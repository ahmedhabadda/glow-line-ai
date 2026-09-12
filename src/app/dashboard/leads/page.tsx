import { LeadFeed } from "@/components/dashboard/lead-feed";
import { getClinicLeads } from "@/lib/clinic-leads";
import { getOwnClinicId } from "@/lib/clinic-knowledge";

export default async function LeadsPage() {
  const clinicId = await getOwnClinicId();
  const { leads, isRealData } = await getClinicLeads(clinicId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Lead feed</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          WhatsApp and web conversations land here with status, timestamps, and estimated
          treatment value.
        </p>
        {!isRealData ? (
          <p className="mt-2 max-w-2xl text-sm text-amber-700">
            Showing a simulated inbox — test your AI receptionist on the Knowledge base page
            to see a real lead appear here.
          </p>
        ) : null}
      </div>
      <LeadFeed initialLeads={leads} isRealData={isRealData} />
    </div>
  );
}