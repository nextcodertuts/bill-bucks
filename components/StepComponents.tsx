/* eslint-disable @next/next/no-img-element */
"use client";

import { MerchantSearch } from "./merchant-search";
import { Check, Upload } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Merchant {
  id: string;
  name: string;
}

interface StepContentProps {
  step: number;
  selectedMerchant: Merchant | null;
  setSelectedMerchant: (merchant: Merchant | null) => void;
  invoiceAmount: string;
  setInvoiceAmount: (amount: string) => void;
  invoiceImage: File | null;
  setInvoiceImage: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileButtonClick: () => void;
  isMerchant?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const Step1Content = ({
  selectedMerchant,
  setSelectedMerchant,
  loading,
}: StepContentProps) => (
  <>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Merchant</Label>
        <MerchantSearch
          onSelect={setSelectedMerchant}
          className="w-full"
          disabled={loading}
        />
        {selectedMerchant && (
          <p className="text-sm text-muted-foreground flex items-center">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            Selected: {selectedMerchant.name}
          </p>
        )}
      </div>
    </div>
  </>
);

export const Step2Content = ({
  invoiceAmount,
  setInvoiceAmount,
  loading,
}: StepContentProps) => (
  <>
    <div className="space-y-4">
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
          className="text-lg py-6"
        />
      </div>
    </div>
  </>
);

export const Step3Content = ({
  invoiceImage,
  setInvoiceImage,
  setPreviewUrl,
  previewUrl,
  loading,
  fileInputRef,
  handleFileButtonClick,
}: StepContentProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return;
    setInvoiceImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Invoice Image</Label>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleFileButtonClick}
              disabled={loading}
              className="w-full py-8 flex flex-col items-center gap-2"
            >
              <Upload className="h-6 w-6" />
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
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const Step4Content = ({
  selectedMerchant,
  invoiceAmount,
  previewUrl,
  isMerchant,
}: StepContentProps) => (
  <>
    <div className="space-y-4">
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Bill Type</h3>
          <p className="font-medium">
            {isMerchant ? "Merchant Bill" : "Non-Merchant Bill"}
          </p>
        </div>
        {isMerchant && selectedMerchant && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Merchant</h3>
            <p className="font-medium">{selectedMerchant.name}</p>
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Amount</h3>
          <p className="font-medium">₹{parseFloat(invoiceAmount).toFixed(2)}</p>
        </div>
        {previewUrl && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Invoice Image</h3>
            <div className="mt-1 w-full h-32 overflow-hidden">
              <img
                src={previewUrl}
                alt="Invoice preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        )}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-700">Cashback Info</h3>
          <p className="text-sm text-purple-600">
            {isMerchant
              ? "You'll receive instant cashback of ₹3-5 for this merchant bill!"
              : "Upload 15 non-merchant bills to get ₹3 cashback. Keep collecting!"}
          </p>
        </div>
      </div>
    </div>
  </>
);
