/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BNPLHighlightProps {
  userId: string;
}

export function BNPLHighlight({ userId }: BNPLHighlightProps) {
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

  if (loading) {
    return <div className="h-24 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <h3 className="font-semibold">Buy Now, Pay Later</h3>
            </div>
            <p className="text-sm text-primary-foreground/80">
              {isEligible
                ? "You're eligible for BNPL! Click to activate."
                : `${formatCurrency(targetAmount - totalSpent)} more to unlock`}
            </p>
          </div>
          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link href="/bnpl">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
