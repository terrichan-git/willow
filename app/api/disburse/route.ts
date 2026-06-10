// Agent-triggered estate disbursement (Stripe Connect, TEST mode).
//
// Tries to create real Connect Express accounts + transfers (with a Willow platform
// fee per transfer). If Connect isn't enabled on the account yet, it degrades to a
// computed disbursement with the same numbers — so the executor view always works and
// auto-upgrades to real transfers once Connect is switched on in the Stripe dashboard.
import { stripe } from "@/lib/stripe";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const ESTATE_TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const ESTATE_ID = "mom-demo";
const FEE_BPS = 50; // Willow platform fee: 0.5% per transfer
const DASH = "https://dashboard.stripe.com/test";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

// Beneficiaries + shares (cross-border: USD to Sarah in NY, SGD to a SG sibling).
const BENEFICIARIES = [
  { id: "sarah", name: "Sarah Chen", relationship: "daughter", location: "New York, USA", country: "US", currency: "usd", gross: 11200000 },
  { id: "daniel", name: "Daniel Chen", relationship: "son", location: "Singapore", country: "SG", currency: "sgd", gross: 15000000 },
];

function plan() {
  return BENEFICIARIES.map((b) => {
    const fee = Math.round((b.gross * FEE_BPS) / 10000);
    return { ...b, fee, net: b.gross - fee };
  });
}

export async function GET() {
  let last = null;
  try {
    const r = await ddb.send(new GetCommand({ TableName: ESTATE_TABLE, Key: { userId: ESTATE_ID, sk: "profile" } }));
    last = r.Item?.disbursement || null;
  } catch {
    /* ignore */
  }
  return Response.json({ beneficiaries: plan(), feeBps: FEE_BPS, last });
}

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return Response.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });

  const items = plan();
  let connectEnabled = true;
  const results = [];

  for (const b of items) {
    const base = { id: b.id, name: b.name, relationship: b.relationship, location: b.location, currency: b.currency.toUpperCase(), gross: b.gross, fee: b.fee, net: b.net };
    try {
      const account = await stripe.accounts.create({
        type: "express",
        country: b.country,
        email: `${b.id}-demo@willow.test`,
        capabilities: { transfers: { requested: true } },
        metadata: { willow_beneficiary: b.id, estate: ESTATE_ID },
      });
      let transferId: string | null = null;
      let status = "account_created";
      try {
        const tr = await stripe.transfers.create({
          amount: b.net,
          currency: b.currency,
          destination: account.id,
          description: `Willow estate disbursement to ${b.name}`,
          metadata: { willow_fee: String(b.fee), estate: ESTATE_ID },
        });
        transferId = tr.id;
        status = "transferred";
      } catch {
        status = "account_created"; // account real, transfer pending (e.g. needs balance/onboarding)
      }
      results.push({
        ...base,
        status,
        accountId: account.id,
        accountUrl: `${DASH}/connect/accounts/${account.id}`,
        transferId,
        transferUrl: transferId ? `${DASH}/transfers/${transferId}` : null,
      });
    } catch (e) {
      // Connect not enabled (or other) -> computed disbursement, clearly flagged.
      connectEnabled = false;
      results.push({ ...base, status: "computed", note: (e as Error).message.slice(0, 120) });
    }
  }

  const disbursement = {
    executedAt: new Date().toISOString(),
    connectEnabled,
    feeBps: FEE_BPS,
    totalFeeByCurrency: results.reduce((acc: Record<string, number>, r) => {
      acc[r.currency] = (acc[r.currency] || 0) + r.fee;
      return acc;
    }, {}),
    results,
  };

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: ESTATE_TABLE,
        Key: { userId: ESTATE_ID, sk: "profile" },
        UpdateExpression: "SET disbursement = :d",
        ExpressionAttributeValues: { ":d": disbursement },
      })
    );
  } catch {
    /* non-fatal */
  }

  return Response.json(disbursement);
}
