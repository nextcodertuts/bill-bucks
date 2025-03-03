/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";

const AdComponent = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : 'e40cf07408c64e6ddd7b8ac1ebc42496',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src =
      "//www.highperformanceformat.com/e40cf07408c64e6ddd7b8ac1ebc42496/invoke.js";
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
      id="ad-container"
      className="flex w-full justify-center"
    ></div>
  );
};

export default AdComponent;
