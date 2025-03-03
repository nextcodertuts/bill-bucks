/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
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
    formData.append("merchantId", selectedMerchant!.id);
    formData.append("amount", invoiceAmount);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        body: formData,
      });
      if (!response.ok)
        throw new Error(`Invoice creation failed: ${response.statusText}`);
      toast.success("Invoice created successfully!");
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
    <div className="flex justify-center mb-4">
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
              <CardTitle>Step 1: Select Merchant</CardTitle>
              <CardDescription>
                Choose the merchant for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <AdComponent step={1} /> */}
              <Step1Content
                {...{ selectedMerchant, setSelectedMerchant, loading }}
              />
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
              {/* <AdComponent step={2} /> */}
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
              {/* <AdComponent step={3} /> */}
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
              {/* <AdComponent step={4} /> */}
              <Step4Content
                {...{ selectedMerchant, invoiceAmount, previewUrl }}
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
