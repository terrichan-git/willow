// Companion inference. Loads the deceased's EstateProfile from DynamoDB (us-west-2),
// runs Claude on Bedrock (us-east-1) with the COMPANION_SYSTEM personality + estate
// context, persists both turns to willow-Conversations, and returns the reply text.
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { COMPANION_SYSTEM } from "@/lib/prompts";

export const maxDuration = 60; // allows one Legal Guide tool round-trip (Exa + Bedrock)

const DDB_REGION = process.env.AWS_REGION || "us-west-2";
const BEDROCK_REGION = process.env.BEDROCK_REGION || "us-east-1"; // Bedrock access lives in us-east-1
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6";
const ESTATE_TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const CONV_TABLE = process.env.CONVERSATIONS_TABLE || "willow-Conversations";
const LEGAL_GUIDE_FN = process.env.LEGAL_GUIDE_FN || "legalGuide";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: DDB_REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});
const bedrock = new BedrockRuntimeClient({ region: BEDROCK_REGION });
const lambda = new LambdaClient({ region: DDB_REGION });

// The companion can call the cross-border Legal Guide agent (a separate AWS Lambda).
const TOOL_CONFIG = {
  tools: [
    {
      toolSpec: {
        name: "consult_legal_guide",
        description:
          "Research cross-border estate/inheritance/tax questions (probate, situs, estate tax, reporting forms, will vs trust). Call this whenever the family asks what happens to money/assets across countries, or about tax/inheritance/probate. Returns sourced findings and the most cost-efficient route.",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              deceasedJurisdiction: { type: "string", description: "country where the deceased lived (from the estate context)" },
              heirJurisdiction: { type: "string", description: "country where the heir lives (from the estate context)" },
              assetTypes: { type: "array", items: { type: "string" }, description: "asset types, noting any US-situs assets like US shares" },
            },
            required: ["deceasedJurisdiction", "heirJurisdiction", "assetTypes"],
          },
        },
      },
    },
  ],
};

async function invokeLegalGuide(input: Record<string, unknown>) {
  const out = await lambda.send(
    new InvokeCommand({ FunctionName: LEGAL_GUIDE_FN, Payload: Buffer.from(JSON.stringify(input)) })
  );
  return JSON.parse(new TextDecoder().decode(out.Payload) || "{}");
}

type Turn = { role: "user" | "assistant"; text: string };

// Build a compact, specific estate brief the companion can reference verbatim.
function estateBrief(p: Record<string, unknown>): string {
  const lines: string[] = [];
  const pi = (p.personalInfo || {}) as Record<string, unknown>;
  if (Array.isArray(pi.familyMembers)) {
    lines.push(
      "FAMILY: " +
        (pi.familyMembers as Record<string, string>[])
          .map((f) => `${f.name} (${f.relationship}${f.nickname ? `, you call them "${f.nickname}"` : ""})`)
          .join("; ")
    );
  }
  if (Array.isArray(p.financialAccounts)) {
    lines.push(
      "FINANCIAL ACCOUNTS:\n" +
        (p.financialAccounts as Record<string, string>[])
          .map((a) => `  - ${a.institution} (${a.type}${a.accountRef ? `, ${a.accountRef}` : ""})${a.notes ? ` — ${a.notes}` : ""}`)
          .join("\n")
    );
  }
  if (Array.isArray(p.insurancePolicies)) {
    lines.push(
      "INSURANCE:\n" +
        (p.insurancePolicies as Record<string, string>[])
          .map(
            (i) =>
              `  - ${i.provider} ${i.type}, policy ${i.policyNumber}${i.sumAssured ? `, sum assured ${i.sumAssured}` : ""}${i.beneficiaries ? `, beneficiaries: ${i.beneficiaries}` : ""}${i.notes ? ` — ${i.notes}` : ""}`
          )
          .join("\n")
    );
  }
  const w = (p.wishes || {}) as Record<string, string>;
  if (w.message) lines.push(`MESSAGE I LEFT: ${w.message}`);
  if (w.funeral) lines.push(`FUNERAL WISHES: ${w.funeral}`);
  if (w.documentsLocation) lines.push(`WHERE DOCUMENTS ARE: ${w.documentsLocation}`);
  return lines.join("\n");
}

export async function POST(req: Request) {
  const { text, estateId = "mom-demo", history = [] } = await req.json();
  if (!text || typeof text !== "string") {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const got = await ddb.send(new GetCommand({ TableName: ESTATE_TABLE, Key: { userId: estateId, sk: "profile" } }));
    const profile = got.Item;
    if (!profile) {
      return Response.json({ error: `No estate profile for "${estateId}". Seed one first.` }, { status: 404 });
    }

    const pi = (profile.personalInfo || {}) as Record<string, string>;
    const system =
      COMPANION_SYSTEM({
        deceasedName: pi.preferredName || pi.name || "your loved one",
        personalityContext: (profile.personalityContext as string) || "",
        estateDetails: estateBrief(profile),
      }) +
      `\n\nWhen the family asks about taxes, inheritance, probate, or what happens to assets across countries, FIRST call consult_legal_guide to research it live, then explain the result warmly in your own voice. Keep it to about 5-7 sentences — the points that matter most, not everything: what passes cleanly, the one real catch, the most cost-efficient route, and that a licensed advisor must confirm the final numbers. Plain language, like a phone call. Never state tax law as final.`;

    const priorTurns: Turn[] = (history as Turn[]).slice(-8);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [
      ...priorTurns.map((t) => ({ role: t.role, content: [{ text: t.text }] })),
      { role: "user", content: [{ text }] },
    ];

    const baseReq = { modelId: MODEL_ID, system: [{ text: system }], toolConfig: TOOL_CONFIG };
    let resp = await bedrock.send(
      new ConverseCommand({ ...baseReq, messages, inferenceConfig: { maxTokens: 650, temperature: 0.8 } })
    );

    // One tool round-trip: if the companion calls the Legal Guide, run it and let it respond.
    let legalGuide: Record<string, unknown> | null = null;
    if (resp.stopReason === "tool_use") {
      const content = resp.output?.message?.content || [];
      const toolUse = content.find((c) => c.toolUse)?.toolUse;
      if (toolUse) {
        legalGuide = await invokeLegalGuide(toolUse.input as Record<string, unknown>);
        messages.push({ role: "assistant", content });
        messages.push({
          role: "user",
          content: [{ toolResult: { toolUseId: toolUse.toolUseId, content: [{ json: legalGuide }] } }],
        });
        resp = await bedrock.send(
          new ConverseCommand({ ...baseReq, messages, inferenceConfig: { maxTokens: 650, temperature: 0.8 } })
        );
      }
    }

    const reply =
      (resp.output?.message?.content || []).map((c) => c.text).filter(Boolean).join(" ").trim() || "...";

    // Persist both turns (best-effort; don't fail the response on a write error).
    const now = new Date().toISOString();
    try {
      await ddb.send(new PutCommand({ TableName: CONV_TABLE, Item: { estateId, ts: `${now}#1-family`, speaker: "family_member", text } }));
      await ddb.send(new PutCommand({ TableName: CONV_TABLE, Item: { estateId, ts: `${now}#2-companion`, speaker: "companion", text: reply } }));
    } catch (e) {
      console.error("Conversations write failed:", (e as Error).message);
    }

    return Response.json({ reply, deceasedName: pi.preferredName || pi.name, model: MODEL_ID, usage: resp.usage, legalGuide });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
