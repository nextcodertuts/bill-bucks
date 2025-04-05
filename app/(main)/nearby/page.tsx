/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, Star, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation";
import { formatDistance } from "@/lib/distance";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

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
  const initialFetchDone = useRef(false);

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useLocation();

  const loadMoreMerchants = async () => {
    try {
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
      if (!response.ok) throw new Error("Failed to fetch merchants");

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

  const LoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="h-32"></CardContent>
        </Card>
      ))}
    </div>
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
            <Button size="sm" onClick={handleRetryLocation}>
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </div>
              )}
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {merchants.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No merchants found nearby
            </div>
          ) : (
            <>
              {merchants.map((merchant) => (
                <Link
                  href={`/add-invoice?merchant=${merchant.id}`}
                  key={merchant.id}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="relative h-40">
                      <Image
                        src={merchant.imageUrl || "/cashbucks-icon.png"}
                        alt={merchant.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <span
                        className={`absolute top-2 right-2 ${
                          merchant.isOpen ? "bg-green-500" : "bg-red-500"
                        } text-white px-2 py-1 rounded-full text-xs`}
                      >
                        {merchant.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {merchant.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">
                            {merchant.rating}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{merchant.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {merchant.openingTime ? merchant.openingTime : "NA"}{" "}
                            -{" "}
                            {merchant.closingTime ? merchant.closingTime : "NA"}
                          </span>
                        </div>
                        {merchant.distance !== undefined && (
                          <div className="text-xs text-primary font-medium">
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
