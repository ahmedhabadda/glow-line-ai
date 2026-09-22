import { NextResponse } from "next/server";
import { env, isStripeConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getOwnClinicId } from "@/lib/clinic-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 });
  }

  const clinicId = await getOwnClinicId();
  if (!clinicId) {
    return NextResponse.json(
      { error: "Sign in to a clinic workspace to manage billing." },
      { status: 401 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable." }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: subscription } = (await supabase
    ?.from("subscriptions")
    .select("stripe_customer_id")
    .eq("clinic_id", clinicId)
    .maybeSingle()) ?? { data: null };

  const stripeCustomerId = subscription?.stripe_customer_id;
  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found yet — subscribe first." },
      { status: 404 },
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.appUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}