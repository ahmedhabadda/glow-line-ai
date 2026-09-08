import { ChatWidget } from "@/components/chat/chat-widget";
import {
  LandingFeatures,
  LandingFooter,
  LandingHero,
  LandingNav,
  LandingPricing,
  LandingReviews,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <main>
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingReviews />
      <LandingPricing />
      <LandingFooter />
      <ChatWidget />
    </main>
  );
}
