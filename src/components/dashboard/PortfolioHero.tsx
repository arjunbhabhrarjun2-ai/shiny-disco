'use client';

import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface PortfolioHeroProps {
  totalValue: number;
  buyingPower: number;
  pnl24h: number;
  pnl24hPct: number;
  activePositions: number;
  openOrders: number;
  sparkline?: number[];
}

const fmt = (n: number) =>
  n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';

export default function PortfolioHero({
  totalValue,
  buyingPower,
  pnl24h,
  pnl24hPct,
  activePositions,
  openOrders,
  sparkline,
}: PortfolioHeroProps) {
  const isUp = pnl24h >= 0;
  const sparkData = (sparkline && sparkline.length
    ? sparkline
    : Array.from({ length: 24 }, (_, i) => 50 + Math.sin(i / 2.4) * 18 + (isUp ? i * 1.6 : -i * 1.4))
  ).map((value, index) => ({ value, index }));

  const sparkColor = isUp ? '#00FFA3' : '#FF4D4D';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Featured: Total Portfolio Value (spans 2 cols on lg) */}
      <div
        className="glass-card lg:col-span-6 p-6 sm:p-7 relative overflow-hidden"
        style={{ minHeight: 220 }}
      >
        <div className="orb-primary" style={{ top: -120, right: -80 }} />
        <div className="orb-pink" style={{ bottom: -160, left: -80, opacity: 0.6 }} />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#00FFA3', boxShadow: '0 0 8px #00FFA3' }}
            />
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
            >
              Total Portfolio Value
            </span>
          </div>

          <h2
            className="font-serif-display tabular-nums leading-[1] mb-3 text-gradient-primary"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 500 }}
          >
            ${fmt(totalValue)}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium tabular-nums"
              style={{
                background: isUp ? 'rgba(0, 255, 163, 0.10)' : 'rgba(255, 77, 77, 0.10)',
                border: `1px solid ${isUp ? 'rgba(0,255,163,0.28)' : 'rgba(255,77,77,0.28)'}`,
                color: isUp ? '#00FFA3' : '#FF4D4D',
              }}
            >
              {isUp ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
              {isUp ? '+' : ''}
              {fmt(pnl24h)} ({isUp ? '+' : ''}
              {pnl24hPct.toFixed(2)}%)
            </span>
            <span className="text-[11px] uppercase" style={{ color: '#64748B', letterSpacing: '0.18em' }}>
              24h Performance
            </span>
          </div>

          <div className="h-16 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id="hero-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparkColor} stopOpacity={0.36} />
                    <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparkColor}
                  strokeWidth={2}
                  fill="url(#hero-spark)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Buying Power */}
      <div className="glass-card lg:col-span-3 p-5 relative overflow-hidden">
        <div className="orb-cyan" style={{ top: -180, right: -120, opacity: 0.5 }} />
        <div className="relative flex flex-col h-full justify-between">
          <span
            className="text-[10px] uppercase font-medium"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Available Buying Power
          </span>
          <p
            className="font-serif-display tabular-nums leading-[1.05]"
            style={{
              fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)',
              color: '#F8FAFC',
              fontWeight: 500,
            }}
          >
            ${fmt(buyingPower)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: '#64748B' }}>
              Margin + Futures
            </span>
            <span
              className="text-[10px] uppercase"
              style={{ color: '#06B6D4', letterSpacing: '0.18em' }}
            >
              Spot · Cross
            </span>
          </div>
        </div>
      </div>

      {/* Active Positions / Orders combo */}
      <div className="glass-card lg:col-span-3 p-5 relative overflow-hidden">
        <div className="orb-pink" style={{ bottom: -160, right: -100, opacity: 0.4 }} />
        <div className="relative grid grid-cols-2 gap-4 h-full">
          <div className="flex flex-col justify-between">
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
            >
              Active Positions
            </span>
            <p
              className="font-serif-display tabular-nums leading-[1]"
              style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)', color: '#F8FAFC' }}
            >
              {activePositions}
            </p>
            <span className="text-[10px]" style={{ color: '#64748B' }}>
              cross · isolated
            </span>
          </div>
          <div
            className="flex flex-col justify-between pl-4"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
            >
              Open Orders
            </span>
            <p
              className="font-serif-display tabular-nums leading-[1]"
              style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)', color: '#F8FAFC' }}
            >
              {openOrders}
            </p>
            <span className="text-[10px]" style={{ color: '#64748B' }}>
              limit · stop · oco
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
