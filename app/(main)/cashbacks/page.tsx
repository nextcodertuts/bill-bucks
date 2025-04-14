"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, CreditCard, Store } from "lucide-react";

interface Cashback {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
  invoice: {
    amount: number;
    merchant?: {
      name: string;
    } | null;
  };
}

export default function CashbacksPage() {
  const [cashbacks, setCashbacks] = useState<Cashback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashbacks = async () => {
      try {
        const response = await fetch("/api/cashbacks");
        if (!response.ok) throw new Error("Failed to fetch cashbacks");
        const data = await response.json();
        setCashbacks(data);
      } catch (error) {
        console.error("Error fetching cashbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashbacks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Cashback History</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Cashback History</h1>
      <div className="space-y-4">
        {cashbacks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No cashbacks found</p>
            </CardContent>
          </Card>
        ) : (
          cashbacks.map((cashback) => (
            <Card key={cashback.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {cashback.invoice.merchant?.name || "Non-Merchant Bill"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(cashback.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {formatCurrency(cashback.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      on bill of {formatCurrency(cashback.invoice.amount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
