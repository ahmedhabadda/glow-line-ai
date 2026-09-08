import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-champagne">
            Built for London boutique clinics
          </p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
            Never miss a Mayfair enquiry after 7pm.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70">
            Glowline is the after-hours front of house for aesthetics and wellness
            clinics. Capture WhatsApp and web leads at 2am, qualify bookings against
            your real menu, and protect your Google rating before a frustrated patient
            posts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button>Start a clinic workspace</Button>
            </Link>
            <Link href="#pricing">
              <Button variant="secondary">See £179/month</Button>
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-ink/50">Capture</dt>
              <dd className="font-medium">24/7 WhatsApp + web</dd>
            </div>
            <div>
              <dt className="text-ink/50">Qualify</dt>
              <dd className="font-medium">Menu-aware AI</dd>
            </div>
            <div>
              <dt className="text-ink/50">Protect</dt>
              <dd className="font-medium">Review routing</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[2rem] border border-sand bg-white p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Live after hours</p>
          <p className="mt-2 font-display text-2xl">Saturday 21:14 · WhatsApp</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-2xl bg-mist px-4 py-3">
              Hi, do you still have anything for under-eyes before my wedding?
            </div>
            <div className="ml-8 rounded-2xl bg-sage px-4 py-3 text-ivory">
              Yes — PRF under-eye rejuvenation is £450 / 45 minutes at 14 South Molton
              Street. I can hold Saturday morning and send a £50 deposit link.
            </div>
            <div className="rounded-2xl bg-mist px-4 py-3">Please do. I&apos;ll take Saturday.</div>
          </div>
          <p className="mt-6 text-xs text-ink/50">
            Qualified as Hot Lead · estimated value £450 · no receptionist overtime
          </p>
        </div>
      </div>
    </section>
  );
}

export function LandingNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Logo />
      <nav className="hidden items-center gap-8 text-sm text-ink/70 md:flex">
        <a href="#features">Product</a>
        <a href="#reviews">Reviews</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost">Sign in</Button>
        </Link>
        <Link href="/signup">
          <Button variant="dark">Get Glowline</Button>
        </Link>
      </div>
    </header>
  );
}

export function LandingFeatures() {
  const items = [
    {
      title: "24/7 WhatsApp & web capture",
      copy: "When Harley Street goes dark, Glowline still answers. Every after-hours message becomes a structured lead instead of a missed call.",
    },
    {
      title: "Automated booking qualification",
      copy: "The concierge reads your knowledge base — hours, prices, patch tests, deposits — so it never invents a treatment you do not offer.",
    },
    {
      title: "Google review protection",
      copy: "Post-appointment SMS asks for a 1–5. Happy patients get your Google link. Anyone under four is routed to the manager, not the public page.",
    },
  ];

  return (
    <section id="features" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.22em] text-champagne">The clinic OS</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl">
          Built for rooms that sell discretion, not discount codes.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-3xl border border-sand bg-mist p-6">
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingReviews() {
  return (
    <section id="reviews" className="px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-ink px-8 py-12 text-ivory">
        <p className="text-xs uppercase tracking-[0.22em] text-champagne">Review automation</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl">
          Keep five-star stories public. Keep friction private.
        </h2>
        <p className="mt-4 max-w-2xl text-ivory/70">
          Glowline sends a feedback loop 24 hours after treatment. Scores of 4–5 go to
          Google. Anything lower alerts the clinic manager with the original complaint —
          before it becomes a Mayfair reputation problem.
        </p>
      </div>
    </section>
  );
}

export function LandingPricing() {
  return (
    <section id="pricing" className="px-6 pb-24">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-sand bg-white p-8 shadow-card md:p-12">
        <p className="text-xs uppercase tracking-[0.22em] text-champagne">Simple clinic plan</p>
        <h2 className="mt-3 font-display text-4xl">£179 / month. One clinic. Unlimited after-hours coverage.</h2>
        <ul className="mt-6 grid gap-2 text-sm text-ink/70 md:grid-cols-2">
          <li>WhatsApp and web concierge</li>
          <li>AI knowledge base for your menu</li>
          <li>Lead inbox with Hot / Booked / Inquired</li>
          <li>SMS review routing templates</li>
          <li>Stripe billing for the clinic, not the patient</li>
          <li>Cancel any time from the dashboard</li>
        </ul>
        <div className="mt-8">
          <Link href="/signup">
            <Button>Create your workspace</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-sand px-6 py-8 text-sm text-ink/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Logo />
        <p>Made for London aesthetics & wellness teams. Not a medical device.</p>
      </div>
    </footer>
  );
}
