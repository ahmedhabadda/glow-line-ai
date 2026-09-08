import { NextResponse } from "next/server";
import { GLOWLINE_MONTHLY_PRICE_PENCE } from "@/lib/billing";
import { env, isStripeConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

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

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable." }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
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
