import Stripe from "stripe";

// Server-only Stripe client (TEST mode key from env). Never import into client code.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Resolve a price by its stable lookup_key so the app never hardcodes account-specific IDs.
export async function priceIdForLookupKey(lookupKey: string): Promise<string> {
  const res = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
  const price = res.data[0];
  if (!price) throw new Error(`No Stripe price with lookup_key "${lookupKey}". Run scripts/stripe-setup.mjs.`);
  return price.id;
}
