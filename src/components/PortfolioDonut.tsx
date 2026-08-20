'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/components/context/AuthContext';

const PLAN_COLORS: Record<string, string> = {
  mining: '#3B82F6',
  premium: '#06B6D4',
  gold: '#F59E0B',
  cash: '#6B7280',
  other: '#8B5CF6',
};

export default function PortfolioDonut() {
  const { user } = useAuth();
  const { dashboard, isLoading, isError } = useDashboard(user?.email ?? null);

  const { allocations, totalValue } = useMemo(() => {
    if (!dashboard) return { allocations: [], totalValue: 0 };

    const allActiveInvestments = Object.values(dashboard.activeInvestments || {}).flat();
    const cashAmount = dashboard.mainBalance || 0;
    const investedAmount = allActiveInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const total = cashAmount + investedAmount;

    if (total === 0) {
      return {
        allocations: [{ name: 'Cash', percentage: 100, color: PLAN_COLORS.cash }],
        totalValue: 0,
      };
    }

    const planGroups: Record<string, number> = {};
    allActiveInvestments.forEach((inv) => {
      const planName = (inv.planName || 'Other').toLowerCase();
      planGroups[planName] = (planGroups[planName] || 0) + (inv.amount || 0);
    });

    const allocations: { name: string; percentage: number; color: string }[] = [];

    Object.entries(planGroups).forEach(([planName, amount]) => {
      const percentage = Math.round((amount / total) * 100);
      if (percentage > 0) {
        allocations.push({
          name: planName.charAt(0).toUpperCase() + planName.slice(1),
          percentage,
          color: PLAN_COLORS[planName.toLowerCase()] || PLAN_COLORS.other,
        });
      }
    });

    const cashPercentage = Math.round((cashAmount / total) * 100);
    if (cashPercentage > 0) {
      allocations.push({ name: 'Cash', percentage: cashPercentage, color: PLAN_COLORS.cash });
    }

    return { allocations, totalValue: total };
  }, [dashboard]);

  const cardStyle = {
    background: '#0D1421',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
  };

  if (isLoading) {
    return (
      <div style={cardStyle}>
        <div className="h-3 rounded w-1/3 mb-4 animate-pulse" style={{ background: '#111827' }} />
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full animate-pulse" style={{ background: '#111827' }} />
          <div className="flex-1 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 rounded animate-pulse" style={{ background: '#111827', width: `${60 + i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={cardStyle}>
        <h3 className="text-sm font-semibold text-white mb-2">Portfolio Allocation</h3>
        <p className="text-xs" style={{ color: '#F43F5E' }}>Failed to load portfolio data</p>
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Build conic gradient for donut
  const gradient = (() => {
    let current = 0;
    return allocations
      .map((item) => {
        const start = current;
        const end = start + item.percentage;
        current = end;
        return `${item.color} ${start}% ${end}%`;
      })
      .join(', ');
  })();

  return (
    <div style={cardStyle}>
      <h3
        className="text-sm font-semibold text-white mb-4"
        style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
      >
        Portfolio Allocation
      </h3>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: gradient
                ? `conic-gradient(${gradient})`
                : 'rgba(255,255,255,0.06)',
            }}
          />
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              inset: '10px',
              background: '#0D1421',
            }}
          >
            <span
              className="text-xs font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
            >
              {formatValue(totalValue)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {allocations.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span style={{ color: '#9CA3AF' }}>{item.name}</span>
              </div>
              <span className="font-semibold text-white">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
