import { Card } from "@/components/ui";
import { formatGbp } from "@/lib/format";
import type { DashboardMetrics } from "@/lib/types";

export function MetricsGrid({ metrics }: { metrics: DashboardMetrics }) {
  const items = [
    { label: "Active leads", value: String(metrics.activeLeads) },
    { label: "Conversion rate", value: `${metrics.conversionRate}%` },
    { label: "Revenue saved", value: formatGbp(metrics.revenueSavedGbp) },
    { label: "After-hours captured", value: String(metrics.afterHoursCaptured) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-xs uppercase tracking-[0.16em] text-ink/50">{item.label}</p>
          <p className="mt-3 font-display text-4xl">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
