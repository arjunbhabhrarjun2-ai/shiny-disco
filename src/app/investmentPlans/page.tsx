'use client';

/**
 * Kandella Investment Plans — Stitch luxe port.
 *
 * There is no dedicated `investment_plans` folder in dashboard_stitch, so
 * this page applies the **Kandella Yield Bonds** tier-card design from
 * `dashboard_stitch/luxe_earn_staking_bonds` (the bonds section, lines
 * ~420-560) — the closest visual match to a 3-tier subscription page.
 *
 * Preserves the full logic from the previous implementation:
 *   • PLANS data (Tier 01/02/03 with apiName, ROI, min/max)
 *   • POST to /api/investmentPlans
 *   • useAuth + updateBalances on success
 *   • confirm / success / error modal flow
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import {
  FaSearch,
  FaPowerOff,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaShieldAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface PlanTier {
  name: string;
  tier: string;
  tierLabel: string;
  apiName: string;
  roi: string;
  roiNum: number;
  duration: string;
  min: number;
  max: number;
  featured?: boolean;
  description: string;
  highlights: string[];
  topBar: string;     // gradient for the top color bar
  accent: string;     // primary tint
  ctaGrad?: string;   // optional gradient CTA for the featured tier
}

const PLANS: PlanTier[] = [
  {
    name: 'Tier 01 · Core Yield Fund',
    tier: 'STARTER',
    tierLabel: 'Core Yield Fund',
    apiName: 'mining',
    roi: '30%',
    roiNum: 30,
    duration: '30 Days',
    min: 1000,
    max: 19999,
    description:
      'Jumpstart your portfolio with the Core Yield Fund. Designed for consistent monthly ROI — ideal for first-time allocators building their foundation.',
    highlights: ['Daily ROI compounded', 'Institutional custody', 'Monthly maturity'],
    topBar: 'linear-gradient(90deg, #06B6D4, #3B82F6)',
    accent: '#06B6D4',
  },
  {
    name: 'Tier 02 · Strategic Growth Fund',
    tier: 'POPULAR',
    tierLabel: 'Strategic Growth Fund',
    apiName: 'premium',
    roi: '40%',
    roiNum: 40,
    duration: '30 Days',
    min: 20000,
    max: 99999,
    featured: true,
    description:
      'The mid-tier allocation — built for ambitious investors scaling capital. Higher ROI, same 30-day horizon, with a discretionary strategy overlay.',
    highlights: ['Discretionary strategy layer', 'Quarterly rebalancing notes', 'Priority client services'],
    topBar: 'linear-gradient(90deg, #A855F7, #EC4899)',
    accent: '#A855F7',
    ctaGrad: 'linear-gradient(135deg, #8B5CF6 0%, #DB2777 100%)',
  },
  {
    name: 'Tier 03 · Institutional Capital Fund',
    tier: 'ELITE',
    tierLabel: 'Institutional Capital Fund',
    apiName: 'gold',
    roi: '55%',
    roiNum: 55,
    duration: '30 Days',
    min: 100000,
    max: 1000000,
    description:
      'The flagship allocation — maximum returns structured for seasoned investors, with dedicated relationship coverage and full reporting access.',
    highlights: ['Dedicated relationship desk', 'Full-spectrum reporting', 'Bespoke unwind windows'],
    topBar: 'linear-gradient(90deg, rgba(212,175,127,0.7), rgba(255,215,0,0.4))',
    accent: '#D4AF7F',
  },
];

export default function InvestmentPlansPage() {
  const { user, updateBalances, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  const projectedReturn = selectedPlan && amount
    ? Number(amount) + (Number(amount) * selectedPlan.roiNum) / 100
    : 0;

  /* ── Invest flow (logic preserved) ───────────────────────────── */
  async function handleInvest() {
    if (!user || !selectedPlan) return;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return setMessage('Please enter a valid amount.');
    if (numericAmount < selectedPlan.min || numericAmount > selectedPlan.max) {
      return setMessage(
        `Amount must be between $${fmtMoney(selectedPlan.min)} and $${fmtMoney(selectedPlan.max)}.`,
      );
    }
    try {
      setLoading(true);
      setMessage('');
      setShowConfirmModal(false);
      const res = await fetch('/api/investmentPlans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan.apiName, amount: numericAmount, user: user.email }),
      });
      const json: any = await res.json();
      if (json.error) {
        setShowErrorModal(true);
      } else {
        updateBalances({
          mainBalance: json.updatedBalances.mainBalance,
          investmentBalance: json.updatedBalances.investmentBalance,
        });
        setShowSuccessModal(true);
      }
      setSelectedPlan(null);
      setAmount('');
    } catch {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }

  function openConfirmModal() {
    if (!selectedPlan) return;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) return setMessage('Please enter a valid amount.');
    if (numericAmount < selectedPlan.min || numericAmount > selectedPlan.max) {
      return setMessage(
        `Amount must be between $${fmtMoney(selectedPlan.min)} and $${fmtMoney(selectedPlan.max)}.`,
      );
    }
    setMessage('');
    setShowConfirmModal(true);
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <p className="text-sm" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>REDIRECTING…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]" style={{ background: '#06090F' }}>
      <div className="luxe-ambient-orb" style={{ background: '#A855F7', top: -200, left: -100 }} />
      <div className="luxe-ambient-orb" style={{ background: '#06B6D4', bottom: -200, right: -100 }} />

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col relative">
        <header
          className="sticky top-0 z-30 h-14 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <FaSearch size={11} style={{ color: 'rgba(212,175,127,0.6)' }} />
            <input type="text" placeholder="SEARCH PLANS…" className="bg-transparent border-none text-[10px] font-bold tracking-widest focus:outline-none w-40 lg:w-56" style={{ color: '#F5F1EA' }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-6xl mx-auto">
            {/* Heading */}
            <div className="mb-10">
              <p className="text-[10px] uppercase font-extrabold tracking-[0.28em] mb-2" style={{ color: '#D4AF7F' }}>
                Kandella Yield · Investment Plans
              </p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Choose your capital tier</h1>
              <p className="text-sm mt-1" style={{ color: '#8F9BB3' }}>
                Three tiers · One-month maturity · Interest paid at the end of every cycle.
              </p>
            </div>

            {/* Inline message */}
            {message && (
              <div
                className="mb-6 p-3 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(255,170,0,0.10)', border: '1px solid rgba(255,170,0,0.32)', color: '#FFAA00' }}
              >
                {message}
              </div>
            )}

            {/* ── Tier cards ────────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {PLANS.map((p) => {
                const isSelected = selectedPlan?.apiName === p.apiName;
                return (
                  <div
                    key={p.apiName}
                    className={`luxe-glass${p.featured || isSelected ? '-border' : ''} rounded-2xl overflow-hidden group transition-all duration-300 ${isSelected ? 'scale-[1.01]' : ''}`}
                    style={isSelected ? { border: `1px solid ${p.accent}66`, boxShadow: `0 0 32px -8px ${p.accent}55` } : undefined}
                  >
                    {/* Top color bar */}
                    <div className="h-1.5 opacity-80" style={{ background: p.topBar }} />

                    <div className="p-6 sm:p-7">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold tracking-tight">{p.tierLabel}</h3>
                        <span
                          className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded"
                          style={
                            p.featured
                              ? { background: `${p.accent}1c`, color: p.accent, border: `1px solid ${p.accent}44` }
                              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(245,241,234,0.55)' }
                          }
                        >
                          {p.tier}
                        </span>
                      </div>
                      <p className="text-xs mb-5 leading-relaxed" style={{ color: 'rgba(245,241,234,0.6)' }}>
                        {p.description}
                      </p>

                      {/* ROI / Duration */}
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>ROI</p>
                          <p className="text-2xl font-black" style={{ color: p.accent }}>{p.roi}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Duration</p>
                          <p className="text-2xl font-black">{p.duration}</p>
                        </div>
                      </div>

                      {/* Range */}
                      <div className="mb-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[9px] uppercase font-bold tracking-widest mb-2" style={{ color: 'rgba(245,241,234,0.5)' }}>Capital Range</p>
                        <p className="font-mono text-sm font-bold">${fmtMoney(p.min)} – ${fmtMoney(p.max)}</p>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-2 mb-6">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-[11px]" style={{ color: 'rgba(245,241,234,0.8)' }}>
                            <FaCheckCircle size={10} style={{ color: p.accent, marginTop: 3 }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Invest CTA */}
                      <button
                        onClick={() => { setSelectedPlan(p); setAmount(''); setMessage(''); }}
                        className={`w-full py-3 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${p.ctaGrad ? 'text-white' : ''}`}
                        style={p.ctaGrad
                          ? { background: p.ctaGrad, boxShadow: `0 8px 24px -10px ${p.accent}99` }
                          : { background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.accent}55`, color: p.accent }}
                      >
                        {isSelected ? 'Selected' : 'Invest'} <FaArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* ── Amount form (appears once a plan is selected) ─── */}
            {selectedPlan && (
              <section className="luxe-glass-border rounded-2xl p-6 sm:p-8 max-w-2xl">
                <div className="flex items-center gap-2.5 mb-5">
                  <FaShieldAlt style={{ color: selectedPlan.accent }} size={13} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Subscribe to {selectedPlan.tierLabel}</h3>
                </div>
                <p className="text-xs mb-5" style={{ color: '#8F9BB3' }}>
                  Enter an amount between <span className="font-mono font-bold" style={{ color: '#F5F1EA' }}>${fmtMoney(selectedPlan.min)}</span> and{' '}
                  <span className="font-mono font-bold" style={{ color: '#F5F1EA' }}>${fmtMoney(selectedPlan.max)}</span>. Returns are paid at the
                  end of the {selectedPlan.duration.toLowerCase()} cycle.
                </p>

                <label className="block text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'rgba(245,241,234,0.5)' }}>
                  Investment Amount (USD)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/40 border rounded-lg px-4 py-3 text-base font-mono mb-4"
                  style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                />

                {amount && Number(amount) > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Projected Return</p>
                      <p className="font-mono font-black text-lg" style={{ color: selectedPlan.accent }}>${fmtMoney(projectedReturn)}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>Profit at Maturity</p>
                      <p className="font-mono font-black text-lg" style={{ color: '#00FFA3' }}>+${fmtMoney(projectedReturn - Number(amount))}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setSelectedPlan(null); setAmount(''); setMessage(''); }}
                    className="flex-1 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#8F9BB3' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={openConfirmModal}
                    disabled={loading || !amount}
                    className="flex-[2] py-3 luxe-grad-purple-pink luxe-neumorphic text-white rounded-lg text-[11px] font-black uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <AiOutlineLoading3Quarters className="animate-spin" size={11} /> : null}
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* ── Info strip below ─────────────────────────────── */}
            <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <FaShieldAlt />, title: 'Qualified Custody', body: 'Funds held by a qualified custodian with 1:1 reserve backing and proof-of-reserves attestation.' },
                { icon: <FaCheckCircle />, title: 'Contractual ROI', body: 'Returns are fixed at issuance — no hidden fees, no variable spreads.' },
                { icon: <FaInfoCircle />, title: 'One-Month Cycles', body: 'Every bond settles in a clean 30-day window. Interest plus capital returned at maturity.' },
              ].map((c) => (
                <div key={c.title} className="luxe-glass rounded-xl p-5">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span style={{ color: '#D4AF7F' }}>{c.icon}</span>
                    <h4 className="text-xs font-black uppercase tracking-widest">{c.title}</h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#8F9BB3' }}>{c.body}</p>
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>

      {/* ── Confirm modal ───────────────────────────────────────── */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="luxe-glass-border rounded-2xl p-7 max-w-md w-full">
            <h3 className="text-lg font-black mb-2">Confirm Subscription</h3>
            <p className="text-sm mb-5" style={{ color: '#8F9BB3' }}>You are about to subscribe to <span className="font-bold" style={{ color: '#F5F1EA' }}>{selectedPlan.tierLabel}</span> for <span className="font-mono font-bold" style={{ color: selectedPlan.accent }}>${fmtMoney(Number(amount))}</span>. This will lock your capital for {selectedPlan.duration.toLowerCase()}.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[9px] uppercase font-bold tracking-widest" style={{ color: 'rgba(245,241,234,0.5)' }}>Expected Return</p>
                <p className="font-mono font-black text-base" style={{ color: selectedPlan.accent }}>${fmtMoney(projectedReturn)}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[9px] uppercase font-bold tracking-widest" style={{ color: 'rgba(245,241,234,0.5)' }}>Profit</p>
                <p className="font-mono font-black text-base" style={{ color: '#00FFA3' }}>+${fmtMoney(projectedReturn - Number(amount))}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#8F9BB3' }}>
                Cancel
              </button>
              <button onClick={handleInvest} disabled={loading} className="flex-[2] py-3 luxe-grad-purple-pink luxe-neumorphic text-white rounded-lg text-[11px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <AiOutlineLoading3Quarters className="animate-spin" size={11} />}
                {loading ? 'Processing…' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ───────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="luxe-glass-border rounded-2xl p-7 max-w-md w-full text-center">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(0,255,163,0.10)', border: '1px solid rgba(0,255,163,0.32)' }}>
              <FaCheckCircle size={24} style={{ color: '#00FFA3' }} />
            </div>
            <h3 className="text-lg font-black mb-2">Investment Active</h3>
            <p className="text-sm mb-6" style={{ color: '#8F9BB3' }}>Your capital has been deployed. Returns will be reflected in your portfolio at maturity.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowSuccessModal(false); router.push('/portfolio'); }} className="flex-1 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#8F9BB3' }}>
                View Portfolio
              </button>
              <button onClick={() => setShowSuccessModal(false)} className="flex-1 py-3 luxe-grad-cyan-blue text-white rounded-lg text-[11px] font-black uppercase tracking-widest active:scale-95">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Error modal ─────────────────────────────────────────── */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="luxe-glass-border rounded-2xl p-7 max-w-md w-full text-center" style={{ borderColor: 'rgba(255,61,113,0.4)' }}>
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,61,113,0.10)', border: '1px solid rgba(255,61,113,0.32)' }}>
              <FaTimesCircle size={24} style={{ color: '#FF3D71' }} />
            </div>
            <h3 className="text-lg font-black mb-2">Subscription Failed</h3>
            <p className="text-sm mb-6" style={{ color: '#8F9BB3' }}>We couldn't process your subscription. This is usually due to an insufficient available balance.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowErrorModal(false)} className="flex-1 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#8F9BB3' }}>
                Close
              </button>
              <button onClick={() => { setShowErrorModal(false); router.push('/addFunds'); }} className="flex-1 py-3 luxe-grad-purple-pink text-white rounded-lg text-[11px] font-black uppercase tracking-widest active:scale-95">
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
