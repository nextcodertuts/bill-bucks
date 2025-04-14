import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SpendingStats } from "@/components/spending-stats";
import ImageCarousel from "@/components/image-carousel";
import { BNPLHighlight } from "@/components/BNPLHighlight";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/register");
  }

  return (
    <div className="p-4 space-y-6 mt-1">
      <BNPLHighlight userId={user.id} />
      <div>
        <ImageCarousel />
      </div>
      <div>
        <SpendingStats userId={user.id} />
      </div>
    </div>
  );
}
