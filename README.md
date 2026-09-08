# Glowline

Micro-SaaS for boutique aesthetics and wellness clinics in London. Capture WhatsApp and web leads after hours, qualify bookings from a live treatment menu, and route Google reviews so unhappy patients never hit the public listing first.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth + Postgres)
- Stripe Checkout at **£179 / month**
- OpenAI chat via `/api/chat` (falls back to a local placeholder if no API key)

## Run locally

This machine did not have Node.js on `PATH` when the project was generated. Node 22 is now available via Homebrew (`node@22`). Then:

```bash
cd ~/Projects/glowline
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase keys, sign-in still opens the clinic dashboard in **demo mode**.

## Supabase

1. Create a project and enable Email auth.
2. Run `supabase/schema.sql` in the SQL editor.
3. Put the project URL and anon key in `.env.local`.

Clinic managers sign up at `/signup`. Middleware protects `/dashboard` once keys are present.

## Stripe

Add `STRIPE_SECRET_KEY`. The Billing tab posts to `/api/stripe/checkout` and starts a **recurring GBP subscription** using price_data (£179.00). Point webhooks at `/api/stripe/webhook`.

## OpenAI widget

The landing-page chat widget posts conversation turns to `/api/chat`. With `OPENAI_API_KEY` set, the route calls Chat Completions using the clinic knowledge-base prompt. Without a key, a deterministic placeholder responder uses the same menu, hours, and FAQs.

## Product surfaces

| Route | Purpose |
| --- | --- |
| `/` | Marketing site for London clinic owners |
| `/login` `/signup` | Clinic manager auth |
| `/dashboard` | Active leads, conversion, revenue saved |
| `/dashboard/knowledge` | Clinic identity, hours, services, FAQs |
| `/dashboard/leads` | Simulated live inbox |
| `/dashboard/reviews` | SMS feedback loop toggle + templates |
| `/dashboard/billing` | Stripe subscribe button |
