/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Sample image data
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

export default function ImageCarousel() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);
  const [intervalTime, setIntervalTime] = React.useState(3000); // 3 seconds

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  React.useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [api, autoplay, intervalTime]);

  return (
    <div className="space-y-4">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-0 relative overflow-hidden">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-1 rounded-full ${
              index === current - 1 ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
