import { getStripe } from "@/lib/stripe";

export type InvoiceHistoryItem = {
  id: string;
  createdAt: string;
  amountGbp: number;
  status: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
};

/**
 * Fetches recent invoices for a Stripe customer, newest first. Returns an
 * empty array if Stripe isn't configured, there's no customer yet, or the
 * lookup fails — billing history is a nice-to-have, never worth blocking
 * the rest of the billing page over.
 */
export async function getInvoiceHistory(
  stripeCustomerId: string | null | undefined,
  limit = 12,
): Promise<InvoiceHistoryItem[]> {
  if (!stripeCustomerId) return [];

  const stripe = getStripe();
  if (!stripe) return [];

  try {
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit,
    });

    return invoices.data.map((invoice) => ({
      id: invoice.id ?? "",
      createdAt: new Date(invoice.created * 1000).toISOString(),
      amountGbp: invoice.amount_paid / 100,
      status: invoice.status ?? "unknown",
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      invoicePdf: invoice.invoice_pdf ?? null,
    }));
  } catch {
    return [];
  }
}