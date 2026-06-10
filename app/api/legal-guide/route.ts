// Cross-border Legal Guide for the /legal-tax page. POST invokes the legalGuide Lambda
// (Exa -> Bedrock us-east-1) for Maria's SG->US scenario and persists the result so the
// page can load it instantly; GET returns the persisted result.
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export const maxDuration = 60;

const REGION = process.env.AWS_REGION || "us-west-2";
const ESTATE_TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const FN = process.env.LEGAL_GUIDE_FN || "legalGuide";
const ESTATE_ID = "mom-demo";

const lambda = new LambdaClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), { marshallOptions: { removeUndefinedValues: true } });

const SCENARIO = {
  deceasedJurisdiction: "Singapore",
  heirJurisdiction: "United States",
  assetTypes: ["CPF", "DBS bank savings (Singapore)", "US brokerage holding US-listed shares (Apple, Microsoft)"],
};

export async function GET() {
  try {
    const r = await ddb.send(new GetCommand({ TableName: ESTATE_TABLE, Key: { userId: ESTATE_ID, sk: "profile" } }));
    return Response.json({ result: r.Item?.legalGuide || null });
  } catch {
    return Response.json({ result: null });
  }
}

export async function POST() {
  try {
    const out = await lambda.send(new InvokeCommand({ FunctionName: FN, Payload: Buffer.from(JSON.stringify(SCENARIO)) }));
    const result = JSON.parse(new TextDecoder().decode(out.Payload) || "{}");
    if (result.error) return Response.json({ error: result.error }, { status: 502 });
    try {
      await ddb.send(new UpdateCommand({
        TableName: ESTATE_TABLE,
        Key: { userId: ESTATE_ID, sk: "profile" },
        UpdateExpression: "SET legalGuide = :g",
        ExpressionAttributeValues: { ":g": result },
      }));
    } catch {
      /* non-fatal */
    }
    return Response.json({ result });
  } catch (err) {
    return Response.json({ error: `Could not run Legal Guide: ${(err as Error).message}` }, { status: 502 });
  }
}
