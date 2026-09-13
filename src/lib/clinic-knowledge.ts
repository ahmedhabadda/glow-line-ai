import { createClient } from "@/lib/supabase/server";
import { mockKnowledge, mockReviewSettings } from "@/lib/mock-data";
import type { ClinicKnowledge, ReviewSettings } from "@/lib/types";

export async function getClinicKnowledgeById(
  clinicId: string | null | undefined,
): Promise<{ knowledge: ClinicKnowledge; isRealData: boolean }> {
  if (!clinicId) {
    return { knowledge: mockKnowledge, isRealData: false };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { knowledge: mockKnowledge, isRealData: false };
  }

  const [{ data: clinic }, { data: services }, { data: faqs }] = await Promise.all([
    supabase
      .from("clinics")
      .select("id, clinic_name, address, phone, whatsapp, operating_hours, tone")
      .eq("id", clinicId)
      .maybeSingle(),
    supabase
      .from("services")
      .select("id, name, duration_minutes, price_gbp")
      .eq("clinic_id", clinicId),
    supabase.from("faqs").select("id, question, answer").eq("clinic_id", clinicId),
  ]);

  if (!clinic) {
    return { knowledge: mockKnowledge, isRealData: false };
  }

  const hasContent = Boolean(services?.length || faqs?.length);

  const knowledge: ClinicKnowledge = {
    clinicName: clinic.clinic_name || mockKnowledge.clinicName,
    address: clinic.address || mockKnowledge.address,
    phone: clinic.phone || mockKnowledge.phone,
    whatsapp: clinic.whatsapp || mockKnowledge.whatsapp,
    operatingHours: clinic.operating_hours || mockKnowledge.operatingHours,
    tone: clinic.tone || mockKnowledge.tone,
    services: hasContent
      ? (services ?? []).map((service) => ({
          id: service.id,
          name: service.name,
          durationMinutes: service.duration_minutes,
          priceGbp: Number(service.price_gbp),
        }))
      : mockKnowledge.services,
    faqs: hasContent
      ? (faqs ?? []).map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
        }))
      : mockKnowledge.faqs,
  };

  return { knowledge, isRealData: hasContent };
}

/** Returns a clinic's real saved review settings, if any. */
export async function getReviewSettings(
    clinicId: string | null | undefined,
  ): Promise<{ settings: ReviewSettings; isRealData: boolean }> {
    if (!clinicId) {
      return { settings: mockReviewSettings, isRealData: false };
    }
  
    const supabase = await createClient();
    if (!supabase) {
      return { settings: mockReviewSettings, isRealData: false };
    }
  
    const { data } = await supabase
      .from("review_settings")
      .select("enabled, send_delay_hours, sms_template, google_review_url, escalate_if_score_below")
      .eq("clinic_id", clinicId)
      .maybeSingle();
  
    if (!data) {
      return { settings: mockReviewSettings, isRealData: false };
    }
  
    return {
      settings: {
        enabled: data.enabled,
        sendDelayHours: data.send_delay_hours,
        smsTemplate: data.sms_template,
        googleReviewUrl: data.google_review_url,
        escalateIfScoreBelow: data.escalate_if_score_below,
      },
      isRealData: true,
    };
  }

/** Returns the clinic_id owned by the currently signed-in user, if any. */
export async function getOwnClinicId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  return clinic?.id ?? null;
}