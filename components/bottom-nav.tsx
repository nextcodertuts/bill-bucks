"use client";
import type React from "react";
import Link from "next/link";
import { Home, User, LogOut, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/(auth)/actions";

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function BottomNav({ className, ...props }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex p-2  items-center justify-around bg-purple-600/80  mx-2 backdrop-blur-md",
        "mx-auto max-w-sm rounded-full border border-purple-400/20",
        "bottom-2",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-purple-500/20"
        asChild
      >
        <Link href="/">
          <Home className="h-12 w-12" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-purple-500/20"
        asChild
      >
        <Link href="/add-invoice">
          <PlusCircle className="h-12 w-12" />
          <span className="sr-only">Add</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-purple-500/20"
        asChild
      >
        <Link href="/user">
          <User className="h-12 w-12" />
          <span className="sr-only">profile</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="text-white hover:bg-purple-500/20"
        onClick={() => logout()}
      >
        <LogOut className="h-5 w-5" />
        <span className="sr-only">Logout</span>
      </Button>
    </nav>
  );
}
