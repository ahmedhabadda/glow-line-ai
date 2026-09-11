"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/public-env";
import { Button, Field } from "@/components/ui";
import { Logo } from "@/components/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setPending(true);

    const supabase = createClient();
    if (!isSupabaseConfigured || !supabase) {
      setError("Password reset isn't available in demo mode.");
      setPending(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setStatus(
        "If an account exists for that email, a reset link is on its way. Check your inbox (and spam folder) in a couple of minutes.",
      );
    }
    setPending(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-stone-500 hover:text-stone-800 whitespace-nowrap">
          ← Back
        </Link>
        <Logo />
      </div>
      <h1 className="mt-10 font-display text-4xl">Reset your password</h1>
      <p className="mt-2 text-sm text-ink/60">
      Enter the email you signed up with and we&apos;ll send a reset link.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field
          label="Work email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="manager@yourclinic.london"
          required
        />
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </main>
  );
}