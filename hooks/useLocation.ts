/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { toast } from "sonner";

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

  const checkLocationServices = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      return false;
    }

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Additional check for mobile devices

      if (navigator.geolocation.getCurrentPosition.length > 0) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          });
          return true;
        } catch {
          return false;
        }
      }
    }
    return true;
  };

  const getLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      // Check if location services are enabled
      const locationServicesEnabled = await checkLocationServices();
      if (!locationServicesEnabled) {
        throw new Error("Please enable location services on your device");
      }

      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        throw new Error(
          "Location permission denied. Please enable location access in your browser settings"
        );
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);

      // Show more specific error messages
      if (errorMessage.includes("denied")) {
        toast.error("Please enable location access in your browser settings");
      } else if (errorMessage.includes("location services")) {
        toast.error("Please enable location services on your device");
      } else if (errorMessage.includes("timeout")) {
        toast.error("Location request timed out. Please try again");
      } else {
        toast.error(
          "Unable to get your location. Please check your device settings"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { location, loading, error, getLocation };
}
