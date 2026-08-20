'use client';

import { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserShield } from 'react-icons/fa';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useAuth } from '@/components/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { dropdownIn } from '@/lib/animation';

interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  status: string;
  relatedId?: number;
  isRead: boolean;
  createdAt: string;
}

interface PendingCounts {
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export default function NotificationButton() {
  const { user } = useAuth();
  const { notifications, unreadCount, mutate } = useNotifications(user?.email || null);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState<PendingCounts>({ pendingDeposits: 0, pendingWithdrawals: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      const fetchPendingCounts = async () => {
        try {
          const depositsRes = await fetch('/api/deposits?user=' + (user?.email || ''));
          const depositsData = await depositsRes.json();
          const withdrawalsRes = await fetch('/api/withdrawal');
          const withdrawalsData = await withdrawalsRes.json();
          const pendingDeposits = depositsData.pendingDeposits?.length || 0;
          const pendingWithdrawals = withdrawalsData.data?.filter((w: any) => w.status === 'Pending').length || 0;
          setPendingCounts({ pendingDeposits, pendingWithdrawals });
        } catch (error) {
          console.error('Error fetching pending counts:', error);
        }
      };
      fetchPendingCounts();
    }
  }, [isAdmin]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && unreadCount > 0 && user?.email) {
      fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.email }),
      }).then(() => { mutate(); });
    }
  }, [isOpen, unreadCount, user?.email, mutate]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#F43F5E';
      default: return '#3B82F6';
    }
  };

  const hasPendingItems = isAdmin && (pendingCounts.pendingDeposits + pendingCounts.pendingWithdrawals > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-all duration-200"
        style={{ color: 'rgba(255,255,255,0.55)' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#F9FAFB';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium"
            style={{ background: '#F43F5E' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              background: '#0D1421',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}
          >
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
            </div>

            {hasPendingItems && (
              <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Link
                  href="/aK3m9Xq/pZ2vR7nL4wQ1fB/dashboard"
                  className="flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <FaUserShield className="text-blue-400" size={14} />
                    <span className="text-sm font-medium text-blue-400">Admin Dashboard</span>
                  </div>
                  <span
                    className="text-white text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#F43F5E' }}
                  >
                    {pendingCounts.pendingDeposits + pendingCounts.pendingWithdrawals}
                  </span>
                </Link>
                <p className="mt-2 text-xs" style={{ color: '#6B7280' }}>
                  {pendingCounts.pendingDeposits} deposit(s), {pendingCounts.pendingWithdrawals} withdrawal(s) pending
                </p>
              </div>
            )}

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <FaBell className="mx-auto mb-3 opacity-20" size={24} style={{ color: '#9CA3AF' }} />
                  <p className="text-sm" style={{ color: '#6B7280' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 transition-colors duration-150"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: !notification.isRead ? 'rgba(59,130,246,0.04)' : 'transparent',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed" style={{ color: getStatusColor(notification.status) }}>
                          {notification.message}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: '#3B82F6' }}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs transition-colors duration-200"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F9FAFB'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
