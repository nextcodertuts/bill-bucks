import { useState, useEffect, useCallback } from "react";
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
  disabled?: boolean;
}

export function MerchantSearch({
  onSelect,
  className,
  disabled = false,
}: MerchantSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMerchants = useCallback(async (query: string) => {
    if (!query.trim()) {
      setMerchants([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/merchants/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Robust data validation
      if (!data) {
        setMerchants([]);
        return;
      }

      // Ensure data is an array and handle potential malformed responses
      const merchantList = Array.isArray(data) ? data : [];

      const validMerchants = merchantList
        .filter((m): m is Merchant => {
          return (
            m != null &&
            typeof m === "object" &&
            typeof m.id === "string" &&
            typeof m.name === "string"
          );
        })
        .map((m) => ({
          id: m.id,
          name: m.name,
        }));

      setMerchants(validMerchants);
    } catch (err) {
      console.error("Error searching merchants:", err);
      setError("Failed to load merchants. Please try again.");
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const debounce = setTimeout(() => {
      searchMerchants(value);
    }, 300);

    return () => clearTimeout(debounce);
  }, [value, disabled, searchMerchants]);

  const handleSelect = (merchant: Merchant) => {
    console.log("merchant", merchant.name);
    onSelect(merchant);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Command
        className={cn(
          "relative rounded-lg border shadow-md",
          open && !disabled ? "border-ring" : "border-input",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <Command.Input
            value={value}
            onValueChange={setValue}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onFocus={() => !disabled && setOpen(true)}
            disabled={disabled}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search merchants..."
          />
        </div>
        {open && !disabled && (
          <Command.List className="max-h-[200px] overflow-y-auto p-1">
            {loading && (
              <Command.Loading>
                <div className="p-2 text-sm text-muted-foreground">
                  Searching...
                </div>
              </Command.Loading>
            )}
            {!loading && error && (
              <div className="p-2 text-sm text-destructive">{error}</div>
            )}
            {!loading && !error && merchants.length === 0 && value && (
              <div className="p-2 text-sm text-muted-foreground">
                No merchants found
              </div>
            )}
            {!loading &&
              !error &&
              merchants.map((merchant) => (
                <Command.Item
                  key={merchant.id}
                  value={merchant.name}
                  onSelect={() => handleSelect(merchant)}
                  className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent aria-selected:bg-accent"
                >
                  {merchant.name}
                </Command.Item>
              ))}
          </Command.List>
        )}
      </Command>
    </div>
  );
}
