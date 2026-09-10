'use client';

/**
 * Kandella · mobile-only Wallet composition (< md).
 * Mirrors the mobile Wallet mock (mock body .qa/bodies/wallet.txt) using the
 * .k-* shell system, fed by the same live portfolio data as the desktop
 * Wallet (/portfolio): custody rows come from holdings × live tickers, yield
 * bonds from the active investments, and the hero balance/delta are derived
 * from those live rows (24h change = ticker change24h weighted by value).
 * Desktop rendering is completely separate and untouched.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import NotificationButton from '@/components/NotificationButton';
import SwapWidget from '@/components/wallet/SwapWidget';
import CoinIcon from '@/components/CoinIcon';
import { useCurrency } from '@/components/context/CurrencyContext';

export interface MobileCustodyRow {
  sym: string;
  name: string;
  available: number;
  value: number;
}

export interface MobileBondRow {
  id: string;
  planName: string;
  name: string;
  principal: number;
  roiPct: number;
  days: number;
  maturityValue: number;
}

interface Props {
  userEmail: string;
  assetRows: MobileCustodyRow[];
  bonds: MobileBondRow[];
  /** Sum of custody asset USD values (hero "Wallet balance"). */
  walletBalance: number;
  /** 24h P&L in USD — Σ holding value × ticker change24h. */
  pnl24h: number;
  /** 24h P&L as a percent of walletBalance. */
  pnl24hPct: number;
  /** Called after a successful swap (refreshes portfolio summary). */
  onSwapped?: () => void;
}

/* ── Small helpers ─────────────────────────────────────────────────── */

// Kandella is custodial; the desktop view shows a static sample address, so we
// derive a stable per-user pseudo address from the email for display/copy.
function pseudoAddress(email: string): string {
  let h = 2166136261 >>> 0;
  const src = (email || 'kandella.user').toLowerCase().trim();
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let out = h.toString(16).padStart(8, '0');
  while (out.length < 40) {
    h = (Math.imul(h ^ (h >>> 15), 2246822519) >>> 0) ^ (Math.imul(h ^ (h >>> 13), 3266489917) >>> 0);
    out += (h >>> 0).toString(16).padStart(8, '0');
  }
  return `0x${out.slice(0, 40)}`;
}

const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

// Quantity formatter — cash (USDT) at 2dp, crypto up to 8dp so dust stays visible.
const qtyFmt = (n: number, sym: string) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: sym === 'USDT' ? 2 : 8,
  });

type EmblemTone = 'gold' | 'cyan' | 'violet';

const EMBLEM_TONES: EmblemTone[] = ['gold', 'cyan', 'violet'];

function emblemTone(planName: string, index: number): EmblemTone {
  const p = (planName || '').toLowerCase();
  if (p.includes('core') || p === 'mining') return 'gold';
  if (p.includes('growth') || p.includes('premium')) return 'cyan';
  if (p.includes('institutional') || p === 'gold') return 'violet';
  return EMBLEM_TONES[index % EMBLEM_TONES.length];
}

function Chevron() {
  return (
    <svg className="k-row__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function Emblem({ tone }: { tone: EmblemTone }) {
  return (
    <span className={`k-emblem k-emblem--${tone}`} aria-hidden>
      {tone === 'gold' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="8.2" />
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )}
      {tone === 'cyan' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5.4 18.5v-5.2h3.2v5.2" />
          <path d="M10.4 18.5v-7.9h3.2v7.9" />
          <path d="M15.4 18.5V9h3.2v9.5" />
          <path d="M4.5 18.5h15" />
        </svg>
      )}
      {tone === 'violet' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4.2 5.6 6.6v5c0 3.9 2.5 6.5 6.4 7.6 3.9-1.1 6.4-3.7 6.4-7.6v-5L12 4.2Z" />
          <path d="m9.2 11.7 2 2 3.6-3.8" />
        </svg>
      )}
    </span>
  );
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function MobileWallet({
  userEmail,
  assetRows,
  bonds,
  walletBalance,
  pnl24h,
  pnl24hPct,
  onSwapped,
}: Props) {
  const router = useRouter();
  const { format: fmtCur } = useCurrency();

  const [swapOpen, setSwapOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const address = useMemo(() => pseudoAddress(userEmail), [userEmail]);
  const up = pnl24h >= 0;
  const assetsEmpty = assetRows.length === 0;
  const bondsEmpty = bonds.length === 0;

  // While the swap sheet is open: lock page scroll + close on Escape.
  useEffect(() => {
    if (!swapOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSwapOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [swapOpen]);

  // Clear a pending "Copied" timer on unmount.
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — leave state untouched */
    }
  };

  return (
    <>
      {/* ── Top bar ── */}
      <header className="k-topbar">
        <span className="k-topbar__spacer" />
        <NotificationButton />
      </header>

      <main style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Balance hero — two money actions, one of them primary */}
        <section className="k-hero" style={{ margin: '14px 16px 0' }}>
          <p className="k-hero__label">Wallet balance</p>
          <p className="k-hero__amount num">{fmtCur(walletBalance)}</p>
          <div className="k-hero__delta">
            <span className={up ? 'k-delta k-delta--up' : 'k-delta k-delta--down'}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {up ? <path d="M12 19V5" /> : <path d="M12 5v14" />}
                {up ? <path d="m6 11 6-6 6 6" /> : <path d="m6 13 6 6 6-6" />}
              </svg>
              {up ? '+' : ''}
              {Number.isFinite(pnl24hPct) ? pnl24hPct.toFixed(2) : '0.00'}%
            </span>
            <span className="num" style={{ color: 'var(--fg-2)', fontSize: 13 }}>
              {up ? '+' : ''}
              {fmtCur(pnl24h)} (24h)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 16 }}>
            <button type="button" className="k-btn k-btn--primary k-btn--lg" onClick={() => router.push('/addFunds')}>
              Deposit funds
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button type="button" className="k-btn k-btn--ghost" onClick={() => router.push('/withdrawal')}>
                Withdraw
              </button>
              <button type="button" className="k-btn k-btn--soft" onClick={() => setSwapOpen(true)}>
                Swap
              </button>
            </div>
          </div>
        </section>

        {/* Connected wallet */}
        <section className="k-card" style={{ margin: '12px 16px 0', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="k-row__glyph" style={{ background: 'color-mix(in oklch, var(--accent) 13%, transparent)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 14.5, fontWeight: 650 }}>Kandella Wallet</span>
              <span className="num" style={{ display: 'block', fontSize: 12.5, color: 'var(--fg-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {shortAddr(address)}
              </span>
            </span>
            <span className="k-pill k-pill--ok">Active</span>
            <button className="k-iconbtn" type="button" aria-label={copied ? 'Address copied' : 'Copy wallet address'} title="Copy wallet address" onClick={copyAddress}>
              {copied ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#00FFA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="9" y="9" width="11" height="11" rx="2.2" />
                  <path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" />
                </svg>
              )}
            </button>
          </div>
        </section>

        {/* Custody assets — rows, no table */}
        <div className="k-section">
          <h2 className="k-section__title">Assets</h2>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-3)' }}>By value</span>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          <ul className="k-list k-list--flush">
            {assetsEmpty && (
              <li>
                <div className="k-row" style={{ color: 'var(--fg-3)' }}>
                  <span className="k-row__main">
                    <span className="k-row__title">No custody assets yet</span>
                    <span className="k-row__sub">Deposit funds to build your wallet balance.</span>
                  </span>
                </div>
              </li>
            )}
            {assetRows.map((row) => (
              <li key={row.sym}>
                <button type="button" className="k-row" onClick={() => setSwapOpen(true)} aria-label={`Swap ${row.sym}`}>
                  <CoinIcon symbol={row.sym} size={40} tint="#D4AF7F" style={{ borderRadius: '50%' }} />
                  <span className="k-row__main">
                    <span className="k-row__title">{row.name}</span>
                    <span className="k-row__sub num">
                      {qtyFmt(row.available, row.sym)} {row.sym}
                    </span>
                  </span>
                  <span className="k-row__trail">
                    <span className="num">{fmtCur(row.value)}</span>
                  </span>
                  <Chevron />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Yield bonds held */}
        <div className="k-section">
          <h2 className="k-section__title">Yield bonds</h2>
          <button type="button" className="k-section__link" onClick={() => router.push('/transaction')}>
            View all
          </button>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          <ul className="k-list k-list--flush">
            {bondsEmpty && (
              <li>
                <button type="button" className="k-row" onClick={() => router.push('/stake')}>
                  <span className="k-row__main">
                    <span className="k-row__title" style={{ whiteSpace: 'normal' }}>No active bonds</span>
                    <span className="k-row__sub" style={{ whiteSpace: 'normal' }}>Visit Earn to subscribe to a tier.</span>
                  </span>
                  <Chevron />
                </button>
              </li>
            )}
            {bonds.map((bond, i) => (
              <li
                key={bond.id}
                style={{ padding: '15px 16px 16px', borderTop: i > 0 ? '1px solid var(--line-soft)' : undefined }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/stake')}
                  style={{ display: 'block', width: '100%', textAlign: 'left' }}
                >
                  {/* Header: tier emblem + bond name + maturity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ flex: '0 0 auto' }}>
                      <Emblem tone={emblemTone(bond.planName, i)} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="k-row__title" style={{ display: 'block' }}>{bond.name}</span>
                      <span className="k-row__sub" style={{ display: 'block', whiteSpace: 'normal' }}>
                        {bond.roiPct.toFixed(0)}% yield · matures in {bond.days} days
                      </span>
                    </span>
                    <Chevron />
                  </div>

                  {/* Figures on their own row so nothing is squeezed */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: 10,
                      marginTop: 13,
                      paddingTop: 12,
                      borderTop: '1px solid var(--line-soft)',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 3,
                        }}
                      >
                        Principal
                      </span>
                      <span className="num" style={{ display: 'block', fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {fmtCur(bond.principal)}
                      </span>
                    </div>
                    <div style={{ minWidth: 0, textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'block', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 3,
                        }}
                      >
                        At maturity
                      </span>
                      <span
                        className="num"
                        style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--up)', whiteSpace: 'nowrap' }}
                      >
                        {fmtCur(bond.maturityValue)}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* History link */}
        <button type="button" className="k-row" style={{ margin: '10px 16px 0', width: 'calc(100% - 32px)' }} onClick={() => router.push('/transaction')}>
          <span className="k-row__glyph" style={{ background: 'color-mix(in oklch, var(--accent) 13%, transparent)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
              <path d="M12 8v4l2.5 2.5" />
              <path d="M4 6v6" />
              <circle cx="12" cy="12" r="8.5" />
              <path d="M4 6h4" />
            </svg>
          </span>
          <span className="k-row__main">
            <span className="k-row__title" style={{ whiteSpace: 'normal' }}>Deposit &amp; withdrawal history</span>
            <span className="k-row__sub" style={{ whiteSpace: 'normal' }}>Unified transaction ledger</span>
          </span>
          <Chevron />
        </button>
      </main>

      {/* ── Swap sheet: real SwapWidget, k-shell chrome ── */}
      {swapOpen && (
        <>
          <div className="k-scrim is-open" aria-hidden="true" onClick={() => setSwapOpen(false)} />
          <section className="k-sheet is-open" role="dialog" aria-modal="true" aria-label="Swap assets">
            <div className="k-sheet__handle"><i /></div>
            <div className="k-sheet__head">
              <span className="k-sheet__title">Swap assets</span>
              <button className="k-iconbtn" type="button" aria-label="Close swap" onClick={() => setSwapOpen(false)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="k-sheet__body" style={{ paddingBottom: 20 }}>
              <SwapWidget onSwapped={onSwapped} />
              <p className="k-center k-muted" style={{ fontSize: 11.5, margin: '14px 0 4px', letterSpacing: '0.04em' }}>
                Live rates · instant settlement
              </p>
            </div>
          </section>
        </>
      )}
    </>
  );
}
