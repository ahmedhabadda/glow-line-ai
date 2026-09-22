"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { GLOWLINE_MONTHLY_PRICE_GBP } from "@/lib/billing";

export function BillingCard({
  isActive = false,
  hasStripeCustomer = false,
}: {
  isActive?: boolean;
  hasStripeCustomer?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalPending, setPortalPending] = useState(false);

  async function checkout() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start Stripe checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setPending(false);
    }
  }

  async function openPortal() {
    setPortalPending(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to open billing portal.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal.");
    } finally {
      setPortalPending(false);
    }
  }

  return (
    <Card className="max-w-xl space-y-4">
      <p className="text-xs uppercase tracking-[0.16em] text-champagne">Glowline Clinic</p>
      <h2 className="font-display text-4xl">£{GLOWLINE_MONTHLY_PRICE_GBP} / month</h2>
      <p className="text-sm text-ink/70">
        Recurring Stripe subscription for one clinic workspace: after-hours capture,
        knowledge-base concierge, lead inbox, and review routing.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {hasStripeCustomer ? (
          <Button variant="secondary" onClick={() => void openPortal()} disabled={portalPending}>
            {portalPending ? "Opening…" : "Manage subscription"}
          </Button>
        ) : (
          <Button onClick={() => void checkout()} disabled={pending}>
            {pending ? "Redirecting…" : "Subscribe with Stripe"}
          </Button>
        )}
      </div>
      {hasStripeCustomer && !isActive ? (
        <p className="text-sm text-amber-700">
          Your subscription isn&apos;t currently active — use &quot;Manage subscription&quot; to
          update your payment method.
        </p>
      ) : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </Card>
  );
}