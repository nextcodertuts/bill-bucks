import { ImageSlider } from "@/components/image-slider";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SpendingStats } from "@/components/spending-stats";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <ImageSlider />
      </div>
      <div>
        <SpendingStats userId={user.id} />
      </div>
    </div>
  );
}
