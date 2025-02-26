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

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, or WebP)");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setInvoiceImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    },
    []
  );

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

    // Create FormData to send everything in ONE request
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
            <Label htmlFor="invoiceImage">Invoice Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="invoiceImage"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                disabled={loading}
                required
                className="hidden" // Hide the default input
              />
              <Label
                htmlFor="invoiceImage"
                className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span>Choose File</span>
              </Label>
              {invoiceImage && (
                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                  {invoiceImage.name}
                </span>
              )}
            </div>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Invoice preview"
                  className="max-w-full h-auto rounded-md object-contain"
                  onError={() => {
                    setPreviewUrl(null);
                    toast.error("Failed to load image preview");
                  }}
                />
              </div>
            )}
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
