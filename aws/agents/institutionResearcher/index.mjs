// Willow — Institution Researcher agent (Agent 2)
// Runtime: AWS Lambda, Node.js 20.x (bundles AWS SDK v3 + global fetch — zero deps to package).
//
// Flow (this is the AWS AI/ML proof for judging):
//   1. Exa  -> real-time web research on the death-notification / claims procedure.
//   2. Bedrock (Claude Sonnet 4.6) -> structures the raw research into strict JSON.
//   3. DynamoDB (Tasks) <- the structured result is persisted as a task.
//   Bedrock MUST do the structuring — that is what runs the agent on AWS.
//
// Input  : { institutionName, type, jurisdiction }
// Output : { notificationProcess, requiredDocuments[], timeline,
//            financialImplications, notes[], sources[], meta }

import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
// Cross-region inference profile id for Claude Sonnet 4.6 on Bedrock (set via env at deploy).
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6";
// Bedrock runs in its own region: in this hackathon account, Claude Sonnet 4.6 model
// access is enabled in us-east-1 (the us. inference profile cross-routes, so calls only
// succeed when served by an access-enabled region). DynamoDB/S3 stay in us-west-2.
const BEDROCK_REGION = process.env.BEDROCK_REGION || "us-east-1";
const TASKS_TABLE = process.env.TASKS_TABLE || "willow-Tasks";
const EXA_API_KEY = process.env.EXA_API_KEY;

const bedrock = new BedrockRuntimeClient({ region: BEDROCK_REGION });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// Agent 2 system prompt (docs/AGENT_PROMPTS.md), adapted to force machine-readable JSON.
const SYSTEM_PROMPT = `You are the Institution Researcher. Given an institution name, type, and jurisdiction, you turn raw web research into the EXACT process for notifying that institution of an account holder's death.

You will be given search results (titles, URLs, and extracted text). Synthesize ONLY from those results plus well-established general knowledge. Never invent specific phone numbers, form names, or deadlines that are not supported by the sources — if unknown, say so and advise calling the institution directly.

Return a SINGLE JSON object, no prose, no markdown fences, with EXACTLY this shape:
{
  "notificationProcess": {
    "summary": string,                      // 1-2 sentence plain-language overview
    "channels": string[],                   // e.g. ["phone","branch","online form","mail"]
    "contact": { "phone": string|null, "department": string|null, "url": string|null },
    "steps": string[]                       // ordered, concrete steps the family takes
  },
  "requiredDocuments": string[],            // e.g. ["Certified death certificate","Grant of Probate","Executor's ID"]
  "timeline": {
    "notificationDeadline": string|null,    // null if none / unknown
    "processingTime": string|null,
    "followUp": string|null
  },
  "financialImplications": {
    "accountFrozen": boolean|null,
    "fundsRelease": string|null,
    "fees": string|null
  },
  "notes": string[],                        // common mistakes, tips, alternative contacts
  "sources": [ { "title": string, "url": string } ],
  "confidence": "high"|"medium"|"low",
  "needsManualResearch": boolean            // true if sources were thin / generic
}

If the research is thin or generic, set confidence:"low" and needsManualResearch:true, and put a clear note telling the family to call the institution directly.`;

// ---- Exa search (with one broadening retry) --------------------------------

async function exaSearch(query, { numResults = 6 } = {}) {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": EXA_API_KEY },
    body: JSON.stringify({
      query,
      numResults,
      type: "auto",
      contents: { text: { maxCharacters: 2000 } },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Exa ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function researchInstitution({ institutionName, type, jurisdiction }) {
  const j = jurisdiction ? ` in ${jurisdiction}` : "";
  const primary = `How to notify ${institutionName} (${type})${j} of the death of an account holder — required documents, claim process, contact details, and deadlines for the deceased's family or executor.`;
  let results = await exaSearch(primary);
  let broadened = false;

  // Failure handling: nothing useful -> broaden the query, then flag.
  if (results.length < 2) {
    broadened = true;
    const fallback = `deceased account holder death notification claim process required documents ${type} ${jurisdiction || ""}`.trim();
    const more = await exaSearch(fallback, { numResults: 8 });
    const seen = new Set(results.map((r) => r.url));
    results = results.concat(more.filter((r) => !seen.has(r.url)));
  }
  return { results, broadened };
}

// ---- Bedrock structuring (the AWS AI/ML step) ------------------------------

function extractJson(text) {
  // Be tolerant: strip ```json fences, then grab the outermost {...}.
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

async function structureWithBedrock({ institutionName, type, jurisdiction }, research) {
  const sourceBlock = research.results
    .slice(0, 8)
    .map((r, i) => `[Source ${i + 1}] ${r.title}\nURL: ${r.url}\n${(r.text || "").slice(0, 1500)}`)
    .join("\n\n---\n\n");

  const userMessage = `INSTITUTION: ${institutionName}
TYPE: ${type}
JURISDICTION: ${jurisdiction || "(not specified)"}
RESEARCH RESULTS WERE ${research.broadened ? "BROADENED (primary query was thin)" : "from the primary query"}.

SEARCH RESULTS:
${sourceBlock || "(no results found — set needsManualResearch:true and advise calling the institution directly)"}

Produce the JSON object now.`;

  const resp = await bedrock.send(
    new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: SYSTEM_PROMPT }],
      messages: [{ role: "user", content: [{ text: userMessage }] }],
      inferenceConfig: { maxTokens: 2500, temperature: 0 },
    })
  );

  const text = resp.output?.message?.content?.[0]?.text || "";
  const structured = extractJson(text);
  const usage = resp.usage || {};
  return { structured, usage };
}

// ---- Persist to DynamoDB Tasks ---------------------------------------------

async function saveTask({ institutionName, type, jurisdiction }, structured, estateId) {
  const taskId = `inst#${type}#${institutionName}`.toLowerCase().replace(/[^a-z0-9#]+/g, "-") + `#${Date.now()}`;
  const item = {
    estateId,
    taskId,
    category: "7day",
    institution: institutionName,
    institutionType: type,
    jurisdiction: jurisdiction || null,
    action: `Notify ${institutionName} of the account holder's death`,
    requiredDocs: structured.requiredDocuments || [],
    deadline: structured.timeline?.notificationDeadline || null,
    status: "pending",
    researchResult: structured,
    createdAt: new Date().toISOString(),
  };
  await ddb.send(new PutCommand({ TableName: TASKS_TABLE, Item: item }));
  return taskId;
}

// ---- Handler (supports Lambda Function URL + direct invoke) -----------------

function parseInput(event) {
  if (event && typeof event.body === "string") {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    return JSON.parse(raw || "{}");
  }
  return event || {};
}

function httpResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    },
    body: JSON.stringify(payload),
  };
}

export const handler = async (event) => {
  const isHttp = !!(event && (event.requestContext || typeof event.body === "string"));
  // CORS preflight
  if (event?.requestContext?.http?.method === "OPTIONS") return httpResponse(200, { ok: true });

  if (!EXA_API_KEY) {
    const err = { error: "EXA_API_KEY not configured on the Lambda" };
    return isHttp ? httpResponse(500, err) : err;
  }

  let input;
  try {
    input = parseInput(event);
  } catch {
    const err = { error: "Invalid JSON body" };
    return isHttp ? httpResponse(400, err) : err;
  }

  const { institutionName, type = "institution", jurisdiction } = input;
  const estateId = input.estateId || "demo-estate";
  if (!institutionName) {
    const err = { error: "institutionName is required" };
    return isHttp ? httpResponse(400, err) : err;
  }

  const started = Date.now();
  try {
    console.log("InstitutionResearcher start", JSON.stringify({ institutionName, type, jurisdiction, estateId }));

    const research = await researchInstitution({ institutionName, type, jurisdiction });
    console.log(`Exa returned ${research.results.length} results (broadened=${research.broadened})`);

    const { structured, usage } = await structureWithBedrock({ institutionName, type, jurisdiction }, research);
    console.log("Bedrock structuring done", JSON.stringify({ model: MODEL_ID, usage }));

    let taskId = null;
    try {
      taskId = await saveTask({ institutionName, type, jurisdiction }, structured, estateId);
      console.log("Saved task to DynamoDB", taskId);
    } catch (e) {
      console.error("DynamoDB write failed (continuing):", e.message);
    }

    const payload = {
      ...structured,
      meta: {
        institutionName,
        type,
        jurisdiction: jurisdiction || null,
        estateId,
        taskId,
        model: MODEL_ID,
        exaResultCount: research.results.length,
        broadenedQuery: research.broadened,
        bedrockTokens: usage,
        latencyMs: Date.now() - started,
      },
    };
    return isHttp ? httpResponse(200, payload) : payload;
  } catch (err) {
    console.error("InstitutionResearcher failed:", err);
    const out = { error: err.message, institutionName, type };
    return isHttp ? httpResponse(500, out) : out;
  }
};
