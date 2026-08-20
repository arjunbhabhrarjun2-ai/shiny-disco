"use client";

import React from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiTether, SiRipple, SiSolana, SiBinance, SiCardano, SiDogecoin, SiLitecoin, SiPolkadot } from "react-icons/si";
import { useTickers } from "@/lib/hooks/useTickers";
import type { MarketTicker } from "@/types/trade";

// Icon/color hints for well-known coins; everything else gets a letter badge.
const META: Record<string, { icon?: React.ReactNode; color: string }> = {
  BTC: { icon: <FaBitcoin />, color: "#F7931A" },
  ETH: { icon: <FaEthereum />, color: "#627EEA" },
  USDT: { icon: <SiTether />, color: "#26A17B" },
  BNB: { icon: <SiBinance />, color: "#F0B90B" },
  SOL: { icon: <SiSolana />, color: "#9945FF" },
  XRP: { icon: <SiRipple />, color: "#23292F" },
  ADA: { icon: <SiCardano />, color: "#0033AD" },
  DOGE: { icon: <SiDogecoin />, color: "#C2A633" },
  LTC: { icon: <SiLitecoin />, color: "#A6A9AA" },
  DOT: { icon: <SiPolkadot />, color: "#E6007A" },
};
const PALETTE = ["#D4AF7F", "#60A5FA", "#10B981", "#F43F5E", "#A855F7", "#06B6D4", "#F59E0B"];
const colorFor = (sym: string) =>
  META[sym]?.color ?? PALETTE[[...sym].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

const fmtPrice = (n: number) =>
  n >= 1
    ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;

function TickerItem({ t }: { t: MarketTicker }) {
  const up = (t.change24h ?? 0) >= 0;
  const color = colorFor(t.base);
  return (
    <div className="flex items-center gap-3 px-6 whitespace-nowrap flex-shrink-0" style={{ width: "max-content" }}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 font-bold"
        style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}
      >
        {META[t.base]?.icon ?? t.base.slice(0, 2)}
      </div>
      <div className="flex flex-col flex-shrink-0">
        <span className="font-serif-display text-sm whitespace-nowrap" style={{ color: "#F5F1EA", lineHeight: 1.1 }}>
          {t.name ?? t.base}
        </span>
        <span className="text-[10px] uppercase whitespace-nowrap" style={{ letterSpacing: "0.18em", color: "rgba(169,177,192,0.6)" }}>
          {t.base} / {t.quote}
        </span>
      </div>
      <span className="font-mono text-sm tabular-nums pl-3" style={{ color: "#F5F1EA", borderLeft: "1px solid rgba(212,175,127,0.18)" }}>
        <span className="pl-3">{fmtPrice(t.price)}</span>
      </span>
      <span
        className="font-mono text-xs tabular-nums px-2.5 py-1 rounded-md"
        style={{
          color: up ? "#10B981" : "#F43F5E",
          background: up ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.08)",
          border: up ? "1px solid rgba(16,185,129,0.22)" : "1px solid rgba(244,63,94,0.22)",
        }}
      >
        {up ? "▲" : "▼"} {up ? "+" : ""}{(t.change24h ?? 0).toFixed(2)}%
      </span>
      <span className="pl-3" style={{ color: "rgba(212,175,127,0.25)" }}>·</span>
    </div>
  );
}

export default function CryptoTicker() {
  const { tickers } = useTickers(15000);
  const loop = tickers.length ? [...tickers, ...tickers] : [];

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <div className="px-6 md:px-20 mb-10 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="accent-rule" />
          <span className="text-editorial-kicker">Live Markets</span>
          <span className="accent-rule" />
        </div>
        <h2 className="leading-[1.1]" style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)" }}>
          <span className="font-serif-display text-gradient-editorial">Real-time </span>
          <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>asset prices.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "#A9B1C0" }}>
          Track the market pulse across {tickers.length || "65+"} digital assets — continuously streaming, instantly actionable.
        </p>
      </div>

      <div
        className="relative py-5"
        style={{
          borderTop: "1px solid rgba(212,175,127,0.18)",
          borderBottom: "1px solid rgba(212,175,127,0.18)",
          background: "linear-gradient(180deg, rgba(23,34,58,0.35) 0%, rgba(13,19,32,0.6) 100%)",
        }}
      >
        <div className="absolute top-0 left-0 h-full w-32 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, var(--color-bg) 0%, transparent 100%)" }} />
        <div className="absolute top-0 right-0 h-full w-32 pointer-events-none z-10" style={{ background: "linear-gradient(270deg, var(--color-bg) 0%, transparent 100%)" }} />

        {loop.length === 0 ? (
          <div className="text-center text-xs py-2" style={{ color: "rgba(169,177,192,0.6)" }}>Loading live markets…</div>
        ) : (
          <div className="flex items-center" style={{ animation: "ticker-scroll 120s linear infinite", width: "max-content" }}>
            {loop.map((t, i) => (
              <TickerItem key={`${t.symbol}-${i}`} t={t} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-6 md:px-20 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
          <span className="text-[10px] uppercase" style={{ letterSpacing: "0.22em", color: "#10B981" }}>Markets Live</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(212,175,127,0.05)", border: "1px solid rgba(212,175,127,0.22)" }}>
          <span className="text-[10px] uppercase" style={{ letterSpacing: "0.22em", color: "#D4AF7F" }}>24h Snapshot</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.22)" }}>
          <span className="text-[10px] uppercase" style={{ letterSpacing: "0.22em", color: "#60A5FA" }}>{tickers.length || "65+"} Markets</span>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
