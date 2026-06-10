// Server-side estate data access for the dashboard. Reads DynamoDB, but falls back to a
// baked-in snapshot of the demo profile/tasks so the live URL always renders for judges.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const ESTATE_TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const TASKS_TABLE = process.env.TASKS_TABLE || "willow-Tasks";
export const DEMO_ESTATE_ID = "mom-demo";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

/* eslint-disable @typescript-eslint/no-explicit-any */
export type EstateProfile = any;
export type Task = {
  estateId: string;
  taskId: string;
  category: "immediate" | "7day" | "30day" | "90day";
  institution?: string;
  action: string;
  requiredDocs?: string[];
  deadline?: string | null;
  status?: "pending" | "in_progress" | "completed";
};

export async function getProfile(estateId = DEMO_ESTATE_ID): Promise<EstateProfile> {
  try {
    const r = await ddb.send(new GetCommand({ TableName: ESTATE_TABLE, Key: { userId: estateId, sk: "profile" } }));
    if (r.Item) return r.Item;
  } catch (e) {
    console.error("getProfile fell back:", (e as Error).message);
  }
  return FALLBACK_PROFILE;
}

export async function getTasks(estateId = DEMO_ESTATE_ID): Promise<Task[]> {
  try {
    const r = await ddb.send(
      new QueryCommand({
        TableName: TASKS_TABLE,
        KeyConditionExpression: "estateId = :e",
        ExpressionAttributeValues: { ":e": estateId },
      })
    );
    if (r.Items && r.Items.length) return r.Items as Task[];
  } catch (e) {
    console.error("getTasks fell back:", (e as Error).message);
  }
  return FALLBACK_TASKS;
}

export const TASK_CATEGORIES: { key: Task["category"]; label: string }[] = [
  { key: "immediate", label: "Immediate · 24 hours" },
  { key: "7day", label: "Within 7 days" },
  { key: "30day", label: "Within 30 days" },
  { key: "90day", label: "Within 90 days" },
];

// Readiness = weighted completeness across estate sections. A section can be partially
// complete (e.g. a will that's drafted but not yet witnessed) so the score reflects real
// room to improve rather than a flat 100%.
const SECTION_WEIGHTS: Record<string, number> = {
  family: 12, executor: 10, financial: 14, insurance: 14, will: 16, property: 12, digital: 10, voice: 12,
};
const IN_PROGRESS_LABELS: Record<string, string> = { will: "Will & legal", property: "Property & assets" };

export function sectionCompleteness(p: EstateProfile): Record<string, number> {
  if (!p) return {};
  const props = p.propertyAssets || [];
  return {
    family: p.personalInfo?.familyMembers?.length ? 1 : 0,
    executor: p.personalInfo?.executor ? 1 : 0,
    financial: p.financialAccounts?.length ? 1 : 0,
    insurance: p.insurancePolicies?.length ? 1 : 0,
    will: p.will?.exists ? (p.will?.witnessed ? 1 : 0.25) : 0, // drafted but not witnessed -> partial
    property: props.length ? (props.every((a: any) => a.value) ? 1 : 0.5) : 0, // listed but not valued -> partial
    digital: p.digitalAccounts?.length ? 1 : 0,
    voice: p.voiceCloneId ? 1 : 0,
  };
}

export function readinessScore(p: EstateProfile): number {
  const c = sectionCompleteness(p);
  const score = Object.entries(SECTION_WEIGHTS).reduce((sum, [k, w]) => sum + (c[k] ?? 0) * w, 0);
  return Math.round(score);
}

// Sections that exist but aren't fully complete — surfaced as "in progress" on the dashboard.
export function inProgressSections(p: EstateProfile): string[] {
  const c = sectionCompleteness(p);
  return Object.keys(IN_PROGRESS_LABELS).filter((k) => (c[k] ?? 0) > 0 && (c[k] ?? 0) < 1).map((k) => IN_PROGRESS_LABELS[k]);
}

// ---- Fallback demo data (mirrors scripts/seed-mom.mjs) -----------------------
const FALLBACK_PROFILE: EstateProfile = {
  userId: DEMO_ESTATE_ID,
  personalInfo: {
    name: "Maria",
    jurisdiction: "Singapore",
    familyMembers: [{ name: "Sarah", relationship: "daughter", location: "New York, USA" }],
    executor: "Sarah",
  },
  financialAccounts: [
    { institution: "CPF", type: "retirement", situs: "Singapore" },
    { institution: "DBS Bank", type: "savings", situs: "Singapore", accountRef: "ending 4471" },
    { institution: "Interactive Brokers (US)", type: "brokerage", situs: "United States", accountRef: "ending 8830" },
  ],
  insurancePolicies: [{ provider: "AIA", type: "life insurance", policyNumber: "AIA-SG-77231", sumAssured: "SGD 300,000", beneficiaries: "Sarah" }],
  will: { exists: true, location: "Blue folder, study desk", executorOrLawyer: "Sarah (executor)" },
  propertyAssets: [{ type: "real estate", description: "3-room flat, Tampines", location: "Singapore" }],
  digitalAccounts: [{ platform: "Gmail" }, { platform: "Netflix" }, { platform: "iCloud" }],
  wishesMessage: "Sarah, sayang — don't be sad for too long. Take care of yourself.",
  voiceCloneId: "vRaj2Gd0mefB1EU96ua2",
  status: "activated",
};

const FALLBACK_TASKS: Task[] = [
  { estateId: DEMO_ESTATE_ID, taskId: "t1", category: "immediate", institution: "DBS Bank", action: "Notify DBS Bank of the death and freeze the sole account", requiredDocs: ["Death certificate", "Executor's NRIC"], deadline: "24 hours", status: "pending" },
  { estateId: DEMO_ESTATE_ID, taskId: "t2", category: "7day", institution: "CPF Board", action: "File CPF nomination claim (Sarah is sole nominee)", requiredDocs: ["Death certificate", "Sarah's ID"], deadline: "7 days", status: "pending" },
  { estateId: DEMO_ESTATE_ID, taskId: "t3", category: "7day", institution: "AIA", action: "File the AIA life insurance claim — hotline 1800 248 8000", requiredDocs: ["Death certificate", "Policy AIA-SG-77231"], deadline: "within 6 months", status: "pending" },
  { estateId: DEMO_ESTATE_ID, taskId: "t4", category: "30day", institution: "IRS / cross-border", action: "Engage a US cross-border advisor for the Interactive Brokers US-situs shares (Form 706-NA / 3520)", requiredDocs: ["Brokerage statements"], deadline: "30 days", status: "pending" },
  { estateId: DEMO_ESTATE_ID, taskId: "t5", category: "30day", institution: "Subscriptions", action: "Cancel recurring subscriptions (Netflix, iCloud)", deadline: "30 days", status: "pending" },
  { estateId: DEMO_ESTATE_ID, taskId: "t6", category: "90day", institution: "Probate", action: "Apply for Grant of Probate for Singapore assets", requiredDocs: ["Will", "Death certificate"], deadline: "90 days", status: "pending" },
];
