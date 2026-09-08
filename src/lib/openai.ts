import type { ChatTurn, ClinicKnowledge } from "@/lib/types";
import { env, isOpenAIConfigured } from "@/lib/env";

function knowledgeSystemPrompt(knowledge: ClinicKnowledge): string {
  const services = knowledge.services
    .map(
      (service) =>
        `- ${service.name}: £${service.priceGbp}, ${service.durationMinutes} minutes`,
    )
    .join("\n");

  const faqs = knowledge.faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");

  return [
    `You are Glowline, the after-hours concierge for ${knowledge.clinicName}.`,
    `Clinic address: ${knowledge.address}`,
    `Phone: ${knowledge.phone}. WhatsApp: ${knowledge.whatsapp}.`,
    `Hours: ${knowledge.operatingHours}`,
    `Tone: ${knowledge.tone}`,
    "Qualify booking intent, never invent clinical outcomes, and offer a consult when unsure.",
    "Services:",
    services,
    "FAQs:",
    faqs,
  ].join("\n");
}

function placeholderReply(messages: ChatTurn[], knowledge: ClinicKnowledge): string {
  const latest = messages.at(-1)?.content.toLowerCase() ?? "";
  const serviceHit = knowledge.services.find((service) =>
    latest.includes(service.name.split(" ")[0]?.toLowerCase() ?? ""),
  );

  if (latest.includes("prf") || latest.includes("under-eye") || latest.includes("under eye")) {
    const prf = knowledge.services.find((service) => service.name.toLowerCase().includes("prf"));
    if (prf) {
      return `${prf.name} is £${prf.priceGbp} for ${prf.durationMinutes} minutes at ${knowledge.clinicName}, ${knowledge.address}. I can hold a consultation; we never treat without assessing suitability.`;
    }
  }

  if (latest.includes("price") || latest.includes("cost") || latest.includes("how much")) {
    const list = knowledge.services
      .map((service) => `${service.name} from £${service.priceGbp}`)
      .join("; ");
    return `At ${knowledge.clinicName}, current menu pricing is ${list}. I can hold a consultation so a clinician confirms suitability. Which treatment are you considering?`;
  }

  if (latest.includes("hour") || latest.includes("open") || latest.includes("late")) {
    return `${knowledge.operatingHours} I can still capture your enquiry now and have the front of house confirm a chair in the morning.`;
  }

  if (latest.includes("book") || latest.includes("appointment")) {
    return `I can qualify a booking for ${knowledge.clinicName} at ${knowledge.address}. A £50 new-patient deposit is typical. Which day after 10:00 works, and which treatment?`;
  }

  if (latest.includes("park")) {
    const parking = knowledge.faqs.find((faq) => faq.question.toLowerCase().includes("park"));
    if (parking) return parking.answer;
  }

  if (latest.includes("deposit") || latest.includes("patch")) {
    const faqHit = knowledge.faqs.find((faq) =>
      latest.includes("deposit")
        ? faq.question.toLowerCase().includes("deposit")
        : faq.question.toLowerCase().includes("patch"),
    );
    if (faqHit) return faqHit.answer;
  }

  if (serviceHit) {
    return `${serviceHit.name} is £${serviceHit.priceGbp} for ${serviceHit.durationMinutes} minutes. ${knowledge.operatingHours} Would you like me to qualify a booking?`;
  }

  const faqHit = knowledge.faqs.find((faq) =>
    latest.includes(faq.question.toLowerCase().split(" ")[0] ?? ""),
  );

  if (faqHit) return faqHit.answer;

  return `Thank you for writing to ${knowledge.clinicName}. I can help with treatment information, after-hours booking qualification, and next-day confirmation. What would you like to explore?`;
}

export async function generateClinicReply(
  messages: ChatTurn[],
  knowledge: ClinicKnowledge,
): Promise<{ reply: string; provider: "openai" | "placeholder" }> {
  if (!isOpenAIConfigured) {
    return { reply: placeholderReply(messages, knowledge), provider: "placeholder" };
  }

  // Placeholder for the live OpenAI integration.
  // Replace this fetch with your preferred SDK once OPENAI_API_KEY is set.
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiModel,
      temperature: 0.4,
      messages: [
        { role: "system", content: knowledgeSystemPrompt(knowledge) },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    return { reply: placeholderReply(messages, knowledge), provider: "placeholder" };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply = data.choices?.[0]?.message?.content?.trim();

  return {
    reply: reply || placeholderReply(messages, knowledge),
    provider: "openai",
  };
}
