'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { useWithdrawals } from '@/lib/hooks/useWithdrawals';
import { motion } from 'framer-motion';
import { fadeIn, fadeUp, staggerContainer } from '@/lib/animation';
import { FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const C = {
  bgBase: '#0B0D10',
  textPri: '#F8FAFC',
  textSec: '#94A3B8',
  textTer: '#64748B',
  border: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(255,255,255,0.12)',
  purple: '#A855F7',
  green: '#00FFA3',
  red: '#FF4D4D',
  amber: '#FFB800',
};

const GRAD_PRIMARY = 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)';
const GRAD_DANGER = 'linear-gradient(135deg, #FF4D4D 0%, #FF1A1A 100%)';

const statusStyle = (status: string): React.CSSProperties => {
  if (status === 'Completed')
    return {
      background: 'rgba(0,255,163,0.10)',
      color: C.green,
      border: '1px solid rgba(0,255,163,0.28)',
      letterSpacing: '0.18em',
    };
  if (status === 'Rejected')
    return {
      background: 'rgba(255,77,77,0.10)',
      color: '#FCA5A5',
      border: '1px solid rgba(255,77,77,0.28)',
      letterSpacing: '0.18em',
    };
  return {
    background: 'rgba(255,184,0,0.10)',
    color: C.amber,
    border: '1px solid rgba(255,184,0,0.28)',
    letterSpacing: '0.18em',
  };
};

export default function WithdrawalHistory() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const { withdrawals, isLoading, isError, mutate } = useWithdrawals(userId);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.id) {
            setUserId(parsedUser.id);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      if (user?.id) setUserId(user.id);
    };
    fetchUserId();
  }, [user]);

  const cardBase: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${C.borderAccent}`,
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen overflow-x-hidden"
      style={{ background: C.bgBase }}
    >
      <Sidebar />

      <main
        className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 relative pb-24 md:pb-8"
        style={{ color: C.textPri }}
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,77,77,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        {/* Editorial header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10 relative"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-px" style={{ background: GRAD_DANGER }} />
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: C.red, letterSpacing: '0.32em' }}
            >
              Outbound Ledger
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="leading-[1.05] mb-2 font-serif-display"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              color: C.textPri,
              letterSpacing: '-0.02em',
            }}
          >
            Withdrawal{' '}
            <span
              className="font-serif-italic"
              style={{
                background: GRAD_DANGER,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              history.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm sm:text-base" style={{ color: C.textSec }}>
            A timestamped record of every outbound transaction on this account.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-10 flex items-center justify-center gap-3"
            style={cardBase}
          >
            <AiOutlineLoading3Quarters
              className="animate-spin"
              size={18}
              style={{ color: C.purple }}
            />
            <span
              className="text-sm uppercase font-medium"
              style={{ color: C.textSec, letterSpacing: '0.2em' }}
            >
              Loading withdrawals
            </span>
          </motion.div>
        ) : isError ? (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-12 flex flex-col items-center space-y-5"
            style={{
              ...cardBase,
              background:
                'linear-gradient(135deg, rgba(255,77,77,0.06) 0%, rgba(11,13,16,0.85) 100%)',
              border: '1px solid rgba(255,77,77,0.32)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: GRAD_DANGER,
                color: C.textPri,
                boxShadow: '0 8px 24px -4px rgba(255,77,77,0.4)',
              }}
            >
              <FaExclamationTriangle size={20} />
            </div>
            <div className="text-center space-y-1">
              <p className="font-serif-display text-xl" style={{ color: C.textPri }}>
                Failed to load withdrawals.
              </p>
              <p className="text-sm" style={{ color: C.textSec }}>
                Check your connection and try again.
              </p>
            </div>
            <button
              onClick={() => mutate()}
              className="px-6 py-2.5 rounded-lg text-sm font-medium uppercase"
              style={{
                background: GRAD_PRIMARY,
                color: C.textPri,
                letterSpacing: '0.2em',
                boxShadow: '0 4px 14px -2px rgba(168,85,247,0.4)',
              }}
            >
              Retry
            </button>
          </motion.div>
        ) : withdrawals.length === 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-14 flex flex-col items-center text-center"
            style={cardBase}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
              style={{
                background: GRAD_DANGER,
                color: C.textPri,
                boxShadow: '0 8px 24px -4px rgba(255,77,77,0.4)',
              }}
            >
              <FaArrowUp size={18} />
            </div>
            <p className="font-serif-display text-2xl mb-2" style={{ color: C.textPri }}>
              No withdrawals{' '}
              <span
                className="font-serif-italic"
                style={{
                  background: GRAD_DANGER,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                yet.
              </span>
            </p>
            <p className="text-sm" style={{ color: C.textSec }}>
              Your withdrawal activity will appear on this ledger once a request is processed.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl overflow-hidden"
            style={cardBase}
          >
            {/* Header band */}
            <div
              className="flex items-center gap-3 px-6 py-5"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <span
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{
                  background: GRAD_DANGER,
                  color: C.textPri,
                }}
              >
                <FaArrowUp size={12} />
              </span>
              <div>
                <p
                  className="text-[10px] uppercase font-medium"
                  style={{ color: C.red, letterSpacing: '0.3em' }}
                >
                  Outbound
                </p>
                <h2 className="font-serif-display" style={{ fontSize: '1.15rem', color: C.textPri }}>
                  Withdrawals
                </h2>
              </div>
              <span
                className="ml-auto text-[10px] uppercase px-3 py-1 rounded-full font-medium"
                style={{
                  background: 'rgba(255,77,77,0.08)',
                  border: '1px solid rgba(255,77,77,0.28)',
                  color: C.red,
                  letterSpacing: '0.22em',
                }}
              >
                {withdrawals.length} entr{withdrawals.length === 1 ? 'y' : 'ies'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: '640px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {['Date', 'Currency', 'Address', 'Amount', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="text-left py-4 px-6 text-[10px] uppercase font-medium"
                        style={{ color: C.textSec, letterSpacing: '0.22em' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr
                      key={w.id}
                      style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                      }}
                    >
                      <td className="py-4 px-6" style={{ color: C.textSec }}>
                        {new Date(w.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 font-medium" style={{ color: C.textPri }}>
                        {w.currency}
                      </td>
                      <td
                        className="py-4 px-6 text-xs"
                        style={{
                          color: C.textTer,
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-jetbrains-mono, monospace)',
                        }}
                        title={w.address}
                      >
                        {w.address}
                      </td>
                      <td
                        className="py-4 px-6 tabular-nums"
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono, monospace)',
                          color: C.textPri,
                        }}
                      >
                        ${w.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-medium uppercase"
                          style={statusStyle(w.status)}
                        >
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
