import { BellIcon, UserPlus } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const userName = user?.name || "Anonymous";
  const userPhone = user?.phoneNumber || "Not provided";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const userWithDetails = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      balance: true,
      referralCode: true,
      razorpaySubscriptionId: true,
      subscriptionStatus: true,
    },
  });

  const balance = userWithDetails?.balance || 0;
  const referralCode = userWithDetails?.referralCode || "";

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 mt-24">
      <div className="flex items-center gap-6 border-b pb-6">
        <div className="h-20 w-20 rounded-full bg-primary text-secondary flex items-center justify-center text-3xl font-bold uppercase shadow-md">
          {initials}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold capitalize">{userName}</h1>
          <p className="text-sm flex gap-2 items-center">
            <BellIcon className="w-4 h-4" />
            {userPhone}
          </p>

          <div className="flex items-center gap-2 text-secondary">
            <UserPlus className="h-4 w-4" />
            <span className="font-semibold">
              {formatCurrency(Number(balance))}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <Button className="w-full" asChild>
          <Link href="/withdrawals">Withdrawal</Link>
        </Button>

        <Button className="w-full" variant="secondary" asChild>
          <Link href="/invite-friends">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Friends
          </Link>
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Account Created:</span>
          <span className="text-gray-500 text-sm">
            {new Date(user?.createdAt || "").toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) || "Unknown"}
          </span>
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Referral Program</h3>
            <Link
              href="/referrals"
              className="text-xs text-primary font-medium underline"
            >
              View Details
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Share your referral code and earn ₹10 when your friends upload 5
            invoices!
          </p>
          <div className="bg-white p-2 rounded border text-center font-mono">
            {referralCode}
          </div>
        </div>
      </div>
    </div>
  );
}
