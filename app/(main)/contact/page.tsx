/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const phoneNumber = "01169313594";
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  const handleCall = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "phoneCall", phone: phoneNumber })
      );
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleWhatsApp = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "whatsapp", phone: phoneNumber })
      );
    } else {
      window.open(whatsappLink, "_blank");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>For Merchants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Want to join BillBuckz as a merchant? Contact us to get started
              and grow your business.
            </p>
            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleCall}>
                <Phone className="mr-2 h-4 w-4" />
                Call Us
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={handleWhatsApp}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Need help with your account or have questions about BillBuckz?
              We&apos;re here to help!
            </p>
            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleCall}>
                <Phone className="mr-2 h-4 w-4" />
                Call Support
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={handleWhatsApp}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Business Hours: 10:00 AM - 7:00 PM (Monday - Saturday)</p>
          <p>Email: contact@nextcoder.co.in</p>
        </div>
      </div>
    </div>
  );
}
