"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Routes where the space-globe video must NOT show.
 * The match is "starts with" — sub-routes inherit.
 *
 * - User dashboard / authenticated app routes
 * - Sign in / sign up pages
 */
const EXCLUDED_PREFIXES = [
  // Auth
  "/screens/auth",
  "/signup",
  // Dashboard + everything that lives inside the user app
  "/dashboard",
  "/aK3m9Xq",
  "/portfolio",
  "/wallet",
  "/trade",
  "/capital",
  "/custody",
  "/addFunds",
  "/depositHistory",
  "/withdrawal",
  "/withdrawalHistory",
  "/transaction",
  "/referral",
  "/support",
  "/airdrops",
  "/data",
  "/stake",
  "/investmentPlans",
  "/settings",
];

function isMarketingPath(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return false;
    }
  }
  return true;
}

/**
 * Fullscreen ambient space-globe video background.
 *
 * - Mounted in <RootLayout>, so it persists across client-side navigation
 *   (no teardown/refetch when moving between marketing pages).
 * - Sets `data-space="on"` on <body> when active so global CSS can apply
 *   transparent fills, smooth scroll, and glow accents to every marketing
 *   page without per-page edits.
 * - Hidden on dashboard / auth / signup pages.
 * - Fades in smoothly once the first frame is ready, so initial paint
 *   doesn't flash an empty black canvas.
 */
function SpaceBackground() {
  const pathname = usePathname();
  const active = isMarketingPath(pathname);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  // Toggle the body attribute synchronously per-route so CSS scoping is
  // accurate immediately after navigation (no flicker of opaque content).
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (active) {
      document.body.setAttribute("data-space", "on");
    } else {
      document.body.removeAttribute("data-space");
    }
  }, [active]);

  // Try to play eagerly — some browsers gate autoplay until user gesture
  // when the page wasn't yet visible. Catching keeps console clean.
  useEffect(() => {
    if (!active) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) {
      setReady(true);
      tryPlay();
    } else {
      v.addEventListener("loadeddata", () => {
        setReady(true);
        tryPlay();
      }, { once: true });
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Fullscreen looping background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        disableRemotePlayback
        disablePictureInPicture
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
          pointerEvents: "none",
          opacity: ready ? 1 : 0,
          transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "opacity",
        }}
      >
        <source src="/kandella-orb-seamless.mp4" type="video/mp4" />
      </video>

      {/* Static fallback while video decodes — keeps the first paint cosmic
          rather than flashing pure black before the video appears. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 30%, #0a1530 0%, #050811 55%, #03060d 100%)",
        }}
      />

      {/* Dark overlay for legibility (z-index 0 so content at z-index >=1 wins) */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.60) 60%, rgba(0,0,0,0.78) 100%)",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 1,
        }}
      />
    </>
  );
}

export default SpaceBackground;
