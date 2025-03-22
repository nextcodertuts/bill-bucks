/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ReferralData {
  referralCode: string;
  balance: number;
  referredBy: { id: string; name: string } | null;
  referredUsersCount: number;
  referralHistory: Array<{
    id: string;
    amount: number;
    createdAt: string;
    referredUserId: string;
  }>;
  referralLink: string;
}

export default function ReferralCard() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/referral/status");
        if (!response.ok) {
          throw new Error("Failed to fetch referral data");
        }
        const data = await response.json();
        setReferralData(data);
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast.error("Failed to load referral information");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  //   const shareReferral = async () => {
  //     if (!referralData?.referralLink) return;

  //     if (navigator.share) {
  //       try {
  //         await navigator.share({
  //           title: "Join Bill Bucks with my referral",
  //           text: "Track your invoices with Bill Bucks! Use my referral code to join.",
  //           url: referralData.referralLink,
  //         });
  //       } catch (error) {
  //         console.error("Error sharing:", error);
  //         copyToClipboard(
  //           referralData.referralLink,
  //           "Referral link copied to clipboard"
  //         );
  //       }
  //     } else {
  //       copyToClipboard(
  //         referralData.referralLink,
  //         "Referral link copied to clipboard"
  //       );
  //     }
  //   };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!referralData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Failed to load referral information
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Referral Program</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary p-4 rounded-lg">
          <p className="text-sm text-secondary mb-2">
            Invite friends to Bill Bucks! When they upload 5 invoices, you'll
            earn ₹10.
          </p>
          <div className="flex items-center justify-between bg-white p-3 rounded border">
            <div className="font-mono font-medium">
              {referralData.referralCode}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  referralData.referralCode,
                  "Referral code copied!"
                )
              }
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(referralData.balance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Friends Referred</p>
            <p className="text-2xl font-bold text-center text-secondary">
              {referralData.referredUsersCount}
            </p>
          </div>
        </div>

        <Button className="w-full">
          <Link href="/withdrawals">Withdrawal</Link>
        </Button>

        {/* <Button className="w-full" onClick={shareReferral}>
          <Share2 className="mr-2 h-4 w-4" /> Share Your Referral Link
        </Button> */}

        {referralData.referredBy && (
          <div className="text-sm text-muted-foreground">
            You were referred by:{" "}
            <span className="font-medium">{referralData.referredBy.name}</span>
          </div>
        )}

        {referralData.referralHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Referral History</h3>
            <div className="space-y-2">
              {referralData.referralHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <span>Earned {formatCurrency(history.amount)}</span>
                  <span className="text-muted-foreground">
                    {new Date(history.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
