import { KnowledgeForm } from "@/components/dashboard/knowledge-form";
import { mockKnowledge } from "@/lib/mock-data";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">AI knowledge base</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          Everything here is injected into the concierge prompt so patients hear your
          real hours, Mayfair address, and published prices — not a generic chatbot.
        </p>
      </div>
      <KnowledgeForm initial={mockKnowledge} />
    </div>
  );
}
