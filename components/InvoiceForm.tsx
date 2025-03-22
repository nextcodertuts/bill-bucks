/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Script from "next/script";
import {
  Step1Content,
  Step2Content,
  Step3Content,
  Step4Content,
} from "./StepComponents";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isMerchant, setIsMerchant] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!isMerchant) return true;
        return (
          selectedMerchant !== null ||
          (toast.error("Please select a merchant"), false)
        );
      case 2:
        return (
          (!!invoiceAmount && parseFloat(invoiceAmount) > 0) ||
          (toast.error("Please enter a valid invoice amount"), false)
        );
      case 3:
        return (
          invoiceImage !== null ||
          (toast.error("Please upload an invoice image"), false)
        );
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep() && currentStep < 4)
      setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", invoiceImage!);
    if (selectedMerchant) {
      formData.append("merchantId", selectedMerchant.id);
    }
    formData.append("amount", invoiceAmount);
    formData.append("isMerchant", isMerchant.toString());

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Invoice creation failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Show appropriate success message based on cashback
      if (result.cashbackAmount > 0) {
        toast.success(
          `Invoice uploaded successfully! You received ₹${result.cashbackAmount} cashback!`
        );
      } else if (!isMerchant) {
        const remainingBills =
          15 - (result.invoice.user?.nonMerchantBillCount % 15);
        toast.success(
          `Invoice uploaded successfully! Upload ${remainingBills} more non-merchant bills for cashback.`
        );
      } else {
        toast.success("Invoice uploaded successfully!");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-4 pt-2">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`w-3 h-3 rounded-full mx-1 ${
            step === currentStep
              ? "bg-purple-600"
              : step < currentStep
              ? "bg-purple-400"
              : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 1: Select Bill Type</CardTitle>
              <CardDescription>
                Choose merchant or non-merchant bill
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={isMerchant ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setIsMerchant(true)}
                  >
                    Merchant Bill
                  </Button>
                  <Button
                    type="button"
                    variant={!isMerchant ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setIsMerchant(false)}
                  >
                    Non-Merchant Bill
                  </Button>
                </div>
                {isMerchant && (
                  <Step1Content
                    {...{ selectedMerchant, setSelectedMerchant, loading }}
                  />
                )}
              </div>
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 2: Enter Amount</CardTitle>
              <CardDescription>Specify the invoice amount</CardDescription>
            </CardHeader>
            <CardContent>
              <Step2Content {...{ invoiceAmount, setInvoiceAmount, loading }} />
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 3: Upload Invoice</CardTitle>
              <CardDescription>Upload an image of your invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <Step3Content
                {...{
                  invoiceImage,
                  setInvoiceImage,
                  previewUrl,
                  setPreviewUrl,
                  loading,
                  fileInputRef,
                  handleFileButtonClick,
                }}
              />
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>Step 4: Review & Submit</CardTitle>
              <CardDescription>
                Review your invoice details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Step4Content
                {...{
                  selectedMerchant,
                  invoiceAmount,
                  previewUrl,
                  isMerchant,
                }}
              />
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Script
        id="adsense-script"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        id="adsterra-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `console.log('Adsterra script loaded');`,
        }}
      />
      <Card className="w-full max-w-md mx-auto bg-transparent">
        <form onSubmit={handleSubmit}>
          {renderStepIndicator()}
          {renderStepContent()}
          <CardFooter className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || loading}
              className="w-1/3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={loading}
                className="w-1/3"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="w-1/3">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
