/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  subscriptionStatus?: string | null;
  subscriptionId?: string | null;
}

export default function SubscriptionButton({
  subscriptionStatus,
  subscriptionId,
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Create subscription
      const response = await fetch("/api/subscription", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      const { subscriptionId } = await response.json();

      // Load Razorpay SDK
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: subscriptionId,
          name: "Bill Bucks",
          description: "Monthly Premium Subscription",
          handler: async function (response: any) {
            try {
              // Update subscription status
              await fetch("/api/subscription", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  subscriptionId,
                  status: "active",
                }),
              });

              toast.success("Subscription activated successfully!");
              window.location.reload();
            } catch (error) {
              console.error("Error updating subscription:", error);
              toast.error("Failed to activate subscription");
            }
          },
          prefill: {
            name: "", // Will be filled by user
            email: "", // Will be filled by user
            contact: "", // Will be filled by user
          },
          config: {
            display: {
              blocks: {
                banks: {
                  name: "Pay using UPI or Net Banking",
                  instruments: [
                    {
                      method: "upi",
                    },
                    {
                      method: "netbanking",
                    },
                  ],
                },
                cards: {
                  name: "Pay using Card",
                  instruments: [
                    {
                      method: "card",
                    },
                  ],
                },
              },
              sequence: ["block.banks", "block.cards"],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              toast.error("Payment cancelled");
            },
          },
          theme: {
            color: "#7C3AED",
          },
        };

        const razorpayObject = new (window as any).Razorpay(options);
        razorpayObject.open();
      };
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to initiate subscription");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    switch (subscriptionStatus) {
      case "PENDING":
        return "Complete Verification";
      case "FAILED":
        return "Retry Verification";
      default:
        return "Verify Account";
    }
  };

  return (
    <Button onClick={handleSubscribe} disabled={loading} className="w-full">
      {loading ? "Processing..." : getButtonText()}
    </Button>
  );
}
