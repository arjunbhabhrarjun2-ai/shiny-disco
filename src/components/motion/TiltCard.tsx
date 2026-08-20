"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type TiltCardProps = {
  children: React.ReactNode;
  /** Maximum tilt angle in degrees */
  max?: number;
  /** Sheen / glare overlay strength (0–1) */
  glare?: number;
  /** Rounded corners */
  className?: string;
  style?: React.CSSProperties;
};

/**
 * TiltCard — card that tilts on pointer-move, springs back on leave.
 * GPU-accelerated; uses spring smoothing so motion never feels twitchy.
 */
export default function TiltCard({
  children,
  max = 8,
  glare = 0.18,
  className = "",
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.4 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  // Glare position
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        willChange: "transform",
      }}
    >
      <div style={{ transform: "translateZ(0)", height: "100%", width: "100%" }}>
        {children}
      </div>
      {glare > 0 && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background: useTransform(
              [glareX, glareY] as any,
              ([x, y]: [string, string]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,${glare}) 0%, rgba(255,255,255,0) 45%)`
            ),
            mixBlendMode: "screen",
          }}
        />
      )}
    </motion.div>
  );
}
