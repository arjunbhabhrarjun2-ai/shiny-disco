'use client';

import { FaShieldAlt } from 'react-icons/fa';

interface MarginHealthProps {
  ratio: number; // 0-100; higher is safer
  collateral: number;
  used: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MarginHealth({ ratio, collateral, used }: MarginHealthProps) {
  const safe = ratio >= 70;
  const moderate = ratio >= 40 && ratio < 70;
  const risky = ratio >= 20 && ratio < 40;
  const liquidation = ratio < 20;

  const status = safe
    ? { label: 'Safe', color: '#00FFA3', bg: 'rgba(0,255,163,0.10)' }
    : moderate
    ? { label: 'Moderate', color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' }
    : risky
    ? { label: 'Risky', color: '#FFB800', bg: 'rgba(255,184,0,0.10)' }
    : { label: 'Liquidation', color: '#FF4D4D', bg: 'rgba(255,77,77,0.10)' };

  const fillGradient = safe
    ? 'linear-gradient(90deg, #00FFA3, #00D68F)'
    : moderate
    ? 'linear-gradient(90deg, #06B6D4, #6366F1)'
    : risky
    ? 'linear-gradient(90deg, #FFB800, #FF8800)'
    : 'linear-gradient(90deg, #FF4D4D, #FF1A1A)';

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span
            className="text-[10px] uppercase font-medium block mb-0.5"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Margin Health
          </span>
          <h3 className="font-serif-display text-lg" style={{ color: '#F8FAFC' }}>
            Risk <span className="font-serif-italic" style={{ color: status.color }}>monitor</span>
          </h3>
        </div>
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: status.bg, color: status.color }}
        >
          <FaShieldAlt size={14} />
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span
          className="font-serif-display tabular-nums"
          style={{ fontSize: '1.6rem', color: '#F8FAFC' }}
        >
          {ratio.toFixed(0)}%
        </span>
        <span
          className="text-[10px] uppercase px-2 py-1 rounded"
          style={{ background: status.bg, color: status.color, letterSpacing: '0.16em' }}
        >
          {status.label}
        </span>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden mb-3"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(2, ratio)}%`, background: fillGradient }}
        />
      </div>

      <div
        className="flex items-baseline justify-between text-[11px] tabular-nums"
        style={{ color: '#94A3B8', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
      >
        <div className="flex flex-col">
          <span className="text-[9px] uppercase" style={{ color: '#64748B', letterSpacing: '0.22em' }}>
            Collateral
          </span>
          <span style={{ color: '#F8FAFC' }}>${fmt(collateral)}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase" style={{ color: '#64748B', letterSpacing: '0.22em' }}>
            In use
          </span>
          <span style={{ color: '#F8FAFC' }}>${fmt(used)}</span>
        </div>
      </div>
    </div>
  );
}
