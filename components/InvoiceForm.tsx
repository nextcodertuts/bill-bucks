/* eslint-disable @next/next/no-img-element */
// components/InvoiceForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Demo merchant data
const merchants = [
  { id: "1", name: "Amazon" },
  { id: "2", name: "Walmart" },
  { id: "3", name: "Best Buy" },
  { id: "4", name: "Target" },
];

export default function InvoiceForm() {
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form data handling
    const formData = {
      merchant: selectedMerchant,
      amount: invoiceAmount,
      image: invoiceImage,
    };

    console.log("Form submitted:", formData);
    // Here you would typically send this to your API

    // Reset form
    setSelectedMerchant("");
    setInvoiceAmount("");
    setInvoiceImage(null);
    setPreviewUrl(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent">
      <CardHeader>
        <CardTitle>Submit Invoice</CardTitle>
        <CardDescription>Upload your invoice details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Merchant Selection */}
          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Select
              value={selectedMerchant}
              onValueChange={setSelectedMerchant}
            >
              <SelectTrigger id="merchant">
                <SelectValue placeholder="Select a merchant" />
              </SelectTrigger>
              <SelectContent>
                {merchants.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Invoice Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="invoiceImage">Invoice Image</Label>
            <Input
              id="invoiceImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Invoice preview"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!selectedMerchant || !invoiceAmount || !invoiceImage}
          >
            Submit Invoice
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
