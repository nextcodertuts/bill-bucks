import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BNPLEligibility } from "@/components/BNPLEligibility";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Clock, CheckCircle2 } from "lucide-react";

export default async function BNPLPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Buy Now, Pay Later</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-lg text-muted-foreground">
          Shop with confidence using our flexible BNPL service. Get instant
          credit decisions and manage your purchases with ease.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Secure & Trusted</CardTitle>
            <CardDescription>
              Bank-grade security with end-to-end encryption for all
              transactions
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Flexible Payments</CardTitle>
            <CardDescription>
              Split your purchases into 3 easy monthly installments
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold">Upload Invoices</h3>
                <p className="text-sm text-muted-foreground">
                  Build your credit profile by uploading invoices worth ₹10,000
                  or more
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-semibold">Get Approved</h3>
                <p className="text-sm text-muted-foreground">
                  Receive instant approval and credit limit up to ₹50,000
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-semibold">Shop & Pay Later</h3>
                <p className="text-sm text-muted-foreground">
                  Use your credit at any of our partner merchants
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">No Hidden Fees</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Transparent pricing with zero processing fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Quick Approval</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get instant decisions on your BNPL application
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Wide Acceptance</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Use at all participating merchants in our network
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Check Your Eligibility</h2>
        <BNPLEligibility userId={user.id} />
      </div>
    </div>
  );
}
