/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";

const MediumRectangleAd = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : '4a539f2186115e382e9c0639b2145be6',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src =
      "//www.highperformanceformat.com/4a539f2186115e382e9c0639b2145be6/invoke.js";
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
      id="medium-rectangle-ad-container"
      className="flex w-full justify-center"
    ></div>
  );
};

export default MediumRectangleAd;
