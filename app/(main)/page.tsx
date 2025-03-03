import { ImageSlider } from "@/components/image-slider";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SpendingStats } from "@/components/spending-stats";
import HorizontalScroll from "@/components/HorizontalScroll";
import AdComponent from "@/components/ads/AdComponent";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/register");
  }

  return (
    <div className="p-4 space-y-6">
      <AdComponent />
      <div>
        <h2 className="text-xl font-semibold pl-2">Online Merchants</h2>
        <HorizontalScroll />
      </div>
      <div>
        <ImageSlider />
      </div>
      <div>
        <SpendingStats userId={user.id} />
      </div>
    </div>
  );
}
