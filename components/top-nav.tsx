import { BellIcon } from "lucide-react";
import React from "react";

export default function Topnav() {
  return (
    <div className="fixed top-0 z-50 left-0 right-0 flex justify-between bg-primary border-b border-secondary/20 items-center h-12 p-4">
      <h2 className="font-bold text-2xl tracking-wide text-white">
        <span className="text-secondary">Cash</span>
        <span>Bucks</span>
      </h2>
      <p className="text-secondary">
        <BellIcon />
      </p>
    </div>
  );
}
