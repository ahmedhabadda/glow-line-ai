import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { generateClinicReply } from "@/lib/openai";
import { getClinicKnowledgeById } from "@/lib/clinic-knowledge";
import { createClient } from "@/lib/supabase/server";
import type { ChatTurn, ServiceItem } from "@/lib/types";

const BOOKING_KEYWORDS = [
  "book",
  "appointment",
  "hold",
  "wedding",
  "asap",
  "today",
  "tomorrow",
  "urgent",
  "soonest",
  "earliest",
];

function detectMentionedService(
  text: string,
  services: ServiceItem[],
): ServiceItem | undefined {
  const lower = text.toLowerCase();
  return services.find((service) =>
    service.name
      .toLowerCase()
      .split(" ")
      .some((word) => word.length > 3 && lower.includes(word)),
  );
}

function summarize(messages: ChatTurn[]): string {
  const firstPatientMessage = messages.find((message) => message.role === "user");
  return firstPatientMessage?.content.slice(0, 160) ?? "New web chat enquiry.";
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    messages?: ChatTurn[];
    clinicId?: string;
    leadId?: string;
    patientName?: string;
  };

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const clinicId = body.clinicId || undefined;
  const patientName = body.patientName?.trim() || "Website visitor";

  const { knowledge } = await getClinicKnowledgeById(clinicId);
  const result = await generateClinicReply(messages, knowledge);

  // If we don't have a real clinicId (e.g. the generic marketing-page demo),
  // skip lead capture entirely — there's no clinic to attach the lead to.
  if (!clinicId) {
    return NextResponse.json(result);
  }

  const latestPatientMessage = messages.at(-1);
  let leadId = body.leadId;

  try {
    const supabase = await createClient();
    if (supabase && latestPatientMessage?.role === "user") {
      const mentionedService = detectMentionedService(latestPatientMessage.content, knowledge.services);
      const fullText = messages.map((message) => message.content).join(" ").toLowerCase();
      const looksHot = BOOKING_KEYWORDS.some((keyword) => fullText.includes(keyword));

      if (!leadId) {
        // Generate the id ourselves rather than reading it back via
        // `.select()` — an anonymous patient's session should never need
        // (or be granted) permission to read lead rows, only create them.
        const generatedId = randomUUID();
        const { error: insertError } = await supabase.from("leads").insert({
          id: generatedId,
          clinic_id: clinicId,
          patient_name: patientName,
          channel: "web",
          status: looksHot ? "hot" : "inquired",
          summary: summarize(messages),
          estimated_value_gbp: mentionedService?.priceGbp ?? 0,
        });
        if (!insertError) leadId = generatedId;
      } else {
        await supabase
          .from("leads")
          .update({
            status: looksHot ? "hot" : "inquired",
            summary: summarize(messages),
            estimated_value_gbp: mentionedService?.priceGbp ?? 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", leadId);
      }

      if (leadId) {
        await supabase.from("lead_messages").insert([
          { lead_id: leadId, role: "patient", body: latestPatientMessage.content },
          { lead_id: leadId, role: "assistant", body: result.reply },
        ]);
      }
    }
  } catch {
    // Lead capture is best-effort — never block the patient's reply on a DB hiccup.
  }

  return NextResponse.json({ ...result, leadId });
}