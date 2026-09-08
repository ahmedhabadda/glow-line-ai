"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ReviewSettings } from "@/lib/types";

export async function saveReviewSettings(settings: ReviewSettings) {
  if (!isSupabaseConfigured) {
    return {
      ok: true,
      message: "Template stored in this session. Connect Supabase to persist SMS automation.",
    };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, message: "Supabase client is not available." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in required." };

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!clinic) return { ok: false, message: "Create a clinic record first." };

  const { error } = await supabase.from("review_settings").upsert({
    clinic_id: clinic.id,
    enabled: settings.enabled,
    send_delay_hours: settings.sendDelayHours,
    sms_template: settings.smsTemplate,
    google_review_url: settings.googleReviewUrl,
    escalate_if_score_below: settings.escalateIfScoreBelow,
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Review automation saved." };
}
