import { createClient } from "@/lib/supabase/server";
import { mockLeads, mockMetrics } from "@/lib/mock-data";
import type { DashboardMetrics, Lead, LeadStatus } from "@/lib/types";

/**
 * Loads a clinic's real leads (with full message transcripts) from Supabase,
 * newest-updated first. Falls back to mockLeads if the clinic has no real
 * leads yet, so the dashboard never looks empty before the first patient
 * conversation comes in.
 */
export async function getClinicLeads(
  clinicId: string | null | undefined,
): Promise<{ leads: Lead[]; isRealData: boolean }> {
  if (!clinicId) {
    return { leads: mockLeads, isRealData: false };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { leads: mockLeads, isRealData: false };
  }

  const { data: leadRows } = await supabase
    .from("leads")
    .select("id, patient_name, channel, status, summary, estimated_value_gbp, created_at, updated_at")
    .eq("clinic_id", clinicId)
    .order("updated_at", { ascending: false });

  if (!leadRows || leadRows.length === 0) {
    return { leads: mockLeads, isRealData: false };
  }

  const leadIds = leadRows.map((row) => row.id);
  const { data: messageRows } = await supabase
    .from("lead_messages")
    .select("id, lead_id, role, body, created_at")
    .in("lead_id", leadIds)
    .order("created_at", { ascending: true });

  const leads: Lead[] = leadRows.map((row) => ({
    id: row.id,
    patientName: row.patient_name,
    channel: row.channel as Lead["channel"],
    status: row.status as LeadStatus,
    summary: row.summary,
    estimatedValueGbp: Number(row.estimated_value_gbp),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: (messageRows ?? [])
      .filter((message) => message.lead_id === row.id)
      .map((message) => ({
        id: message.id,
        role: message.role as "patient" | "assistant",
        body: message.body,
        createdAt: message.created_at,
      })),
  }));

  return { leads, isRealData: true };
}

/** Computes dashboard summary metrics from a clinic's real leads. */
export function computeMetricsFromLeads(leads: Lead[]): DashboardMetrics {
  if (leads.length === 0) return mockMetrics;

  const booked = leads.filter((lead) => lead.status === "booked").length;
  const conversionRate = Math.round((booked / leads.length) * 100);

  const revenueSavedGbp = leads
    .filter((lead) => lead.status === "hot" || lead.status === "booked")
    .reduce((sum, lead) => sum + lead.estimatedValueGbp, 0);

  const afterHoursCaptured = leads.filter((lead) => {
    // London-local hour of the enquiry. Treated as "after hours" outside a
    // typical 10:00–19:00 clinic day — a simple heuristic until each
    // clinic's real operating_hours text is parsed into structured data.
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/London" }).format(
        new Date(lead.createdAt),
      ),
    );
    return hour < 10 || hour >= 19;
  }).length;

  return {
    activeLeads: leads.length,
    conversionRate,
    revenueSavedGbp,
    afterHoursCaptured,
  };
}