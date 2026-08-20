"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

type ScrollRevealProps = {
  children: React.ReactNode;
  /** Delay (s) before the reveal begins */
  delay?: number;
  /** Duration (s) of the reveal */
  duration?: number;
  /** Direction of entry */
  from?: "up" | "down" | "left" | "right" | "none";
  /** Distance (px) to translate from when entering */
  distance?: number;
  /** Margin used by IntersectionObserver — negative trims viewport */
  rootMargin?: string;
  /** Replay every time the element scrolls back into view */
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Tailwind/grid passthrough */
  as?: keyof React.JSX.IntrinsicElements;
};

const offsets = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * ScrollReveal — fades and slides children in once they enter the viewport.
 * Lightweight wrapper around framer-motion `useInView`. Honours reduced-motion.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.65,
  from = "up",
  distance = 32,
  rootMargin = "-10% 0px -10% 0px",
  once = true,
  className = "",
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin: rootMargin as any });

  const off = offsets[from];
  const dx = (off.x / 32) * distance;
  const dy = (off.y / 32) * distance;

  const variants: Variants = {
    hidden: { opacity: 0, x: dx, y: dy, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger — animates children one-by-one as the parent enters view.
 */
export function StaggerReveal({
  children,
  stagger = 0.08,
  delay = 0,
  className = "",
  style,
  rootMargin = "-10% 0px -10% 0px",
  once = true,
}: {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, margin: rootMargin as any });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealItem — a child of <StaggerReveal>. Use for items that should
 * each receive their own slot in the parent's stagger schedule.
 */
export function RevealItem({
  children,
  from = "up",
  distance = 28,
  className = "",
  style,
}: {
  children: React.ReactNode;
  from?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const off = offsets[from];
  const dx = (off.x / 32) * distance;
  const dy = (off.y / 32) * distance;
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, x: dx, y: dy, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
