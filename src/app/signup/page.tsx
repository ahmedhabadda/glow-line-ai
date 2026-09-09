import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Logo />
      <Link href="/" className="text-sm text-stone-500 hover:text-stone-800 mb-4 inline-block">
  ← Back to home
</Link>
      <h1 className="mt-10 font-display text-4xl">Open your clinic workspace</h1>
      <p className="mt-2 text-sm text-ink/60">
        For managers of boutique aesthetics and wellness rooms in London.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-sm text-ink/60">
        Already using Glowline?{" "}
        <Link href="/login" className="text-ink underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
