'use client';

/**
 * Kandella Wallet — Stitch luxe port (dashboard_stitch/luxe_wallet_balances_bonds).
 * Preserves: useAuth, useAssets, Sidebar, auth-redirect.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useAssets, Investment } from '@/lib/hooks/useAssets';
import { useHoldings } from '@/lib/hooks/useHoldings';
import { useTickers } from '@/lib/hooks/useTickers';
import { MARKETS } from '@/lib/market/symbols';
import { getPlanByName } from '@/lib/config/plans';
import CoinIcon from '@/components/CoinIcon';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import SwapWidget from '@/components/wallet/SwapWidget';
import { useCurrency } from '@/components/context/CurrencyContext';
import {
  FaBitcoin,
  FaEthereum,
  FaLandmark,
  FaExclamationTriangle,
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
  FaCopy,
  FaPlus,
  FaPowerOff,
} from 'react-icons/fa';
import { SiTether, SiSolana } from 'react-icons/si';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => `$${fmt(n)}`;

const RATE: Record<string, { price: number; icon: React.ReactNode; name: string; tint: string }> = {
  BTC: { price: 64231.5, icon: <FaBitcoin />, name: 'Bitcoin', tint: '#F7931A' },
  ETH: { price: 3452.12, icon: <FaEthereum />, name: 'Ethereum', tint: '#627EEA' },
  USDT: { price: 1, icon: <SiTether />, name: 'Tether', tint: '#26A17B' },
  SOL: { price: 142.88, icon: <SiSolana />, name: 'Solana', tint: '#9945FF' },
};

export default function WalletPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { assets, isLoading, isError, mutate } = useAssets(user?.email || null) as any;
  const { quote, holdings } = useHoldings();
  const { tickers } = useTickers();
  const router = useRouter();
  const { format: fmtCur } = useCurrency(); // selected display currency

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

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
        <p className="text-[11px] uppercase" style={{ color: '#8F9BB3', letterSpacing: '0.28em' }}>LOADING WALLET</p>
      </div>
    );
  }
  if (isError || !assets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <FaExclamationTriangle size={28} style={{ color: '#FF3D71' }} />
        <h2 className="text-lg font-bold">Failed to load wallet</h2>
        <button onClick={() => mutate?.()} className="px-6 py-2.5 rounded-lg text-[11px] uppercase text-white luxe-grad-purple-pink luxe-neumorphic" style={{ letterSpacing: '0.2em' }}>Retry</button>
      </div>
    );
  }

  const summary = assets.summary || {};
  const allInv: Investment[] = assets.allInvestments || [];
  // Status is stored capitalized ("Active") by the API — compare case-insensitively
  // so Purchased Bonds actually render (previously always empty).
  const activeInv = allInv.filter((i) => (i.status || '').toLowerCase() === 'active');

  const availableUsd = (summary.mainBalance || 0) + (summary.interestBalance || 0);
  const investedUsd = summary.totalInvested || 0;
  const netWorth = availableUsd + investedUsd;
  const custodyPct = netWorth > 0 ? (availableUsd / netWorth) * 100 : 0;
  const selfCustodyPct = 100 - custodyPct;
  // roi is stored as a decimal fraction (0.40 = 40%); normalize to a percent for display.
  const avgApy = activeInv.length > 0
    ? activeInv.reduce((s, i) => { const r = i.roi || 0; return s + (r > 1.5 ? r : r * 100); }, 0) / activeInv.length
    : 0;
  const totalYield = summary.totalRoiEarned || summary.totalEarned || 0;

  // ── Custody assets: every asset the user actually holds (any of the 65+),
  // priced live from tickers (reference price as fallback). USDT cash always shown.
  const priceOf = (base: string): number => {
    const b = base.toUpperCase();
    if (b === 'USDT' || b === 'USD') return 1;
    const t = tickers.find((x) => x.base === b && (x.quote === 'USDT' || x.quote === 'USD'));
    if (t?.price) return t.price;
    return MARKETS.find((x) => x.base === b)?.reference ?? 0;
  };
  const nameOf = (base: string): string => {
    const b = base.toUpperCase();
    if (b === 'USDT') return 'Tether';
    return MARKETS.find((x) => x.base === b)?.name || b;
  };
  const assetRows = [
    { sym: 'USDT', available: quote?.amount ?? availableUsd, inStake: 0 },
    ...holdings
      .filter((h) => h.asset.toUpperCase() !== 'USDT' && h.amount > 0)
      .map((h) => ({ sym: h.asset.toUpperCase(), available: h.amount, inStake: 0 })),
  ]
    .map((r) => ({ ...r, price: priceOf(r.sym), name: nameOf(r.sym), value: r.available * priceOf(r.sym) }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]" style={{ background: '#06090F' }}>
      <div className="luxe-ambient-orb" style={{ background: '#A855F7', top: -200, left: -100 }} />
      <div className="luxe-ambient-orb" style={{ background: '#06B6D4', bottom: -200, right: -100 }} />

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col relative">
        <header
          className="sticky top-0 z-30 h-16 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <FaWallet style={{ color: '#D4AF7F' }} />
            <h1 className="text-lg font-black uppercase tracking-widest">Wallet</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-[0.15em]" style={{ color: '#D4AF7F' }}>Net Worth</p>
              <div className="flex items-baseline gap-2"><h2 className="text-2xl sm:text-3xl font-black">{fmtCur(netWorth)}</h2><span className="text-xs font-bold" style={{ color: '#06B6D4' }}>+{avgApy.toFixed(2)}%</span></div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full luxe-grad-cyan-blue" style={{ width: `${Math.min(100, custodyPct)}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-[0.15em]" style={{ color: 'rgba(245,241,234,0.5)' }}>Custody Balance</p>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'rgba(245,241,234,0.9)' }}>{fmtCur(availableUsd)}</h2>
              <p className="text-[10px] font-bold" style={{ color: 'rgba(212,175,127,0.7)' }}>{custodyPct.toFixed(1)}% ALLOCATION</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-[0.15em]" style={{ color: 'rgba(245,241,234,0.5)' }}>Invested</p>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'rgba(245,241,234,0.9)' }}>{fmtCur(investedUsd)}</h2>
              <p className="text-[10px] font-bold" style={{ color: 'rgba(212,175,127,0.7)' }}>{selfCustodyPct.toFixed(1)}% ALLOCATION</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-[0.15em]" style={{ color: 'rgba(245,241,234,0.5)' }}>Total Earn PnL</p>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#06B6D4' }}>+{fmtCur(totalYield)}</h2>
              <p className="text-[10px] font-bold" style={{ color: 'rgba(6,182,212,0.7)' }}>{avgApy.toFixed(1)}% AVG. APY</p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="luxe-glass-border rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2.5"><FaLandmark style={{ color: '#D4AF7F' }} />Custody <span className="text-sm font-normal" style={{ color: 'rgba(245,241,234,0.5)' }}>(Trading)</span></h3>
                  <div className="flex gap-2">
                    <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink text-white text-[10px] font-black px-3 sm:px-4 py-1.5 rounded-lg uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">Deposit</button>
                    <button onClick={() => router.push('/withdrawal')} className="bg-transparent text-[10px] font-black px-3 sm:px-4 py-1.5 rounded-lg uppercase tracking-widest hover:bg-[#D4AF7F]/10 active:scale-95 transition-all" style={{ border: '1px solid rgba(212,175,127,0.3)', color: '#D4AF7F' }}>Withdraw</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[520px]">
                    <thead style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <tr>{['Asset', 'Available', 'In-Stake', 'Equity (USD)'].map((h, i) => (<th key={h} className={`p-4 text-[10px] uppercase font-bold tracking-widest ${i > 0 ? 'text-right' : ''}`} style={{ color: 'rgba(212,175,127,0.7)' }}>{h}</th>))}</tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {assetRows.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-sm" style={{ color: '#8F9BB3' }}>No custody balances yet.</td></tr>
                      )}
                      {assetRows.map((row) => {
                        const tint = RATE[row.sym]?.tint || '#D4AF7F';
                        return (
                          <tr key={row.sym} className="hover:bg-[#D4AF7F]/5 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <CoinIcon symbol={row.sym} size={36} tint={tint} />
                                <div><p className="font-bold text-sm">{row.sym}</p><p className="text-[10px] uppercase" style={{ color: 'rgba(245,241,234,0.4)' }}>{row.name}</p></div>
                              </div>
                            </td>
                            <td className="p-4 text-right font-mono text-sm" style={{ color: 'rgba(245,241,234,0.85)' }}>{fmt(row.available, row.sym === 'USDT' ? 2 : 6)}</td>
                            <td className="p-4 text-right font-mono text-sm" style={{ color: row.inStake > 0 ? '#06B6D4' : 'rgba(245,241,234,0.4)' }}>{fmt(row.inStake, row.sym === 'USDT' ? 2 : 6)}</td>
                            <td className="p-4 text-right font-mono text-sm font-black" style={{ color: '#D4AF7F' }}>{fmtUsd(row.value)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="luxe-glass rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <FaLandmark style={{ color: '#D4AF7F' }} />
                  <h3 className="text-base sm:text-lg font-bold">Purchased Bonds ({activeInv.length})</h3>
                </div>
                {activeInv.length === 0 ? (
                  <div className="p-10 text-center text-sm" style={{ color: '#8F9BB3' }}>
                    No active bonds. Visit <button onClick={() => router.push('/stake')} className="font-semibold" style={{ color: '#D4AF7F' }}>Earn</button> to subscribe to a tier.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[520px]">
                      <thead style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <tr>{['Bond', 'Principal', 'ROI', 'Maturity'].map((h, i) => (<th key={h} className={`p-4 text-[10px] uppercase font-bold tracking-widest ${i > 0 ? 'text-right' : ''}`} style={{ color: 'rgba(212,175,127,0.7)' }}>{h}</th>))}</tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        {activeInv.slice(0, 6).map((inv) => {
                          const plan = getPlanByName(inv.planName);
                          // roi stored as fraction (0.40 = 40%); normalize defensively.
                          const roiRate = inv.roi > 1.5 ? inv.roi / 100 : inv.roi;
                          const expected = inv.amount * (1 + roiRate); // principal + total ROI at maturity
                          const bondName = plan?.displayName || inv.planName;
                          const term = plan?.duration || `${inv.durationDays || inv.duration} days`;
                          return (
                            <tr key={inv.id} className="hover:bg-[#D4AF7F]/5 transition-colors">
                              <td className="p-4"><p className="font-bold text-sm">{bondName}</p><p className="text-[10px] uppercase font-medium" style={{ color: 'rgba(212,175,127,0.6)' }}>{term}</p></td>
                              <td className="p-4 text-right font-mono text-sm" style={{ color: 'rgba(245,241,234,0.85)' }}>{fmtUsd(inv.amount)}</td>
                              <td className="p-4 text-right font-mono text-sm font-black" style={{ color: '#06B6D4' }}>{(roiRate * 100).toFixed(0)}%</td>
                              <td className="p-4 text-right font-mono text-sm font-black" style={{ color: '#D4AF7F' }}>{fmtUsd(expected)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="luxe-glass-border rounded-2xl p-5 sm:p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center luxe-grad-cyan-blue text-white shadow-lg"><FaWallet size={20} /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1" style={{ color: '#D4AF7F' }}>Active Connection</p>
                      <p className="font-bold text-sm">Kandella Wallet</p>
                      <p className="text-[10px] font-mono" style={{ color: 'rgba(245,241,234,0.5)' }}>0x82…f92a</p>
                    </div>
                  </div>
                  <button title="Copy address" className="p-2 rounded hover:bg-white/5 transition-colors" style={{ color: '#D4AF7F' }}><FaCopy size={12} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Ref. Balance</p>
                    <p className="text-lg font-black">{fmtUsd(availableUsd)}</p>
                    <p className="text-[10px] font-bold" style={{ color: '#06B6D4' }}>+{avgApy.toFixed(2)}% 24h</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Open Positions</p>
                    <p className="text-lg font-black">{activeInv.length}</p>
                    <p className="text-[10px] font-bold" style={{ color: '#D4AF7F' }}>SUBMITTED</p>
                  </div>
                </div>
              </div>

              <SwapWidget onSwapped={() => mutate?.()} />

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => router.push('/addFunds')} className="luxe-glass p-4 rounded-xl text-left flex items-center gap-3 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.18)', color: '#06B6D4' }}><FaArrowDown /></div>
                  <div><p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'rgba(245,241,234,0.5)' }}>Add</p><p className="text-sm font-bold">Deposit Funds</p></div>
                </button>
                <button onClick={() => router.push('/withdrawal')} className="luxe-glass p-4 rounded-xl text-left flex items-center gap-3 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(219,39,119,0.18)', color: '#DB2777' }}><FaArrowUp /></div>
                  <div><p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'rgba(245,241,234,0.5)' }}>Send</p><p className="text-sm font-bold">Withdraw</p></div>
                </button>
                <button onClick={() => router.push('/transaction')} className="luxe-glass p-4 rounded-xl text-left flex items-center gap-3 hover:bg-white/5 transition-colors col-span-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,127,0.14)', color: '#D4AF7F' }}><FaPlus /></div>
                  <div><p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'rgba(245,241,234,0.5)' }}>History</p><p className="text-sm font-bold">View All Transactions</p></div>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
