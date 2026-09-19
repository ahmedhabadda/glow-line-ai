import { Card } from "@/components/ui";
import { formatDateTime, formatGbp } from "@/lib/format";
import type { InvoiceHistoryItem } from "@/lib/billing-history";

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  open: "Awaiting payment",
  void: "Voided",
  uncollectible: "Failed",
  draft: "Draft",
};

export function BillingHistory({ invoices }: { invoices: InvoiceHistoryItem[] }) {
  if (invoices.length === 0) {
    return (
      <Card>
        <h2 className="font-display text-2xl">Billing history</h2>
        <p className="mt-2 text-sm text-ink/60">
          No invoices yet — your first one will appear here after your next billing cycle.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-2xl">Billing history</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.14em] text-ink/50">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Amount</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="py-3 pr-4 whitespace-nowrap">{formatDateTime(invoice.createdAt)}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{formatGbp(invoice.amountGbp)}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {STATUS_LABEL[invoice.status] ?? invoice.status}
                </td>
                <td className="py-3">
                  {invoice.hostedInvoiceUrl ? (
                    
                      href={invoice.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-ink/40">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}