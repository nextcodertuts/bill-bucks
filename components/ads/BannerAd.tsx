/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";

const BannerAd = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : '0a2c98242287e05737a6bd192c01df9b',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src =
      "//www.highperformanceformat.com/0a2c98242287e05737a6bd192c01df9b/invoke.js";
    script2.async = true;

    adContainerRef.current.appendChild(script1);
    adContainerRef.current.appendChild(script2);

    return () => {
      adContainerRef.current?.removeChild(script1);
      adContainerRef.current?.removeChild(script2);
    };
  }, []);

  return (
    <div
      ref={adContainerRef}
      id="banner-ad-container"
      style={{
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f0f0",
      }}
    ></div>
  );
};

export default BannerAd;
