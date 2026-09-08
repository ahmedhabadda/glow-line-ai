import { ReviewSettingsForm } from "@/components/dashboard/review-settings";
import { mockReviewSettings } from "@/lib/mock-data";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Review automation</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          A private SMS loop 24 hours after treatment. Happy patients receive your Google
          link. Anyone below the threshold is escalated to you, not the public listing.
        </p>
      </div>
      <ReviewSettingsForm initial={mockReviewSettings} />
    </div>
  );
}
