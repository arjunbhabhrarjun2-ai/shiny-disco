"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

type CarouselProps = {
  children: React.ReactNode[];
  /** Approximate gap between slides (px) */
  gap?: number;
  /** Auto-advance interval (ms). 0 disables auto-play. */
  autoPlay?: number;
  /** Class for the outer overflow container */
  className?: string;
};

/**
 * Carousel — drag-to-scroll horizontal carousel with snap points,
 * auto-play, dot indicators, and momentum. Lightweight (no third-party).
 */
export default function Carousel({
  children,
  gap = 24,
  autoPlay = 0,
  className = "",
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const slides = React.Children.toArray(children);

  // Recompute max scroll on resize
  useEffect(() => {
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      setMaxScroll(Math.max(0, max));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [slides.length]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const id = setInterval(() => {
      const next = (active + 1) % slides.length;
      goTo(next);
    }, autoPlay);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, autoPlay, slides.length]);

  const goTo = (i: number) => {
    setActive(i);
    const el = trackRef.current;
    if (!el) return;
    const slide = el.children[i] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    // Determine the closest slide
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const slide = el.children[i] as HTMLElement;
      const d = Math.abs(slide.offsetLeft - el.scrollLeft);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    }
    setActive(nearest);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory"
        style={{
          gap: `${gap}px`,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "8px",
          // Hide native scrollbar in webkit
          WebkitOverflowScrolling: "touch",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0"
            style={{
              scrollSnapAlign: "start",
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  i === active
                    ? "linear-gradient(90deg, #00e5ff, #0066ff)"
                    : "rgba(212,175,127,0.25)",
                boxShadow:
                  i === active
                    ? "0 0 12px rgba(0,229,255,0.45)"
                    : "none",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Hide scrollbar for Webkit globally (Tailwind v4 plugin not available)
if (typeof document !== "undefined") {
  const id = "carousel-scrollbar-hide";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `.scrollbar-none::-webkit-scrollbar{display:none;}`;
    document.head.appendChild(style);
  }
}
