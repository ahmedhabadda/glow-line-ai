import { ReviewSettingsForm } from "@/components/dashboard/review-settings";
import { getOwnClinicId, getReviewSettings } from "@/lib/clinic-knowledge";

export default async function ReviewsPage() {
  const clinicId = await getOwnClinicId();
  const { settings, isRealData } = await getReviewSettings(clinicId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Review automation</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">
          A private SMS loop 24 hours after treatment. Happy patients receive your Google
          link. Anyone below the threshold is escalated to you, not the public listing.
        </p>
        {!isRealData ? (
          <p className="mt-2 max-w-2xl text-sm text-amber-700">
            Showing sample settings — save your own template and Google review link below to
            replace it.
          </p>
        ) : null}
      </div>
      <ReviewSettingsForm initial={settings} isRealData={isRealData} />
    </div>
  );
}