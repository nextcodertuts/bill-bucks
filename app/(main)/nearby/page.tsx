/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Loader2,
  RefreshCw,
  Store,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation";
import { formatDistance } from "@/lib/distance";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Merchant {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  latitude: number;
  longitude: number;
  category: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  rating: number;
  imageUrl: string;
  distance: number;
}

const PAGE_SIZE = 10;

export default function NearbyMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const initialFetchDone = useRef(false);

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useLocation();

  const loadMoreMerchants = async () => {
    try {
      setFetchError(null);
      const nextPage = page + 1;
      await fetchMerchants(location?.latitude, location?.longitude, nextPage);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more merchants:", error);
      toast.error("Failed to load more merchants");
    }
  };

  const { loadMoreRef, loading: scrollLoading } = useInfiniteScroll({
    onLoadMore: loadMoreMerchants,
    hasMore,
    threshold: 0.8,
  });

  const fetchMerchants = async (
    lat?: number,
    lng?: number,
    currentPage = 1
  ) => {
    try {
      setLoading(true);
      setFetchError(null);
      const params = new URLSearchParams();

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        params.append("lat", lat.toString());
        params.append("lng", lng.toString());
      }

      if (searchQuery) {
        params.append("q", searchQuery);
      }

      params.append("page", currentPage.toString());
      params.append("limit", PAGE_SIZE.toString());

      const response = await fetch(`/api/merchants/nearby?${params}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch merchants");
      }

      const data = await response.json();
      const processedData = data.merchants;

      if (currentPage === 1) {
        setMerchants(processedData);
      } else {
        setMerchants((prev) => [...prev, ...processedData]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      setFetchError(
        error instanceof Error
          ? error.message
          : "Failed to load nearby merchants"
      );
      toast.error("Failed to load nearby merchants");
    } finally {
      setLoading(false);
    }
  };

  // Handle location retry
  useEffect(() => {
    if (!location && !locationLoading && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        getLocation();
      }, 2000); // Retry every 2 seconds

      return () => clearTimeout(timer);
    }
  }, [location, locationLoading, retryCount, getLocation]);

  // Initial location check and merchant fetch
  useEffect(() => {
    if (!initialFetchDone.current) {
      if (location) {
        fetchMerchants(location.latitude, location.longitude);
        initialFetchDone.current = true;
      } else if (!locationLoading && retryCount >= 3) {
        // If we've tried 3 times and still no location, fetch without coordinates
        fetchMerchants();
        initialFetchDone.current = true;
      }
    }
  }, [location, locationLoading, retryCount]);

  // Handle search updates with debounce
  useEffect(() => {
    if (!initialFetchDone.current) return;

    const debounceTimeout = setTimeout(() => {
      setPage(1);
      if (location) {
        fetchMerchants(location.latitude, location.longitude, 1);
      } else {
        fetchMerchants(undefined, undefined, 1);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleRetryLocation = () => {
    setRetryCount(0);
    getLocation();
  };

  const handleRetryFetch = () => {
    if (location) {
      fetchMerchants(location.latitude, location.longitude, 1);
    } else {
      fetchMerchants(undefined, undefined, 1);
    }
  };

  const MerchantCardSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="relative h-40 bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={loading && !initialFetchDone.current}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>

        {!location && !locationLoading && (
          <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              {retryCount >= 3
                ? "Unable to get location. Showing all merchants."
                : "Trying to get your location..."}
            </p>
            <Button size="sm" onClick={handleRetryLocation} variant="outline">
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Retry
            </Button>
          </div>
        )}

        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {locationError}. Showing merchants without location filtering.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {fetchError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="flex-1">{fetchError}</AlertDescription>
          <Button
            size="sm"
            onClick={handleRetryFetch}
            variant="outline"
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      )}

      {loading && !merchants.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MerchantCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {merchants.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Store className="h-12 w-12 mb-4 text-muted" />
              <h3 className="text-lg font-medium mb-1">No merchants found</h3>
              <p className="text-sm text-center max-w-md">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "No merchants found in this area. Try expanding your search or try again later."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <>
              {merchants.map((merchant) => (
                <Link
                  href={`/add-invoice?merchant=${merchant.id}`}
                  key={merchant.id}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-40">
                      <Image
                        src={merchant.imageUrl || "/cashbucks-icon.png"}
                        alt={merchant.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <span
                        className={`absolute top-2 right-2 ${
                          merchant.isOpen ? "bg-green-500" : "bg-red-500"
                        } text-white px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        {merchant.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {merchant.name}
                        </h3>
                        <div className="flex items-center shrink-0 ml-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {merchant.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {merchant.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>
                            {merchant.openingTime ? merchant.openingTime : "NA"}{" "}
                            -{" "}
                            {merchant.closingTime ? merchant.closingTime : "NA"}
                          </span>
                        </div>
                        {merchant.distance !== undefined && (
                          <div className="text-xs text-primary font-medium mt-1">
                            {formatDistance(merchant.distance)} away
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="col-span-full flex justify-center p-4"
                >
                  {scrollLoading && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
