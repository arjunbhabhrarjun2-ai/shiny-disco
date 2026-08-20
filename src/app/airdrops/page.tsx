'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { motion } from 'framer-motion';
import { fadeIn, fadeUp, staggerContainer } from '@/lib/animation';
import {
  FaGift,
  FaClock,
  FaCheckCircle,
  FaTrophy,
  FaShieldAlt,
  FaArrowRight,
  FaCoins,
  FaUserShield,
  FaInfoCircle,
} from 'react-icons/fa';

const fmt = (n: number) =>
  n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';

const fmtInt = (n: number) =>
  n?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '0';

const TOTAL_EPOCHS = 24; // 24-month AirDrop cycle
const PROGRAM_START = new Date('2025-01-01T00:00:00Z');

// Compute current epoch (1-indexed) based on months since program start
function getCurrentEpoch(now: Date): number {
  const months =
    (now.getFullYear() - PROGRAM_START.getFullYear()) * 12 +
    (now.getMonth() - PROGRAM_START.getMonth()) +
    1;
  return Math.max(1, Math.min(TOTAL_EPOCHS, months));
}

// Days until end of current epoch (end of current month)
function daysUntilNextEpoch(now: Date): { days: number; hours: number; minutes: number } {
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
  const diffMs = nextMonth.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

interface EligibilityCheck {
  key: string;
  label: string;
  description: string;
  passed: boolean;
  icon: React.ReactNode;
}

export default function AirDropsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { dashboard } = useDashboard(user?.email || null);
  const [now, setNow] = useState<Date>(new Date());
  const [claimNotice, setClaimNotice] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/screens/auth/Signin');
    }
  }, [authLoading, user, router]);

  // Live ticker for countdown
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const currentEpoch = useMemo(() => getCurrentEpoch(now), [now]);
  const cycleProgress = (currentEpoch / TOTAL_EPOCHS) * 100;
  const countdown = useMemo(() => daysUntilNextEpoch(now), [now]);

  // Derive metrics from dashboard
  const rewardPoints = dashboard?.rewardPoints || 0;
  const totalDeposit = dashboard?.totalDeposit || 0;
  const activeInvestmentsCount = dashboard?.activeInvestmentsCount || 0;
  const totalEarn = dashboard?.totalEarn || 0;

  // Eligibility logic — heuristic snapshot based on user activity
  const eligibility: EligibilityCheck[] = [
    {
      key: 'kyc',
      label: 'Verified Account',
      description: 'Account onboarded & email verified',
      passed: !!user?.email,
      icon: <FaUserShield size={12} />,
    },
    {
      key: 'deposit',
      label: 'Active Deposit',
      description: 'Minimum funded balance ≥ $100',
      passed: totalDeposit >= 100,
      icon: <FaCoins size={12} />,
    },
    {
      key: 'position',
      label: 'Active Position',
      description: 'At least one active investment or stake',
      passed: activeInvestmentsCount >= 1,
      icon: <FaShieldAlt size={12} />,
    },
    {
      key: 'rewards',
      label: 'Reward Points',
      description: 'Reward points accrued ≥ 50',
      passed: rewardPoints >= 50,
      icon: <FaTrophy size={12} />,
    },
  ];

  const eligibleCount = eligibility.filter((e) => e.passed).length;
  const fullyEligible = eligibleCount === eligibility.length;
  const eligibilityPct = (eligibleCount / eligibility.length) * 100;

  // Claimable allocation (visual derivation only - no logic mutation)
  const baseAllocation = Math.min(rewardPoints * 0.5, 500);
  const claimableNow = fullyEligible ? baseAllocation : 0;
  const lifetimeClaimed = Math.max(0, totalEarn * 0.05);

  const handleClaim = () => {
    if (!fullyEligible) {
      setClaimNotice('Complete all eligibility steps to unlock your monthly claim.');
      setTimeout(() => setClaimNotice(null), 3500);
      return;
    }
    if (claimableNow <= 0) {
      setClaimNotice('No claimable allocation in the current epoch. Check back next cycle.');
      setTimeout(() => setClaimNotice(null), 3500);
      return;
    }
    setClaimNotice(
      `Claim of ${fmt(claimableNow)} ATM queued for epoch #${currentEpoch}. Settlement in ~24h.`
    );
    setTimeout(() => setClaimNotice(null), 4500);
  };

  if (authLoading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0B0D10' }}
      >
        <div className="text-sm" style={{ color: '#94A3B8' }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0B0D10' }}>
      <Sidebar />

      <main className="flex-1 lg:ml-64 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Ambient orbs */}
          <div
            className="orb-primary"
            style={{
              position: 'absolute',
              top: '120px',
              left: '15%',
              width: '420px',
              height: '420px',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.10) 0%, transparent 70%)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <div
            className="orb-pink"
            style={{
              position: 'absolute',
              top: '320px',
              right: '8%',
              width: '380px',
              height: '380px',
              background: 'radial-gradient(circle, rgba(255, 165, 0, 0.10) 0%, transparent 70%)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 space-y-8"
          >
            {/* Header */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block w-8 h-px"
                  style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }}
                />
                <span
                  className="text-[10px] uppercase font-medium"
                  style={{ color: '#FFD700', letterSpacing: '0.32em' }}
                >
                  AirDrop · Reward Cycle
                </span>
              </div>
              <h1
                className="font-serif-display"
                style={{
                  fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)',
                  color: '#F8FAFC',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Claim your{' '}
                <span
                  className="font-serif-italic"
                  style={{
                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  AirDrop
                </span>{' '}
                allocation
              </h1>
              <p className="mt-3 text-sm max-w-2xl" style={{ color: '#94A3B8' }}>
                A 24-month, monthly-epoch reward cycle for verified Kandella participants.
                Eligibility snapshots are taken at the close of each epoch.
              </p>
            </motion.div>

            {/* Hero claim panel */}
            <motion.div variants={fadeUp}>
              <div
                className="relative overflow-hidden rounded-2xl p-6 md:p-8"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 165, 0, 0.04) 50%, rgba(11, 13, 16, 0.9) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.18)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
              >
                {/* Inner orb */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-80px',
                    right: '-80px',
                    width: '320px',
                    height: '320px',
                    background:
                      'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }}
                />

                <div className="relative grid lg:grid-cols-12 gap-8 items-start">
                  {/* Left: claim CTA */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          boxShadow: '0 8px 24px -4px rgba(255, 215, 0, 0.45)',
                          color: '#0B0D10',
                        }}
                      >
                        <FaGift size={18} />
                      </span>
                      <div>
                        <span
                          className="text-[10px] uppercase font-medium block"
                          style={{ color: '#94A3B8', letterSpacing: '0.28em' }}
                        >
                          Current Epoch
                        </span>
                        <span
                          className="font-serif-display text-base"
                          style={{ color: '#F8FAFC' }}
                        >
                          Epoch <span style={{ color: '#FFD700' }}>#{currentEpoch}</span> of{' '}
                          {TOTAL_EPOCHS}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span
                        className="text-[10px] uppercase block mb-1"
                        style={{ color: '#64748B', letterSpacing: '0.22em' }}
                      >
                        Claimable in this epoch
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-serif-display tabular-nums"
                          style={{
                            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                          }}
                        >
                          {fmt(claimableNow)}
                        </span>
                        <span
                          className="text-xs uppercase tracking-widest"
                          style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                        >
                          ATM
                        </span>
                      </div>
                      <span className="text-xs mt-1 block" style={{ color: '#64748B' }}>
                        Lifetime claimed: ${fmt(lifetimeClaimed)}
                      </span>
                    </div>

                    {/* Claim button */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleClaim}
                        disabled={!fullyEligible || claimableNow <= 0}
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          background:
                            fullyEligible && claimableNow > 0
                              ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                              : 'rgba(255, 255, 255, 0.04)',
                          color:
                            fullyEligible && claimableNow > 0 ? '#0B0D10' : '#64748B',
                          boxShadow:
                            fullyEligible && claimableNow > 0
                              ? '0 8px 24px -4px rgba(255, 215, 0, 0.45)'
                              : 'none',
                          border:
                            fullyEligible && claimableNow > 0
                              ? '1px solid rgba(255, 215, 0, 0.4)'
                              : '1px solid rgba(255,255,255,0.06)',
                          cursor:
                            fullyEligible && claimableNow > 0 ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaGift size={13} />
                        {fullyEligible && claimableNow > 0 ? 'Claim AirDrop' : 'Locked'}
                        <FaArrowRight
                          size={11}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </button>

                      <Link
                        href="/investmentPlans"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          color: '#F8FAFC',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        Boost eligibility
                        <FaArrowRight size={11} />
                      </Link>
                    </div>

                    {claimNotice && (
                      <div
                        className="mt-4 px-4 py-3 rounded-lg text-xs flex items-center gap-2"
                        style={{
                          background: 'rgba(255, 215, 0, 0.08)',
                          border: '1px solid rgba(255, 215, 0, 0.18)',
                          color: '#FFD700',
                        }}
                      >
                        <FaInfoCircle size={11} />
                        {claimNotice}
                      </div>
                    )}
                  </div>

                  {/* Right: epoch countdown */}
                  <div className="lg:col-span-5">
                    <div
                      className="rounded-xl p-5"
                      style={{
                        background: 'rgba(11, 13, 16, 0.55)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FaClock size={11} style={{ color: '#FFD700' }} />
                        <span
                          className="text-[10px] uppercase font-medium"
                          style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                        >
                          Eligibility Snapshot In
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { v: countdown.days, l: 'Days' },
                          { v: countdown.hours, l: 'Hrs' },
                          { v: countdown.minutes, l: 'Min' },
                        ].map((u, i) => (
                          <div
                            key={i}
                            className="rounded-lg py-3 text-center"
                            style={{
                              background:
                                'linear-gradient(145deg, #0f1115, #1a1d24)',
                              boxShadow:
                                '4px 4px 12px #0a0c10, -4px -4px 12px rgba(36, 40, 48, 0.45)',
                              border: '1px solid rgba(255,255,255,0.04)',
                            }}
                          >
                            <div
                              className="font-serif-display tabular-nums"
                              style={{
                                fontSize: '1.4rem',
                                color: '#F8FAFC',
                                lineHeight: 1,
                              }}
                            >
                              {String(u.v).padStart(2, '0')}
                            </div>
                            <div
                              className="text-[9px] uppercase mt-1"
                              style={{ color: '#64748B', letterSpacing: '0.22em' }}
                            >
                              {u.l}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span
                            className="text-[10px] uppercase"
                            style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                          >
                            Cycle Progress
                          </span>
                          <span
                            className="text-[11px] tabular-nums"
                            style={{ color: '#F8FAFC' }}
                          >
                            {currentEpoch}/{TOTAL_EPOCHS}
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${cycleProgress}%`,
                              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                            }}
                          />
                        </div>
                        <div className="flex items-baseline justify-between mt-1.5">
                          <span className="text-[10px]" style={{ color: '#64748B' }}>
                            {cycleProgress.toFixed(1)}% complete
                          </span>
                          <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                            {TOTAL_EPOCHS - currentEpoch} epochs remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Eligibility snapshot */}
            <motion.div variants={fadeUp}>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span
                        className="text-[10px] uppercase font-medium block mb-0.5"
                        style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                      >
                        Eligibility Snapshot
                      </span>
                      <h3 className="font-serif-display text-lg" style={{ color: '#F8FAFC' }}>
                        Verification{' '}
                        <span className="font-serif-italic" style={{ color: '#FFD700' }}>
                          checklist
                        </span>
                      </h3>
                    </div>
                    <span
                      className="text-[11px] uppercase px-3 py-1.5 rounded"
                      style={{
                        background: fullyEligible
                          ? 'rgba(0, 255, 163, 0.10)'
                          : 'rgba(255, 215, 0, 0.10)',
                        color: fullyEligible ? '#00FFA3' : '#FFD700',
                        letterSpacing: '0.16em',
                      }}
                    >
                      {eligibleCount}/{eligibility.length} passed
                    </span>
                  </div>

                  {/* Progress */}
                  <div
                    className="h-1.5 rounded-full overflow-hidden mb-5"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${eligibilityPct}%`,
                        background: fullyEligible
                          ? 'linear-gradient(90deg, #00FFA3, #00D68F)'
                          : 'linear-gradient(90deg, #FFD700, #FFA500)',
                      }}
                    />
                  </div>

                  {/* Checks */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {eligibility.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          background: item.passed
                            ? 'rgba(0, 255, 163, 0.04)'
                            : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${
                            item.passed
                              ? 'rgba(0, 255, 163, 0.14)'
                              : 'rgba(255,255,255,0.04)'
                          }`,
                        }}
                      >
                        <span
                          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: item.passed
                              ? 'rgba(0, 255, 163, 0.10)'
                              : 'rgba(255,255,255,0.04)',
                            color: item.passed ? '#00FFA3' : '#94A3B8',
                          }}
                        >
                          {item.passed ? <FaCheckCircle size={11} /> : item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-0.5">
                            <span
                              className="text-[12px] font-medium truncate"
                              style={{ color: '#F8FAFC' }}
                            >
                              {item.label}
                            </span>
                            <span
                              className="text-[9px] uppercase shrink-0"
                              style={{
                                color: item.passed ? '#00FFA3' : '#64748B',
                                letterSpacing: '0.18em',
                              }}
                            >
                              {item.passed ? 'Passed' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-[11px]" style={{ color: '#64748B' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reward summary */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span
                        className="text-[10px] uppercase font-medium block mb-0.5"
                        style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                      >
                        Reward Wallet
                      </span>
                      <h3 className="font-serif-display text-lg" style={{ color: '#F8FAFC' }}>
                        Your{' '}
                        <span className="font-serif-italic" style={{ color: '#FFD700' }}>
                          balance
                        </span>
                      </h3>
                    </div>
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 215, 0, 0.10)',
                        color: '#FFD700',
                      }}
                    >
                      <FaTrophy size={14} />
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="rounded-lg p-3"
                      style={{
                        background: 'rgba(255, 215, 0, 0.06)',
                        border: '1px solid rgba(255, 215, 0, 0.12)',
                      }}
                    >
                      <span
                        className="text-[10px] uppercase block mb-0.5"
                        style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                      >
                        Reward Points
                      </span>
                      <span
                        className="font-serif-display tabular-nums"
                        style={{ fontSize: '1.4rem', color: '#FFD700' }}
                      >
                        {fmtInt(rewardPoints)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="rounded-lg p-3"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <span
                          className="text-[9px] uppercase block mb-0.5"
                          style={{ color: '#64748B', letterSpacing: '0.22em' }}
                        >
                          Active
                        </span>
                        <span
                          className="text-sm tabular-nums"
                          style={{ color: '#F8FAFC' }}
                        >
                          {activeInvestmentsCount}
                        </span>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <span
                          className="text-[9px] uppercase block mb-0.5"
                          style={{ color: '#64748B', letterSpacing: '0.22em' }}
                        >
                          Funded
                        </span>
                        <span
                          className="text-sm tabular-nums"
                          style={{ color: '#F8FAFC' }}
                        >
                          ${fmt(totalDeposit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reward tiers */}
            <motion.div variants={fadeUp}>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span
                    className="text-[10px] uppercase font-medium block mb-0.5"
                    style={{ color: '#94A3B8', letterSpacing: '0.22em' }}
                  >
                    Reward Tiers
                  </span>
                  <h3 className="font-serif-display text-xl" style={{ color: '#F8FAFC' }}>
                    Boost your{' '}
                    <span className="font-serif-italic" style={{ color: '#FFD700' }}>
                      monthly allocation
                    </span>
                  </h3>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Bronze',
                    multiplier: '1.0x',
                    points: '0 – 49',
                    color: '#A88054',
                    bg: 'rgba(168, 128, 84, 0.08)',
                    border: 'rgba(168, 128, 84, 0.18)',
                    active: rewardPoints < 50,
                  },
                  {
                    name: 'Silver',
                    multiplier: '1.5x',
                    points: '50 – 249',
                    color: '#C0C8D5',
                    bg: 'rgba(192, 200, 213, 0.08)',
                    border: 'rgba(192, 200, 213, 0.18)',
                    active: rewardPoints >= 50 && rewardPoints < 250,
                  },
                  {
                    name: 'Gold',
                    multiplier: '2.0x',
                    points: '250 – 999',
                    color: '#FFD700',
                    bg: 'rgba(255, 215, 0, 0.08)',
                    border: 'rgba(255, 215, 0, 0.18)',
                    active: rewardPoints >= 250 && rewardPoints < 1000,
                  },
                  {
                    name: 'Platinum',
                    multiplier: '3.0x',
                    points: '1,000+',
                    color: '#A855F7',
                    bg: 'rgba(168, 85, 247, 0.08)',
                    border: 'rgba(168, 85, 247, 0.18)',
                    active: rewardPoints >= 1000,
                  },
                ].map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-xl p-5 transition-all duration-200"
                    style={{
                      background: tier.active
                        ? `linear-gradient(135deg, ${tier.bg} 0%, rgba(11,13,16,0.6) 100%)`
                        : 'linear-gradient(145deg, #0f1115, #1a1d24)',
                      border: `1px solid ${tier.active ? tier.border : 'rgba(255,255,255,0.04)'}`,
                      boxShadow: tier.active
                        ? `0 0 28px ${tier.bg}`
                        : '6px 6px 14px #0a0c10, -6px -6px 14px rgba(36, 40, 48, 0.45)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] uppercase font-medium"
                        style={{ color: tier.color, letterSpacing: '0.22em' }}
                      >
                        {tier.name}
                      </span>
                      {tier.active && (
                        <span
                          className="text-[9px] uppercase px-2 py-0.5 rounded"
                          style={{
                            background: tier.bg,
                            color: tier.color,
                            letterSpacing: '0.16em',
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <div
                      className="font-serif-display tabular-nums mb-2"
                      style={{ fontSize: '1.6rem', color: tier.color }}
                    >
                      {tier.multiplier}
                    </div>
                    <span className="text-[10px] uppercase block" style={{ color: '#64748B', letterSpacing: '0.18em' }}>
                      Allocation Multiplier
                    </span>
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-[10px] uppercase block mb-0.5" style={{ color: '#64748B', letterSpacing: '0.18em' }}>
                        Reward Points
                      </span>
                      <span className="text-xs tabular-nums" style={{ color: '#F8FAFC' }}>
                        {tier.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Footer info */}
            <motion.div variants={fadeIn}>
              <div
                className="rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 215, 0, 0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.12)',
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(255, 215, 0, 0.08)',
                      color: '#FFD700',
                    }}
                  >
                    <FaInfoCircle size={14} />
                  </span>
                  <div>
                    <h4 className="text-sm font-medium mb-0.5" style={{ color: '#F8FAFC' }}>
                      How AirDrop epochs work
                    </h4>
                    <p className="text-[12px] leading-relaxed max-w-2xl" style={{ color: '#94A3B8' }}>
                      Eligibility is snapshotted at the close of each monthly epoch. Allocations
                      are computed from your tier multiplier and reward points and become
                      claimable in the following epoch. Unclaimed allocations roll forward up to
                      three epochs.
                    </p>
                  </div>
                </div>
                <Link
                  href="/screens/Earn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs uppercase font-medium transition-all duration-200 self-start md:self-auto shrink-0"
                  style={{
                    background: 'rgba(255, 215, 0, 0.08)',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 215, 0, 0.18)',
                    letterSpacing: '0.18em',
                  }}
                >
                  Program details
                  <FaArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
