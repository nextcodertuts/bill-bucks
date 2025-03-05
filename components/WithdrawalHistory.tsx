"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Withdrawal {
  id: string;
  amount: number;
  upiId: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  notes?: string;
}

export default function WithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch("/api/withdrawals");
        if (!response.ok) throw new Error("Failed to fetch withdrawals");
        const data = await response.json();
        setWithdrawals(data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>View your withdrawal requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {withdrawals.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No withdrawal history found
            </p>
          ) : (
            withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {formatCurrency(withdrawal.amount)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      withdrawal.status
                    )}`}
                  >
                    {withdrawal.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>UPI ID: {withdrawal.upiId}</p>
                  <p>
                    Date:{" "}
                    {new Date(withdrawal.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  {withdrawal.notes && (
                    <p className="mt-2 text-sm italic">{withdrawal.notes}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
