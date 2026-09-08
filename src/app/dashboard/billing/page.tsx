import { BillingCard } from "@/components/dashboard/billing-card";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Billing</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          Glowline bills the clinic, never the patient. Checkout creates a recurring Stripe
          subscription at £179 per month.
        </p>
      </div>
      {status === "success" ? (
        <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm text-sage">
          Stripe checkout completed. Recurring billing is now active for this clinic.
        </p>
      ) : null}
      {status === "cancelled" ? (
        <p className="rounded-2xl bg-sand px-4 py-3 text-sm">Checkout cancelled. You can retry anytime.</p>
      ) : null}
      <BillingCard />
    </div>
  );
}
