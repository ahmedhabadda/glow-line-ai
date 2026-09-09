import { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { isSupabaseConfigured } from "@/lib/public-env";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex-1 px-6 py-8">
        {!isSupabaseConfigured ? (
          <p className="mb-4 rounded-2xl bg-sand px-4 py-3 text-sm text-ink/70">
            Demo mode: add Supabase keys in `.env.local` to enable live clinic-manager auth.
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}