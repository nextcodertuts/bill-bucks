"use client";

import { BellIcon, MoreVertical, Power } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { Button } from "./ui/button";

export default function Topnav() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    // Function to handle clicks outside the menu
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was outside both the menu and the toggle button
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    // Add event listener when menu is shown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="fixed top-0 z-50 left-0 right-0 flex justify-between bg-primary border-b border-secondary/20 items-center h-12 p-4">
      <h2 className="font-bold text-2xl tracking-wide text-white ">
        <span className="text-secondary">Bill</span>
        <span>BuckZ</span>
      </h2>
      <div className="flex items-center gap-4">
        <p className="text-secondary">
          <BellIcon />
        </p>
        <div className="relative">
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="text-secondary hover:text-white"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div className="py-1" role="menu">
                <Link
                  href="/privacy-policy"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  Terms & Conditions
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 font-semibold block text-sm text-red-600 hover:bg-gray-100"
                >
                  <p className="rounded-md flex items-center bg-primary/5 p-1 ">
                    <Power className="w-4 h-4 mr-2" />
                    Logout
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
