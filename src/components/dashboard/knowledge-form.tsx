"use client";

import { useEffect, useState } from "react";
import { saveKnowledge } from "@/app/dashboard/knowledge/actions";
import { Button, Card, Field, TextArea } from "@/components/ui";
import { readDemoValue, writeDemoValue } from "@/lib/demo-store";
import { createId } from "@/lib/format";
import type { ClinicKnowledge, FaqItem, ServiceItem } from "@/lib/types";

export function KnowledgeForm({
  initial,
  isRealData = false,
}: {
  initial: ClinicKnowledge;
  /** True when `initial` came from the user's real saved Supabase data.
   * When true we skip the localStorage demo overlay entirely, so a stale
   * demo-mode edit in this browser can never shadow real saved data. */
  isRealData?: boolean;
}) {
  const [knowledge, setKnowledge] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setKnowledge(isRealData ? initial : readDemoValue("knowledge", initial));
  }, [initial, isRealData]);

  function update<K extends keyof ClinicKnowledge>(key: K, value: ClinicKnowledge[K]) {
    setKnowledge((current) => ({ ...current, [key]: value }));
  }

  function updateService(id: string, patch: Partial<ServiceItem>) {
    update(
      "services",
      knowledge.services.map((service) =>
        service.id === id ? { ...service, ...patch } : service,
      ),
    );
  }

  function updateFaq(id: string, patch: Partial<FaqItem>) {
    update(
      "faqs",
      knowledge.faqs.map((faq) => (faq.id === id ? { ...faq, ...patch } : faq)),
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        if (!isRealData) writeDemoValue("knowledge", knowledge);
        const result = await saveKnowledge(knowledge);
        setStatus(result.message);
        setPending(false);
      }}
    >
      <Card className="space-y-4">
        <h2 className="font-display text-2xl">Clinic identity</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Clinic name"
            value={knowledge.clinicName}
            onChange={(event) => update("clinicName", event.target.value)}
          />
          <Field
            label="Phone"
            value={knowledge.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
          <Field
            label="WhatsApp"
            value={knowledge.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
          />
          <Field
            label="Address"
            value={knowledge.address}
            onChange={(event) => update("address", event.target.value)}
          />
        </div>
        <TextArea
          label="Operating hours"
          value={knowledge.operatingHours}
          onChange={(event) => update("operatingHours", event.target.value)}
        />
        <TextArea
          label="AI tone"
          value={knowledge.tone}
          onChange={(event) => update("tone", event.target.value)}
        />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Services & prices</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              update("services", [
                ...knowledge.services,
                {
                  id: createId("svc"),
                  name: "",
                  durationMinutes: 0,
                  priceGbp: 0,
                },
              ])
            }
          >
            Add service
          </Button>
        </div>
        {knowledge.services.map((service) => (
          <div key={service.id} className="grid gap-3 md:grid-cols-3">
            <Field
              label="Service"
              value={service.name}
              placeholder="e.g. Signature brightening peel"
              onChange={(event) => updateService(service.id, { name: event.target.value })}
            />
            <Field
              label="Duration (minutes)"
              type="number"
              placeholder="e.g. 30"
              value={service.durationMinutes === 0 ? "" : service.durationMinutes}
              onChange={(event) =>
                updateService(service.id, {
                  durationMinutes: event.target.value === "" ? 0 : Number(event.target.value),
                })
              }
            />
            <Field
              label="Price (£)"
              type="number"
              placeholder="e.g. 250"
              value={service.priceGbp === 0 ? "" : service.priceGbp}
              onChange={(event) =>
                updateService(service.id, {
                  priceGbp: event.target.value === "" ? 0 : Number(event.target.value),
                })
              }
            />
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">FAQ answers</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              update("faqs", [
                ...knowledge.faqs,
                { id: createId("faq"), question: "", answer: "" },
              ])
            }
          >
            Add FAQ
          </Button>
        </div>
        {knowledge.faqs.map((faq) => (
          <div key={faq.id} className="grid gap-3 md:grid-cols-2">
            <Field
              label="Question"
              value={faq.question}
              placeholder="e.g. Do you offer patch tests?"
              onChange={(event) => updateFaq(faq.id, { question: event.target.value })}
            />
            <TextArea
              label="Answer the AI should use"
              value={faq.answer}
              placeholder="e.g. Yes, we require a patch test 48 hours before treatment."
              onChange={(event) => updateFaq(faq.id, { answer: event.target.value })}
            />
          </div>
        ))}
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save knowledge base"}
        </Button>
        {status ? <p className="text-sm text-ink/60">{status}</p> : null}
      </div>
    </form>
  );
}