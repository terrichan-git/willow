// Seed realistic "after they pass" tasks for the demo estate (mom-demo) into willow-Tasks.
// Run: node --env-file=.env.local scripts/seed-tasks.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE = process.env.TASKS_TABLE || "willow-Tasks";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});
const estateId = "mom-demo";

const tasks = [
  { taskId: "task#immediate#dbs", category: "immediate", institution: "DBS Bank", action: "Notify DBS Bank of the death; the sole account will be frozen", requiredDocs: ["Death certificate", "Executor's NRIC"], deadline: "24 hours", status: "pending" },
  { taskId: "task#7day#cpf", category: "7day", institution: "CPF Board", action: "File CPF nomination claim — Sarah is the sole nominee, passes outside probate", requiredDocs: ["Death certificate", "Sarah's ID"], deadline: "7 days", status: "pending" },
  { taskId: "task#7day#aia", category: "7day", institution: "AIA", action: "File the AIA life insurance claim (policy AIA-SG-77231) — hotline 1800 248 8000", requiredDocs: ["Death certificate", "Policy document"], deadline: "within 6 months", status: "pending" },
  { taskId: "task#30day#crossborder", category: "30day", institution: "US cross-border", action: "Engage a US estate-tax advisor for the Interactive Brokers US-situs shares (Form 706-NA; Sarah files Form 3520)", requiredDocs: ["Brokerage statements"], deadline: "30 days", status: "pending" },
  { taskId: "task#30day#subs", category: "30day", institution: "Subscriptions", action: "Cancel recurring subscriptions — Netflix, iCloud (no bereavement line; just cancel)", deadline: "30 days", status: "pending" },
  { taskId: "task#90day#probate", category: "90day", institution: "Family Justice Courts", action: "Apply for Grant of Probate for the Singapore estate", requiredDocs: ["Will", "Death certificate"], deadline: "90 days", status: "pending" },
];

for (const t of tasks) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: { estateId, createdAt: new Date().toISOString(), ...t } }));
}
console.log(`Seeded ${tasks.length} tasks for estateId "${estateId}" -> ${TABLE}`);
