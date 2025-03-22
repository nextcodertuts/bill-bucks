// import AdsterraBanner from "@/components/ads/AdsterraBanner";
import { validateRequest } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Gift } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
// import SubscriptionButton from "@/components/SubscriptionButton";
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

  // Fetch user balance and mandate status
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
  // const subscriptionStatus = userWithDetails?.subscriptionStatus;
  // const subscriptionId = userWithDetails?.razorpaySubscriptionId;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 mt-24">
      {/* Profile Header */}
      <div className="flex items-center gap-6 border-b pb-6">
        {/* Profile Avatar */}
        <div className="h-20 w-20 rounded-full bg-purple-500 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-md">
          {initials}
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold capitalize">{userName}</h1>
          <p className="text-gray-600 text-sm">📞 {userPhone}</p>

          {/* Referral Balance */}
          <div className="flex items-center gap-2 text-purple-600">
            <Gift className="h-4 w-4" />
            <span className="font-semibold">
              {formatCurrency(Number(balance))}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      {/* <div className="mt-6 bg-purple-50 rounded-lg">
        <div className="flex items-center justify-center mb-4">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              subscriptionStatus === "ACTIVE"
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {subscriptionStatus === "ACTIVE" ? "Verified" : "Not Verified"}
          </span>
        </div>

        {subscriptionStatus !== "ACTIVE" && (
          <div className="space-y-2">
            <p className="text-sm text-center text-gray-600 mb-4">
              Verify your account to enable instant withdrawals
            </p>
            <SubscriptionButton
              subscriptionStatus={subscriptionStatus}
              subscriptionId={subscriptionId}
            />
          </div>
        )}
      </div> */}

      <Button className="w-full mt-6" asChild>
        <Link href="/withdrawals">Withdrawal</Link>
      </Button>

      {/* Additional Details */}
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

        {/* Referral Section */}
        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Referral Program</h3>
            <Link
              href="/referrals"
              className="text-sm text-purple-600 font-medium hover:underline"
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
      {/* <AdsterraBanner /> */}
    </div>
  );
}
