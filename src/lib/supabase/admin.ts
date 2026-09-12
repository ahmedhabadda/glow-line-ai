import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Privileged Supabase client using the service_role key — bypasses RLS
 * entirely. NEVER import this into a client component or anywhere reachable
 * from the browser. Use only in trusted server-to-server contexts like the
 * Stripe webhook, where there's no authenticated user session to rely on RLS
 * with, but the write still needs to be trusted (e.g. billing status).
 */
export function createAdminClient() {
  if (!isSupabaseConfigured || !env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }
  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}