// Companion inference. Loads the deceased's EstateProfile from DynamoDB (us-west-2),
// runs Claude on Bedrock (us-east-1) with the COMPANION_SYSTEM personality + estate
// context, persists both turns to willow-Conversations, and returns the reply text.
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { COMPANION_SYSTEM } from "@/lib/prompts";

export const maxDuration = 30;

const DDB_REGION = process.env.AWS_REGION || "us-west-2";
const BEDROCK_REGION = process.env.BEDROCK_REGION || "us-east-1"; // Bedrock access lives in us-east-1
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6";
const ESTATE_TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const CONV_TABLE = process.env.CONVERSATIONS_TABLE || "willow-Conversations";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: DDB_REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});
const bedrock = new BedrockRuntimeClient({ region: BEDROCK_REGION });

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
    const system = COMPANION_SYSTEM({
      deceasedName: pi.preferredName || pi.name || "your loved one",
      personalityContext: (profile.personalityContext as string) || "",
      estateDetails: estateBrief(profile),
    });

    const priorTurns: Turn[] = (history as Turn[]).slice(-8);
    const messages = [
      ...priorTurns.map((t) => ({ role: t.role, content: [{ text: t.text }] })),
      { role: "user" as const, content: [{ text }] },
    ];

    const resp = await bedrock.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: system }],
        messages,
        inferenceConfig: { maxTokens: 400, temperature: 0.8 },
      })
    );
    const reply = resp.output?.message?.content?.[0]?.text?.trim() || "...";

    // Persist both turns (best-effort; don't fail the response on a write error).
    const now = new Date().toISOString();
    try {
      await ddb.send(new PutCommand({ TableName: CONV_TABLE, Item: { estateId, ts: `${now}#1-family`, speaker: "family_member", text } }));
      await ddb.send(new PutCommand({ TableName: CONV_TABLE, Item: { estateId, ts: `${now}#2-companion`, speaker: "companion", text: reply } }));
    } catch (e) {
      console.error("Conversations write failed:", (e as Error).message);
    }

    return Response.json({ reply, deceasedName: pi.preferredName || pi.name, model: MODEL_ID, usage: resp.usage });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
