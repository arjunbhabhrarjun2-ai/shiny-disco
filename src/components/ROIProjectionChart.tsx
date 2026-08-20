'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/components/context/AuthContext';

export default function ROIProjectionChart() {
  const { user } = useAuth();
  const { dashboard, isLoading, isError } = useDashboard(user?.email || null);

  const projectionData = useMemo(() => {
    if (!dashboard?.activeInvestments || dashboard.activeInvestments.length === 0) return [];

    const data = [];
    const days = 30;

    for (let day = 1; day <= days; day++) {
      let cumulativeEarnings = 0;
      dashboard.activeInvestments.forEach((investment) => {
        const dailyProfit = (investment.amount * investment.roi) / investment.durationDays;
        cumulativeEarnings += dailyProfit * day;
      });
      data.push({ day: `Day ${day}`, earnings: cumulativeEarnings, dayNumber: day });
    }

    return data;
  }, [dashboard?.activeInvestments]);

  const cardStyle = {
    background: '#0D1421',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
  };

  if (isLoading) {
    return (
      <div style={cardStyle} className="animate-pulse">
        <div className="h-3 rounded w-1/3 mb-4" style={{ background: '#111827' }} />
        <div className="h-40 rounded" style={{ background: '#111827' }} />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div style={cardStyle}>
        <h3 className="text-sm font-semibold text-white mb-2">ROI Projection</h3>
        <p className="text-xs" style={{ color: '#F43F5E' }}>Failed to load projection data</p>
      </div>
    );
  }

  if (projectionData.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 className="text-sm font-semibold text-white mb-2">ROI Projection</h3>
        <p className="text-xs" style={{ color: '#6B7280' }}>No active investments to project</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h3
        className="text-sm font-semibold text-white mb-4"
        style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
      >
        ROI Projection (30 Days)
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={projectionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="transparent"
            tick={{ fill: '#6B7280', fontSize: 10 }}
            interval="preserveStartEnd"
            tickFormatter={(value) => value.replace('Day ', '')}
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#F9FAFB',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
            labelFormatter={(label) => `Day ${label.replace('Day ', '')}`}
            formatter={(value: any) => [
              `$${typeof value === 'number' ? value.toFixed(2) : value}`,
              'Projected Earnings',
            ]}
          />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#10B981"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#10B981' }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="mt-2 text-xs" style={{ color: '#4B5563' }}>
        Based on {dashboard.activeInvestments.length} active investment
        {dashboard.activeInvestments.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
