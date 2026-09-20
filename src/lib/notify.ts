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
  if (!isNotifyConfigured) {
    console.error("notifyHotLead skipped: RESEND_API_KEY is not configured");
    return;
  }

  const supabase = createAdminClient();
  if (!supabase) {
    console.error("notifyHotLead skipped: admin Supabase client unavailable");
    return;
  }

  try {
    const { data: clinic, error: clinicError } = await supabase
      .from("clinics")
      .select("owner_id")
      .eq("id", params.clinicId)
      .maybeSingle();
    if (clinicError || !clinic) {
      console.error("notifyHotLead: could not find clinic", params.clinicId, clinicError);
      return;
    }

    const { data: userResult, error: userError } = await supabase.auth.admin.getUserById(
      clinic.owner_id,
    );
    const ownerEmail = userResult?.user?.email;
    if (userError || !ownerEmail) {
      console.error("notifyHotLead: could not find owner email", clinic.owner_id, userError);
      return;
    }

    const response = await fetch("https://api.resend.com/emails", {
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

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("notifyHotLead: Resend API call failed", response.status, errorBody);
    } else {
      console.log("notifyHotLead: email sent successfully to", ownerEmail);
    }
  } catch (err) {
    console.error("notifyHotLead: unexpected error", err);
  }
}