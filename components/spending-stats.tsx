/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface SpendingStatsProps {
  userId: string;
}

export function SpendingStats({ userId }: SpendingStatsProps) {
  const [period, setPeriod] = useState("monthly");
  const [stats, setStats] = useState<{
    invoices: any[];
    total: number;
  }>({
    invoices: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/invoices?period=${period}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Spending Overview</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="yearly">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-32 rounded" />
              ) : (
                formatCurrency(stats.total)
              )}
            </div>
          </CardContent>
        </Card>
        {/* <MediumRectangleAd /> */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-200 h-6 w-full rounded"
                    />
                  ))
              ) : stats.invoices.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    No transactions found for this period.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Transactions will appear here once they are processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.invoices.slice(0, 3).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex justify-between items-center"
                    >
                      <span>{invoice.merchant?.name || "NON-Merchant"}</span>
                      <span className="font-semibold">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
