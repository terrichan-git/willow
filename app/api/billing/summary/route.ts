// Returns the demo customer's plan, card, and recent invoices for the billing page.
import { stripe } from "@/lib/stripe";
import { getOrCreateDemoCustomer, ensureDemoCard, ensureDemoInvoice } from "@/lib/stripe-demo";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.STRIPE_SECRET_KEY) return Response.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
  try {
    const customer = await getOrCreateDemoCustomer();
    await ensureDemoCard(customer.id);
    await ensureDemoInvoice(customer.id);

    const pms = await stripe.paymentMethods.list({ customer: customer.id, type: "card" });
    const card = pms.data[0]?.card || null;
    const invoices = await stripe.invoices.list({ customer: customer.id, limit: 5 });

    return Response.json({
      customerId: customer.id,
      plan: { name: "Full Estate Plan + AI Companion", price: "$79", status: "active", lookupKey: "willow_full" },
      card: card ? { brand: card.brand, last4: card.last4, exp_month: card.exp_month, exp_year: card.exp_year } : null,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      invoices: invoices.data
        .filter((i: any) => (i.amount_paid || i.amount_due || 0) > 0)
        .map((i: any) => ({
        id: i.number || i.id,
        amount: (i.amount_paid || i.amount_due || 0) / 100,
        currency: (i.currency || "usd").toUpperCase(),
        status: i.status,
        date: i.created,
        url: i.hosted_invoice_url || null,
      })),
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
