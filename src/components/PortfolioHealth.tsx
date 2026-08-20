'use client';

import React from 'react';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/components/context/AuthContext';

const PortfolioHealth: React.FC = () => {
  const { user } = useAuth();
  const { dashboard } = useDashboard(user?.email ?? null);

  const mainBalance = dashboard?.mainBalance ?? 0;
  const investmentBalance = dashboard?.interestBalance ?? 0;
  const totalDeposit = dashboard?.totalDeposit ?? 0;
  const totalEarn = dashboard?.totalEarn ?? 0;

  const totalPortfolio = mainBalance + investmentBalance;
  const activePercentage = totalPortfolio > 0 ? (investmentBalance / totalPortfolio) * 100 : 0;
  const availablePercentage = totalPortfolio > 0 ? (mainBalance / totalPortfolio) * 100 : 0;
  const roiPercentage = totalDeposit > 0 ? ((totalEarn / totalDeposit) * 100).toFixed(1) : '0.0';
  const investmentRatio = totalDeposit > 0 ? ((investmentBalance / totalDeposit) * 100).toFixed(1) : '0.0';

  const healthScore = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        Number(roiPercentage) * 0.5 +
          (totalDeposit > 0 ? (investmentBalance / totalDeposit) * 30 : 0) +
          (mainBalance > 0 ? 20 : 0)
      )
    )
  );

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
    if (score >= 60) return { status: 'Good', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' };
    if (score >= 40) return { status: 'Fair', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
    return { status: 'Needs Attention', color: '#F43F5E', bg: 'rgba(244,63,94,0.12)' };
  };

  const healthInfo = getHealthStatus(healthScore);

  const createPieSlice = (percentage: number, color: string, offset = 0) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dash = (percentage / 100) * circumference;
    const gap = circumference - dash;
    return (
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
    );
  };

  const donutOffset = -(activePercentage / 100) * (2 * Math.PI * 40);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3
        className="text-sm font-semibold text-white mb-5"
        style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
      >
        Portfolio Health
      </h3>

      <div className="flex items-center gap-6 mb-5">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            {createPieSlice(activePercentage, '#3B82F6')}
            {createPieSlice(availablePercentage, '#10B981', donutOffset)}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                {healthScore}
              </p>
              <p className="text-xs" style={{ color: '#6B7280' }}>Score</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: healthInfo.bg, color: healthInfo.color }}
          >
            {healthInfo.status}
          </span>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: '#6B7280' }}>Accrued Returns</span>
              <span className="text-xs font-medium" style={{ color: '#60A5FA' }}>
                ${investmentBalance.toLocaleString()} ({Math.round(activePercentage)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: '#6B7280' }}>Available Balance</span>
              <span className="text-xs font-medium" style={{ color: '#10B981' }}>
                ${mainBalance.toLocaleString()} ({Math.round(availablePercentage)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pt-4 space-y-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h4 className="text-xs font-semibold text-white">Health Factors</h4>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>ROI Performance</p>
            <p
              className="text-lg font-semibold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
            >
              {roiPercentage}%
            </p>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Investment Ratio</p>
            <p
              className="text-lg font-semibold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
            >
              {investmentRatio}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHealth;
