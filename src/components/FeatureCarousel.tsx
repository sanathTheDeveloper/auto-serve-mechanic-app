"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCarouselProps {
  children: React.ReactNode[];
}

export function FeatureCarousel({ children }: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = children.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-lg hover:bg-white hover:scale-110 transition-all"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 text-slate-700" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-lg hover:bg-white hover:scale-110 transition-all"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 text-slate-700" />
      </Button>

      {/* Cards Container */}
      <div className="overflow-hidden px-16">
        <div className="relative h-72 flex items-center justify-center">
          {children.map((child, index) => {
            const position = (index - currentIndex + totalCards) % totalCards;
            let zIndex = totalCards - position;
            let scale = 1;
            let translateX = 0;
            let opacity = 1;

            if (position === 0) {
              // Front card
              zIndex = totalCards;
              scale = 1;
              translateX = 0;
            } else if (position === 1) {
              // Second card (right)
              zIndex = totalCards - 1;
              scale = 0.9;
              translateX = 280;
              opacity = 0.8;
            } else if (position === totalCards - 1) {
              // Last card (left)
              zIndex = totalCards - 1;
              scale = 0.9;
              translateX = -280;
              opacity = 0.8;
            } else {
              // Hidden cards
              zIndex = 0;
              scale = 0.8;
              translateX = position > totalCards / 2 ? 400 : -400;
              opacity = 0;
            }

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  zIndex,
                  opacity
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 gap-3">
        {Array.from({ length: totalCards }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-500 shadow-md scale-125" 
                : "bg-slate-300 hover:bg-slate-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}