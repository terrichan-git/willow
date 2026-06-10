// Agent-triggered estate disbursement (Stripe Connect, TEST mode).
//
// Real path: creates Standard connected accounts and real transfers (net of a 0.5%
// Willow platform fee), funding the platform's test balance so they clear, with live
// Stripe dashboard links. The beneficiaries are cross-border (Sarah in NY, Daniel in
// SG); this platform is Stripe Malaysia, which (a) can't create loss-liable Express
// accounts and (b) can only settle within its region — so the live test settlement runs
// on MYR rails. The intended cross-border currency is shown alongside.
//
// Fallback: if anything fails (incl. Connect not enabled), it degrades to a computed
// disbursement with the same numbers and a clear note — the button can never 500.
import { stripe } from "@/lib/stripe";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const ESTATE_TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const ESTATE_ID = "mom-demo";
const FEE_BPS = 50; // Willow platform fee: 0.5% per transfer
const SETTLE = "myr"; // live test settlement rail (Stripe Malaysia platform)
const DASH = "https://dashboard.stripe.com/test";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

const BENEFICIARIES = [
  { id: "sarah", name: "Sarah Chen", relationship: "daughter", location: "New York, USA", country: "MY", currency: "usd", gross: 11200000 },
  { id: "daniel", name: "Daniel Chen", relationship: "son", location: "Singapore", country: "MY", currency: "sgd", gross: 15000000 },
];

function plan() {
  return BENEFICIARIES.map((b) => {
    const fee = Math.round((b.gross * FEE_BPS) / 10000);
    return { ...b, fee, net: b.gross - fee };
  });
}

// Top up available MYR test balance so a transfer clears. Test funding charges take a
// small fee, so gross the top-up up with a buffer.
async function ensureBalance(neededCents: number) {
  const bal = await stripe.balance.retrieve();
  const available = bal.available.find((a) => a.currency === SETTLE)?.amount || 0;
  if (available >= neededCents) return;
  const fund = Math.ceil((neededCents - available) * 1.15) + 50000;
  await stripe.charges.create({ amount: fund, currency: SETTLE, source: "tok_bypassPending", description: "Willow estate funding (test)" });
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
  let connectEnabled = false;
  let note: string | null = null;
  const results = [];

  for (const b of items) {
    const base = { id: b.id, name: b.name, relationship: b.relationship, location: b.location, currency: b.currency.toUpperCase(), gross: b.gross, fee: b.fee, net: b.net };
    try {
      await ensureBalance(b.net); // top up right before each transfer
      const account = await stripe.accounts.create({
        type: "standard",
        country: b.country,
        email: `${b.id}-demo@willow.test`,
        metadata: { willow_beneficiary: b.id, estate: ESTATE_ID },
      });
      const tr = await stripe.transfers.create({
        amount: b.net,
        currency: SETTLE,
        destination: account.id,
        description: `Willow estate disbursement to ${b.name}`,
        metadata: { willow_fee: String(b.fee), estate: ESTATE_ID, intended_currency: b.currency },
      });
      connectEnabled = true;
      results.push({
        ...base,
        status: "transferred",
        settleCurrency: SETTLE.toUpperCase(),
        accountId: account.id,
        accountUrl: `${DASH}/connect/accounts/${account.id}`,
        transferId: tr.id,
        transferUrl: `${DASH}/connect/transfers/${tr.id}`,
      });
    } catch (e) {
      results.push({ ...base, status: "computed", note: (e as Error).message.slice(0, 120) });
    }
  }

  if (connectEnabled && !note) {
    note = "Live Stripe Connect transfers (test) — settled on the platform's Stripe Malaysia rails (MYR); a US/SG-based platform would settle the intended USD/SGD cross-border.";
  }

  const disbursement = {
    executedAt: new Date().toISOString(),
    connectEnabled,
    feeBps: FEE_BPS,
    settleCurrency: SETTLE.toUpperCase(),
    note,
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
