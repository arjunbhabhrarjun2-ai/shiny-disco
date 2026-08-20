'use client';

import { useMarketIndex } from '@/lib/hooks/useMarketIndex';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const fmtPrice = (n: number | null | undefined) => {
  if (n == null) return '—';
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
};

export default function WatchlistMini() {
  const { data, isLoading } = useMarketIndex();

  const rows = (() => {
    if (!data) return [];
    const top = data.top10
      .filter((c) => c.id !== 'bitcoin' && c.id !== 'ethereum')
      .slice(0, 4)
      .map((c) => ({
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        price: c.current_price ?? 0,
        change: c.price_change_percentage_24h ?? 0,
      }));
    return [
      { symbol: 'BTC', name: 'Bitcoin',  price: data.btc?.usd ?? 0, change: data.btc?.usd_24h_change ?? 0 },
      { symbol: 'ETH', name: 'Ethereum', price: data.eth?.usd ?? 0, change: data.eth?.usd_24h_change ?? 0 },
      ...top,
    ];
  })();

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span
            className="text-[10px] uppercase font-medium block mb-0.5"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Watchlist
          </span>
          <h3 className="font-serif-display text-lg" style={{ color: '#F8FAFC' }}>
            Markets <span className="font-serif-italic" style={{ color: '#06B6D4' }}>tracked</span>
          </h3>
        </div>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#00FFA3', boxShadow: '0 0 8px #00FFA3' }}
        />
      </div>

      <div className="space-y-1">
        {isLoading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-9 shimmer-skeleton" />
          ))}

        {!isLoading &&
          rows.slice(0, 6).map((r) => {
            const isUp = r.change >= 0;
            const sparkData = Array.from({ length: 16 }, (_, i) =>
              50 + Math.sin(i / 2) * 8 + (isUp ? i * 0.6 : -i * 0.5),
            ).map((value, index) => ({ value, index }));
            const sparkColor = isUp ? '#00FFA3' : '#FF4D4D';
            return (
              <div key={r.symbol} className="flex items-center gap-2 py-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[12px] font-medium" style={{ color: '#F8FAFC' }}>
                      {r.symbol}
                    </span>
                    <span className="text-[9px] truncate" style={{ color: '#64748B' }}>
                      {r.name}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-6 opacity-80 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                      <defs>
                        <linearGradient id={`mini-${r.symbol}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={sparkColor} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={sparkColor}
                        strokeWidth={1.4}
                        fill={`url(#mini-${r.symbol})`}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-[12px] tabular-nums leading-tight"
                    style={{ color: '#F8FAFC', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
                  >
                    ${fmtPrice(r.price)}
                  </p>
                  <p
                    className="text-[10px] tabular-nums leading-tight"
                    style={{ color: isUp ? '#00FFA3' : '#FF4D4D' }}
                  >
                    {isUp ? '+' : ''}
                    {r.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
