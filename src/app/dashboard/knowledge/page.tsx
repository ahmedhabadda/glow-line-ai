import { KnowledgeForm } from "@/components/dashboard/knowledge-form";
import { ChatWidget } from "@/components/chat/chat-widget";
import { getClinicKnowledgeById, getOwnClinicId } from "@/lib/clinic-knowledge";

export default async function KnowledgePage() {
  const clinicId = await getOwnClinicId();
  const { knowledge, isRealData } = await getClinicKnowledgeById(clinicId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">AI knowledge base</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          Everything here is injected into the concierge prompt so patients hear your
          real hours, Mayfair address, and published prices — not a generic chatbot.
        </p>
        {!isRealData ? (
          <p className="mt-2 max-w-2xl text-sm text-amber-700">
            Showing sample menu data — save your own treatments and FAQs below to
            replace it with what patients will actually hear.
          </p>
        ) : null}
      </div>
      <KnowledgeForm initial={knowledge} isRealData={isRealData} />
      <div>
        <h2 className="font-display text-2xl">Test your AI receptionist</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink/65">
          Chat with it exactly as a patient would. Real conversations here create a
          real lead on your{" "}
          <a href="/dashboard/leads" className="underline">
            lead feed
          </a>
          .
        </p>
        <div className="mt-4 h-[32rem]">
          <ChatWidget
            embedded
            clinicId={clinicId ?? undefined}
            greeting={`Hello, I'm the Glowline concierge for ${knowledge.clinicName}. Ask me about treatments, pricing, or booking.`}
          />
        </div>
      </div>
    </div>
  );
}