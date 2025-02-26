/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MerchantSearch } from "./merchant-search";

interface Merchant {
  id: string;
  name: string;
}

export default function InvoiceForm() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchant || !invoiceAmount || !invoiceImage) return;

    setLoading(true);
    try {
      // First, upload the image
      const imageFormData = new FormData();
      imageFormData.append("file", invoiceImage);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { url: imageUrl } = await uploadResponse.json();

      // Then create the invoice
      const invoiceFormData = new FormData();
      invoiceFormData.append("merchantId", selectedMerchant.id);
      invoiceFormData.append("amount", invoiceAmount);
      invoiceFormData.append("imageUrl", imageUrl);

      const invoiceResponse = await fetch("/api/invoices", {
        method: "POST",
        body: invoiceFormData,
      });

      if (!invoiceResponse.ok) {
        throw new Error("Failed to create invoice");
      }

      toast.success("Invoice created successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent">
      <CardHeader>
        <CardTitle>Submit Invoice</CardTitle>
        <CardDescription>Upload your invoice details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Merchant</Label>
            <MerchantSearch
              onSelect={(merchant) => setSelectedMerchant(merchant)}
              className="w-full"
            />
            {selectedMerchant && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedMerchant.name}
              </p>
            )}
          </div>

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

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading || !selectedMerchant || !invoiceAmount || !invoiceImage
            }
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : (
              "Submit Invoice"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
