/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Lock, ShieldCheck, Wallet } from "lucide-react";

interface BNPLEligibilityProps {
  userId: string;
}

export function BNPLEligibility({ userId }: BNPLEligibilityProps) {
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const targetAmount = 10000;
  const isEligible = totalSpent >= targetAmount;

  useEffect(() => {
    const fetchTotalSpent = async () => {
      try {
        const response = await fetch("/api/invoices?period=all");
        const data = await response.json();
        setTotalSpent(data.total || 0);
      } catch (error) {
        console.error("Error fetching total spent:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalSpent();
  }, []);

  const calculateProgress = () => {
    const progress = (totalSpent / targetAmount) * 100;
    return Math.min(progress, 100);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CreditCard className="h-5 w-5 text-primary" />
          Buy Now, Pay Later
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress towards BNPL eligibility</span>
              <span className="font-medium">
                {formatCurrency(totalSpent)} / {formatCurrency(targetAmount)}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          {/* Status Card */}
          <div
            className={`p-4 rounded-lg ${
              isEligible ? "bg-green-50" : "bg-yellow-50"
            }`}
          >
            <div className="flex items-start gap-3">
              {isEligible ? (
                <ShieldCheck className="h-5 w-5 text-green-600 mt-1" />
              ) : (
                <Lock className="h-5 w-5 text-yellow-600 mt-1" />
              )}
              <div>
                <h3
                  className={`font-medium ${
                    isEligible ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {isEligible
                    ? "Congratulations! You're Eligible"
                    : "Almost There!"}
                </h3>
                <p
                  className={`text-sm ${
                    isEligible ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {isEligible
                    ? "You can now access Buy Now, Pay Later features"
                    : `Upload more invoices worth ${formatCurrency(
                        targetAmount - totalSpent
                      )} to unlock BNPL`}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4 text-primary" />
              <span>Credit limit up to ₹50,000</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Zero processing fees</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Pay in easy installments</span>
            </div>
          </div>

          <Button className="w-full" disabled={!isEligible}>
            {isEligible ? "Activate BNPL" : "Keep Shopping"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
