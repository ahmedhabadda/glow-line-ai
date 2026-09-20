import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { generateClinicReply } from "@/lib/openai";
import { getClinicKnowledgeById } from "@/lib/clinic-knowledge";
import { createAdminClient } from "@/lib/supabase/admin";
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

// Generous enough for a genuine back-and-forth conversation, tight enough
// to block a scripted flood — each message here also costs real OpenAI
// spend, so this protects both the database and the bill.
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 20;

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

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
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

  // Service-role client: lead writes are controlled entirely by this
  // server code now, not by public RLS policies, so this bypasses RLS
  // intentionally rather than relying on the (removed) public policies.
  const supabase = createAdminClient();

  if (supabase) {
    const ip = getClientIp(request);
    const { data: allowed } = await supabase.rpc("check_chat_rate_limit", {
      rate_key: `chat:${ip}`,
      window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      limit_count: RATE_LIMIT_MAX_REQUESTS,
    });

    if (allowed === false) {
      return NextResponse.json(
        { reply: "I'm getting a lot of messages right now — please try again in a moment." },
        { status: 429 },
      );
    }
  }

  const { knowledge } = await getClinicKnowledgeById(clinicId);
  const result = await generateClinicReply(messages, knowledge);

  // If we don't have a real clinicId (e.g. the generic marketing-page demo),
  // skip lead capture entirely — there's no clinic to attach the lead to.
  if (!clinicId || !supabase) {
    return NextResponse.json(result);
  }

  const latestPatientMessage = messages.at(-1);
  let leadId = body.leadId;

  try {
    if (latestPatientMessage?.role === "user") {
      const mentionedService = detectMentionedService(latestPatientMessage.content, knowledge.services);
      const fullText = messages.map((message) => message.content).join(" ").toLowerCase();
      const looksHot = BOOKING_KEYWORDS.some((keyword) => fullText.includes(keyword));

      if (!leadId) {
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