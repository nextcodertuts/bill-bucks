"use client";
import type React from "react";
import Link from "next/link";
import { Home, User, PlusCircle, Gift, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function BottomNav({ className, ...props }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex p-2 items-center justify-around bg-primary/90 mx-1 backdrop-blur-md",
        "mx-auto max-w-sm rounded-lg border border-secondary/20",
        "bottom-1",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-secondary p-2"
        asChild
      >
        <Link href="/">
          <Home className="h-16 w-16" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-secondary p-2"
        asChild
      >
        <Link href="/nearby">
          <MapPin className="h-16 w-16" />
          <span className="sr-only">Nearby</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-secondary p-2"
        asChild
      >
        <Link href="/add-invoice">
          <PlusCircle className="h-16 w-16" />
          <span className="sr-only">Add</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-secondary p-2"
        asChild
      >
        <Link href="/referrals">
          <Gift className="h-16 w-16" />
          <span className="sr-only">Referrals</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-secondary p-2"
        asChild
      >
        <Link href="/user">
          <User className="h-16 w-16" />
          <span className="sr-only">profile</span>
        </Link>
      </Button>
    </nav>
  );
}
