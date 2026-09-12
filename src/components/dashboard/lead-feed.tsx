"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui";
import { formatDateTime, formatGbp } from "@/lib/format";
import type { Lead, LeadStatus } from "@/lib/types";

const statusCopy: Record<LeadStatus, string> = {
  hot: "Hot Lead",
  booked: "Booked",
  inquired: "Inquired",
};

export function LeadFeed({
  initialLeads,
  isRealData = false,
}: {
  initialLeads: Lead[];
  isRealData?: boolean;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState(initialLeads[0]?.id);
  const selected = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? leads[0],
    [leads, selectedId],
  );

  useEffect(() => {
    if (isRealData) return;

    const timer = window.setInterval(() => {
      setLeads((current) => {
        const stamp = new Date().toISOString();
        const incoming: Lead = {
          id: `sim-${stamp}`,
          patientName: "Sophie Ellison",
          channel: "whatsapp",
          status: "hot",
          summary: "After-hours WhatsApp: asking if laser hair reduction can be booked tomorrow morning.",
          estimatedValueGbp: 120,
          createdAt: stamp,
          updatedAt: stamp,
          messages: [
            {
              id: `sim-msg-${stamp}`,
              role: "patient",
              body: "Hi — are you still answering? Can I book laser for a small area tomorrow?",
              createdAt: stamp,
            },
            {
              id: `sim-reply-${stamp}`,
              role: "assistant",
              body: "Yes, after-hours capture is live. Laser hair reduction (small area) is £120 / 25 minutes. I can hold a morning consult and take the £50 deposit.",
              createdAt: stamp,
            },
          ],
        };

        if (current.some((lead) => lead.patientName === incoming.patientName)) {
          const first = current[0];
          if (!first) return current;
          return [
            {
              ...first,
              updatedAt: stamp,
              messages: [
                ...first.messages,
                {
                  id: `sim-hold-${stamp}`,
                  role: "assistant",
                  body: "I've held the Saturday consult and flagged this as a hot lead for the morning huddle.",
                  createdAt: stamp,
                },
              ],
            },
            ...current.slice(1),
          ];
        }

        return [incoming, ...current];
      });
    }, 14000);

    return () => window.clearInterval(timer);
  }, []);

  if (!selected) {
    return <p className="text-sm text-ink/60">No leads yet. The concierge will land them here.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-3">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => setSelectedId(lead.id)}
            className={`w-full rounded-3xl border p-4 text-left ${
              lead.id === selected.id ? "border-ink bg-white" : "border-sand bg-mist"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{lead.patientName}</p>
              <span className="rounded-full bg-sand px-2 py-1 text-[11px] uppercase tracking-wide">
                {statusCopy[lead.status]}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-ink/60">{lead.summary}</p>
            <p className="mt-2 text-xs text-ink/40">
              {lead.channel} · {formatDateTime(lead.updatedAt)} · {formatGbp(lead.estimatedValueGbp)}
            </p>
          </button>
        ))}
      </div>
      <Card>
      <p className="text-xs uppercase tracking-[0.16em] text-ink/50">
          {isRealData ? "Live conversation" : "Simulated chat log"}
        </p>
        <h2 className="mt-1 font-display text-3xl">{selected.patientName}</h2>
        <div className="mt-6 space-y-3">
          {selected.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                message.role === "assistant" ? "bg-mist" : "ml-auto bg-sage text-ivory"
              }`}
            >
              <p>{message.body}</p>
              <p className="mt-1 text-[11px] opacity-60">{formatDateTime(message.createdAt)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
