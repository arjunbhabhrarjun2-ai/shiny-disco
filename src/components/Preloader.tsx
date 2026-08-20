"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Logo from "@/components/Logo";

const PARTICLES = 28;

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Dismiss: driven by CSS `animationend` on the container ──
  const handleAnimationEnd = useCallback((e: AnimationEvent) => {
    if (e.animationName?.includes("preloaderLifecycle")) {
      // Inject force-visibility style into <head> (survives unmount)
      const id = "preloader-force-vis";
      if (!document.getElementById(id)) {
        const s = document.createElement("style");
        s.id = id;
        s.textContent =
          `body[data-loaded] .pt-wrapper *{opacity:1!important;transform:none!important;visibility:visible!important}`;
        document.head.appendChild(s);
      }
      document.body.setAttribute("data-loaded", "");
      setHidden(true);
      setTimeout(() => document.getElementById(id)?.remove(), 1500);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, [handleAnimationEnd]);

  // ── Progress bar: rAF tick purely for display ──
  useEffect(() => {
    if (hidden) return;
    const startedAt = performance.now();
    const TOTAL = 3200;
    let rafId: number;
    const tick = () => {
      const pct = Math.min(100, ((performance.now() - startedAt) / TOTAL) * 100);
      setProgress(pct);
      if (pct < 100) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hidden]);

  // ── Body scroll lock ──────────────────────────────────────────
  useEffect(() => {
    if (hidden) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hidden]);

  if (hidden) return null;

  const p = Math.floor(progress);

  const particles = Array.from({ length: PARTICLES }).map((_, i) => {
    const seed = i * 7919;
    const x = ((seed * 9301 + 49297) % 233280) / 233280;
    const y = ((seed * 12345 + 6789) % 233280) / 233280;
    const s = 1 + ((seed * 17) % 3);
    const d = (i % 8) * 0.3;
    const dur = 3.5 + (i % 4);
    return { x: x * 100, y: y * 100, s, d, dur, k: i };
  });

  return (
    <>
      <style>{`
        @keyframes preloaderLifecycle {
          0%,85% { opacity:1; filter:none; }
          100% { opacity:0; filter:blur(8px); }
        }
        @keyframes pFloat {
          0%,100% { opacity:0.15; transform:translateY(0); }
          50% { opacity:0.9; transform:translateY(-12px); }
        }
        @keyframes pPulse {
          0%,100% { transform:scale(1); opacity:0.7; }
          50% { transform:scale(1.08); opacity:1; }
        }
        @keyframes pPulseSmall {
          0%,100% { transform:scale(1); }
          50% { transform:scale(1.06); }
        }
        @keyframes pSpinCW { to { transform:rotate(360deg); } }
        @keyframes pSpinCCW { to { transform:rotate(-360deg); } }
        @keyframes pFadeUp {
          from { opacity:0; transform:translateY(8px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div
        ref={containerRef}
        aria-busy="true"
        aria-live="polite"
        aria-label="Loading Kandella"
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "#02040a",
          animation: "preloaderLifecycle 4.5s ease-in-out forwards",
          pointerEvents: "auto",
        }}
      >
        <div aria-hidden className="absolute inset-0" style={{ background: "#02040a" }} />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 35%, #0a1530 0%, #050811 55%, #02040a 100%)" }}
        />

        {/* Starfield */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((pt) => (
            <span
              key={pt.k}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${pt.x}%`, top: `${pt.y}%`, width: pt.s, height: pt.s,
                background: "#E8D3B0",
                boxShadow: "0 0 6px rgba(232,211,176,0.7)",
                animation: `pFloat ${pt.dur}s ease-in-out ${pt.d}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Cosmic radial glow */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
          style={{
            marginLeft: "-320px", marginTop: "-320px",
            background: "radial-gradient(circle, rgba(0,102,255,0.18) 0%, rgba(212,175,127,0.06) 35%, transparent 70%)",
            filter: "blur(40px)",
            animation: "pPulse 3s ease-in-out infinite",
          }}
        />

        {/* Orbiting arcs + central core */}
        <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center mb-12">
          <div aria-hidden className="absolute rounded-full" style={{
            width: "100%", height: "100%",
            border: "1px solid rgba(0,229,255,0.45)",
            borderTopColor: "transparent", borderBottomColor: "transparent",
            animation: "pSpinCW 14s linear infinite",
          }}>
            <span className="absolute rounded-full" style={{
              width: 10, height: 10, top: -5, right: -2, background: "#00e5ff",
              boxShadow: "0 0 14px #00e5ff, 0 0 30px #00e5ff",
            }} />
          </div>
          <div aria-hidden className="absolute rounded-full" style={{
            width: "78%", height: "78%",
            border: "1px solid rgba(212,175,127,0.50)",
            borderTopColor: "transparent", borderBottomColor: "transparent",
            animation: "pSpinCCW 11s linear infinite",
          }}>
            <span className="absolute rounded-full" style={{
              width: 10, height: 10, top: -5, right: -2, background: "#D4AF7F",
              boxShadow: "0 0 14px #D4AF7F, 0 0 30px #D4AF7F",
            }} />
          </div>
          <div aria-hidden className="absolute rounded-full" style={{
            width: "56%", height: "56%",
            border: "1px solid rgba(0,102,255,0.55)",
            borderTopColor: "transparent", borderBottomColor: "transparent",
            animation: "pSpinCW 8s linear infinite",
          }}>
            <span className="absolute rounded-full" style={{
              width: 10, height: 10, top: -5, right: -2, background: "#0066ff",
              boxShadow: "0 0 14px #0066ff, 0 0 30px #0066ff",
            }} />
          </div>

          <div className="relative z-10 flex items-center justify-center" style={{
            width: "44%", aspectRatio: "1", borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, rgba(212,175,127,0.35) 0%, rgba(0,102,255,0.18) 45%, rgba(10,15,26,0.95) 85%)",
            border: "1px solid rgba(212,175,127,0.4)",
            boxShadow: "0 0 60px -10px rgba(212,175,127,0.45), 0 0 100px -20px rgba(0,102,255,0.5), inset 0 0 30px rgba(0,229,255,0.10)",
            animation: "pPulseSmall 2.4s ease-in-out infinite",
          }}>
            <Logo size={44} />
          </div>
        </div>

        {/* Caption */}
        <div className="flex items-center gap-3 mb-5 relative z-10"
          style={{ animation: "pFadeUp 0.6s ease 0.15s both" }}>
          <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, #D4AF7F)" }} />
          <span className="text-[10px] uppercase" style={{ letterSpacing: "0.32em", color: "#D4AF7F" }}>
            Kandella · Calibrating
          </span>
          <span style={{ width: 36, height: 1, background: "linear-gradient(90deg, #D4AF7F, transparent)" }} />
        </div>

        {/* Progress bar */}
        <div className="relative w-64 sm:w-80 rounded-full overflow-hidden z-10" style={{
          height: "3px", background: "rgba(255,255,255,0.06)",
          boxShadow: "inset 0 0 0 1px rgba(0,229,255,0.10)",
        }}>
          <div className="h-full rounded-full" style={{
            background: "linear-gradient(90deg, #0066ff 0%, #00e5ff 50%, #D4AF7F 100%)",
            width: `${Math.min(p, 100)}%`,
            boxShadow: "0 0 12px rgba(0,229,255,0.5), 0 0 24px rgba(0,102,255,0.35)",
          }} />
        </div>

        {/* Counter */}
        <div className="mt-5 flex items-center gap-4 font-mono text-[11px] uppercase relative z-10"
          style={{ letterSpacing: "0.22em", color: "#A9B1C0" }}>
          <span style={{ color: "#00e5ff" }}>{String(p).padStart(2, "0")}%</span>
          <span style={{ width: 14, height: 1, background: "rgba(212,175,127,0.4)" }} />
          <span>{p < 30 ? "Initialising" : p < 65 ? "Syncing oracles" : p < 100 ? "Calibrating feeds" : "Ready"}</span>
        </div>

        {/* Watermark */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase z-10"
          style={{ letterSpacing: "0.32em", color: "#4B5566" }}>
          Layer 3 · EVM Compatible · Regulated
        </div>
      </div>
    </>
  );
}
