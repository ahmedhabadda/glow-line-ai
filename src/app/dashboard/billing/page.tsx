import { BillingCard } from "@/components/dashboard/billing-card";
import { BillingHistory } from "@/components/dashboard/billing-history";
import { getOwnClinicId } from "@/lib/clinic-knowledge";
import { getInvoiceHistory } from "@/lib/billing-history";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const clinicId = await getOwnClinicId();

  let subscriptionStatus: string | null = null;
  let stripeCustomerId: string | null = null;

  if (clinicId) {
    const supabase = await createClient();
    const { data } = (await supabase
      ?.from("subscriptions")
      .select("status, stripe_customer_id")
      .eq("clinic_id", clinicId)
      .maybeSingle()) ?? { data: null };
    subscriptionStatus = data?.status ?? null;
    stripeCustomerId = data?.stripe_customer_id ?? null;
  }

  const isActive = subscriptionStatus === "active";
  const invoices = await getInvoiceHistory(stripeCustomerId);

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
      {clinicId ? (
        <p className="text-sm text-ink/70">
          Current status:{" "}
          <span className={isActive ? "font-medium text-sage" : "font-medium text-ink"}>
            {subscriptionStatus ?? "inactive"}
          </span>
        </p>
      ) : null}
      <BillingCard isActive={isActive} />
      <BillingHistory invoices={invoices} />
    </div>
  );
}