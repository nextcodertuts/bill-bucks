/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Merchant {
  id: string;
  name: string;
}

interface MerchantSearchProps {
  onSelect: (merchant: Merchant) => void;
  className?: string;
}

export function MerchantSearch({ onSelect, className }: MerchantSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMerchants = async () => {
      if (!value) {
        setMerchants([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/merchants/search?q=${value}`);
        const data = await response.json();
        setMerchants(data);
      } catch (error) {
        console.error("Error searching merchants:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMerchants, 300);
    return () => clearTimeout(debounce);
  }, [value]);

  return (
    <Command
      className={cn(
        "relative rounded-lg border shadow-md",
        open ? "border-ring" : "border-input",
        className
      )}
    >
      <div className="flex items-center border-b px-3">
        <Search className="h-4 w-4 shrink-0 opacity-50" />
        <Command.Input
          value={value}
          onValueChange={setValue}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search merchants..."
        />
      </div>
      {open && (
        <Command.List className="max-h-[200px] overflow-y-auto p-1">
          {loading && (
            <Command.Loading>
              <div className="p-2 text-sm text-muted-foreground">
                Searching...
              </div>
            </Command.Loading>
          )}
          {merchants.map((merchant) => (
            <Command.Item
              key={merchant.id}
              value={merchant.name}
              onSelect={() => {
                onSelect(merchant);
                setValue("");
                setOpen(false);
              }}
              className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              {merchant.name}
            </Command.Item>
          ))}
          {!loading && merchants.length === 0 && value && (
            <div className="p-2 text-sm text-muted-foreground">
              No merchants found
            </div>
          )}
        </Command.List>
      )}
    </Command>
  );
}
