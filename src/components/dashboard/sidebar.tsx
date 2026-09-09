"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/knowledge", label: "AI knowledge base" },
  { href: "/dashboard/leads", label: "Lead feed" },
  { href: "/dashboard/reviews", label: "Review automation" },
  { href: "/dashboard/billing", label: "Billing" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col justify-between border-b border-sand bg-white p-6 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div>
        <Logo href={isDemo ? "/dashboard?demo=1" : "/dashboard"} />
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-ink/40">Clinic manager</p>
        <nav className="mt-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            const href = isDemo ? `${link.href}?demo=1` : link.href;
            return (
              <Link
                key={link.href}
                href={href}
                className={`block rounded-2xl px-3 py-2 text-sm ${
                  active ? "bg-ink text-ivory" : "text-ink/70 hover:bg-mist"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={() => void signOut()}
        className="mt-8 text-left text-sm text-ink/50 hover:text-ink"
      >
        Sign out
      </button>
    </aside>
  );
}