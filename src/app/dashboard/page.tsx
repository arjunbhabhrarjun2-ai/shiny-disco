'use client';

/**
 * Kandella Dashboard — Stitch luxe port
 * ----------------------------------
 * Layout faithfully follows dashboard_stitch/luxe_dashboard_overview.
 * All data sources, hooks, and routing are preserved — only the visual
 * layer changed. The page consumes the exact same `useDashboard` hook
 * and the existing <Sidebar />.
 */

import { useEffect } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/lib/hooks/useDashboard';
import {
  FaSearch,
  FaPowerOff,
  FaPlusCircle,
  FaArrowUp,
  FaBolt,
  FaChartLine,
  FaSignOutAlt,
  FaCog,
  FaExclamationTriangle,
  FaWallet,
  FaListAlt,
  FaShieldAlt,
  FaChevronRight,
  FaServer,
  FaNewspaper,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import NotificationButton from '@/components/NotificationButton';
import Logo from '@/components/Logo';
import MarketNews from '@/components/MarketNews';
import TickerTape from '@/components/TickerTape';
import CoinIcon from '@/components/CoinIcon';
import { useCurrency } from '@/components/context/CurrencyContext';

/* ── Small helpers ─────────────────────────────────────────────────── */
const fmt = (n: number, decimals = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtUsd = (n: number) => `$${fmt(n)}`;
const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}k` : fmtUsd(n);

const ACTIVITY_KIND_MAP: Record<string, 'deposit' | 'withdraw' | 'reward' | 'stake' | 'investment' | 'fill' | 'other'> = {
  deposit: 'deposit', withdrawal: 'withdraw', withdraw: 'withdraw',
  reward: 'reward', roi: 'reward', stake: 'stake', staking: 'stake',
  investment: 'investment', invest: 'investment', fill: 'fill', trade: 'fill',
};

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { dashboard, isLoading, isError, mutate } = useDashboard(user?.email || null);
  const { format: fmtCur } = useCurrency(); // display in selected currency


  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [user, router, authLoading]);


  /* ── Guards ────────────────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <p className="text-sm" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>
          REDIRECTING TO SIGN IN…
        </p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-5" style={{ background: '#06090F' }}>
        <Logo size={36} />
        <AiOutlineLoading3Quarters className="animate-spin" size={22} style={{ color: '#D4AF7F' }} />
        <p className="text-[11px] uppercase" style={{ color: '#8F9BB3', letterSpacing: '0.28em' }}>
          PREPARING CRYPTOTRADEPRIME PORTAL
        </p>
      </div>
    );
  }
  if (isError || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)' }}
        >
          <FaExclamationTriangle size={22} style={{ color: '#FF3D71' }} />
        </div>
        <h2 className="text-xl font-bold">Failed to load dashboard</h2>
        <button
          onClick={() => mutate()}
          className="px-6 py-2.5 rounded-lg text-[11px] uppercase text-white luxe-grad-purple-pink luxe-neumorphic"
          style={{ letterSpacing: '0.2em' }}
        >
          Retry
        </button>
      </div>
    );
  }

  /* ── Derived metrics (unchanged from previous version) ─────────── */
  const totalPortfolioValue =
    (dashboard.mainBalance || 0) + (dashboard.interestBalance || 0) + (dashboard.totalDeposit || 0);
  const pnl24h = dashboard.recentROITotal || 0;
  const pnl24hPct = totalPortfolioValue > 0 ? (pnl24h / totalPortfolioValue) * 100 : 0;
  const isPnlUp = pnl24h >= 0;
  // Margin usage = capital deployed in active investments / total equity.
  // Deployed capital comes straight from the active investment principals
  // (authoritative), regardless of which invest endpoint booked it.
  const investedCapital = (dashboard.activeInvestments || []).reduce(
    (s: number, inv: any) => s + (Number(inv?.amount) || 0),
    0,
  );
  const availableMargin = Math.max(0, totalPortfolioValue - investedCapital);
  const marginUsagePct =
    totalPortfolioValue > 0 ? Math.min(100, (investedCapital / totalPortfolioValue) * 100) : 0;
  const marginRatio = 100 - marginUsagePct;

  /* ── Active positions from active investments ──────────────────── */
  const positions = (dashboard.activeInvestments || []).slice(0, 5).map((inv: any, i: number) => {
    const principal = Number(inv?.amount) || 0;
    // roi is stored as a decimal fraction (0.40 = 40%). Normalize defensively
    // in case a legacy record stored it as a whole percent.
    const rawRoi = Number(inv?.roi ?? 0);
    const roiRate = rawRoi > 1.5 ? rawRoi / 100 : rawRoi;
    const roiPct = roiRate * 100;
    const durationDays = Number(inv?.durationDays ?? inv?.duration) || 30;
    const start = inv?.startDate
      ? new Date(inv.startDate)
      : inv?.createdAt
        ? new Date(inv.createdAt)
        : null;
    const daysElapsed = start ? Math.max(0, (Date.now() - start.getTime()) / 86_400_000) : 0;
    const progress = Math.min(100, Math.max(0, Math.round((daysElapsed / durationDays) * 100)));
    const totalProfit = principal * roiRate; // credited in full at maturity
    const accrued = totalProfit * (progress / 100); // prorated → totalProfit at maturity
    const realizedPct = roiPct * (progress / 100);
    const tier = (inv?.planName || inv?.tier || inv?.plan || `TIER-${i + 1}`).toString().toUpperCase();
    return { id: inv?.id ?? inv?._id ?? i, tier, principal, roiPct, accrued, realizedPct, daysTotal: durationDays, daysElapsed, progress };
  });

  /* ── Open orders from pending deposits/withdrawals ─────────────── */
  const pendingDeposits = (dashboard.pendingDeposits || []).slice(0, 3);
  const pendingWithdrawals = (dashboard.pendingWithdrawals || []).slice(0, 3);
  const openOrders = [
    ...pendingDeposits.map((d: any, i: number) => ({
      id: `d-${d.id ?? i}`,
      pair: (d.asset || d.currency || 'USDT').toUpperCase(),
      side: 'DEPOSIT',
      sideColor: '#06B6D4',
      size: Number(d.amount) || 0,
      price: Number(d.price) || 0,
      progress: d.confirmations ? Math.min(100, Math.round((d.confirmations / 3) * 100)) : 0,
    })),
    ...pendingWithdrawals.map((w: any, i: number) => ({
      id: `w-${w.id ?? i}`,
      pair: (w.asset || w.currency || 'USDT').toUpperCase(),
      side: 'WITHDRAW',
      sideColor: '#DB2777',
      size: Number(w.amount) || 0,
      price: Number(w.price) || 0,
      progress: 45,
    })),
  ].slice(0, 4);

  /* ── System log from recent activities ─────────────────────────── */
  const systemLogs = (dashboard.recentActivities || []).slice(0, 4).map((a: any, i: number) => {
    const rawKind = (a?.type || a?.kind || 'other').toString().toLowerCase();
    const kind = ACTIVITY_KIND_MAP[rawKind] || 'other';
    const dot =
      kind === 'reward' || kind === 'fill' ? '#06B6D4' : kind === 'withdraw' ? '#DB2777' : '#D4AF7F';
    const stamp = a?.timestamp || a?.createdAt || a?.date;
    const time = stamp ? new Date(stamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
    const amt = typeof a?.amount === 'number' ? fmtUsd(a.amount) : '';
    return {
      id: a?.id ?? a?._id ?? i,
      title: a?.title || a?.description || `${rawKind.charAt(0).toUpperCase()}${rawKind.slice(1)}`,
      detail: a?.subtitle || a?.note || (amt ? `${amt} processed.` : ''),
      time,
      dot,
    };
  });

  /* ── Earn summary ──────────────────────────────────────────────── */
  const stakingTotal = dashboard.totalEarn || 0;
  const earnApy = Number((dashboard.roiCompleted as any) || 14.8);

  /* ───────────────────────────────────────────────────────────────── */
  return (
    <div
      className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]"
      style={{ background: '#06090F' }}
    >
      {/* Ambient orbs (Stitch ref) */}
      <div className="luxe-ambient-orb" style={{ background: '#A855F7', top: -200, left: -100 }} />
      <div className="luxe-ambient-orb" style={{ background: '#06B6D4', bottom: -200, right: -100 }} />

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* ── Top header (Search · Ticker · Notifications · Deposit) ── */}
        <header
          className="sticky top-0 z-30 h-14 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{
            background: 'rgba(6,9,15,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Live ticker tape — all markets */}
            <TickerTape maxWidth="60vw" />
          </div>

          <div className="flex items-center gap-3">
            <NotificationButton />

            <button
              onClick={() => router.push('/settings')}
              title="Settings"
              className="p-1.5 rounded-full transition-all"
              style={{
                color: '#D4AF7F',
                background: 'rgba(212,175,127,0.06)',
                border: '1px solid rgba(212,175,127,0.22)',
              }}
            >
              <FaCog size={16} />
            </button>

            <button
              onClick={() => logout()}
              title="Logout"
              className="hidden sm:inline-flex p-1.5 transition-colors"
              style={{ color: '#94a3b8' }}
            >
              <FaPowerOff size={14} />
            </button>

            {/* Primary Deposit CTA */}
            <button
              onClick={() => router.push('/addFunds')}
              className="luxe-grad-purple-pink luxe-neumorphic text-white px-4 sm:px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-all"
            >
              Deposit
            </button>
          </div>
        </header>

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className="p-4 sm:p-6 overflow-y-auto flex-1 relative">
          <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
            {/* ── LEFT COLUMN ─────────────────────────────────────── */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            {/* ── Portfolio Summary (col-span-8, sub-grid 2:1) ───── */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Equity card */}
              <div className="md:col-span-2 luxe-glass-border rounded-xl p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <FaWallet size={120} style={{ color: '#D4AF7F' }} />
                </div>
                <div className="relative">
                  <span className="luxe-text-gold text-[10px] font-extrabold uppercase tracking-[0.2em] block mb-2">
                    Total Equity
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#D4AF7F' }}>
                    {fmtCur(totalPortfolioValue)}
                  </h2>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        color: isPnlUp ? '#06B6D4' : '#DB2777',
                        background: isPnlUp ? 'rgba(6,182,212,0.18)' : 'rgba(219,39,119,0.18)',
                        borderColor: isPnlUp ? 'rgba(6,182,212,0.32)' : 'rgba(219,39,119,0.32)',
                      }}
                    >
                      {isPnlUp ? '+' : ''}
                      {pnl24hPct.toFixed(2)}%
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                      {isPnlUp ? '+' : ''}
                      {fmtCur(pnl24h)} (24h)
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest block mb-2" style={{ color: '#5a6578' }}>
                        Available Margin
                      </span>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full luxe-grad-cyan-blue" style={{ width: `${marginRatio}%` }} />
                      </div>
                      <span className="text-xs font-mono mt-2 block" style={{ color: 'rgba(212,175,127,0.85)' }}>
                        {fmtUsd(availableMargin)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest block mb-2" style={{ color: '#5a6578' }}>
                        Margin Usage
                      </span>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full luxe-bg-gold" style={{ width: `${marginUsagePct}%` }} />
                      </div>
                      <span className="text-xs font-mono mt-2 block" style={{ color: 'rgba(212,175,127,0.85)' }}>
                        {marginUsagePct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Terminal card */}
              <div className="luxe-glass rounded-xl p-5 flex flex-col gap-3">
                <span className="luxe-text-gold text-[10px] font-extrabold uppercase tracking-[0.2em] mb-1">
                  Quick Terminal
                </span>
                {[
                  { label: 'Deposit', icon: <FaPlusCircle size={14} />, color: '#D4AF7F', onClick: () => router.push('/addFunds') },
                  { label: 'Withdraw', icon: <FaArrowUp size={14} />, color: 'rgba(255,255,255,0.4)', onClick: () => router.push('/withdrawal') },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
                    className="w-full py-2.5 rounded-lg flex items-center justify-between px-4 group luxe-neumorphic transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span style={{ color: btn.color }}>{btn.icon}</span>
                      <span className="font-semibold text-sm">{btn.label}</span>
                    </span>
                    <FaChevronRight size={10} style={{ color: 'rgba(255,255,255,0.25)' }} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
                <button
                  onClick={() => router.push('/trade/spot')}
                  className="w-full py-3 mt-auto luxe-grad-purple-pink luxe-neumorphic text-white rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-3"
                >
                  <FaBolt size={13} />
                  <span className="font-black uppercase tracking-tighter text-sm">Instant Trade</span>
                </button>
              </div>
            </section>

            {/* ── Active Positions ────────────────────────────────── */}
            <section className="col-span-12 lg:col-span-8 luxe-glass rounded-xl overflow-hidden">
              <div
                className="p-4 sm:p-5 flex justify-between items-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-2.5">
                  <FaListAlt style={{ color: '#D4AF7F' }} size={14} />
                  <div>
                    <span className="luxe-text-gold text-[9px] font-extrabold uppercase tracking-[0.2em] block">
                      Portfolio
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">
                      Active Positions ({positions.length})
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/portfolio')}
                  className="text-[11px] font-bold uppercase hover:underline underline-offset-4"
                  style={{ color: '#D4AF7F' }}
                >
                  View All
                </button>
              </div>

              {positions.length === 0 ? (
                <div className="p-10 text-center text-sm" style={{ color: '#8F9BB3' }}>
                  No active positions. Tap <span className="luxe-text-gold font-semibold">Instant Trade</span> to open one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {['Principal', 'ROI', 'Progress', 'Accrued'].map((h, i) => (
                          <th
                            key={h}
                            className={`p-4 text-[10px] font-extrabold uppercase tracking-widest ${i >= 1 ? 'text-right' : ''}`}
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      {positions.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {fmtUsd(p.principal)}
                          </td>
                          <td className="p-4 font-mono text-xs text-right" style={{ color: '#D4AF7F' }}>
                            {p.roiPct.toFixed(0)}%
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3 justify-end">
                              <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full luxe-grad-cyan-blue" style={{ width: `${p.progress}%` }} />
                              </div>
                              <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold" style={{ color: '#06B6D4' }}>
                                +{fmtUsd(p.accrued)}
                              </span>
                              <span className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.6)' }}>
                                +{p.realizedPct.toFixed(2)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
            {/* ── Market News (moved above Active Positions) ── */}
            <section className="col-span-12 lg:col-span-8">
              <div className="luxe-glass rounded-xl overflow-hidden">
                <div
                  className="p-4 flex justify-between items-center"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <FaNewspaper size={12} style={{ color: '#D4AF7F' }} />
                    <div>
                      <span className="luxe-text-gold text-[9px] font-extrabold uppercase tracking-[0.2em] block">
                        Intelligence
                      </span>
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">Market News</h3>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <MarketNews />
                </div>
              </div>
            </section>

            </div>
            {/* ── /LEFT COLUMN ────────────────────────────────────── */}
            {/* ── Right column: Earn Summary + System Logs + News ─ */}
            <aside className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              {/* ── Open Orders / Pending Transactions ───────────────── */}
            <section className="col-span-12 lg:col-span-8 luxe-glass rounded-xl overflow-hidden">
              <div
                className="p-4 sm:p-5 flex justify-between items-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-2.5">
                  <FaShieldAlt style={{ color: '#D4AF7F' }} size={13} />
                  <div>
                    <span className="luxe-text-gold text-[9px] font-extrabold uppercase tracking-[0.2em] block">
                      Queue
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">
                      Pending Transactions ({openOrders.length})
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/transaction')}
                  className="text-[11px] font-bold uppercase hover:underline underline-offset-4"
                  style={{ color: '#D4AF7F' }}
                >
                  View All
                </button>
              </div>

              {openOrders.length === 0 ? (
                <div className="p-10 text-center text-sm" style={{ color: '#8F9BB3' }}>
                  No pending transactions. Deposits and withdrawals will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      {openOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white">{o.pair}</span>
                              <span className="text-[10px] font-mono" style={{ color: `${o.sideColor}cc` }}>
                                {o.side}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                {fmt(o.size, 4)}
                              </span>
                              <span className="text-[10px]" style={{ color: '#5a6578' }}>SIZE</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                {o.price > 0 ? fmtUsd(o.price) : '—'}
                              </span>
                              <span className="text-[10px]" style={{ color: '#5a6578' }}>PRICE</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div
                                  className="h-full"
                                  style={{ width: `${o.progress}%`, background: `linear-gradient(135deg, ${o.sideColor} 0%, ${o.sideColor}80 100%)` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                {o.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => router.push('/transaction')}
                              className="text-lg transition-colors hover:text-[#DB2777]"
                              style={{ color: '#5a6578' }}
                              title="Details"
                            >
                              <FaChevronRight size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

              {/* Earn Summary */}
              <div className="luxe-glass-border rounded-xl p-5 sm:p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="luxe-text-gold text-[9px] font-extrabold uppercase tracking-[0.2em] block mb-1">
                      Staking Rewards
                    </span>
                    <h3 className="text-2xl font-black tracking-tighter text-white">{fmtUsd(stakingTotal)}</h3>
                  </div>
                  <span
                    className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest"
                    style={{
                      color: '#D4AF7F',
                      background: 'rgba(212,175,127,0.10)',
                      border: '1px solid rgba(212,175,127,0.25)',
                    }}
                  >
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Ethereum', sub: 'LIDO LIQUID', apy: '37.5%', value: fmtCompact(stakingTotal * 0.3), icon: <CoinIcon symbol="eth" size={22} /> },
                    { name: 'Solana', sub: 'Validator Node', apy: '32.2%', value: fmtCompact(stakingTotal * 0.5), icon: <CoinIcon symbol="sol" size={22} /> },
                    { name: 'Tron', sub: 'Yield Aggregator', apy: '8.4%', value: fmtCompact(stakingTotal * 0.2), icon: <CoinIcon symbol="trx" size={22} /> },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:border-[#D4AF7F]/40"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#D4AF7F' }}
                        >
                          {s.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{s.name}</span>
                          <span className="text-[10px]" style={{ color: '#5a6578' }}>{s.sub}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold" style={{ color: '#06B6D4' }}>{s.apy}% APY</span>
                        <div className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push('/stake')}
                  className="w-full mt-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all luxe-neumorphic hover:bg-[#D4AF7F]/10"
                  style={{ color: '#D4AF7F', border: '1px solid rgba(212,175,127,0.3)' }}
                >
                  Manage Yield
                </button>
              </div>

              {/* System Logs */}
              <div className="luxe-glass rounded-xl flex flex-col overflow-hidden">
                <div
                  className="p-4 flex items-center gap-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <FaServer size={12} style={{ color: '#D4AF7F' }} />
                  <div>
                    <span className="luxe-text-gold text-[9px] font-extrabold uppercase tracking-[0.2em] block">
                      Infrastructure
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">System Logs</h3>
                  </div>
                </div>
                <div className="p-5 space-y-5 max-h-[280px] overflow-y-auto">
                  {systemLogs.length === 0 && (
                    <p className="text-xs" style={{ color: '#8F9BB3' }}>
                      No recent activity. New events stream here in real time.
                    </p>
                  )}
                  {systemLogs.map((l) => (
                    <div key={l.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: l.dot, boxShadow: `0 0 8px ${l.dot}80` }}
                        />
                        <div className="w-px flex-1 mt-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
                      </div>
                      <div className="flex-1 flex flex-col -mt-1 min-w-0">
                        <span className="text-[11px] font-bold text-white">{l.title}</span>
                        {l.detail && (
                          <p className="text-[11px] mt-1 leading-tight truncate" style={{ color: '#94a3b8' }}>
                            {l.detail}
                          </p>
                        )}
                        <span className="text-[9px] font-mono mt-1 uppercase" style={{ color: '#5a6578' }}>
                          {l.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}
