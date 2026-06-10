// Opens the Stripe Customer Portal for the demo customer. Ensures a portal
// configuration exists first (test mode requires one) so this never 500s.
import { stripe } from "@/lib/stripe";
import { getOrCreateDemoCustomer, ensurePortalConfig } from "@/lib/stripe-demo";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return Response.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
  try {
    const customer = await getOrCreateDemoCustomer();
    const config = await ensurePortalConfig();
    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      configuration: config.id,
      return_url: `${origin}/settings/billing`,
    });
    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
