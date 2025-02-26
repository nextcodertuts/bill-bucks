import { ImageSlider } from "@/components/image-slider";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }
  return (
    <div className="p-4">
      <div>
        <ImageSlider />
      </div>
      <div>{/* Shows Users All Overviews, How many Spents*/}</div>
    </div>
  );
}
