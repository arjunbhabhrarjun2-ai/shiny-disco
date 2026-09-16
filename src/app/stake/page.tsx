'use client';

/**
 * Kandella Earn — Stitch luxe port (dashboard_stitch/luxe_earn_staking_bonds).
 * Preserves: useAuth, useDashboard, Sidebar, auth-redirect.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useCurrency } from '@/components/context/CurrencyContext';
import { useDashboard } from '@/lib/hooks/useDashboard';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import CoinIcon from '@/components/CoinIcon';
import MobileEarn from '@/components/stake/MobileEarn';
import {
  FaSeedling,
  FaShieldAlt,
  FaBolt,
  FaLock,
  FaArrowRight,
  FaCoins,
  FaPowerOff,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUsd = (n: number) => `$${fmt(n)}`;

// The private ATRIUM coin app (de-indexed). Set these in .env; the defaults
// keep local dev working. The key must match NEXT_PUBLIC_ATRIUM_KEY in the
// coin app's AccessGate.
const ATRIUM_URL = process.env.NEXT_PUBLIC_ATRIUM_URL || 'http://localhost:3001';
const ATRIUM_KEY = process.env.NEXT_PUBLIC_ATRIUM_KEY || 'atrium-staking';

interface ProtocolCard {
  name: string;
  sub: string;
  icon: React.ReactNode;
  apy: string;
  apyLabel: string;
  lockup: string;
  rewards: string;
  position: string;
  topBar: string;
}

export default function StakePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { format: fmtCur } = useCurrency(); // display in selected currency
  const { dashboard, isLoading, isError } = useDashboard(user?.email || null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [user, authLoading, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <p className="text-sm" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>REDIRECTING…</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-5" style={{ background: '#06090F' }}>
        <Logo size={36} />
        <AiOutlineLoading3Quarters className="animate-spin" size={22} style={{ color: '#D4AF7F' }} />
        <p className="text-[11px] uppercase" style={{ color: '#8F9BB3', letterSpacing: '0.28em' }}>LOADING EARN</p>
      </div>
    );
  }

  // Derived metrics from existing dashboard data
  const activeInvestments = Array.isArray(dashboard?.activeInvestments) ? dashboard.activeInvestments : [];
  const totalActive = activeInvestments.reduce((s: number, i: any) => s + (Number(i?.amount) || 0), 0);
  const available = dashboard?.mainBalance || 0;
  // roi is stored as a decimal fraction (0.40 = 40%); normalize defensively.
  const roiRateOf = (i: any) => { const r = Number(i?.roi) || 0; return r > 1.5 ? r / 100 : r; };
  // Plans are 30-day (monthly) terms, so each investment's ROI is its monthly
  // return. Projected monthly yield = sum(principal × monthly ROI).
  const monthlyYield = activeInvestments.reduce(
    (s: number, i: any) => s + (Number(i?.amount) || 0) * roiRateOf(i),
    0,
  );
  const avgMonthlyPct = totalActive > 0 ? (monthlyYield / totalActive) * 100 : 0;

  // Open the private ATRIUM coin app with the access key (new tab).
  const openAtrium = () => {
    const sep = ATRIUM_URL.includes('?') ? '&' : '?';
    window.open(`${ATRIUM_URL}${sep}k=${encodeURIComponent(ATRIUM_KEY)}`, '_blank', 'noopener,noreferrer');
  };

  const protocols: ProtocolCard[] = [
    {
      name: 'Ethereum',
      sub: 'Lido Liquid',
      icon: <CoinIcon symbol="eth" size={28} />,
      apy: '37.5%',
      apyLabel: 'Variable APY',
      lockup: 'LIQUID (0d)',
      rewards: 'DAILY STREAM',
      position: 'ACTIVE',
      topBar: 'linear-gradient(90deg, #6366F1, #A855F7)',
    },
    {
      name: 'Solana',
      sub: 'Validator Node',
      icon: <CoinIcon symbol="sol" size={28} />,
      apy: '32.2%',
      apyLabel: 'Fixed APY',
      lockup: '21 DAYS',
      rewards: 'EPOCH (2.5d)',
      position: 'OPEN',
      topBar: 'linear-gradient(90deg, #06B6D4, #3B82F6)',
    },
    {
      name: 'Tron',
      sub: 'Yield Aggregator',
      icon: <CoinIcon symbol="trx" size={28} />,
      apy: '8.4%',
      apyLabel: 'Base APY',
      lockup: 'Flexible',
      rewards: 'Hourly',
      position: 'OPEN',
      topBar: 'linear-gradient(90deg, rgba(212,175,127,0.5), rgba(212,175,127,0.15))',
    },
  ];

  const bonds = [
    { tier: 'Core Yield Fund', tierColor: 'TIER 01', sub: 'Optimized for low-risk initial entry.', plan: 'mining', roiPct: 30, coupon: '30%', duration: '30 Days', icon: <FaSeedling size={18} /> },
    { tier: 'Strategic Growth Fund', tierColor: 'POPULAR', sub: 'High-velocity cycle for active portfolios.', plan: 'premium', roiPct: 40, coupon: '40%', duration: '30 Days', active: true, icon: <FaShieldAlt size={18} /> },
    { tier: 'Institutional Capital Fund', tierColor: 'ELITE TIER', sub: 'Maximum leverage yield for HNW accounts.', plan: 'gold', roiPct: 55, coupon: '55%', duration: '30 Days', icon: <FaCoins size={18} /> },
  ];

  // ── Mobile composition data (same live sources as the desktop above) ──
  // The API does not chain-tag capital, so the live staked total is split
  // across the three protocol pools with the same mix the Earn-summary card
  // on /dashboard uses (ETH 30 / SOL 50 / TRX 20) so rows sum to the hero.
  const PROTOCOL_TICKERS: Record<string, string> = { Ethereum: 'eth', Solana: 'sol', Tron: 'trx' };
  const PROTOCOL_MIX = [0.3, 0.5, 0.2];
  const mobileProtocols = protocols.map((p, i) => ({
    symbol: PROTOCOL_TICKERS[p.name] ?? p.name.toLowerCase(),
    name: p.name,
    sub: p.sub,
    apyPct: parseFloat(p.apy) || 0,
    staked: totalActive * (PROTOCOL_MIX[i] ?? 0),
  }));
  // Est. annual yield = Σ (protocol stake × protocol APY).
  const estAnnualYield = mobileProtocols.reduce((s, p) => s + p.staked * (p.apyPct / 100), 0);
  const protocolsActive = totalActive > 0 ? protocols.length : 0;
  // Portfolio cycle maturity: amount-weighted elapsed / term across holdings.
  let wElapsed = 0;
  let wTerm = 0;
  let wAmt = 0;
  activeInvestments.forEach((inv: any) => {
    const amt = Number(inv?.amount) || 0;
    const dur = Number(inv?.durationDays ?? inv?.duration) || 30;
    const start = inv?.startDate ? new Date(inv.startDate) : inv?.createdAt ? new Date(inv.createdAt) : null;
    const elapsed = start ? Math.max(0, (Date.now() - start.getTime()) / 86_400_000) : 0;
    wElapsed += elapsed * amt;
    wTerm += dur * amt;
    wAmt += amt;
  });
  const maturityElapsedDays = wAmt > 0 ? wElapsed / wAmt : 0;
  const maturityTotalDays = wAmt > 0 ? wTerm / wAmt : 30;
  const mobileBonds = bonds.map((b) => ({
    plan: b.plan,
    tier: b.tier,
    tierColor: b.tierColor,
    roiPct: b.roiPct,
    duration: b.duration,
    icon: b.icon,
  }));

  // Cycle maturity for a bond = elapsed time through the user's matching active
  // investment of that tier (by plan name or coupon ROI). 0 if none held.
  const bondProgress = (planKey: string, roiPct: number) => {
    const inv = activeInvestments.find((i: any) =>
      (i?.planName || '').toLowerCase() === planKey || Math.round(roiRateOf(i) * 100) === roiPct,
    );
    if (!inv) return 0;
    const durationDays = Number(inv?.durationDays ?? inv?.duration) || 30;
    const start = inv?.startDate ? new Date(inv.startDate) : inv?.createdAt ? new Date(inv.createdAt) : null;
    const daysElapsed = start ? Math.max(0, (Date.now() - start.getTime()) / 86_400_000) : 0;
    return Math.min(100, Math.max(0, Math.round((daysElapsed / durationDays) * 100)));
  };

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]" style={{ background: '#06090F' }}>
      {/* Ambient orbs (Stitch ref) — desktop only; the mobile view carries its own tinted backdrop */}
      <div className="luxe-ambient-orb hidden md:block" style={{ background: '#06B6D4', top: -200, right: -100 }} />
      <div className="luxe-ambient-orb hidden md:block" style={{ background: '#A855F7', bottom: -200, left: -100 }} />

      <Sidebar />

      {/* ── DESKTOP composition (md+) — unchanged ── */}
      <div className="hidden md:flex flex-1 min-w-0 flex-col relative">
        <header
          className="sticky top-0 z-30 h-16 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <FaSeedling style={{ color: '#D4AF7F' }} />
            <h1 className="text-lg font-black uppercase tracking-widest">Earn</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Page heading */}
          <div className="mb-8">
            <p className="text-[10px] uppercase font-extrabold tracking-[0.28em] mb-2" style={{ color: '#D4AF7F' }}>Active Capital · Kandella Earn</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Yield strategy desk</h2>
            <p className="text-sm mt-1" style={{ color: '#8F9BB3' }}>Institutional staking, bonds, and active portfolio yield.</p>
          </div>

          {/* ── Top 4 stat cards ────────────────────────────── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="luxe-glass p-6 rounded-xl border-l-4" style={{ borderLeftColor: '#D4AF7F' }}>
              <p className="text-[10px] uppercase font-bold tracking-[0.15em] mb-3" style={{ color: 'rgba(245,241,234,0.5)' }}>Total Active Capital</p>
              <p className="text-3xl font-black tracking-tight text-white">{fmtUsd(totalActive)}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full luxe-grad-cyan-blue" style={{ width: `${Math.min(100, (totalActive / (totalActive + available || 1)) * 100)}%` }} />
                </div>
                <span className="text-[11px] font-mono font-bold" style={{ color: '#06B6D4' }}>+{avgMonthlyPct.toFixed(1)}%</span>
              </div>
            </div>
            <div className="luxe-glass p-6 rounded-xl">
              <p className="text-[10px] uppercase font-bold tracking-[0.15em] mb-3" style={{ color: 'rgba(245,241,234,0.5)' }}>Projected Monthly Yield</p>
              <p className="text-2xl font-black tracking-tight text-white">{fmtUsd(monthlyYield)}</p>
              <p className="text-[11px] font-mono font-medium mt-4" style={{ color: '#D4AF7F' }}>EST. MONTHLY: {avgMonthlyPct.toFixed(1)}%</p>
            </div>
          </section>

          {/* ── Active Staking Tiers (from luxe Earn correction) ── */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: '#D4AF7F' }}>Active Staking Tiers</h3>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(212,175,127,0.2), transparent)' }} />
            </div>
            {/* Three across only when there is room: at 768–1279 px (with the
                sidebar out) a third column leaves the card header ~160 px for an
                icon, a name and the APY block, which is how the APY ended up on
                top of the asset name. Two columns from lg, three from xl. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {protocols.map((p) => (
                <div key={p.name} onClick={openAtrium} className="luxe-glass rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-500 cursor-pointer">
                  <div className="h-1.5 opacity-70" style={{ background: p.topBar }} />
                  <div className="p-6 sm:p-7">
                    <div className="flex justify-between items-start gap-4 mb-7">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-[#D4AF7F] transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F1EA' }}>
                          {p.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-lg font-bold tracking-tight">{p.name}</h4>
                          <p className="text-[10px] uppercase font-mono tracking-wider" style={{ color: 'rgba(245,241,234,0.5)' }}>{p.sub}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-2xl font-black whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #00FFA3 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.apy}</span>
                        <p className="text-[9px] uppercase font-mono whitespace-nowrap" style={{ color: 'rgba(245,241,234,0.5)' }}>{p.apyLabel}</p>
                      </div>
                    </div>
                    <div className="space-y-3.5 mb-7 text-[11px]">
                      <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }} className="uppercase tracking-wider">Lock-up</span><span className="font-mono text-white">{p.lockup}</span></div>
                      <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }} className="uppercase tracking-wider">Rewards</span><span className="font-mono text-white">{p.rewards}</span></div>
                      <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }} className="uppercase tracking-wider">Position</span><span className="font-mono font-bold" style={{ color: '#D4AF7F' }}>{p.position}</span></div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); openAtrium(); }}
                      className="w-full py-3.5 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] transition-all group-hover:-translate-y-0.5 luxe-glass hover:bg-white/10"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      Stake Asset
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Kandella Yield Bonds ────────────────────────────── */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <FaBolt size={14} style={{ color: '#D4AF7F' }} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: '#D4AF7F' }}>Kandella Yield Bonds</h3>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(212,175,127,0.2), transparent)' }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {bonds.map((b) => {
                const prog = bondProgress(b.plan, b.roiPct);
                return (
                <div
                  key={b.tier}
                  className={`luxe-glass${b.active ? '-border' : ''} rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all`}
                  style={b.active ? { border: '1px solid rgba(99,102,241,0.6)' } : undefined}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#D4AF7F' }}
                      >
                        {b.icon}
                      </div>
                      <h4 className="text-lg font-bold tracking-tight min-w-0">{b.tier}</h4>
                    </div>
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded flex-shrink-0 whitespace-nowrap"
                      style={b.active ? { background: 'rgba(99,102,241,0.18)', color: '#A1C9FF' } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(245,241,234,0.5)' }}
                    >
                      {b.tierColor}
                    </span>
                  </div>
                  <p className="text-xs mb-5" style={{ color: 'rgba(245,241,234,0.6)' }}>{b.sub}</p>
                  <div className="mb-5">
                    <div className="flex justify-between items-baseline gap-3 text-[10px] uppercase mb-2" style={{ color: 'rgba(245,241,234,0.5)' }}>
                      <span className="font-bold tracking-widest truncate">Cycle Maturity</span>
                      <span className="font-mono font-bold whitespace-nowrap flex-shrink-0" style={{ color: prog > 0 ? '#F5F1EA' : 'rgba(245,241,234,0.4)' }}>
                        {prog > 0 ? `${prog}% COMPLETE` : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full luxe-grad-cyan-blue" style={{ width: `${prog}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Coupon Rate</p>
                      <p className="text-lg font-black" style={{ color: '#00FFA3' }}>{b.coupon}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Duration</p>
                      <p className="text-lg font-black">{b.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/investmentPlans')}
                    className="w-full py-3 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 luxe-grad-cyan-blue text-white hover:brightness-110"
                  >
                    Purchase Bond <FaArrowRight size={10} />
                  </button>
                </div>
                );
              })}
            </div>
          </section>

          {/* ── Reward Distribution History (from data) ─────── */}
          <section className="luxe-glass rounded-2xl overflow-hidden mb-8">
            <div className="p-5 sm:p-6 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2.5">
                <FaLock style={{ color: '#D4AF7F' }} size={12} />
                <h3 className="text-sm font-black uppercase tracking-widest">Reward Distribution History</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: '#00FFA3', boxShadow: '0 0 8px #00FFA3' }} />
                <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#00FFA3' }}>REAL-TIME STREAM</span>
              </div>
            </div>
            {(!dashboard?.recentActivities || dashboard.recentActivities.length === 0) ? (
              <div className="p-10 text-center text-sm" style={{ color: '#8F9BB3' }}>
                No reward distributions yet. Subscribe to a tier above to start earning.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                      {['Timestamp', 'Asset', 'Type', 'Amount', 'USD Value', 'Status'].map((h, i) => (
                        <th key={h} className={`p-4 text-[10px] uppercase font-bold tracking-widest ${i > 2 ? 'text-right' : ''}`} style={{ color: 'rgba(212,175,127,0.7)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {dashboard.recentActivities.slice(0, 6).map((a: any, i: number) => {
                      const stamp = a?.timestamp || a?.createdAt;
                      const ts = stamp ? new Date(stamp).toLocaleString('en-US', { hour12: false }) : '—';
                      const amt = Number(a?.amount) || 0;
                      return (
                        <tr key={a?.id ?? i} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-xs" style={{ color: 'rgba(245,241,234,0.8)' }}>{ts}</td>
                          <td className="p-4 font-bold text-xs" style={{ color: '#F5F1EA' }}>{(a?.asset || 'USDT').toUpperCase()}</td>
                          <td className="p-4">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.18)', color: '#A1C9FF' }}>
                              {(a?.type || 'reward').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-right text-xs" style={{ color: 'rgba(245,241,234,0.85)' }}>{fmt(amt)}</td>
                          <td className="p-4 font-mono text-right text-xs font-bold" style={{ color: '#00FFA3' }}>+{fmtUsd(amt)}</td>
                          <td className="p-4 font-mono text-right text-[10px] uppercase font-bold tracking-widest" style={{ color: '#00FFA3' }}>COMPLETED</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ── MOBILE composition (< md) — mirrors the earn mobile mock ── */}
      <div
        className="md:hidden flex-1 min-w-0 flex flex-col relative"
        style={{
          background:
            'radial-gradient(920px 640px at 88% -14%, rgba(168,85,247,0.13), transparent 62%), radial-gradient(780px 560px at -12% 112%, rgba(6,182,212,0.10), transparent 60%), #06090F',
          minHeight: '100dvh',
        }}
      >
        <MobileEarn
          totalActive={totalActive}
          estAnnualYield={estAnnualYield}
          protocolsActive={protocolsActive}
          maturityElapsedDays={maturityElapsedDays}
          maturityTotalDays={maturityTotalDays}
          protocols={mobileProtocols}
          bonds={mobileBonds}
          activities={dashboard?.recentActivities || []}
          fmtCur={fmtCur}
        />
      </div>
    </div>
  );
}
