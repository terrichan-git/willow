// Creates a Stripe Checkout Session for the $9 tripwire (Estate Readiness Report).
// On success Stripe redirects to /setup to begin onboarding.
import { stripe, priceIdForLookupKey } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "STRIPE_SECRET_KEY is not set" }, { status: 500 });
  }

  // Allow the SKU to be chosen later (upsells); default to the tripwire.
  const { lookupKey = "willow_readiness" } = await req.json().catch(() => ({}));
  const origin = req.headers.get("origin") || new URL(req.url).origin;

  try {
    const price = await priceIdForLookupKey(lookupKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/setup?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
      metadata: { willow_flow: "tripwire" },
    });
    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
