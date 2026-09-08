function readPublic(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

export const publicEnv = {
  appUrl: readPublic("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
  supabaseUrl: readPublic("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readPublic("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  stripePublishableKey: readPublic("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
};

export const isSupabaseConfigured = Boolean(
  publicEnv.supabaseUrl &&
    publicEnv.supabaseAnonKey &&
    !publicEnv.supabaseUrl.includes("YOUR_PROJECT"),
);
