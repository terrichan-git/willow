// Willow — Legal Guide agent (cross-border estate/tax). Agent 3.
// Runtime: AWS Lambda, Node.js 20.x (bundles AWS SDK v3 + global fetch — zero deps).
//
// Pipeline: Exa (live research across BOTH jurisdictions) -> Bedrock / Claude Sonnet 4.6
// in us-east-1 (structures to JSON) -> returns options + most cost-efficient route.
//
// It NEVER asserts law as final: every result carries advisorReviewRequired:true and a
// disclaimer, cites sources, and broadens the Exa query then flags when research is thin.
//
// Input : { deceasedJurisdiction, heirJurisdiction, assetTypes[], estateValue? }
// Output: structured cross-border estate brief (see SYSTEM_PROMPT schema).

import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

// Bedrock access for this account lives in us-east-1.
const BEDROCK_REGION = process.env.BEDROCK_REGION || "us-east-1";
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-6";
const EXA_API_KEY = process.env.EXA_API_KEY;

const bedrock = new BedrockRuntimeClient({ region: BEDROCK_REGION });

const SYSTEM_PROMPT = `You are the Legal Guide — a cross-border estate and tax research agent. You are given a deceased person's jurisdiction, their heir's jurisdiction, and the asset types in the estate, plus live web search results.

You NEVER state the law as final or give definitive legal/tax advice. You research, summarize options, cite sources, recommend the most cost-efficient route, and ALWAYS defer the final determination to a licensed cross-border estate/tax advisor.

Synthesize ONLY from the provided search results plus well-established general principles. Do not invent specific exemption figures, form numbers, or rates that the sources don't support — if a number is uncertain, say "approximately" and flag it.

Call the "return_brief" tool exactly once with your structured findings. Do not write any prose outside the tool call.`;

// Forced tool-use guarantees a valid structured object (no fragile JSON parsing).
const BRIEF_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-3 sentence plain-language overview of the cross-border situation" },
    deceasedCountry: {
      type: "object",
      properties: {
        jurisdiction: { type: "string" },
        inheritanceOrEstateTax: { type: "string", description: 'e.g. "Singapore has no inheritance/estate tax"' },
        keyPoints: { type: "array", items: { type: "string" } },
      },
      required: ["jurisdiction", "inheritanceOrEstateTax", "keyPoints"],
    },
    heirCountry: {
      type: "object",
      properties: {
        jurisdiction: { type: "string" },
        taxOnInheritedAssets: { type: "string" },
        situsRules: { type: "string", description: "which assets are taxed by situs, e.g. US-situs shares" },
        reportingForms: { type: "array", items: { type: "string" }, description: 'e.g. ["IRS Form 3520 — reporting, not a tax"]' },
      },
      required: ["jurisdiction", "taxOnInheritedAssets", "situsRules", "reportingForms"],
    },
    crossBorderIssues: { type: "array", items: { type: "string" }, description: "specific frictions, e.g. US non-resident estate tax over ~$60k" },
    recommendedRoute: {
      type: "object",
      properties: { summary: { type: "string" }, rationale: { type: "string" } },
      required: ["summary", "rationale"],
    },
    willVsTrust: {
      type: "object",
      properties: { recommendation: { type: "string", enum: ["will", "trust", "either", "unclear"] }, why: { type: "string" } },
      required: ["recommendation", "why"],
    },
    steps: { type: "array", items: { type: "string" }, description: "concrete steps for the family/executor" },
    sources: {
      type: "array",
      items: { type: "object", properties: { title: { type: "string" }, url: { type: "string" } }, required: ["title", "url"] },
    },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    needsManualResearch: { type: "boolean" },
  },
  required: [
    "summary", "deceasedCountry", "heirCountry", "crossBorderIssues",
    "recommendedRoute", "willVsTrust", "steps", "sources", "confidence", "needsManualResearch",
  ],
};

async function exaSearch(query, { numResults = 4 } = {}) {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": EXA_API_KEY },
    body: JSON.stringify({ query, numResults, type: "auto", contents: { text: { maxCharacters: 1000 } } }),
  });
  if (!res.ok) throw new Error(`Exa ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  return (await res.json()).results || [];
}

function dedupe(results) {
  const seen = new Set();
  return results.filter((r) => (seen.has(r.url) ? false : seen.add(r.url)));
}

async function research({ deceasedJurisdiction, heirJurisdiction, assetTypes }) {
  const assets = (assetTypes || []).join(", ") || "bank accounts and shares";
  const queries = [
    `${deceasedJurisdiction} inheritance tax / estate tax on death — does it apply to a deceased resident's estate?`,
    `${heirJurisdiction} estate or inheritance tax on assets inherited from abroad — non-resident situs rules for ${assets}; reporting forms for receiving a foreign inheritance`,
    `Most cost-efficient way to pass ${assets} from a ${deceasedJurisdiction} estate to an heir in ${heirJurisdiction} — cross-border estate tax planning`,
    `Will versus trust for cross-border estate ${deceasedJurisdiction} to ${heirJurisdiction} — probate avoidance, keeping assets invested and disbursing on a schedule`,
  ];
  // Run the jurisdiction queries concurrently — much faster than sequential.
  const settled = await Promise.allSettled(queries.map((q) => exaSearch(q)));
  let results = dedupe(settled.flatMap((s) => (s.status === "fulfilled" ? s.value : [])));
  let broadened = false;
  if (results.length < 3) {
    broadened = true;
    try { results = dedupe(results.concat(await exaSearch(`cross-border inheritance tax ${deceasedJurisdiction} ${heirJurisdiction} estate planning`, { numResults: 8 }))); } catch { /* ignore */ }
  }
  return { results, broadened };
}

async function structure(input, research) {
  const block = research.results
    .slice(0, 6)
    .map((r, i) => `[Source ${i + 1}] ${r.title}\nURL: ${r.url}\n${(r.text || "").slice(0, 900)}`)
    .join("\n\n---\n\n");

  const userMessage = `DECEASED JURISDICTION: ${input.deceasedJurisdiction}
HEIR JURISDICTION: ${input.heirJurisdiction}
ASSET TYPES: ${(input.assetTypes || []).join(", ") || "(unspecified)"}
ESTATE VALUE: ${input.estateValue || "(unspecified)"}
RESEARCH WAS ${research.broadened ? "BROADENED (primary queries were thin)" : "from the primary queries"}.

SEARCH RESULTS:
${block || "(no results — set needsManualResearch:true, confidence:low, and recommend a licensed advisor)"}

Call return_brief now.`;

  const resp = await bedrock.send(
    new ConverseCommand({
      modelId: MODEL_ID,
      system: [{ text: SYSTEM_PROMPT }],
      messages: [{ role: "user", content: [{ text: userMessage }] }],
      inferenceConfig: { maxTokens: 1600, temperature: 0 },
      toolConfig: {
        tools: [{ toolSpec: { name: "return_brief", description: "Return the structured cross-border estate brief.", inputSchema: { json: BRIEF_SCHEMA } } }],
        toolChoice: { tool: { name: "return_brief" } },
      },
    })
  );

  const toolUse = (resp.output?.message?.content || []).find((c) => c.toolUse)?.toolUse;
  if (!toolUse?.input) throw new Error("Model did not return the structured brief");
  return { structured: toolUse.input, usage: resp.usage };
}

function parseInput(event) {
  if (event && typeof event.body === "string") {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    return JSON.parse(raw || "{}");
  }
  return event || {};
}

export const handler = async (event) => {
  const isHttp = !!(event && (event.requestContext || typeof event.body === "string"));
  const respond = (code, payload) =>
    isHttp ? { statusCode: code, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) } : payload;

  if (!EXA_API_KEY) return respond(500, { error: "EXA_API_KEY not configured" });

  let input;
  try { input = parseInput(event); } catch { return respond(400, { error: "Invalid JSON body" }); }
  const { deceasedJurisdiction, heirJurisdiction, assetTypes = [] } = input;
  if (!deceasedJurisdiction || !heirJurisdiction) {
    return respond(400, { error: "deceasedJurisdiction and heirJurisdiction are required" });
  }

  const started = Date.now();
  try {
    console.log("LegalGuide start", JSON.stringify({ deceasedJurisdiction, heirJurisdiction, assetTypes }));
    const r = await research(input);
    console.log(`Exa returned ${r.results.length} results (broadened=${r.broadened})`);
    const { structured, usage } = await structure(input, r);
    console.log("Bedrock structuring done", JSON.stringify({ model: MODEL_ID, region: BEDROCK_REGION, usage }));

    // Safety net: backfill anything the model omitted; advisor flag is non-negotiable.
    structured.advisorReviewRequired = true;
    structured.confidence = structured.confidence || "medium";
    structured.needsManualResearch = structured.needsManualResearch ?? false;
    // Backfill citations from the real Exa research if the model didn't echo them.
    if (!structured.sources || structured.sources.length === 0) {
      structured.sources = r.results.slice(0, 6).map(({ title, url }) => ({ title, url }));
    }
    if (!structured.disclaimer) {
      structured.disclaimer = "This is general research, not legal or tax advice. Confirm with a licensed cross-border estate/tax advisor.";
    }

    return respond(200, {
      ...structured,
      meta: {
        deceasedJurisdiction,
        heirJurisdiction,
        assetTypes,
        model: MODEL_ID,
        bedrockRegion: BEDROCK_REGION,
        exaResultCount: r.results.length,
        broadenedQuery: r.broadened,
        bedrockTokens: usage,
        latencyMs: Date.now() - started,
      },
    });
  } catch (err) {
    console.error("LegalGuide failed:", err);
    return respond(500, { error: err.message });
  }
};
