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
    src: "https://gist.github.com/user-attachments/assets/80efd26e-47f8-4a19-bf3d-f46876aedb01",
    alt: "Image 1",
    title: "Guranteed cashback",
  },
  {
    src: "https://gist.github.com/user-attachments/assets/efd3a053-5569-4637-8379-5c33106cb255",
    alt: "Image 1",
    title: "Beautiful Landscape",
  },
  {
    src: "https://gist.github.com/user-attachments/assets/89e4581a-228c-400b-a94c-acf21fee72fa",
    alt: "Image 1",
    title: "Ramdhanu",
  },
  {
    src: "https://gist.github.com/user-attachments/assets/c8b1673b-6799-4ef5-9da7-7c418467c790",
    alt: "Image 3",
    title: "Beautiful Landscape",
  },
];

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const slideInterval = 5000; // 3 seconds
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
          className=""
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${100 * extendedImages.length}%`,
            }}
          >
            {extendedImages.map((image, index) => (
              <div
                key={index}
                className="relative w-full flex-shrink-0 z-10"
                aria-hidden={index !== currentIndex}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={360}
                  height={250}
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full bg-background/50 backdrop-blur-sm"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full bg-background/50 backdrop-blur-sm"
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
