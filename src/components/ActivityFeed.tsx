'use client';

import React, { useState, useMemo } from 'react';
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaCoins,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEye,
  FaTimes,
} from 'react-icons/fa';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/components/context/AuthContext';

interface ActivityItem {
  id: number;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: Date;
}

const ActivityFeed: React.FC = () => {
  const { user } = useAuth();
  const { dashboard } = useDashboard(user?.email || null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const activities = dashboard?.recentActivities || [];

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'All') return activities;
    return activities.filter((activity) => {
      const activityType = activity.type?.toLowerCase() || '';
      switch (activeFilter) {
        case 'Deposits': return activityType === 'deposit';
        case 'Withdrawals': return activityType === 'withdraw' || activityType === 'withdrawal';
        case 'Investments': return activityType === 'invest' || activityType === 'investment';
        case 'ROI Credited': return activityType === 'roi';
        default: return true;
      }
    });
  }, [activities, activeFilter]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <FaArrowDown style={{ color: '#10B981' }} size={12} />;
      case 'withdraw': return <FaArrowUp style={{ color: '#F43F5E' }} size={12} />;
      case 'invest': return <FaCoins style={{ color: '#3B82F6' }} size={12} />;
      case 'roi': return <FaDollarSign style={{ color: '#10B981' }} size={12} />;
      case 'interest': return <FaWallet style={{ color: '#8B5CF6' }} size={12} />;
      default: return <FaClock style={{ color: '#6B7280' }} size={12} />;
    }
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'Success': return { background: 'rgba(16,185,129,0.1)', color: '#10B981' };
      case 'Pending': return { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' };
      case 'Failed': return { background: 'rgba(244,63,94,0.1)', color: '#F43F5E' };
      default: return { background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <FaCheckCircle style={{ color: '#10B981' }} size={10} />;
      case 'Pending': return <FaClock style={{ color: '#F59E0B' }} size={10} />;
      case 'Failed': return <FaTimesCircle style={{ color: '#F43F5E' }} size={10} />;
      default: return <FaExclamationTriangle style={{ color: '#F59E0B' }} size={10} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) return { text: 'Just now', color: '#F43F5E' };
    if (diffHours < 24) return { text: `${Math.floor(diffHours)}h ago`, color: diffHours < 2 ? '#F59E0B' : '#6B7280' };
    if (diffDays < 7) return { text: `${Math.floor(diffDays)}d ago`, color: '#6B7280' };
    return { text: new Date(date).toLocaleDateString(), color: '#4B5563' };
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'withdraw' ? '-' : '+';
    const color = type === 'withdraw' ? '#F43F5E' : '#10B981';
    return { text: `${sign}$${amount.toLocaleString()}`, color };
  };

  const filterTabs = ['All', 'Deposits', 'Withdrawals', 'Investments', 'ROI Credited'];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#0D1421',
        border: '1px solid rgba(255,255,255,0.06)',
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3
          className="text-sm font-semibold text-white mb-3"
          style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
        >
          Activity Feed
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="px-2.5 py-1 text-xs rounded-full transition-all duration-200"
              style={
                activeFilter === tab
                  ? { background: '#3B82F6', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#6B7280' }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {filteredActivities.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-xs" style={{ color: '#6B7280' }}>
              No {activeFilter.toLowerCase()} activity yet
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const timeInfo = formatTime(activity.createdAt);
            const amountInfo = formatAmount(activity.amount, activity.type);

            return (
              <div
                key={activity.id}
                className="p-3.5 cursor-pointer transition-all duration-150"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white font-medium truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: timeInfo.color }}>{timeInfo.text}</span>
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                          style={getStatusStyle(activity.status)}
                        >
                          {getStatusIcon(activity.status)}
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: amountInfo.color, fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
                    >
                      {amountInfo.text}
                    </p>
                    <FaEye size={10} style={{ color: '#4B5563', marginLeft: 'auto', marginTop: 2 }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail modal */}
      {selectedActivity && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            className="w-full max-w-sm"
            style={{
              background: '#0D1421',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-sm font-semibold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                Transaction Details
              </h3>
              <button
                onClick={() => setSelectedActivity(null)}
                style={{ color: '#6B7280' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F9FAFB'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  {getActivityIcon(selectedActivity.type)}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{selectedActivity.description}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>ID: #{selectedActivity.id}</p>
                </div>
              </div>

              <div
                className="grid grid-cols-2 gap-3 p-4 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Amount</p>
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: formatAmount(selectedActivity.amount, selectedActivity.type).color,
                      fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    }}
                  >
                    {formatAmount(selectedActivity.amount, selectedActivity.type).text}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Status</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={getStatusStyle(selectedActivity.status)}
                  >
                    {getStatusIcon(selectedActivity.status)}
                    {selectedActivity.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Date & Time</p>
                <p
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
                >
                  {new Date(selectedActivity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
