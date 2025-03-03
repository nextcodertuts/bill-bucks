/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";

const AdsterraBanner = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src =
      "//pl26010838.effectiveratecpm.com/413d612f3b4b8abd879e87d07e80f44d/invoke.js";

    adContainerRef.current.appendChild(script);

    return () => {
      adContainerRef.current?.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={adContainerRef}
      id="container-413d612f3b4b8abd879e87d07e80f44d"
      style={{ width: "100%", textAlign: "center", padding: "10px 0" }}
    >
      <p>Loading Ad...</p>
    </div>
  );
};

export default AdsterraBanner;
