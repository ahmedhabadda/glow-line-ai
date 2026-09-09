export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};

export const isSupabaseConfigured = Boolean(
  publicEnv.supabaseUrl &&
    publicEnv.supabaseAnonKey &&
    !publicEnv.supabaseUrl.includes("YOUR_PROJECT")
);