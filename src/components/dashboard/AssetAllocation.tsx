'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Holding {
  symbol: string;
  name: string;
  value: number;
  pct: number;
  color: string;
}

interface AssetAllocationProps {
  totalValue: number;
  holdings: Holding[];
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AssetAllocation({ totalValue, holdings }: AssetAllocationProps) {
  const data = holdings.map((h) => ({ name: h.symbol, value: Math.max(h.pct, 0.01), color: h.color }));

  return (
    <div className="glass-card p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span
            className="text-[10px] uppercase font-medium block mb-1"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Asset Allocation
          </span>
          <h3 className="font-serif-display text-xl" style={{ color: '#F8FAFC' }}>
            Top <span className="font-serif-italic" style={{ color: '#A855F7' }}>holdings</span>
          </h3>
        </div>
        <span
          className="text-[10px] uppercase px-2 py-1 rounded"
          style={{
            background: 'rgba(99, 102, 241, 0.10)',
            color: '#A855F7',
            letterSpacing: '0.16em',
          }}
        >
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 items-center">
        {/* Donut */}
        <div className="sm:col-span-2 relative" style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((d, i) => (
                  <linearGradient key={i} id={`alloc-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={d.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={d.color} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                innerRadius={56}
                outerRadius={82}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={`url(#alloc-grad-${i})`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-[9px] uppercase"
              style={{ color: '#64748B', letterSpacing: '0.22em' }}
            >
              Total
            </span>
            <span
              className="font-serif-display tabular-nums text-lg"
              style={{ color: '#F8FAFC' }}
            >
              ${fmt(totalValue)}
            </span>
          </div>
        </div>

        {/* Holdings list */}
        <div className="sm:col-span-3 space-y-2">
          {holdings.length === 0 && (
            <p className="text-xs text-center py-6" style={{ color: '#64748B' }}>
              No holdings yet — fund your account to see allocation.
            </p>
          )}
          {holdings.slice(0, 5).map((h) => (
            <div
              key={h.symbol}
              className="flex items-center gap-3 p-2.5 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.015)' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: h.color, boxShadow: `0 0 8px ${h.color}80` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium" style={{ color: '#F8FAFC' }}>
                    {h.symbol}
                  </span>
                  <span
                    className="text-[12px] tabular-nums"
                    style={{ color: '#F8FAFC', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
                  >
                    ${fmt(h.value)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-0.5">
                  <span className="text-[10px] truncate" style={{ color: '#64748B' }}>
                    {h.name}
                  </span>
                  <span
                    className="text-[10px] tabular-nums"
                    style={{ color: '#94A3B8' }}
                  >
                    {h.pct.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="mt-1.5 h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(h.pct, 100)}%`,
                      background: `linear-gradient(90deg, ${h.color}, ${h.color}aa)`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
