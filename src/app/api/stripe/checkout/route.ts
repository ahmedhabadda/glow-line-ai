import { NextResponse } from "next/server";
import { GLOWLINE_MONTHLY_PRICE_PENCE } from "@/lib/billing";
import { env, isStripeConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getOwnClinicId } from "@/lib/clinic-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (!isStripeConfigured) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local to enable the £179/month clinic plan.",
      },
      { status: 501 },
    );
  }

  const clinicId = await getOwnClinicId();
  if (!clinicId) {
    return NextResponse.json(
      { error: "Sign in to a clinic workspace before starting checkout." },
      { status: 401 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable." }, { status: 500 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    // Ties this checkout back to the clinic so the webhook knows which
    // Supabase row to update once payment completes.
    client_reference_id: clinicId,
    customer_email: user?.email ?? undefined,
    success_url: `${env.appUrl}/dashboard/billing?status=success`,
    cancel_url: `${env.appUrl}/dashboard/billing?status=cancelled`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          recurring: { interval: "month" },
          unit_amount: GLOWLINE_MONTHLY_PRICE_PENCE,
          product_data: {
            name: "Glowline Clinic",
            description: "After-hours AI capture, booking qualification, and review protection.",
          },
        },
      },
    ],
  });

  return NextResponse.json({ url: session.url });
}