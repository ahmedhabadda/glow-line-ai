import { MetricsGrid } from "@/components/dashboard/metrics";
import { mockMetrics } from "@/lib/mock-data";

export default function DashboardPage() {
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
      </div>
      <MetricsGrid metrics={mockMetrics} />
    </div>
  );
}
