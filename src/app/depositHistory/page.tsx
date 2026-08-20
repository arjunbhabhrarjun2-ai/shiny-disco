'use client';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { useDeposits } from '@/lib/hooks/useDeposits';
import { motion } from 'framer-motion';
import { fadeIn, fadeUp } from '@/lib/animation';
import { FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const C = {
  bgBase: '#0B0D10',
  textPri: '#F8FAFC',
  textSec: '#94A3B8',
  textTer: '#64748B',
  border: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(255,255,255,0.12)',
  purple: '#A855F7',
  pink: '#EC4899',
  green: '#00FFA3',
  red: '#FF4D4D',
  amber: '#FFB800',
};

const GRAD_PRIMARY = 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)';
const GRAD_SUCCESS = 'linear-gradient(135deg, #00FFA3 0%, #00D68F 100%)';

const statusStyle = (status: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    fontSize: '10px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '999px',
    fontWeight: 500,
  };
  if (status === 'Approved' || status === 'Completed')
    return {
      ...base,
      background: 'rgba(0,255,163,0.08)',
      color: C.green,
      border: '1px solid rgba(0,255,163,0.28)',
    };
  if (status === 'Rejected')
    return {
      ...base,
      background: 'rgba(255,77,77,0.08)',
      color: '#FCA5A5',
      border: '1px solid rgba(255,77,77,0.28)',
    };
  return {
    ...base,
    background: 'rgba(255,184,0,0.08)',
    color: C.amber,
    border: '1px solid rgba(255,184,0,0.28)',
  };
};

export default function DepositHistoryPage() {
  const { user } = useAuth();
  const { deposits, isLoading, isError, mutate } = useDeposits(user?.email || null, 0);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen overflow-x-hidden relative"
      style={{ background: C.bgBase }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 80% 0%, rgba(0,255,163,0.06), transparent 60%), radial-gradient(ellipse 60% 40% at 10% 90%, rgba(168,85,247,0.06), transparent 60%)',
        }}
      />
      <Sidebar />

      <main
        className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 relative pb-24 md:pb-10"
        style={{ color: C.textPri }}
      >
        {/* Editorial Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-10 max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-px" style={{ background: GRAD_SUCCESS }} />
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: C.green, letterSpacing: '0.32em' }}
            >
              Inbound Ledger
            </span>
          </div>
          <h1
            className="font-serif-display"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
              lineHeight: 1.05,
              color: C.textPri,
              letterSpacing: '-0.02em',
            }}
          >
            Deposit{' '}
            <span
              className="font-serif-italic"
              style={{
                background: GRAD_SUCCESS,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              history.
            </span>
          </h1>
          <p className="text-sm md:text-base mt-3 max-w-xl" style={{ color: C.textSec }}>
            A chronological record of every inbound settlement across your Kandella account.
          </p>
        </motion.div>

        {isLoading ? (
          <div
            className="flex items-center gap-3 py-14 px-6 rounded-xl max-w-md glass-card"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: `1px solid ${C.borderAccent}`,
            }}
          >
            <AiOutlineLoading3Quarters
              className="animate-spin"
              size={16}
              style={{ color: C.purple }}
            />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: C.textSec, letterSpacing: '0.22em' }}
            >
              Loading ledger…
            </span>
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center py-14 px-6 rounded-xl text-center max-w-md mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255,77,77,0.06) 0%, rgba(11,13,16,0.85) 100%)',
              border: '1px solid rgba(255,77,77,0.32)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <FaExclamationTriangle size={24} style={{ color: C.red }} />
            <p
              className="mt-4 text-xl font-serif-display"
              style={{ color: C.textPri }}
            >
              Unable to load deposits
            </p>
            <p className="text-sm mt-2 mb-5" style={{ color: C.textSec }}>
              The ledger feed could not be retrieved.
            </p>
            <button
              onClick={() => mutate()}
              className="px-6 py-2.5 rounded-md text-xs font-medium"
              style={{
                background: GRAD_PRIMARY,
                color: C.textPri,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 14px -2px rgba(168,85,247,0.4)',
              }}
            >
              Retry
            </button>
          </div>
        ) : !deposits?.depositHistory?.length ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center py-20 text-center rounded-xl max-w-xl mx-auto glass-card"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: `1px solid ${C.borderAccent}`,
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
              style={{
                background: GRAD_SUCCESS,
                color: '#0B0D10',
                boxShadow: '0 8px 24px -4px rgba(0,255,163,0.4)',
              }}
            >
              <FaArrowDown size={18} />
            </div>
            <p className="text-xl mb-2 font-serif-display" style={{ color: C.textPri }}>
              No deposits recorded
            </p>
            <p className="text-sm max-w-sm" style={{ color: C.textSec }}>
              Your inbound settlement ledger is currently empty. New deposits will appear here once
              processed.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: `1px solid ${C.borderAccent}`,
            }}
          >
            {/* Table header strip */}
            <div
              className="flex items-center gap-3 px-6 py-5"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{
                  background: GRAD_SUCCESS,
                  color: '#0B0D10',
                }}
              >
                <FaArrowDown size={13} />
              </div>
              <div>
                <p
                  className="text-[10px] uppercase font-medium"
                  style={{ color: C.green, letterSpacing: '0.3em' }}
                >
                  Inbound
                </p>
                <h2 className="text-lg font-serif-display" style={{ color: C.textPri }}>
                  Deposits
                </h2>
              </div>
              <span
                className="ml-auto text-[10px] px-3 py-1.5 rounded-full uppercase font-medium"
                style={{
                  background: 'rgba(0,255,163,0.08)',
                  color: C.green,
                  border: '1px solid rgba(0,255,163,0.28)',
                  letterSpacing: '0.22em',
                }}
              >
                {deposits.depositHistory.length} entries
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '560px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {['Amount', 'Currency', 'Status', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="text-left py-4 px-6 text-[10px] font-medium uppercase"
                        style={{ color: C.textSec, letterSpacing: '0.22em' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deposits.depositHistory.map((d: any) => (
                    <tr
                      key={d.id}
                      style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                      }}
                    >
                      <td className="py-4 px-6">
                        <span
                          className="tabular-nums"
                          style={{
                            fontFamily: 'var(--font-jetbrains-mono, monospace)',
                            fontSize: '14px',
                            color: C.textPri,
                            fontWeight: 500,
                          }}
                        >
                          ${d.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono, monospace)',
                          color: C.textSec,
                          letterSpacing: '0.08em',
                        }}
                      >
                        {d.currency}
                      </td>
                      <td className="py-4 px-6">
                        <span style={statusStyle(d.status)}>{d.status}</span>
                      </td>
                      <td className="py-4 px-6 text-sm" style={{ color: C.textSec }}>
                        {new Date(d.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        <span style={{ color: C.textTer, fontSize: '12px' }}>
                          {new Date(d.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
