import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { validateRequest } from "@/lib/auth";

export default async function UserProfilePage() {
  const { user } = await validateRequest();

  const userName = user?.name ? user.name : "Anonymous";

  return (
    <div className="">
      {/* Top Navigation */}
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="" asChild>
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      {/* User Profile Header */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-purple-300 flex items-center justify-center text-2xl font-bold text-purple-900 uppercase">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold capitalize">{userName}</h1>
            <p className=" text-sm">Phone: {user?.phoneNumber}</p>
            <p
              className={`w-fit px-2 font-semibold text-sm rounded-2xl ${
                user?.subscribe ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {user?.subscribe ? "Subscribed" : "Not Subscribed"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
