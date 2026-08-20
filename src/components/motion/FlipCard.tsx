"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

type FlipCardProps = {
  /** Front face — kept compact */
  front: React.ReactNode;
  /** Back face — revealed on hover/tap */
  back: React.ReactNode;
  /** Aspect-ratio height; default tall enough for most card content */
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * FlipCard — front-to-back 3D flip on hover (and tap on touch devices).
 * Front and back share the same footprint. Performant via transform-only
 * animation; backface-visibility hides the inactive side.
 */
export default function FlipCard({
  front,
  back,
  height = 280,
  className = "",
  style,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{
        ...style,
        height,
        perspective: 1200,
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((v) => !v)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
