'use client';

import { useTickers } from '@/lib/hooks/useTickers';

const fmt = (n: number) =>
  n >= 1
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });

/**
 * Compact, continuously-scrolling live ticker tape across all 65+ markets.
 * Used in the dashboard and trade headers. Pauses on hover.
 */
export default function TickerTape({ maxWidth = '46vw' }: { maxWidth?: string }) {
  const { tickers } = useTickers(15000);
  if (!tickers.length) return null;
  const loop = [...tickers, ...tickers]; // duplicate for a seamless -50% loop

  return (
    <div className="hidden md:block relative overflow-hidden" style={{ maxWidth }}>
      <div className="marquee-track flex items-center gap-5 whitespace-nowrap" style={{ width: 'max-content', animationDuration: '120s' }}>
        {loop.map((t, i) => {
          const up = (t.change24h ?? 0) >= 0;
          return (
            <span key={`${t.symbol}-${i}`} className="font-mono text-[11px] font-bold flex items-center gap-1.5">
              <span style={{ color: '#F5F1EA' }}>{t.base}</span>
              <span style={{ color: 'rgba(245,241,234,0.5)' }}>${fmt(t.price)}</span>
              <span style={{ color: up ? '#06B6D4' : '#DB2777' }}>
                {up ? '+' : ''}{(t.change24h ?? 0).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
