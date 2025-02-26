"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample image array - you can replace these with your own images
const images = [
  {
    src: "/next.svg",
    alt: "Image 1",
    title: "Beautiful Landscape",
  },
  {
    src: "/next.svg",
    alt: "Image 2",
    title: "City Skyline",
  },
  {
    src: "/next.svg",
    alt: "Image 3",
    title: "Mountain View",
  },
  {
    src: "/next.svg",
    alt: "Image 4",
    title: "Ocean Sunset",
  },
];

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const slideInterval = 3000; // 3 seconds
  const minSwipeDistance = 50;

  // Create circular array for infinite scroll
  const extendedImages = [...images, ...images, ...images];
  const totalSlides = images.length;

  const handlePrevious = React.useCallback(() => {
    setCurrentIndex((current) => {
      const newIndex = current - 1;
      // When we reach the beginning of the extended array, jump to the middle set
      if (newIndex < 0) {
        return totalSlides - 1;
      }
      return newIndex;
    });
  }, [totalSlides]);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((current) => {
      const newIndex = current + 1;
      // When we reach the end of the extended array, jump to the middle set
      if (newIndex >= totalSlides) {
        return 0;
      }
      return newIndex;
    });
  }, [totalSlides]);

  // Auto-play functionality
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(handleNext, slideInterval);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Touch handlers for swipe functionality
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  return (
    <div
      className="w-full container mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <Card className="relative overflow-hidden rounded-lg">
        {/* Image container */}
        <div
          className="aspect-[16/9] relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${100 * extendedImages.length}%`,
            }}
          >
            {extendedImages.map((image, index) => (
              <div
                key={index}
                className="relative w-full h-full flex-shrink-0"
                aria-hidden={index !== currentIndex}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentIndex === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
