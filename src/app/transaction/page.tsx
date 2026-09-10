'use client';

/**
 * Kandella Orders / Transactions — Stitch luxe port
 * (dashboard_stitch/luxe_orders_history_settlement).
 *
 * Unifies depositHistory + withdrawalHistory + investmentHistory
 * (the existing `useTransactions` hook) into a single tabbed view with
 * filters, exactly per the correction PDF ("unify into transactions in
 * the ORDER page").
 *
 * Preserves: useAuth, useTransactions(user.id), the API contract.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useTransactions } from '@/lib/hooks/useTransactions';
import Sidebar from '@/components/Sidebar';
import MobileOrders from '@/components/transaction/MobileOrders';
import Logo from '@/components/Logo';
import {
  FaSearch,
  FaPowerOff,
  FaCalendarAlt,
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type Tab = 'open' | 'history' | 'trades' | 'transactions';
type RowKind = 'deposit' | 'withdrawal' | 'investment';

interface Row {
  id: string;
  ts: string;
  kind: RowKind;
  instrument: string;
  side: 'BUY' | 'SELL' | 'IN' | 'OUT';
  type: string;
  price: number | null;
  amount: number;
  fillPct: number;
  notional: number;
  status: string;
  rawStatus: string;
}

const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => `$${fmt(n)}`;

function normalizeStatus(s: string): { label: string; color: string; bg: string } {
  const t = (s || '').toLowerCase();
  if (t.includes('complete') || t.includes('success') || t.includes('filled') || t === 'active')
    return { label: 'Complete', color: '#00FFA3', bg: 'rgba(0,255,163,0.10)' };
  if (t.includes('partial')) return { label: 'Partial Fill', color: '#A855F7', bg: 'rgba(168,85,247,0.10)' };
  if (t.includes('reject') || t.includes('fail') || t.includes('cancel'))
    return { label: t.includes('cancel') ? 'Cancelled' : 'Rejected', color: '#FF3D71', bg: 'rgba(255,61,113,0.10)' };
  if (t.includes('pending') || t.includes('processing'))
    return { label: 'Pending', color: '#FFB800', bg: 'rgba(255,184,0,0.10)' };
  return { label: s || 'Pending', color: '#8F9BB3', bg: 'rgba(143,155,179,0.10)' };
}

export default function TransactionsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { transactions, isLoading, isError, mutate } = useTransactions(user?.id || null);

  /* Local UI state — pure filtering, no API impact */
  const [tab, setTab] = useState<Tab>('transactions');
  const [dateRange, setDateRange] = useState('All Time');
  const [assetFilter, setAssetFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  /* ── Build unified rows from the three histories ────────────── */
  const allRows: Row[] = useMemo(() => {
    const out: Row[] = [];
    transactions.depositHistory.forEach((d) => {
      const norm = normalizeStatus(d.status);
      out.push({
        id: `dep-${d.id}`,
        ts: d.createdAt,
        kind: 'deposit',
        instrument: (d.currency || 'USDT').toUpperCase(),
        side: 'IN',
        type: 'Deposit',
        price: null,
        amount: d.amount,
        fillPct: norm.label === 'Complete' ? 100 : norm.label === 'Pending' ? 30 : 0,
        notional: d.amount,
        status: norm.label,
        rawStatus: d.status,
      });
    });
    transactions.withdrawalHistory.forEach((w) => {
      const norm = normalizeStatus(w.status);
      out.push({
        id: `wd-${w.id}`,
        ts: w.createdAt,
        kind: 'withdrawal',
        instrument: (w.currency || 'USDT').toUpperCase(),
        side: 'OUT',
        type: 'Withdrawal',
        price: null,
        amount: w.amount,
        fillPct: norm.label === 'Complete' ? 100 : norm.label === 'Pending' ? 45 : 0,
        notional: w.amount,
        status: norm.label,
        rawStatus: w.status,
      });
    });
    transactions.investmentHistory.forEach((iv) => {
      const norm = normalizeStatus(iv.status);
      // Fill progress = elapsed time through the bond's term.
      const start = iv.startDate ? new Date(iv.startDate).getTime() : new Date(iv.createdAt).getTime();
      const end = iv.endDate ? new Date(iv.endDate).getTime() : start + 30 * 86_400_000;
      const fillPct = norm.label === 'Complete'
        ? 100
        : end > start
          ? Math.min(100, Math.max(0, Math.round(((Date.now() - start) / (end - start)) * 100)))
          : 0;
      // roi is a decimal fraction (0.40 = 40%); maturity value = principal × (1 + roi).
      const roiRate = (iv.roi || 0) > 1.5 ? (iv.roi || 0) / 100 : (iv.roi || 0);
      out.push({
        id: `inv-${iv.id}`,
        ts: iv.createdAt,
        kind: 'investment',
        instrument: (iv.planName || 'BOND').toUpperCase().slice(0, 18),
        side: 'BUY',
        type: 'Investment',
        price: null,
        amount: iv.amount,
        fillPct,
        notional: iv.amount * (1 + roiRate),
        status: norm.label,
        rawStatus: iv.status,
      });
    });
    return out.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  }, [transactions]);

  /* ── Apply filters ──────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let rows = allRows;
    if (tab === 'open') rows = rows.filter((r) => r.status === 'Pending' || r.status === 'Partial Fill');
    else if (tab === 'history') rows = rows.filter((r) => r.status !== 'Pending');
    else if (tab === 'trades') rows = rows.filter((r) => r.kind === 'investment');
    // tab === 'transactions' shows everything
    if (assetFilter !== 'All') rows = rows.filter((r) => r.instrument === assetFilter);
    if (typeFilter !== 'All') rows = rows.filter((r) => r.type === typeFilter);
    if (statusFilter !== 'All') rows = rows.filter((r) => r.status === statusFilter);
    if (search.trim()) rows = rows.filter((r) => r.id.toLowerCase().includes(search.toLowerCase()) || r.instrument.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [allRows, tab, assetFilter, typeFilter, statusFilter, search]);

  /* Distinct asset list for filter dropdown */
  const assetOptions = useMemo(() => {
    const set = new Set<string>();
    allRows.forEach((r) => set.add(r.instrument));
    return ['All', ...Array.from(set)];
  }, [allRows]);

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
        <p className="text-[11px] uppercase" style={{ color: '#8F9BB3', letterSpacing: '0.28em' }}>LOADING ORDER MANAGEMENT</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <FaExclamationTriangle size={28} style={{ color: '#FF3D71' }} />
        <h2 className="text-lg font-bold">Failed to load transactions</h2>
        <button onClick={() => mutate()} className="px-6 py-2.5 rounded-lg text-[11px] uppercase text-white luxe-grad-purple-pink luxe-neumorphic" style={{ letterSpacing: '0.2em' }}>
          Retry
        </button>
      </div>
    );
  }

  const reset = () => {
    setDateRange('All Time');
    setAssetFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
    setSearch('');
  };

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif]" style={{ background: '#06090F' }}>
      {/* Ambient orbs — desktop only; mobile uses the k-shell backdrop */}
      <div className="luxe-ambient-orb hidden md:block" style={{ background: '#A855F7', top: -200, left: -100 }} />
      <div className="luxe-ambient-orb hidden md:block" style={{ background: '#06B6D4', bottom: -200, right: -100 }} />

      <Sidebar />

      {/* ── MOBILE composition (< md) — mirrors the mobile activity mock ── */}
      <div className="md:hidden flex-1 min-w-0 flex flex-col relative">
        <MobileOrders
          rows={allRows}
          fmt={fmt}
          fmtUsd={fmtUsd}
          onCancelWithdrawal={() => mutate()}
        />
      </div>

      {/* ── DESKTOP composition (md+) — unchanged ── */}
      <div className="hidden md:flex flex-1 min-w-0 flex flex-col relative">
        <header
          className="sticky top-0 z-30 h-16 flex justify-between items-center px-4 sm:px-6 border-b"
          style={{ background: 'rgba(6,9,15,0.65)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div />
          <div className="flex items-center gap-3">
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-[1500px] mx-auto">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2" style={{ color: '#D4AF7F' }}>Order Management</h1>
              <p className="text-sm max-w-2xl" style={{ color: '#8F9BB3' }}>
                Unified institutional execution tracking — deposits, withdrawals, and bond settlements with real-time status.
              </p>
            </div>

            {/* Tabs + Filters */}
            <div className="luxe-glass-border rounded-2xl overflow-hidden mb-8">
              <div className="flex flex-wrap md:flex-nowrap border-b md:overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {([
                  { id: 'transactions', label: 'All Transactions', count: allRows.length },
                  { id: 'open', label: 'Open Orders', count: allRows.filter((r) => r.status === 'Pending' || r.status === 'Partial Fill').length },
                  { id: 'history', label: 'Order History', count: allRows.filter((r) => r.status !== 'Pending').length },
                  { id: 'trades', label: 'Investments', count: allRows.filter((r) => r.kind === 'investment').length },
                ] as const).map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id as Tab)}
                      className="px-4 md:px-6 py-3.5 md:py-4 text-xs font-mono uppercase tracking-widest flex items-center gap-2 whitespace-nowrap transition-colors"
                      style={
                        active
                          ? { color: '#D4AF7F', borderBottom: '2px solid #D4AF7F', background: 'rgba(212,175,127,0.04)' }
                          : { color: 'rgba(245,241,234,0.4)' }
                      }
                    >
                      {t.label}
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: active ? 'rgba(212,175,127,0.18)' : 'rgba(255,255,255,0.05)', color: active ? '#D4AF7F' : 'rgba(245,241,234,0.5)' }}>
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filter row */}
              <div className="p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] block" style={{ color: '#D4AF7F' }}>Date Range</label>
                  <div className="relative">
                    <input
                      readOnly
                      type="text"
                      value={dateRange}
                      onClick={() => setDateRange(dateRange === 'All Time' ? 'Last 24 Hours' : dateRange === 'Last 24 Hours' ? 'Last 7 Days' : dateRange === 'Last 7 Days' ? 'Last 30 Days' : 'All Time')}
                      className="w-full bg-black/40 border text-xs py-2 pl-8 pr-3 rounded cursor-pointer focus:outline-none"
                      style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                    />
                    <FaCalendarAlt size={10} className="absolute left-3 top-2.5" style={{ color: '#D4AF7F' }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] block" style={{ color: '#D4AF7F' }}>Asset</label>
                  <select value={assetFilter} onChange={(e) => setAssetFilter(e.target.value)} className="w-full bg-black/40 border text-xs py-2 px-3 rounded focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}>
                    {assetOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] block" style={{ color: '#D4AF7F' }}>Type</label>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full bg-black/40 border text-xs py-2 px-3 rounded focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}>
                    <option>All</option>
                    <option>Deposit</option>
                    <option>Withdrawal</option>
                    <option>Investment</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] block" style={{ color: '#D4AF7F' }}>Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-black/40 border text-xs py-2 px-3 rounded focus:outline-none" style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}>
                    <option>All</option>
                    <option>Complete</option>
                    <option>Pending</option>
                    <option>Partial Fill</option>
                    <option>Rejected</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-2 lg:col-span-2 flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search ID or pair…"
                      className="w-full bg-black/40 border text-xs py-2 pl-8 pr-3 rounded focus:outline-none"
                      style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                    />
                    <FaSearch size={10} className="absolute left-3 top-2.5" style={{ color: '#D4AF7F' }} />
                  </div>
                  <button onClick={reset} className="text-xs font-bold px-4 py-2 rounded uppercase tracking-widest transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(245,241,234,0.7)' }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Data table */}
            <div className="luxe-glass-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px] stack-table-xl">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {['Timestamp', 'Instrument', 'Side', 'Type', 'Amount', 'Fill Progress', 'Notional', 'Status', 'Action'].map((h, i) => (
                        <th key={h} className={`p-4 text-[10px] font-bold uppercase tracking-[0.2em] ${i === 8 ? 'text-right' : ''}`} style={{ color: '#D4AF7F' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} data-span="all" className="p-12 text-center text-sm" style={{ color: '#8F9BB3' }}>
                          No transactions match your filters.
                          {allRows.length === 0 && (
                            <span> Try <button onClick={() => router.push('/addFunds')} className="font-bold" style={{ color: '#D4AF7F' }}>making a deposit</button> to get started.</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row) => {
                        const sideColor =
                          row.side === 'IN' || row.side === 'BUY' ? '#00FFA3' : row.side === 'OUT' || row.side === 'SELL' ? '#FF3D71' : '#06B6D4';
                        const ts = new Date(row.ts).toLocaleString('en-US', { hour12: false });
                        const status = normalizeStatus(row.rawStatus);
                        return (
                          <tr key={row.id} className="hover:bg-white/[0.03] transition-colors group">
                            <td className="p-4 font-mono text-[11px]" data-label="Timestamp" style={{ color: '#8F9BB3' }}>{ts}</td>
                            <td className="p-4" data-label="Instrument" data-span="all">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                  style={{ background: 'rgba(212,175,127,0.18)', border: '1px solid rgba(212,175,127,0.32)', color: '#D4AF7F' }}
                                >
                                  {row.kind === 'deposit' ? <FaArrowDown size={9} /> : row.kind === 'withdrawal' ? <FaArrowUp size={9} /> : <FaChartLine size={9} />}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{row.instrument}</span>
                              </div>
                            </td>
                            <td className="p-4" data-label="Side">
                              <span className="font-bold text-xs uppercase tracking-widest" style={{ color: sideColor }}>{row.side}</span>
                            </td>
                            <td className="p-4 text-xs font-mono uppercase" data-label="Type" style={{ color: 'rgba(245,241,234,0.5)' }}>{row.type}</td>
                            <td className="p-4 font-mono text-xs" data-label="Amount" style={{ color: '#F5F1EA' }}>{fmt(row.amount)}</td>
                            <td className="p-4" data-label="Fill Progress" data-span="all">
                              <div className="w-full max-w-[100px] rounded-full h-1 mb-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <div
                                  className="h-1 rounded-full"
                                  style={{
                                    width: `${row.fillPct}%`,
                                    background: row.fillPct === 100 ? 'linear-gradient(90deg, #00FFA3, #06B6D4)' : row.fillPct > 0 ? 'linear-gradient(135deg, #8B5CF6 0%, #DB2777 100%)' : 'rgba(255,255,255,0.10)',
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-mono font-medium" style={{ color: 'rgba(245,241,234,0.5)' }}>{row.fillPct.toFixed(2)}%</span>
                            </td>
                            <td className="p-4 font-mono text-xs" data-label="Notional" style={{ color: '#F5F1EA' }}>{fmtUsd(row.notional)}</td>
                            <td className="p-4" data-label="Status">
                              <span
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block"
                                style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}33` }}
                              >
                                {status.label}
                              </span>
                            </td>
                            <td className="p-4 text-right" data-label="Action" data-span="all" data-align="end">
                              {row.status === 'Pending' && row.kind === 'withdrawal' ? (
                                <button
                                  onClick={() => mutate()}
                                  className="text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-white px-3 py-2 rounded-lg"
                                  style={{ color: '#FF3D71', background: 'rgba(255,61,113,0.10)', border: '1px solid rgba(255,61,113,0.3)' }}
                                >
                                  Cancel
                                </button>
                              ) : (
                                <button
                                  onClick={() => router.push(row.kind === 'deposit' ? '/depositHistory' : row.kind === 'withdrawal' ? '/withdrawalHistory' : '/portfolio')}
                                  className="text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-white px-3 py-2 rounded-lg"
                                  style={{ color: 'rgba(245,241,234,0.6)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                                >
                                  Details
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer pagination summary */}
              <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: '#8F9BB3' }}>
                  Showing {filtered.length} of {allRows.length} records
                </span>
                <div className="flex gap-2 items-center">
                  <button disabled className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded opacity-40" style={{ background: 'rgba(255,255,255,0.05)', color: '#F5F1EA' }}>Prev</button>
                  <span className="text-[10px] uppercase font-mono" style={{ color: '#D4AF7F' }}>Page 1 / 1</span>
                  <button disabled className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded opacity-40" style={{ background: 'rgba(255,255,255,0.05)', color: '#F5F1EA' }}>Next</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
