import { env, isNotifyConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatGbp } from "@/lib/format";

/**
 * Emails the clinic's owner when a lead becomes "hot" — the whole point of
 * Glowline is never missing a booking-ready enquiry, so this is the one
 * notification that matters most. Best-effort: a failure here should never
 * break the patient's chat experience.
 */
export async function notifyHotLead(params: {
  clinicId: string;
  clinicName: string;
  patientName: string;
  summary: string;
  estimatedValueGbp: number;
}) {
  if (!isNotifyConfigured) return;

  const supabase = createAdminClient();
  if (!supabase) return;

  try {
    const { data: clinic } = await supabase
      .from("clinics")
      .select("owner_id")
      .eq("id", params.clinicId)
      .maybeSingle();
    if (!clinic) return;

    const { data: userResult } = await supabase.auth.admin.getUserById(clinic.owner_id);
    const ownerEmail = userResult?.user?.email;
    if (!ownerEmail) return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Glowline <${env.notifyFromEmail}>`,
        to: ownerEmail,
        subject: `Hot lead: ${params.patientName} — ${params.clinicName}`,
        text: [
          `A new hot lead just came in for ${params.clinicName}.`,
          "",
          `Patient: ${params.patientName}`,
          `Estimated value: ${formatGbp(params.estimatedValueGbp)}`,
          `Summary: ${params.summary}`,
          "",
          `View it: ${env.appUrl}/dashboard/leads`,
        ].join("\n"),
      }),
    });
  } catch {
    // Notification failure should never affect the patient's conversation.
  }
}