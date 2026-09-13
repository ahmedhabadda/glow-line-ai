"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ClinicKnowledge } from "@/lib/types";

export async function saveKnowledge(knowledge: ClinicKnowledge) {
  if (!isSupabaseConfigured) {
    return {
      ok: true,
      message: "Saved locally for this session. Connect Supabase to persist across devices.",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, message: "Supabase client is not available." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in to save clinic knowledge." };

  const { data: clinic, error: clinicError } = await supabase
    .from("clinics")
    .upsert(
      {
        owner_id: user.id,
        clinic_name: knowledge.clinicName,
        address: knowledge.address,
        phone: knowledge.phone,
        whatsapp: knowledge.whatsapp,
        operating_hours: knowledge.operatingHours,
        tone: knowledge.tone,
      },
      { onConflict: "owner_id" },
    )
    .select("id")
    .single();

  if (clinicError || !clinic) {
    const { data: existing } = await supabase
      .from("clinics")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    const clinicId = existing?.id;
    if (!clinicId) {
      return { ok: false, message: clinicError?.message ?? "Could not save clinic." };
    }

    await supabase
      .from("clinics")
      .update({
        clinic_name: knowledge.clinicName,
        address: knowledge.address,
        phone: knowledge.phone,
        whatsapp: knowledge.whatsapp,
        operating_hours: knowledge.operatingHours,
        tone: knowledge.tone,
      })
      .eq("id", clinicId);

    return await replaceChildren(supabase, clinicId, knowledge);
  }

  return await replaceChildren(supabase, clinic.id, knowledge);
}

async function replaceChildren(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  clinicId: string,
  knowledge: ClinicKnowledge,
) {
  await supabase.from("services").delete().eq("clinic_id", clinicId);
  await supabase.from("faqs").delete().eq("clinic_id", clinicId);

  const namedServices = knowledge.services.filter((service) => service.name.trim().length > 0);
  if (namedServices.length) {
    const { error } = await supabase.from("services").insert(
      namedServices.map((service) => ({
        clinic_id: clinicId,
        name: service.name.trim(),
        duration_minutes: service.durationMinutes,
        price_gbp: service.priceGbp,
      })),
    );
    if (error) return { ok: false, message: `Could not save services: ${error.message}` };
  }

  const answeredFaqs = knowledge.faqs.filter(
    (faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0,
  );
  if (answeredFaqs.length) {
    const { error } = await supabase.from("faqs").insert(
      answeredFaqs.map((faq) => ({
        clinic_id: clinicId,
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      })),
    );
    if (error) return { ok: false, message: `Could not save FAQs: ${error.message}` };
  }

  return { ok: true, message: "Knowledge base updated." };
}