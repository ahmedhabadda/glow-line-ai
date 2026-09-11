"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/public-env";
import { Button, Field } from "@/components/ui";
import { Logo } from "@/components/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    if (!isSupabaseConfigured || !supabase) {
      setError("Password reset isn't available in demo mode.");
      setPending(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(
        updateError.message ||
          "Could not update your password. The reset link may have expired — request a new one.",
      );
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Logo />
      <h1 className="mt-10 font-display text-4xl">Choose a new password</h1>
      <p className="mt-2 text-sm text-ink/60">
      You&apos;ve followed a valid reset link. Set a new password to finish.. Set a new password to finish.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Saving…" : "Update password"}
        </Button>
      </form>
    </main>
  );
}