"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

type CountUpProps = {
  /** Final numeric value */
  to: number;
  /** Number of decimals to show */
  decimals?: number;
  /** Prefix shown before the number (e.g. "$") */
  prefix?: string;
  /** Suffix shown after the number (e.g. "+", "%") */
  suffix?: string;
  /** Duration in seconds */
  duration?: number;
  /** Locale for thousands grouping */
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * CountUp — animates a number from 0 → `to` once it enters the viewport.
 * Uses framer-motion's `animate` for smooth eased counting.
 */
export default function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  locale = "en-US",
  className = "",
  style,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
