"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `data-in-view="true"` to every <section>, card, and major heading
 * on marketing pages as they intersect the viewport. Pairs with the
 * scroll-reveal CSS in globals.css to animate elements in.
 *
 * Acts as a fallback for browsers without native `animation-timeline:
 * view()` support — modern Chromium picks it up natively, this covers
 * Safari and older browsers.
 *
 * Re-scans on route changes so client-navigated marketing pages keep
 * their reveals working without a hard reload.
 */
export default function ScrollRevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    // Skip: native CSS scroll-driven animations are doing the work already
    const supportsTimeline =
      CSS && (CSS as any).supports?.("animation-timeline: view()");
    if (supportsTimeline) return;

    // Only run when we're on a marketing route (body has data-space="on")
    const checkActive = () => document.body.getAttribute("data-space") === "on";
    if (!checkActive()) return;

    const selectors = [
      "section > h1",
      "section > h2",
      "section > h3",
      "section .card-editorial",
      "section .card-glass",
      "section .card-luxe",
      "section .card-elevated",
      "section .grid > *",
      "section > p",
      "section > .max-w-2xl",
      "section > .max-w-3xl",
      "section > .max-w-4xl",
      "section > .max-w-5xl",
      "section > .max-w-6xl",
      "section > .max-w-7xl",
    ];

    const targets = document.querySelectorAll<HTMLElement>(selectors.join(", "));
    if (!targets.length) return;

    // Mark un-revealed first so they start hidden
    targets.forEach((el) => {
      if (!el.dataset.reveal) el.dataset.reveal = "true";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.inView = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
