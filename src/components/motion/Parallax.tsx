"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type ParallaxProps = {
  children: React.ReactNode;
  /** Pixels translated across the visible scroll range */
  offset?: number;
  /** Direction of translation */
  axis?: "y" | "x";
  /** Optional scale animation alongside translate (1 = no scale) */
  scaleFrom?: number;
  scaleTo?: number;
  /** Optional opacity ramp */
  opacityFrom?: number;
  opacityTo?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Parallax — translates its children based on the parent's scroll progress
 * relative to the viewport, using framer-motion's `useScroll` hook.
 *
 * Use sparingly: each Parallax adds a scroll listener. Honours
 * prefers-reduced-motion via `transform: none` fallback in CSS.
 */
export default function Parallax({
  children,
  offset = 80,
  axis = "y",
  scaleFrom,
  scaleTo,
  opacityFrom,
  opacityTo,
  className = "",
  style,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const translate = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const scale =
    scaleFrom != null && scaleTo != null
      ? useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo])
      : (undefined as unknown as MotionValue<number>);
  const opacity =
    opacityFrom != null && opacityTo != null
      ? useTransform(scrollYProgress, [0, 1], [opacityFrom, opacityTo])
      : (undefined as unknown as MotionValue<number>);

  const motionStyle: any = { ...style, willChange: "transform" };
  motionStyle[axis] = translate;
  if (scale) motionStyle.scale = scale;
  if (opacity) motionStyle.opacity = opacity;

  return (
    <motion.div ref={ref} className={className} style={motionStyle}>
      {children}
    </motion.div>
  );
}

/**
 * ParallaxWord — large display word that drifts as the user scrolls past.
 */
export function ParallaxWord({
  children,
  offset = 120,
  className = "",
  style,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Parallax offset={offset} axis="y" className={className} style={style}>
      {children}
    </Parallax>
  );
}
