/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useCallback } from "react";
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
import { expo } from "@/lib/expo-bridge";

interface Merchant {
  id: string;
  name: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function InvoiceForm() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImagePick = useCallback(async () => {
    try {
      const hasPermission = await expo.requestCameraPermission();
      if (!hasPermission) {
        toast.error("Camera permission denied");
        return;
      }

      const result = await expo.pickImage();
      if (!result) {
        return;
      }

      // Convert base64 to File object
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const file = new File([blob], "invoice.jpg", { type: "image/jpeg" });

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setInvoiceImage(file);
      setPreviewUrl(result.uri);
    } catch (error) {
      console.error("Error picking image:", error);
      toast.error("Failed to pick image");
    }
  }, []);

  const validateForm = () => {
    if (!selectedMerchant) {
      toast.error("Please select a merchant");
      return false;
    }
    if (!invoiceAmount || parseFloat(invoiceAmount) <= 0) {
      toast.error("Please enter a valid invoice amount");
      return false;
    }
    if (!invoiceImage) {
      toast.error("Please upload an invoice image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", invoiceImage!);
    formData.append("merchantId", selectedMerchant!.id);
    formData.append("amount", invoiceAmount);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Invoice creation failed: ${response.statusText}`);
      }

      toast.success("Invoice created successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create invoice"
      );
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Merchant</Label>
            <MerchantSearch
              onSelect={setSelectedMerchant}
              className="w-full"
              disabled={loading}
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
              min="0.01"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Invoice Image</Label>
            <div className="flex flex-col items-center gap-4">
              <Button
                type="button"
                onClick={handleImagePick}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Uploading..." : "Take Photo or Choose from Gallery"}
              </Button>

              {previewUrl && (
                <div className="mt-2 w-full">
                  <img
                    src={previewUrl}
                    alt="Invoice preview"
                    className="w-full h-auto rounded-md object-contain"
                    onError={() => {
                      setPreviewUrl(null);
                      toast.error("Failed to load image preview");
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Submitting...</span>
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
