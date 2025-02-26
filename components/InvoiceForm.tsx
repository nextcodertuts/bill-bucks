/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WEBP images are accepted");
      return;
    }

    setInvoiceImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

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
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileButtonClick}
                  disabled={loading}
                  className="w-full"
                >
                  {invoiceImage ? "Change Image" : "Upload Image"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
              {invoiceImage && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {invoiceImage.name}
                </p>
              )}
              {previewUrl && (
                <div className="mt-2 w-full">
                  <img
                    src={previewUrl}
                    alt="Invoice preview"
                    className="w-full h-auto rounded-md object-contain border"
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
