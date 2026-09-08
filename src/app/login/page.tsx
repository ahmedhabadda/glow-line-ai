import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Logo />
      <h1 className="mt-10 font-display text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/60">Sign in as a clinic manager.</p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-ink/60">
        New clinic?{" "}
        <Link href="/signup" className="text-ink underline">
          Create a workspace
        </Link>
      </p>
    </main>
  );
}
