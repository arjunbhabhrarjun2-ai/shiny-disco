'use client';

/**
 * Kandella Deposit Funds — Stitch luxe port (dashboard_stitch/deposit_funds).
 * Preserves the existing deposit logic: useAuth, useDeposits, addFundsSchema,
 * the WALLETS config (BTC/USDT-ERC20/ETH/XRP/SOL/USDT-BEP20), and the
 * submitDeposit POST. Only the visual layer changed.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import { useAuth } from '@/components/context/AuthContext';
import { useDeposits } from '@/lib/hooks/useDeposits';
import { useTickers } from '@/lib/hooks/useTickers';
import WireTransferPanel from '@/components/wire/WireTransferPanel';
import { addFundsSchema } from '@/lib/validation';
import { WALLETS } from '@/lib/config';
import { formatWithCommas, unformat } from '@/lib/utils/formatAmount';
import {
  FaSearch,
  FaPowerOff,
  FaCopy,
  FaCheckCircle,
  FaShieldAlt,
  FaInfoCircle,
  FaHistory,
  FaChevronRight,
  FaBitcoin,
  FaUniversity,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const fmt = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function AddFundsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { submitDeposit } = useDeposits(user?.email || null);
  const { tickers } = useTickers();

  /* ── Form state (preserved from original page) ───────────────── */
  const [selected, setSelected] = useState<any | null>(WALLETS[0]);
  // Payment method: crypto deposit flow or the bank wire flow.
  const [method, setMethod] = useState<'crypto' | 'wire'>('crypto');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const [error, setError] = useState<string | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  const showAlert = (msg: string, type: 'success' | 'error' | 'warning' = 'success', autoClose = true) => {
    setAlertMsg(msg);
    setAlertType(type);
    if (autoClose) setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleCopy = async () => {
    if (!selected?.address) return;
    try {
      await navigator.clipboard.writeText(selected.address);
      setAddressCopied(true);
      showAlert('Address copied to clipboard.', 'success');
      setTimeout(() => setAddressCopied(false), 2000);
    } catch {
      showAlert('Copy failed. Please copy manually.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selected) {
      setError('Please select an asset to deposit.');
      return;
    }
    const numericAmount = parseFloat(unformat(amount));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid deposit amount.');
      return;
    }
    // Zod (not Yup): validate just the client-supplied fields with safeParse.
    const parsed = addFundsSchema
      .pick({ amount: true, currency: true })
      .safeParse({ amount: numericAmount, currency: selected.name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid deposit details.');
      return;
    }
    if (!selected.address) {
      setError('This asset has no deposit address configured.');
      return;
    }
    setLoading(true);
    try {
      // useDeposits.submitDeposit takes POSITIONAL args (amount, currency, address)
      // and returns a result object — it does not throw on a failed request.
      const result = await submitDeposit(numericAmount, selected.name, selected.address);
      if (result.success) {
        showAlert('Deposit submitted. We will notify you once it confirms on-chain.', 'success');
        setAmount('');
      } else {
        setError(result.message);
        showAlert(result.message || 'Deposit failed. Please try again.', 'error');
      }
    } catch (err: any) {
      const msg = err?.message || 'Deposit failed. Please try again.';
      setError(msg);
      showAlert(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  /* QR code via free service so we don't bundle a QR lib */
  const qrSrc = useMemo(() => {
    if (!selected?.address) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selected.address)}`;
  }, [selected]);

  /* ── Real-time USD → asset equivalent preview ──────────────────── */
  const ASSET_BASE: Record<string, string> = {
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Ripple: 'XRP',
    Solana: 'SOL',
    'Tether (ERC20)': 'USDT',
    'USDC (ERC20)': 'USDC',
    'Tether (BEP20)': 'USDT',
    'BNB Smart Chain': 'BNB',
    Tron: 'TRX',
    Arbitrum: 'ARB',
    Aeternity: 'AE',
    Aptos: 'APT',
    Akash: 'AKT',
    Algorand: 'ALGO',
    Sui: 'SUI',
    Aurora: 'AURORA',
    'Avalanche C-Chain': 'AVAX',
    Axelar: 'AXL',
    'Bitcoin Cash': 'BCH',
    Blast: 'BLAST',
    Boba: 'BOBA',
    BounceBit: 'BB',
    Cardano: 'ADA',
    Celo: 'CELO',
    'Conflux eSpace': 'CFX',
    'Cosmos Hub': 'ATOM',
    'Cronos Chain': 'CRO',
    'Crypto.org': 'CRO',
    Dash: 'DASH',
    Decred: 'DCR',
    DigiByte: 'DGB',
    Dogecoin: 'DOGE',
    Evmos: 'EVMOS',
    'FIO Protocol': 'FIO',
    'Ethereum Classic': 'ETC',
    Fantom: 'FTM',
    Filecoin: 'FIL',
    Firo: 'FIRO',
    Zcash: 'ZEC',
    Flux: 'FLUX',
    Groestlcoin: 'GRS',
    Harmony: 'ONE',
    ICON: 'ICX',
  };
  const assetPreview = useMemo(() => {
    const base = ASSET_BASE[selected?.name ?? ''] || '';
    if (!base) return null;
    const usd = parseFloat(unformat(amount));
    if (!Number.isFinite(usd) || usd <= 0) return null;
    let price = 1; // USDT ≈ $1
    if (base !== 'USDT') {
      const t = tickers.find(
        (x) => x.base === base && (x.quote === 'USDT' || x.quote === 'USD'),
      );
      if (!t || !t.price) return null;
      price = t.price;
    }
    const qty = usd / price;
    return { base, qty, decimals: qty >= 1 ? 4 : 8 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, amount, tickers]);

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
            <input type="text" placeholder="SEARCH ASSETS…" className="bg-transparent border-none text-[10px] font-bold tracking-widest focus:outline-none w-40 lg:w-56" style={{ color: '#F5F1EA' }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button className="bg-[#0095FF] text-white px-5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-[10px] font-bold tracking-widest uppercase">
              <Link href="/portfolio" className="hover:text-[#0095FF] transition-colors" style={{ color: '#5A6578' }}>Wallet</Link>
              <FaChevronRight size={9} style={{ color: '#5A6578' }} />
              <span style={{ color: '#F0F2F5' }}>Deposit Funds</span>
            </nav>

            {/* Heading */}
            <header className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#F0F2F5' }}>Deposit Funds</h2>
              <p className="text-sm" style={{ color: '#8F9BB3' }}>Choose your preferred method to fund your Kandella Prime account.</p>
            </header>

            {/* Alert */}
            {alertMsg && (
              <div
                className="mb-6 p-3 rounded-lg text-xs font-medium flex items-center gap-2"
                style={{
                  background: alertType === 'error' ? 'rgba(255,61,113,0.10)' : alertType === 'warning' ? 'rgba(255,170,0,0.10)' : 'rgba(0,200,83,0.10)',
                  border: `1px solid ${alertType === 'error' ? 'rgba(255,61,113,0.32)' : alertType === 'warning' ? 'rgba(255,170,0,0.32)' : 'rgba(0,200,83,0.32)'}`,
                  color: alertType === 'error' ? '#FF3D71' : alertType === 'warning' ? '#FFAA00' : '#00C853',
                }}
              >
                <FaCheckCircle size={11} />
                {alertMsg}
              </div>
            )}

            {/* Multi-step grid */}
            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
              {/* ── Left: Method Selection ───────────────────────── */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="rounded-lg p-1" style={{ background: '#151A21', border: '1px solid #404753' }}>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest px-4 py-3" style={{ color: '#5A6578' }}>Select Method</h3>
                  <button
                    type="button"
                    onClick={() => setMethod('crypto')}
                    className="w-full text-left p-4 flex items-center gap-4 rounded-md group"
                    style={{
                      background: method === 'crypto' ? '#1C2128' : 'transparent',
                      border: method === 'crypto' ? '1px solid #0095FF' : '1px solid transparent',
                    }}
                  >
                    <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(0,149,255,0.10)', border: '1px solid rgba(0,149,255,0.30)', color: '#0095FF' }}>
                      <FaBitcoin size={16} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-base font-semibold" style={{ color: '#dfe2eb' }}>Cryptocurrency</p>
                      <p className="text-[11px] uppercase tracking-tight" style={{ color: '#5A6578' }}>Instant • No Fees</p>
                    </div>
                    {method === 'crypto' && <FaCheckCircle size={14} style={{ color: '#0095FF' }} />}
                  </button>

                  {/* Wire transfer — bank wires are arranged with support */}
                  <button
                    type="button"
                    onClick={() => setMethod('wire')}
                    className="w-full text-left p-4 flex items-center gap-4 rounded-md group mt-1"
                    style={{
                      background: method === 'wire' ? '#1C2128' : 'transparent',
                      border: method === 'wire' ? '1px solid #0095FF' : '1px solid transparent',
                    }}
                  >
                    <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: 'rgba(0,149,255,0.10)', border: '1px solid rgba(0,149,255,0.30)', color: '#0095FF' }}>
                      <FaUniversity size={15} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-base font-semibold" style={{ color: '#dfe2eb' }}>Wire transfer</p>
                      <p className="text-[11px] uppercase tracking-tight" style={{ color: '#5A6578' }}>Bank wire • 1 business day</p>
                    </div>
                    {method === 'wire' && <FaCheckCircle size={14} style={{ color: '#0095FF' }} />}
                  </button>
                </div>

                {/* Security Info Box */}
                <div className="p-4 rounded-lg" style={{ background: 'rgba(0,149,255,0.05)', border: '1px solid rgba(0,149,255,0.20)' }}>
                  <div className="flex items-start gap-3">
                    <FaShieldAlt size={14} style={{ color: '#0095FF', marginTop: 2 }} />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: '#dfe2eb' }}>Secure Custody</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: '#8F9BB3' }}>
                        Funds are held in segregated multi-sig institutional vaults with $500M insurance coverage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount input — kept from original logic */}
                <div className="p-4 rounded-lg" style={{ background: '#151A21', border: '1px solid #404753' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#5A6578' }}>Amount (USD value)</label>
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
                    className="w-full bg-[#0B0E11] border rounded px-3 py-2.5 text-sm font-mono"
                    style={{ borderColor: '#404753', color: '#F0F2F5' }}
                  />
                  {assetPreview && (
                    <div className="mt-3 flex items-center justify-between px-3 py-2 rounded" style={{ background: '#0B0E11', border: '1px solid #404753' }}>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: '#5A6578' }}>Equivalent</span>
                      <span className="text-sm font-mono font-bold" style={{ color: '#0095FF' }}>
                        ≈ {fmt(assetPreview.qty, assetPreview.decimals)} {assetPreview.base}
                      </span>
                    </div>
                  )}
                  {error && (
                    <p className="mt-2 text-[11px]" style={{ color: '#FF3D71' }}>{error}</p>
                  )}
                </div>
              </div>

              {/* ── Right: Content Canvas ─────────────────────────── */}
              <div className="col-span-12 lg:col-span-8">
                {method === 'wire' ? (
                  <WireTransferPanel mode="deposit" amountText={amount ? `$${amount}` : ''} />
                ) : (
                <div className="rounded-lg overflow-hidden" style={{ background: '#151A21', border: '1px solid #404753' }}>
                  {/* Step header */}
                  <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid #404753' }}>
                    <div>
                      <h4 className="text-base font-semibold" style={{ color: '#F0F2F5' }}>Crypto Deposit Detail</h4>
                      <p className="text-xs" style={{ color: '#8F9BB3' }}>Send cryptocurrency to your unique brokerage address.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#0B0E11', border: '1px solid #404753' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#00C853', boxShadow: '0 0 8px #00C853' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#00C853' }}>Network Online</span>
                    </div>
                  </div>

                  {/* Selectors + QR */}
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Selectors */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#5A6578' }}>Select Asset</label>
                        <select
                          value={selected?.name || ''}
                          onChange={(e) => {
                            const w = WALLETS.find((x) => x.name === e.target.value);
                            if (w) setSelected(w);
                          }}
                          className="w-full p-3 rounded text-sm font-semibold cursor-pointer transition-colors"
                          style={{ background: '#0B0E11', border: '1px solid #404753', color: '#F0F2F5' }}
                        >
                          {WALLETS.map((w) => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#5A6578' }}>Network</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            className="p-3 rounded text-left relative overflow-hidden"
                            style={{ border: '1px solid #0095FF', background: 'rgba(0,149,255,0.10)' }}
                          >
                            <span className="block text-xs font-bold" style={{ color: '#0095FF' }}>{selected?.name?.split(' ')[0] || 'Bitcoin'}</span>
                            <span className="block text-[10px] uppercase" style={{ color: '#5A6578' }}>Native</span>
                          </button>
                          <button
                            type="button"
                            className="p-3 rounded text-left transition-colors"
                            style={{ border: '1px solid #404753', background: 'transparent', color: '#dfe2eb' }}
                          >
                            <span className="block text-xs font-bold">Lightning</span>
                            <span className="block text-[10px] uppercase" style={{ color: '#5A6578' }}>Instant</span>
                          </button>
                        </div>
                      </div>

                      {/* Important info */}
                      <div className="p-4 rounded" style={{ background: 'rgba(49,53,60,0.5)', border: '1px solid #404753' }}>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#5A6578' }}>
                          <FaInfoCircle size={11} />
                          Important Information
                        </h5>
                        <ul className="space-y-2 text-[11px]" style={{ color: '#8F9BB3' }}>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full mt-1.5" style={{ background: '#0095FF' }} />
                            Minimum deposit: {selected?.name?.startsWith('Bitcoin') ? '0.0001 BTC' : '$10 equivalent'}
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full mt-1.5" style={{ background: '#0095FF' }} />
                            Arrival estimation: ~10 – 30 minutes
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full mt-1.5" style={{ background: '#0095FF' }} />
                            Confirmations required: 2 – 6 blocks
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Address & QR */}
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg shadow-xl mb-6 relative group overflow-hidden">
                        {qrSrc ? (
                          <img alt={`${selected?.name} address QR`} src={qrSrc} width={160} height={160} className="w-40 h-40" />
                        ) : (
                          <div className="w-40 h-40 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">QR Code</div>
                        )}
                      </div>
                      <div className="w-full space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-center" style={{ color: '#5A6578' }}>
                          Your {selected?.name?.split(' ')[0]} Deposit Address
                        </label>
                        <div className="flex items-center gap-0 w-full group">
                          <div
                            className="flex-grow px-4 py-3 font-mono text-xs truncate rounded-l"
                            style={{ background: '#0B0E11', border: '1px solid #404753', borderRight: 'none', color: '#dfe2eb' }}
                          >
                            {selected?.address || ''}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="px-4 py-3 hover:bg-[#0095FF] hover:text-[#002c51] transition-all flex items-center justify-center rounded-r"
                            style={{ background: '#31353c', border: '1px solid #404753', borderLeft: 'none', color: '#dfe2eb' }}
                          >
                            {addressCopied ? <FaCheckCircle size={14} /> : <FaCopy size={14} />}
                          </button>
                        </div>
                        <p className="text-center text-[10px] italic" style={{ color: '#5A6578' }}>
                          Address refresh every 24h for enhanced privacy
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="p-6 flex items-center justify-between" style={{ background: '#1C2128', borderTop: '1px solid #404753' }}>
                    <Link
                      href="/transaction"
                      className="flex items-center gap-2 font-bold text-[11px] tracking-widest uppercase transition-colors hover:text-[#dfe2eb]"
                      style={{ color: '#5A6578' }}
                    >
                      <FaHistory size={11} />
                      View Deposit History
                    </Link>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => router.push('/portfolio')}
                        className="px-5 py-2 font-bold text-[11px] tracking-widest uppercase transition-all rounded"
                        style={{ border: '1px solid #404753', color: '#8F9BB3' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 font-bold text-[11px] tracking-widest uppercase hover:brightness-110 transition-all rounded flex items-center gap-2"
                        style={{ background: '#0095FF', color: '#002c51', opacity: loading ? 0.6 : 1 }}
                      >
                        {loading && <AiOutlineLoading3Quarters className="animate-spin" size={11} />}
                        {loading ? 'Submitting…' : 'Submit Deposit'}
                      </button>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
