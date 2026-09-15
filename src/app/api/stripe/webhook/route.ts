import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = env.stripeWebhookSecret;

  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    console.error("Stripe webhook received but SUPABASE_SERVICE_ROLE_KEY is not configured.");
    return NextResponse.json({ error: "Server not configured to persist billing." }, { status: 500 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clinicId = session.client_reference_id;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

    console.log("checkout.session.completed received", {
      clinicId,
      customerId,
      subscriptionId,
    });

    if (clinicId) {
      const { error } = await supabase.from("subscriptions").upsert({
        clinic_id: clinicId,
        stripe_customer_id: customerId ?? null,
        stripe_subscription_id: subscriptionId ?? null,
        status: "active",
      });
      if (error) {
        console.error("Failed to upsert subscription on checkout completion", error);
      } else {
        console.log("Subscription upserted successfully for clinic", clinicId);
      }
    } else {
      console.error("checkout.session.completed had no client_reference_id — cannot link to a clinic");
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: event.type === "customer.subscription.deleted" ? "cancelled" : subscription.status,
        stripe_subscription_id: subscription.id,
      })
      .eq("stripe_customer_id", customerId);
    if (error) console.error("Failed to update subscription status", error);
  }

  return NextResponse.json({ received: true });
}