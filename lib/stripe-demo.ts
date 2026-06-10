// Server-only helpers for the demo billing experience (Stripe TEST mode).
// Everything here is idempotent and self-healing so the live URL never 500s.
import { stripe } from "./stripe";

const DEMO_EMAIL = "maria-demo@willow.test";

export async function getOrCreateDemoCustomer() {
  const found = await stripe.customers.list({ email: DEMO_EMAIL, limit: 1 });
  if (found.data[0]) return found.data[0];
  return stripe.customers.create({ email: DEMO_EMAIL, name: "Maria Chen", description: "Willow demo account" });
}

// Attach a test card as the default payment method (so judges see real card data).
export async function ensureDemoCard(customerId: string) {
  const pms = await stripe.paymentMethods.list({ customer: customerId, type: "card" });
  if (pms.data[0]) return pms.data[0];
  try {
    const pm = await stripe.paymentMethods.attach("pm_card_visa", { customer: customerId });
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: pm.id } });
    return pm;
  } catch {
    return null;
  }
}

// One paid $79 invoice so the invoice history isn't empty. Create the draft invoice
// first, then attach the line item to it directly — otherwise the item can miss the
// invoice and you get a $0 invoice.
export async function ensureDemoInvoice(customerId: string) {
  const existing = await stripe.invoices.list({ customer: customerId, limit: 10 });
  if (existing.data.some((i) => (i.amount_paid || 0) > 0)) return;
  try {
    const invoice = await stripe.invoices.create({ customer: customerId, auto_advance: false });
    if (!invoice.id) return;
    await stripe.invoiceItems.create({ customer: customerId, invoice: invoice.id, amount: 7900, currency: "usd", description: "Full Estate Plan + AI Companion" });
    await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.pay(invoice.id).catch(() => {});
  } catch {
    /* non-fatal — invoices panel just shows a placeholder */
  }
}

// The Customer Portal needs a saved configuration in test mode, or sessions.create 500s.
export async function ensurePortalConfig() {
  const cfgs = await stripe.billingPortal.configurations.list({ limit: 1 });
  if (cfgs.data.length) return cfgs.data[0];
  return stripe.billingPortal.configurations.create({
    business_profile: { headline: "Willow — manage your plan" },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["email", "address", "name"] },
    },
  });
}
