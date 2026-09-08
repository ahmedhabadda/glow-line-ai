import { LeadFeed } from "@/components/dashboard/lead-feed";
import { mockLeads } from "@/lib/mock-data";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Lead feed</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          WhatsApp and web conversations land here with status, timestamps, and estimated
          treatment value. The log below simulates a live after-hours inbox.
        </p>
      </div>
      <LeadFeed initialLeads={mockLeads} />
    </div>
  );
}
