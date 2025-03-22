// import AdComponent from "@/components/ads/AdComponent";
// import BannerAd from "@/components/ads/BannerAd";
import InvoiceForm from "@/components/InvoiceForm";
import React from "react";

export default function page() {
  return (
    <div className=" px-2 space-y-2 flex flex-col justify-center items-center min-h-screen">
      {/* <AdComponent /> */}
      <InvoiceForm />
      {/* <BannerAd /> */}
    </div>
  );
}
