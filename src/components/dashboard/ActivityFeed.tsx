'use client';

import { FaArrowDown, FaArrowUp, FaCoins, FaSeedling, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

type ActivityKind = 'deposit' | 'withdraw' | 'reward' | 'stake' | 'investment' | 'fill' | 'other';
type ActivityStatus = 'completed' | 'pending' | 'failed';

interface ActivityItem {
  id: string | number;
  kind: ActivityKind;
  title: string;
  subtitle?: string;
  amount?: string;
  status: ActivityStatus;
  timestamp?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const KIND_META: Record<ActivityKind, { icon: React.ReactNode; color: string; bg: string }> = {
  deposit:    { icon: <FaArrowDown size={11} />,   color: '#00FFA3', bg: 'rgba(0, 255, 163, 0.10)' },
  withdraw:   { icon: <FaArrowUp size={11} />,     color: '#FF4D4D', bg: 'rgba(255, 77, 77, 0.10)' },
  reward:     { icon: <FaCoins size={11} />,       color: '#FFD700', bg: 'rgba(255, 215, 0, 0.10)' },
  stake:      { icon: <FaSeedling size={11} />,    color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.10)' },
  investment: { icon: <FaCoins size={11} />,       color: '#A855F7', bg: 'rgba(168, 85, 247, 0.10)' },
  fill:       { icon: <FaCheckCircle size={11} />, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.10)' },
  other:      { icon: <FaCheckCircle size={11} />, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.10)' },
};

const STATUS_META: Record<ActivityStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed: { label: 'Settled',  color: '#00FFA3', bg: 'rgba(0,255,163,0.08)',   icon: <FaCheckCircle size={9} /> },
  pending:   { label: 'Pending',  color: '#FFB800', bg: 'rgba(255,184,0,0.08)',   icon: <FaClock size={9} /> },
  failed:    { label: 'Failed',   color: '#FF4D4D', bg: 'rgba(255,77,77,0.08)',   icon: <FaExclamationCircle size={9} /> },
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="glass-card p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span
            className="text-[10px] uppercase font-medium block mb-1"
            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
          >
            Recent Activity
          </span>
          <h3 className="font-serif-display text-xl" style={{ color: '#F8FAFC' }}>
            Account <span className="font-serif-italic" style={{ color: '#EC4899' }}>events</span>
          </h3>
        </div>
        <span
          className="text-[10px] uppercase"
          style={{ color: '#64748B', letterSpacing: '0.16em' }}
        >
          Last 30 days
        </span>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1" style={{ maxHeight: 320 }}>
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(148, 163, 184, 0.06)' }}
            >
              <FaClock size={16} style={{ color: '#64748B' }} />
            </div>
            <p className="text-xs" style={{ color: '#64748B' }}>
              No recent activity yet.
            </p>
          </div>
        )}

        {items.map((item) => {
          const meta = KIND_META[item.kind];
          const statusMeta = STATUS_META[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: meta.bg, color: meta.color }}
              >
                {meta.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium truncate" style={{ color: '#F8FAFC' }}>
                    {item.title}
                  </span>
                  {item.amount && (
                    <span
                      className="text-[12px] tabular-nums shrink-0"
                      style={{
                        color: meta.color,
                        fontFamily: 'var(--font-jetbrains-mono, monospace)',
                      }}
                    >
                      {item.amount}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="text-[10px] truncate" style={{ color: '#64748B' }}>
                    {item.subtitle || item.timestamp}
                  </span>
                  <span
                    className="text-[9px] uppercase inline-flex items-center gap-1 px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      background: statusMeta.bg,
                      color: statusMeta.color,
                      letterSpacing: '0.14em',
                    }}
                  >
                    {statusMeta.icon}
                    {statusMeta.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
