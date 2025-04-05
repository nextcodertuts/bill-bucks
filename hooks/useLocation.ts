/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if running in React Native WebView
      const isReactNative = !!(window as any).ReactNativeWebView;

      if (isReactNative) {
        // Try to get location from React Native bridge
        try {
          const message = JSON.stringify({ type: "GET_LOCATION" });
          (window as any).ReactNativeWebView.postMessage(message);

          // Wait for response from React Native
          const locationData = await new Promise<Location>(
            (resolve, reject) => {
              window.addEventListener("message", function handleMessage(event) {
                try {
                  const data = JSON.parse(event.data);
                  if (data.type === "LOCATION_RESULT") {
                    window.removeEventListener("message", handleMessage);
                    if (data.error) {
                      reject(new Error(data.error));
                    } else {
                      resolve({
                        latitude: data.latitude,
                        longitude: data.longitude,
                      });
                    }
                  }
                } catch (e) {
                  // Ignore non-JSON messages
                }
              });

              // Timeout after 10 seconds
              setTimeout(() => {
                reject(new Error("Location request timed out"));
              }, 10000);
            }
          );

          setLocation(locationData);
          return;
        } catch (e) {
          console.error("Failed to get location from React Native:", e);
          // Fall back to browser geolocation
        }
      }

      // Browser geolocation fallback
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);
      console.error("Location error:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial location request
  useEffect(() => {
    getLocation();
  }, []);

  return { location, loading, error, getLocation };
}
