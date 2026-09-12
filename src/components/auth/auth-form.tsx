"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/public-env";
import { Button, Field } from "@/components/ui";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);

    if (!isSupabaseConfigured || !supabase) {
      router.push("/dashboard?demo=1");
      return;
    }

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { clinic_name: clinicName, role: "clinic_manager" },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;

        const userId = data.user?.id;

        // Supabase intentionally returns a success-shaped response even when
        // the email is already registered, to prevent account-enumeration
        // attacks. One documented, safe signal it does expose: for an
        // already-confirmed account, `identities` comes back empty. That's
        // the one case we can surface a clearer message for without leaking
        // anything about unconfirmed accounts.
        if (data.user && data.user.identities?.length === 0) {
          setInfo(
            "It looks like you already have an account with this email. Try signing in, or reset your password if you've forgotten it.",
          );
          setPending(false);
          return;
        }

        if (userId) {
          await supabase.from("clinics").insert({
            owner_id: userId,
            clinic_name: clinicName || "Untitled clinic",
          });
        }

        if (!data.session) {
          setInfo("Check your email to confirm your account.");
          setPending(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  async function resendConfirmation() {
    if (!supabase || !email) return;
    setResending(true);
    setError(null);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setInfo(resendError ? null : "Confirmation email resent.");
    if (resendError) setError(resendError.message);
    setResending(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" ? (
        <Field
          label="Clinic name"
          value={clinicName}
          onChange={(event) => setClinicName(event.target.value)}
          placeholder="Maison Lumière Aesthetics"
          required={isSupabaseConfigured}
        />
      ) : null}
      <Field
        label="Work email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="manager@yourclinic.london"
        required={isSupabaseConfigured}
      />
      <Field
        label="Password"
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={isSupabaseConfigured ? 8 : undefined}
        required={isSupabaseConfigured}
      />
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {error && mode === "login" && error.toLowerCase().includes("confirm") ? (
        <button
          type="button"
          onClick={() => void resendConfirmation()}
          disabled={resending}
          className="text-sm text-ink/60 underline"
        >
          {resending ? "Resending…" : "Resend confirmation email"}
        </button>
      ) : null}
      {info ? <p className="text-sm text-ink">{info}</p> : null}
      {mode === "login" ? (
        <a href="/forgot-password" className="block text-sm text-ink/60 underline">
          Forgot your password?
        </a>
      ) : null}
      {!isSupabaseConfigured ? (
        <p className="text-xs text-ink/60">
          Supabase is not configured yet. Continue to open the clinic dashboard in demo mode.
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? "Please wait…"
          : mode === "signup"
            ? "Create clinic workspace"
            : "Sign in"}
      </Button>
    </form>
  );
}