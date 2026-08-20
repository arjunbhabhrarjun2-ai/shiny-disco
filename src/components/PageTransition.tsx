"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * PageTransition — route-based fade wrapper.
 *
 * Uses a CSS @keyframes animation for the initial fade-in so the compositor
 * thread handles it independently of the JS event loop.  On mobile Safari
 * framer-motion `animate` can silently stall when the page has heavy work,
 * but a CSS animation always completes — guaranteeing the page becomes
 * visible even under JS congestion.
 */

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes ptFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .pt-wrapper {
          animation: ptFadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .pt-wrapper.pt-rekey {
          animation: none;
          opacity: 0;
        }
        .pt-wrapper.pt-rekey.pt-active {
          animation: ptFadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
      <div
        key={key}
        className="pt-wrapper"
        ref={(el) => {
          if (el && !el.classList.contains("pt-active")) {
            el.classList.add("pt-active");
          }
        }}
      >
        {children}
      </div>
    </>
  );
}
