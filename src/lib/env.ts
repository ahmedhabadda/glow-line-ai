import { publicEnv } from "@/lib/public-env";

function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

export const env = {
  ...publicEnv,
  stripeSecretKey: read("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: read("STRIPE_WEBHOOK_SECRET"),
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  openaiApiKey: read("OPENAI_API_KEY"),
  openaiModel: read("OPENAI_MODEL") ?? "gpt-4o-mini",
  resendApiKey: read("RESEND_API_KEY"),
  notifyFromEmail: read("NOTIFY_FROM_EMAIL") ?? "onboarding@resend.dev",
};

export { isSupabaseConfigured } from "@/lib/public-env";

export const isStripeConfigured = Boolean(
  env.stripeSecretKey && env.stripeSecretKey.startsWith("sk_"),
);

export const isOpenAIConfigured = Boolean(env.openaiApiKey);
