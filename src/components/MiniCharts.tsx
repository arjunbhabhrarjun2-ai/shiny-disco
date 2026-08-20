'use client';

import React from 'react';
import { useAuth } from '@/components/context/AuthContext';
import { useDashboard } from '@/lib/hooks/useDashboard';
import styles from './MiniCharts.module.css';

const BAR_COLORS = {
  deposits: '#10B981',
  investments: '#3B82F6',
  roi: '#06B6D4',
  interest: '#8B5CF6',
};

const MiniCharts: React.FC = () => {
  const { user } = useAuth();
  const { dashboard } = useDashboard(user?.email || null);

  const monthlyData = dashboard?.monthlyData || [];
  const maxValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.deposits, d.invest, d.roi, d.interest)),
    1
  );
  const recentData = monthlyData.slice(-6);

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3
        className="text-sm font-semibold text-white mb-4"
        style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
      >
        Activity Trends
      </h3>

      <div className="space-y-4">
        {/* Bar chart */}
        <div>
          <p className="text-xs mb-3" style={{ color: '#6B7280' }}>Monthly Activity</p>
          <div className="flex items-end gap-2 h-28">
            {recentData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col-reverse gap-0.5 h-full">
                  <div
                    className={styles.bar}
                    style={
                      {
                        '--bar-height': `${(data.roi / maxValue) * 100}%`,
                        background: BAR_COLORS.roi,
                      } as React.CSSProperties
                    }
                    title={`ROI: $${data.roi}`}
                  />
                  <div
                    className={styles.bar}
                    style={
                      {
                        '--bar-height': `${(data.interest / maxValue) * 100}%`,
                        background: BAR_COLORS.interest,
                      } as React.CSSProperties
                    }
                    title={`Interest: $${data.interest}`}
                  />
                  <div
                    className={styles.bar}
                    style={
                      {
                        '--bar-height': `${(data.invest / maxValue) * 100}%`,
                        background: BAR_COLORS.investments,
                      } as React.CSSProperties
                    }
                    title={`Investments: $${data.invest}`}
                  />
                  <div
                    className={styles.bar}
                    style={
                      {
                        '--bar-height': `${(data.deposits / maxValue) * 100}%`,
                        background: BAR_COLORS.deposits,
                      } as React.CSSProperties
                    }
                    title={`Deposits: $${data.deposits}`}
                  />
                </div>
                <span className="text-xs mt-2" style={{ color: '#6B7280' }}>{data.month}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {Object.entries(BAR_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
                <span className="text-xs capitalize" style={{ color: '#6B7280' }}>{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div
          className="grid grid-cols-2 gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-center">
            <p
              className="text-xl font-bold"
              style={{ color: '#10B981', fontFamily: 'var(--font-space-grotesk, system-ui)' }}
            >
              ${recentData.reduce((sum, d) => sum + d.deposits, 0).toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>Total Deposits</p>
          </div>
          <div className="text-center">
            <p
              className="text-xl font-bold"
              style={{ color: '#3B82F6', fontFamily: 'var(--font-space-grotesk, system-ui)' }}
            >
              ${recentData.reduce((sum, d) => sum + d.invest, 0).toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>Total Investments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCharts;
