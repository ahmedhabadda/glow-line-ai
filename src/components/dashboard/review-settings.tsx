"use client";

import { useEffect, useState } from "react";
import { saveReviewSettings } from "@/app/dashboard/reviews/actions";
import { Button, Card, Field, TextArea } from "@/components/ui";
import { readDemoValue, writeDemoValue } from "@/lib/demo-store";
import type { ReviewSettings } from "@/lib/types";

export function ReviewSettingsForm({ initial }: { initial: ReviewSettings }) {
  const [settings, setSettings] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setSettings(readDemoValue("reviews", initial));
  }, [initial]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        writeDemoValue("reviews", settings);
        const result = await saveReviewSettings(settings);
        setStatus(result.message);
        setPending(false);
      }}
    >
      <Card className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Post-appointment SMS loop</h2>
          <p className="mt-1 text-sm text-ink/60">
            Send a private 1–5 check-in, then route 4–5 scores to Google.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          onClick={() => setSettings((current) => ({ ...current, enabled: !current.enabled }))}
          className={`relative h-8 w-14 rounded-full transition ${
            settings.enabled ? "bg-sage" : "bg-sand"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
              settings.enabled ? "left-7" : "left-1"
            }`}
          />
        </button>
      </Card>

      <Card className="space-y-4">
        <Field
          label="Send delay (hours after appointment)"
          type="number"
          value={settings.sendDelayHours}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              sendDelayHours: Number(event.target.value),
            }))
          }
        />
        <Field
          label="Google review URL"
          value={settings.googleReviewUrl}
          onChange={(event) =>
            setSettings((current) => ({ ...current, googleReviewUrl: event.target.value }))
          }
        />
        <Field
          label="Escalate privately if score is below"
          type="number"
          min={1}
          max={5}
          value={settings.escalateIfScoreBelow}
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              escalateIfScoreBelow: Number(event.target.value),
            }))
          }
        />
        <TextArea
          label="SMS template"
          value={settings.smsTemplate}
          onChange={(event) =>
            setSettings((current) => ({ ...current, smsTemplate: event.target.value }))
          }
        />
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save review automation"}
        </Button>
        {status ? <p className="text-sm text-ink/60">{status}</p> : null}
      </div>
    </form>
  );
}
