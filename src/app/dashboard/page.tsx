import { MetricsGrid } from "@/components/dashboard/metrics";
import { getClinicLeads, computeMetricsFromLeads } from "@/lib/clinic-leads";
import { getOwnClinicId } from "@/lib/clinic-knowledge";

export default async function DashboardPage() {
  const clinicId = await getOwnClinicId();
  const { leads, isRealData } = await getClinicLeads(clinicId);
  const metrics = computeMetricsFromLeads(leads);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-champagne">Tonight in London</p>
        <h1 className="mt-2 font-display text-4xl">Clinic overview</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          After-hours capture is live. Conversion is measured from qualified Hot Leads and
          Booked statuses. Revenue saved estimates treatment value that would otherwise have
          gone unanswered after close.
        </p>
        {!isRealData ? (
          <p className="mt-2 max-w-2xl text-sm text-amber-700">
            Showing sample activity — real patient conversations will replace this once your
            AI receptionist starts capturing leads.
          </p>
        ) : null}
      </div>
      <MetricsGrid metrics={metrics} />
    </div>
  );
}