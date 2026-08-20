import React from 'react';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
}

// Map legacy tailwind accent class names to editorial hex palette
const ACCENT_MAP: Record<string, string> = {
  'text-blue-400': '#60A5FA',
  'text-emerald-400': '#10B981',
  'text-cyan-400': '#22D3EE',
  'text-amber-400': '#D4AF7F',
  'text-indigo-400': '#A78BFA',
  'text-orange-400': '#FB923C',
  'text-rose-400': '#F43F5E',
};

export default function StatCard({
  title,
  value,
  icon,
  accentColor = 'text-blue-400',
  change,
  changeLabel,
  sparklineData,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const changeSymbol = isPositive ? '+' : '';
  const changeColorHex = isPositive ? '#10B981' : '#F43F5E';

  const hex = ACCENT_MAP[accentColor] || '#D4AF7F';

  const defaultSparkline = sparklineData || Array.from({ length: 12 }, () => 40 + Math.random() * 60);
  const sparklineChartData = defaultSparkline.map((val, idx) => ({ value: val, index: idx }));
  const gradientId = `grad-${title.replace(/\s+/g, '-')}`;

  return (
    <div
      className="group relative flex flex-col justify-between p-5 rounded-2xl transition-all duration-300 cursor-default min-h-[150px] w-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(23,34,58,0.42) 0%, rgba(11,15,26,0.85) 100%)',
        border: '1px solid rgba(212,175,127,0.16)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Top: icon tile + sparkline */}
      <div className="flex items-start justify-between mb-5 relative">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
          style={{
            background: `${hex}12`,
            border: `1px solid ${hex}35`,
            color: hex,
          }}
        >
          {icon}
        </div>

        {sparklineData && (
          <div className="w-20 h-10 opacity-80 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineChartData}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={hex} stopOpacity={0.32} />
                    <stop offset="100%" stopColor={hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={hex}
                  strokeWidth={1.5}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Editorial kicker label */}
      <p
        className="text-[10px] uppercase mb-2"
        style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}
      >
        {title}
      </p>

      {/* Value — serif display, tabular */}
      <p
        className="font-serif-display tabular-nums leading-[1.05] mb-1.5"
        style={{
          color: '#F5F1EA',
          fontSize: 'clamp(1.4rem, 2.1vw, 1.75rem)',
        }}
      >
        {typeof value === 'string' && value.startsWith('$') ? (
          <>
            <span style={{ color: hex }}>$</span>
            {value.substring(1)}
          </>
        ) : (
          value
        )}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-2 mt-1">
          <span
            className="font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded"
            style={{
              color: changeColorHex,
              background: isPositive ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
              border: `1px solid ${isPositive ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.22)'}`,
            }}
          >
            {isPositive ? '▲' : '▼'} {changeSymbol}{change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className="text-[10px] uppercase" style={{ color: 'rgba(169,177,192,0.6)', letterSpacing: '0.14em' }}>
              {changeLabel}
            </span>
          )}
        </div>
      )}

      {/* Bottom hairline accent */}
      <div
        className="absolute left-5 right-5 bottom-0 h-px opacity-70 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${hex}55 50%, transparent 100%)`,
        }}
      />

      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${hex}28` }}
      />
    </div>
  );
}
