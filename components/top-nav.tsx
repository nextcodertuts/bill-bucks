import { BellIcon } from "lucide-react";
import React from "react";

export default function Topnav() {
  return (
    <div className="fixed top-0 z-50 left-0 right-0 flex justify-between bg-purple-50 border-b items-center h-12 p-4">
      <h2 className="font-bold text-2xl tracking-wide">
        <span className="text-purple-600">Cash</span>
        <span>Bucks</span>
      </h2>
      <p className="text-purple-600">
        <BellIcon />
      </p>
    </div>
  );
}
