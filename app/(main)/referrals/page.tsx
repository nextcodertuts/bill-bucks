import AdComponent from "@/components/ads/AdComponent";
import BannerAd from "@/components/ads/BannerAd";
import ReferralCard from "@/components/ReferralCard";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReferralsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <AdComponent />
      <h1 className="text-2xl font-bold">Referral Program</h1>
      <ReferralCard />
      <BannerAd />
    </div>
  );
}
