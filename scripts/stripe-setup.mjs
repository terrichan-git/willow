// Willow — create Stripe products + prices (TEST mode), idempotently.
// Run:  node --env-file=.env.local scripts/stripe-setup.mjs
//
// Idempotency: products are matched by metadata.willow_sku; prices by lookup_key.
// Re-running reuses existing objects and never creates duplicates.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CATALOG = [
  { sku: "readiness", name: "Estate Readiness Report",          amount: 900,   recurring: false, key: "willow_readiness", desc: "A clear report of where your estate is exposed and what your family would face today." },
  { sku: "will",      name: "Digital Will Generator",           amount: 1900,  recurring: false, key: "willow_will",      desc: "Generate a structured digital will from your estate profile." },
  { sku: "full",      name: "Full Estate Plan + AI Companion",  amount: 7900,  recurring: false, key: "willow_full",      desc: "The complete plan: will, voice-cloned companion, and full agent access." },
  { sku: "checklist", name: "Estate Checklist Pack",            amount: 2900,  recurring: false, key: "willow_checklist", desc: "A ready-to-use checklist pack for executors and family." },
  { sku: "family",    name: "Family Protection Plan",           amount: 14900, recurring: true,  key: "willow_family",    desc: "Ongoing monitoring, annual review, and multi-member access." },
];

const CURRENCY = "usd";

async function findProduct(sku) {
  // Search can lag right after creation; fall back to a list scan for safety.
  try {
    const r = await stripe.products.search({ query: `metadata['willow_sku']:'${sku}'`, limit: 1 });
    if (r.data[0]) return r.data[0];
  } catch {
    /* search not ready; fall through */
  }
  for await (const p of stripe.products.list({ limit: 100 })) {
    if (p.metadata?.willow_sku === sku) return p;
  }
  return null;
}

async function upsertProduct(item) {
  const existing = await findProduct(item.sku);
  if (existing) return existing;
  return stripe.products.create({
    name: item.name,
    description: item.desc,
    metadata: { willow_sku: item.sku },
  });
}

async function upsertPrice(product, item) {
  const found = await stripe.prices.list({ lookup_keys: [item.key], limit: 1 });
  if (found.data[0]) return found.data[0];
  return stripe.prices.create({
    product: product.id,
    currency: CURRENCY,
    unit_amount: item.amount,
    lookup_key: item.key,
    ...(item.recurring ? { recurring: { interval: "year" } } : {}),
  });
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  console.log("Stripe catalog (test mode):\n");
  const rows = [];
  for (const item of CATALOG) {
    const product = await upsertProduct(item);
    const price = await upsertPrice(product, item);
    const display = `$${(item.amount / 100).toFixed(2)}${item.recurring ? "/yr" : ""}`;
    rows.push({ sku: item.sku, name: item.name, price: display, lookup_key: item.key, priceId: price.id });
  }
  console.table(rows.map((r) => ({ SKU: r.sku, Name: r.name, Price: r.price, "Lookup key": r.lookup_key, "Price ID": r.priceId })));
  console.log("\nThe app resolves prices at runtime by lookup_key, so these IDs are FYI only.");
}

main().catch((e) => {
  console.error("stripe-setup failed:", e.message);
  process.exit(1);
});
