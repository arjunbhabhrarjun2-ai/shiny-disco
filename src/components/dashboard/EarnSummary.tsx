'use client';

import { FaSeedling, FaPercent, FaClock } from 'react-icons/fa';

interface EarnSummaryProps {
  activeStakes: number;
  estApy: number;
  nextRewardDays: number;
  totalEarned: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function EarnSummary({
  activeStakes,
  estApy,
  nextRewardDays,
  totalEarned,
}: EarnSummaryProps) {
  return (
    <div className="glass-card p-5 h-full relative overflow-hidden">
      <div className="orb-cyan" style={{ top: -200, right: -120, opacity: 0.5 }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span
              className="text-[10px] uppercase font-medium block mb-0.5"
              style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
            >
              Earn Summary
            </span>
            <h3 className="font-serif-display text-lg" style={{ color: '#F8FAFC' }}>
              Yield <span className="font-serif-italic" style={{ color: '#06B6D4' }}>position</span>
            </h3>
          </div>
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
              boxShadow: '0 4px 14px -2px rgba(6, 182, 212, 0.30)',
            }}
          >
            <FaSeedling size={14} />
          </span>
        </div>

        <div
          className="rounded-xl p-4 mb-3"
          style={{
            background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.06) 0%, rgba(99, 102, 241, 0.04) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.16)',
          }}
        >
          <span className="text-[9px] uppercase block" style={{ color: '#64748B', letterSpacing: '0.22em' }}>
            Total Earned
          </span>
          <p
            className="font-serif-display tabular-nums leading-[1.05] mt-1"
            style={{
              fontSize: 'clamp(1.4rem, 2vw, 1.75rem)',
              color: '#F8FAFC',
            }}
          >
            <span style={{ color: '#06B6D4' }}>$</span>
            {fmt(totalEarned)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Metric
            icon={<FaSeedling size={10} />}
            label="Stakes"
            value={activeStakes.toString()}
            color="#06B6D4"
          />
          <Metric
            icon={<FaPercent size={10} />}
            label="Est APY"
            value={`${estApy.toFixed(1)}%`}
            color="#00FFA3"
          />
          <Metric
            icon={<FaClock size={10} />}
            label="Next"
            value={`${nextRewardDays}d`}
            color="#A855F7"
          />
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5 flex flex-col gap-1"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        className="inline-flex items-center gap-1 text-[9px] uppercase"
        style={{ color, letterSpacing: '0.16em' }}
      >
        {icon}
        {label}
      </span>
      <span
        className="text-[14px] tabular-nums"
        style={{
          color: '#F8FAFC',
          fontFamily: 'var(--font-jetbrains-mono, monospace)',
        }}
      >
        {value}
      </span>
    </div>
  );
}
