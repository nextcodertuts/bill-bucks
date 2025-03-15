/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VerifyButtonProps {
  mandateStatus?: string | null;
  mandateId?: string | null;
}

export default function VerifyButton({
  mandateStatus,
  mandateId,
}: VerifyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);

      // Create customer, order and mandate
      const response = await fetch("/api/mandate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create mandate");
      }

      const { orderId, mandateId, customerId } = await response.json();

      // Load Razorpay SDK
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderId,
          customer_id: customerId,
          mandate_id: mandateId,
          name: "Bill Bucks",
          description: "AutoPay Mandate Setup",
          image: "/bill-bucks.png",
          handler: async function (response: any) {
            try {
              // Update mandate status with payment verification
              await fetch("/api/mandate", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  mandateId,
                  status: "active",
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });

              toast.success("Verification completed successfully!");
              window.location.reload();
            } catch (error) {
              console.error("Error updating mandate:", error);
              toast.error("Failed to complete verification");
            }
          },
          modal: {
            confirm_close: true,
            ondismiss: async () => {
              try {
                await fetch("/api/mandate", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    mandateId,
                    status: "failed",
                  }),
                });
              } catch (error) {
                console.error("Error updating mandate status:", error);
              }
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
      toast.error("Failed to initiate verification");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    switch (mandateStatus) {
      case "PENDING":
        return "Complete Verification";
      case "FAILED":
        return "Retry Verification";
      default:
        return "Verify Account";
    }
  };

  return (
    <Button onClick={handleVerify} disabled={loading} className="w-full">
      {loading ? "Processing..." : getButtonText()}
    </Button>
  );
}
