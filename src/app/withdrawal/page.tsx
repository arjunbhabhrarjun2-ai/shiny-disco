'use client';

/**
 * Kandella Withdraw Funds — Stitch luxe port (dashboard_stitch/luxe_wallet_withdraw_funds).
 *
 * Preserves the existing withdrawal logic:
 *   • useAuth + userId resolution (localStorage → /api/user/simple)
 *   • amount / currency / address form state with formatWithCommas
 *   • POST /api/withdrawal → redirect to /withdrawalHistory on success
 *   • Alert toast on success / error / warning
 *
 * Visual layer is the luxe 4-step layout: Select Asset · Destination
 * Address · Select Network · Amount + a right-rail Transaction Summary
 * with 2FA input · Confirm Withdrawal · Security Checklist.
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import { formatWithCommas, unformat } from '@/lib/utils/formatAmount';
import { authFetch } from '@/lib/clientAuth';
import {
  FaSearch,
  FaPowerOff,
  FaChevronRight,
  FaBitcoin,
  FaEthereum,
  FaShieldAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaTimes,
} from 'react-icons/fa';
import { SiTether, SiSolana, SiRipple } from 'react-icons/si';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useHoldings } from '@/lib/hooks/useHoldings';

/* Asset catalogue — display layer only; the actual currency string is
   what gets POSTed in the existing handleWithdraw payload. */
const ASSETS: Record<string, { name: string; icon: React.ReactNode; tint: string; min: number; spotUsd: number }> = {
  BTC: { name: 'Bitcoin', icon: <FaBitcoin />, tint: '#F7931A', min: 0.001, spotUsd: 64935 },
  ETH: { name: 'Ethereum', icon: <FaEthereum />, tint: '#627EEA', min: 0.01, spotUsd: 3452 },
  USDT: { name: 'Tether (USDT)', icon: <SiTether />, tint: '#26A17B', min: 10, spotUsd: 1 },
  SOL: { name: 'Solana', icon: <SiSolana />, tint: '#9945FF', min: 0.5, spotUsd: 143 },
  XRP: { name: 'Ripple', icon: <SiRipple />, tint: '#7DAEDB', min: 10, spotUsd: 0.62 },
};

const NETWORKS: Record<string, { id: string; name: string; sub: string; fee: number; eta: string; disabled?: boolean; warning?: string }[]> = {
  BTC: [
    { id: 'bitcoin', name: 'Bitcoin', sub: 'Native Network', fee: 0.0005, eta: '~60m' },
    { id: 'lightning', name: 'Lightning', sub: 'Fast Layer 2', fee: 0.00001, eta: '<1m' },
    { id: 'erc20', name: 'ERC-20 (WBTC)', sub: 'Ethereum Network', fee: 0.0012, eta: '—', disabled: true, warning: 'High Cong.' },
  ],
  ETH: [
    { id: 'eth', name: 'Ethereum', sub: 'Native Network', fee: 0.0015, eta: '~3m' },
    { id: 'arbitrum', name: 'Arbitrum', sub: 'Layer 2', fee: 0.0001, eta: '<1m' },
    { id: 'base', name: 'Base', sub: 'Layer 2', fee: 0.0001, eta: '<1m' },
  ],
  USDT: [
    { id: 'erc20', name: 'ERC-20', sub: 'Ethereum Network', fee: 5, eta: '~3m' },
    { id: 'bep20', name: 'BEP-20', sub: 'BNB Smart Chain', fee: 0.5, eta: '<1m' },
    { id: 'trc20', name: 'TRC-20', sub: 'Tron Network', fee: 1, eta: '~2m' },
  ],
  SOL: [{ id: 'sol', name: 'Solana', sub: 'Native Network', fee: 0.00001, eta: '<1m' }],
  XRP: [{ id: 'xrp', name: 'XRP Ledger', sub: 'Native Network', fee: 0.00001, eta: '<1m' }],
};

export default function WithdrawalPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  /* ── Original state preserved ──────────────────────────────── */
  const [userId, setUserId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('BTC');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  /* ── New visual-only state ─────────────────────────────────── */
  const [network, setNetwork] = useState<string>('bitcoin');

  /* ── Holdings: only let users withdraw assets they actually own ── */
  const { quote: usdtBal, holdings } = useHoldings();
  const heldAssets = [
    ...(usdtBal.amount > 0 ? [{ asset: 'USDT', amount: usdtBal.amount }] : []),
    ...holdings.filter((h) => h.amount > 0),
  ];
  const availableBalance =
    currency === 'USDT' ? usdtBal.amount : holdings.find((h) => h.asset === currency)?.amount ?? 0;

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  /* Reset network when currency changes */
  useEffect(() => {
    const first = NETWORKS[currency]?.find((n) => !n.disabled);
    if (first) setNetwork(first.id);
  }, [currency]);

  /* userId resolution — same flow as before */
  useEffect(() => {
    const fetchUserId = async () => {
      let userEmail = user?.email;
      if (!userEmail) {
        try {
          const storedUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
          if (storedUser) userEmail = JSON.parse(storedUser).email;
        } catch {}
      }
      if (!userEmail) return;
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.id) {
            setUserId(parsedUser.id);
            return;
          }
        }
        const res = await fetch(`/api/user/simple?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) {
          if (user?.id) setUserId(user.id);
          return;
        }
        const data = await res.json();
        if (data.id) {
          setUserId(data.id);
          if (storedUser) {
            const ud = JSON.parse(storedUser);
            if (!ud.id) {
              ud.id = data.id;
              localStorage.setItem('currentUser', JSON.stringify(ud));
            }
          }
        }
      } catch {
        if (user?.id) setUserId(user.id);
      }
    };
    if (user || localStorage.getItem('currentUser') || localStorage.getItem('user')) {
      fetchUserId();
    }
  }, [user]);

  const showAlert = (type: 'success' | 'error' | 'warning', message: string) => setAlert({ type, message });

  async function handleWithdraw() {
    if (!amount || !address) return showAlert('warning', 'Please fill in all fields before submitting.');
    if (!userId) return showAlert('error', 'User not found. Please refresh and try again.');

    // userId is no longer sent — the server derives identity from the auth token.
    const numericAmount = parseFloat(unformat(amount));
    // Block withdrawing more than you hold (server re-validates this too).
    if (numericAmount > availableBalance) {
      return showAlert('error', `Insufficient ${currency}. You hold ${availableBalance.toLocaleString('en-US', { maximumFractionDigits: 8 })} ${currency}.`);
    }

    const payload = { amount: numericAmount, currency, address };

    setLoading(true);
    try {
      const res = await authFetch('/api/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: { success?: boolean; message?: string } = await res.json();
      if (res.ok && data.success) {
        showAlert('success', 'Withdrawal submitted successfully.');
        setTimeout(() => { window.location.href = '/withdrawalHistory'; }, 2000);
      } else {
        showAlert('error', data.message || "We couldn't process your withdrawal. Please check your balance and try again.");
      }
    } catch {
      showAlert('error', 'Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  /* Derived values for the summary panel */
  const meta = ASSETS[currency];
  const activeNets = NETWORKS[currency] || [];
  const selectedNet = activeNets.find((n) => n.id === network) || activeNets[0];
  const gross = parseFloat(unformat(amount)) || 0;
  const fee = selectedNet?.fee || 0;
  const totalReceive = Math.max(0, gross - fee);
  const totalReceiveUsd = totalReceive * (meta?.spotUsd || 0);

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
        {/* Header */}
        <header
          className="sticky top-0 z-30 h-14 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <FaSearch size={11} style={{ color: 'rgba(212,175,127,0.6)' }} />
            <input type="text" placeholder="Search markets, assets…" className="bg-transparent border-none text-[11px] focus:outline-none w-40 lg:w-56" style={{ color: '#F5F1EA' }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Heading row */}
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Withdraw Funds</h1>
                <p className="text-sm mt-1" style={{ color: '#8F9BB3' }}>
                  Securely transfer assets to your external whitelisted wallets.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.25)' }}>
                <FaShieldAlt size={11} style={{ color: '#00C853' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#00C853' }}>Safe Custody Active</span>
              </div>
            </div>

            {/* Alert toast */}
            {alert && (
              <div
                className="mb-6 p-3.5 rounded-lg text-xs font-medium flex items-center justify-between gap-3"
                style={{
                  background: alert.type === 'error' ? 'rgba(255,61,113,0.10)' : alert.type === 'warning' ? 'rgba(255,170,0,0.10)' : 'rgba(0,200,83,0.10)',
                  border: `1px solid ${alert.type === 'error' ? 'rgba(255,61,113,0.32)' : alert.type === 'warning' ? 'rgba(255,170,0,0.32)' : 'rgba(0,200,83,0.32)'}`,
                  color: alert.type === 'error' ? '#FF3D71' : alert.type === 'warning' ? '#FFAA00' : '#00C853',
                }}
              >
                <div className="flex items-center gap-2">
                  {alert.type === 'success' ? <FaCheckCircle size={12} /> : <FaExclamationTriangle size={12} />}
                  <span>{alert.message}</span>
                </div>
                <button onClick={() => setAlert(null)} className="opacity-60 hover:opacity-100"><FaTimes size={11} /></button>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* ── Left: Form (col-span-2) ────────────────────── */}
              <div className="xl:col-span-2 luxe-glass-border rounded-2xl p-5 sm:p-8 space-y-8">
                {/* 01. Select Asset */}
                <div>
                  <label className="text-[9px] uppercase font-black tracking-[0.3em] block mb-3" style={{ color: '#D4AF7F' }}>
                    01. Select Asset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {Object.entries(ASSETS).map(([sym, m]) => {
                      const active = currency === sym;
                      return (
                        <button
                          key={sym}
                          onClick={() => setCurrency(sym)}
                          className="p-3 rounded-lg flex items-center gap-2.5 transition-all"
                          style={
                            active
                              ? { background: `${m.tint}15`, border: `1px solid ${m.tint}55`, color: '#F5F1EA' }
                              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,241,234,0.7)' }
                          }
                        >
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ background: `${m.tint}1f`, color: m.tint }}>
                            {m.icon}
                          </span>
                          <div className="text-left">
                            <p className="font-bold text-xs">{sym}</p>
                            <p className="text-[9px] uppercase" style={{ color: 'rgba(245,241,234,0.5)' }}>{m.name.split(' ')[0]}</p>
                          </div>
                          {active && <FaCheckCircle size={11} className="ml-auto" style={{ color: m.tint }} />}
                        </button>
                      );
                    })}
                  </div>
                  {/* Withdraw any asset you hold (synced with your wallet) */}
                  <div className="mt-3">
                    <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>
                      Or pick a held asset
                    </p>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-black/40 border rounded-lg px-3 py-2 text-xs"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#F5F1EA' }}
                    >
                      {heldAssets.length === 0 && <option value="">No withdrawable balances</option>}
                      {heldAssets.map((h) => (
                        <option key={h.asset} value={h.asset} style={{ background: '#0B0E11' }}>
                          {h.asset} — {h.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 flex justify-between text-[11px]">
                    <span style={{ color: '#8F9BB3' }}>Available balance</span>
                    <span className="font-mono font-bold">
                      {availableBalance.toLocaleString('en-US', { maximumFractionDigits: 8 })} {currency}
                    </span>
                  </div>
                </div>

                {/* 02. Destination Address */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-[9px] uppercase font-black tracking-[0.3em]" style={{ color: '#D4AF7F' }}>
                      02. Destination Address
                    </label>
                    <button type="button" className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#06B6D4' }}>
                      Select from Address Book
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={`Enter ${currency} withdrawal address`}
                      className="w-full bg-black/40 border rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none transition-colors"
                      style={{ borderColor: address ? 'rgba(0,229,255,0.32)' : 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                    />
                    {address && (
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1"
                        style={{ background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4' }}
                      >
                        <FaShieldAlt size={9} /> Whitelisted
                      </span>
                    )}
                  </div>
                </div>

                {/* 03. Select Network */}
                <div>
                  <label className="text-[9px] uppercase font-black tracking-[0.3em] block mb-3" style={{ color: '#D4AF7F' }}>
                    03. Select Network
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeNets.map((n) => {
                      const active = network === n.id;
                      return (
                        <button
                          key={n.id}
                          disabled={n.disabled}
                          onClick={() => !n.disabled && setNetwork(n.id)}
                          className="p-4 rounded-lg text-left relative transition-all"
                          style={{
                            background: active ? 'rgba(212,175,127,0.06)' : n.disabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.04)',
                            border: active ? '2px solid rgba(212,175,127,0.5)' : '1px solid rgba(255,255,255,0.06)',
                            opacity: n.disabled ? 0.4 : 1,
                            cursor: n.disabled ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <p className="text-sm font-bold mb-0.5">{n.name}</p>
                          <p className="text-[10px] uppercase font-bold tracking-tighter mb-3" style={{ color: '#8F9BB3' }}>{n.sub}</p>
                          <div className="flex items-center justify-between text-[10px]" style={{ color: '#8F9BB3' }}>
                            <span>Fee: {n.fee}</span>
                            <span className="font-mono" style={{ color: n.warning ? '#FF3D71' : '#8F9BB3' }}>{n.warning || n.eta}</span>
                          </div>
                          {active && (
                            <span className="absolute top-2 right-2"><FaCheckCircle size={11} style={{ color: '#D4AF7F' }} /></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 04. Withdrawal Amount */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-[9px] uppercase font-black tracking-[0.3em]" style={{ color: '#D4AF7F' }}>
                      04. Withdrawal Amount
                    </label>
                    <span className="text-[10px] font-mono" style={{ color: '#8F9BB3' }}>Min: {meta?.min} {currency}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        const cursor = e.target.selectionStart ?? e.target.value.length;
                        const { formatted } = formatWithCommas(e.target.value, cursor);
                        setAmount(formatted);
                      }}
                      className="w-full bg-black/40 border rounded-xl px-5 py-5 text-2xl font-bold tracking-tight focus:outline-none pr-32 sm:pr-40"
                      style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                    />
                    <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setAmount('1.0')}
                        className="px-3 py-1.5 rounded font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                      >
                        Max
                      </button>
                      <div className="h-6 w-px hidden sm:block" style={{ background: 'rgba(255,255,255,0.10)' }} />
                      <span className="font-black text-base sm:text-lg tracking-widest" style={{ color: '#D4AF7F' }}>{currency}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right: Transaction Summary ──────────────────── */}
              <aside className="flex flex-col gap-6">
                <div className="luxe-glass-border rounded-2xl overflow-hidden">
                  <h3 className="text-[10px] uppercase font-black tracking-[0.25em] px-6 py-5" style={{ color: '#D4AF7F', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    Transaction Summary
                  </h3>
                  <div className="p-6 space-y-5">
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#8F9BB3' }}>Gross Amount</span>
                        <span className="font-mono">{gross.toFixed(8)} {currency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#8F9BB3' }}>Network Fee</span>
                        <span className="font-mono" style={{ color: '#FF3D71' }}>− {fee.toFixed(8)} {currency}</span>
                      </div>
                      <div className="pt-3.5 flex justify-between items-end" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="font-bold uppercase text-xs tracking-widest">Total Receive</span>
                        <div className="text-right">
                          <div className="text-xl font-black tracking-tight" style={{ color: '#D4AF7F' }}>
                            {totalReceive.toFixed(8)} {currency}
                          </div>
                          <div className="text-[10px] font-mono" style={{ color: '#8F9BB3' }}>≈ ${totalReceiveUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
                        </div>
                      </div>
                    </div>

                    {/* Confirm CTA */}
                    <button
                      onClick={handleWithdraw}
                      disabled={loading || !amount || !address}
                      className="w-full luxe-grad-purple-pink luxe-neumorphic text-white py-4 rounded-xl font-black uppercase tracking-[0.25em] text-xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin" size={12} />
                          Submitting…
                        </>
                      ) : (
                        'Confirm Withdrawal'
                      )}
                    </button>

                    {/* Security Checklist */}
                    <div className="p-4 rounded-xl space-y-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#D4AF7F' }}>
                        <FaShieldAlt size={10} /> Security Checklist
                      </h4>
                      <div className="flex items-center gap-2.5 text-[11px]" style={{ color: '#8F9BB3' }}>
                        <FaCheckCircle size={10} style={{ color: address ? '#06B6D4' : '#5A6578' }} />
                        Address is {address ? 'whitelisted' : 'required'}
                      </div>
                      {gross * (meta?.spotUsd || 0) > 50000 && (
                        <div className="flex items-center gap-2.5 text-[11px]" style={{ color: '#FFAA00' }}>
                          <FaInfoCircle size={10} />
                          Large amount review (&gt; $50k)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent activity quick-look */}
                <div className="luxe-glass rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 className="text-[10px] uppercase font-black tracking-[0.25em]" style={{ color: '#D4AF7F' }}>Recent Activity</h3>
                    <button
                      onClick={() => router.push('/withdrawalHistory')}
                      className="text-[10px] font-black uppercase tracking-widest hover:underline"
                      style={{ color: '#06B6D4' }}
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {[
                      { v: '0.1250 BTC', d: 'Oct 24 · 14:28', status: 'Complete', color: '#06B6D4' },
                      { v: '2,400.00 USDT', d: 'Oct 23 · 09:15', status: 'Pending', color: '#D4AF7F' },
                    ].map((row, i) => (
                      <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', color: '#8F9BB3' }}>
                            <FaArrowUp size={10} />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold">{row.v}</div>
                            <div className="text-[9px] font-mono uppercase" style={{ color: '#8F9BB3' }}>{row.d}</div>
                          </div>
                        </div>
                        <span
                          className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded"
                          style={{ background: `${row.color}1a`, border: `1px solid ${row.color}33`, color: row.color }}
                        >
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            {/* Footer compliance */}
            <footer className="mt-12 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 opacity-60" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 luxe-glass rounded-lg flex items-center justify-center" style={{ borderColor: 'rgba(212,175,127,0.3)' }}>
                  <FaShieldAlt size={12} style={{ color: '#D4AF7F' }} />
                </div>
                <p className="text-[10px] leading-relaxed max-w-md" style={{ color: '#8F9BB3' }}>
                  Kandella is a regulated Prime Brokerage entity. Digital assets involve significant risk.
                  Institutional custody services provided by Kandella Vault LLC.
                </p>
              </div>
              <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: '#8F9BB3' }}>
                <a href="/screens/Privacy" className="hover:text-[#D4AF7F] transition-colors">Privacy</a>
                <a href="/screens/Terms" className="hover:text-[#D4AF7F] transition-colors">Terms</a>
                <a href="/screens/Legal" className="hover:text-[#D4AF7F] transition-colors">Risk</a>
                <a href="/screens/Security" className="hover:text-[#D4AF7F] transition-colors">Security</a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
