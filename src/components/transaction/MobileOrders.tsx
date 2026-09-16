'use client';

/**
 * Kandella · mobile-only Orders / Transactions composition (< md).
 *
 * Faithful port of the mobile "activity ledger" mock (.qa/bodies/order.txt)
 * built on the shared .k-* shell (mobile-shell.css, imported globally).
 * Rows are the SAME unified live rows the desktop table renders, prop-drilled
 * from /transaction/page.tsx — chips filter by kind, status pills reuse the
 * page's normalized labels, pending withdrawals expose progress + Cancel
 * (revalidates via the page's mutate()), and rows navigate to the same
 * detail routes as the desktop Actions column. Desktop is untouched.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NotificationButton from '@/components/NotificationButton';
import CoinIcon from '@/components/CoinIcon';

export type LedgerKind = 'deposit' | 'withdrawal' | 'investment';

/** Structural subset of the page's unified Row (extra desktop fields allowed). */
export interface LedgerRow {
  id: string;
  ts: string;
  kind: LedgerKind;
  instrument: string;
  amount: number;
  fillPct: number;
  status: string; // normalized label: Complete / Pending / Partial Fill / Cancelled / Rejected …
}

interface Props {
  rows: LedgerRow[];
  fmt: (n: number, d?: number) => string;
  fmtUsd: (n: number) => string;
  /** Cancel a pending withdrawal — wired to the page's mutate() revalidation. */
  onCancelWithdrawal: () => void;
}

type KindFilter = 'all' | 'deposit' | 'withdraw' | 'investment';

const KIND_CHIPS: { id: KindFilter; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'deposit', label: 'Deposits' },
  { id: 'withdraw', label: 'Withdrawals' },
  { id: 'investment', label: 'Bond buys' },
];

/** Bond emblem cycle for investment rows (mock: cyan bars / gold target). */
const EMBLEMS = [
  { cls: 'k-emblem--cyan', key: 'bars' },
  { cls: 'k-emblem--gold', key: 'target' },
  { cls: 'k-emblem--violet', key: 'wave' },
] as const;

const STABLES = new Set(['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'PYUSD', 'USDE']);

/** Live history has no network/address field, so the mock's third sub-line
 *  ("Tether (ERC-20)", "to 0x82…4cEa") becomes a short real flow phrase. */
function flowNote(kind: LedgerKind, status: string): string {
  switch (status) {
    case 'Pending':
      return kind === 'deposit' ? 'Awaiting confirmations' : kind === 'withdrawal' ? 'Network review' : 'Yield accruing';
    case 'Partial Fill':
      return kind === 'investment' ? 'Yield accruing' : 'Partially processed';
    case 'Cancelled':
      return kind === 'deposit' ? 'Deposit cancelled' : kind === 'withdrawal' ? 'Withdrawal cancelled' : 'Investment cancelled';
    case 'Rejected':
      return kind === 'deposit' ? 'Deposit rejected' : kind === 'withdrawal' ? 'Withdrawal rejected' : 'Investment rejected';
    default:
      return kind === 'deposit' ? 'Deposit confirmed' : kind === 'withdrawal' ? 'Withdrawal completed' : 'Term completed';
  }
}

function whenLabel(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '—';
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}

/** "STRATEGIC GROWTH" → "Strategic Growth" (mock bond titles are sentence case). */
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Status label → shell pill variant (colors from normalizeStatus in the page). */
function pillClass(status: string): string {
  switch (status) {
    case 'Complete':
      return 'k-pill k-pill--ok';
    case 'Pending':
      return 'k-pill k-pill--pending';
    case 'Partial Fill':
      return 'k-pill k-pill--partial';
    case 'Cancelled':
    case 'Rejected':
      return 'k-pill k-pill--danger';
    default:
      return 'k-pill k-pill--neutral';
  }
}

function rowTitle(row: LedgerRow): string {
  if (row.kind === 'investment') {
    const plan = titleCase(row.instrument).replace(/\s*bond$/i, '');
    return `${plan} · bond`;
  }
  return `${row.instrument} ${row.kind === 'deposit' ? 'deposit' : 'withdrawal'}`;
}

function CoinMark({ row }: { row: LedgerRow }) {
  return (
    <span className="k-logo" aria-hidden>
      <CoinIcon symbol={row.instrument} size={40} tint="#D4AF7F" />
    </span>
  );
}

function Emblem({ variant }: { variant: (typeof EMBLEMS)[number] }) {
  return (
    <span className={`k-emblem ${variant.cls}`} aria-hidden>
      {variant.key === 'bars' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5.4 18.5v-5.2h3.2v5.2" />
          <path d="M10.4 18.5v-7.9h3.2v7.9" />
          <path d="M15.4 18.5V9h3.2v9.5" />
          <path d="M4.5 18.5h15" />
        </svg>
      ) : variant.key === 'target' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="8.2" />
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 16.5 9 10l4 4 7.5-8.5" />
          <path d="M15.5 5.5H20V10" />
        </svg>
      )}
    </span>
  );
}

export default function MobileOrders({ rows, fmt, fmtUsd, onCancelWithdrawal }: Props) {
  const router = useRouter();
  const [kind, setKind] = useState<KindFilter>('all');

  const visible = rows.filter((r) => {
    if (kind === 'all') return true;
    const k = kind === 'withdraw' ? 'withdrawal' : kind;
    return r.kind === k;
  });

  const goDetails = (row: LedgerRow) => {
    const to = row.kind === 'deposit' ? '/depositHistory' : row.kind === 'withdrawal' ? '/withdrawalHistory' : '/portfolio';
    router.push(to);
  };

  return (
    <>
      {/* ── Top bar (mock order.txt) ── */}
      <header className="k-topbar">
        <span className="k-topbar__spacer" />
        <NotificationButton />
      </header>

      <main style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Screen title */}
        <div style={{ padding: '18px 16px 0' }}>
          <h1 className="k-screen-title" style={{ fontSize: 22 }}>Everything that moved</h1>
          <p style={{ fontSize: 13.5, color: 'var(--fg-2)', marginTop: 4 }}>
            Deposits, withdrawals and bond investments in one ledger.
          </p>
        </div>

        {/* Kind filter — one chip row (mock type filter) */}
        <div className="k-chiprow" style={{ marginTop: 14 }} role="group" aria-label="Filter by type">
          {KIND_CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              className="k-chip"
              aria-pressed={kind === c.id}
              onClick={() => setKind(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Ledger card */}
        <section className="k-card" style={{ margin: '12px 16px 0' }}>
          {visible.length === 0 ? (
            <p className="k-center" style={{ padding: '30px 20px', color: 'var(--fg-3)', fontSize: 13.5 }}>
              Nothing here yet.
            </p>
          ) : (
            <ul className="k-list k-list--flush">
              {visible.map((row, rowIdx) => {
                const isPending = row.status === 'Pending';
                const isPendingWd = isPending && row.kind === 'withdrawal';
                const showProgress = (isPending || row.status === 'Partial Fill') && row.fillPct > 0 && row.fillPct < 100;
                const isStable = STABLES.has(row.instrument) || row.instrument.includes('USD');
                const decimals = isStable ? 2 : row.amount >= 1 ? 2 : 4;
                const emblem = EMBLEMS[rowIdx % EMBLEMS.length];

                // Signed amount trail — deposits credit (mint), outflows debit (down).
                let trailMain: string;
                let trailSub: string;
                if (row.kind === 'investment') {
                  trailMain = `−${fmtUsd(row.amount)}`;
                  trailSub = 'Principal';
                } else if (isStable) {
                  trailMain = `${row.kind === 'deposit' ? '+' : '−'}${fmtUsd(row.amount)}`;
                  trailSub = `${fmt(row.amount)} ${row.instrument}`;
                } else {
                  trailMain = `${row.kind === 'deposit' ? '+' : '−'}${fmt(row.amount, decimals)} ${row.instrument}`;
                  trailSub = row.kind === 'deposit' ? 'Deposit' : 'Withdrawal';
                }
                const trailColor = row.kind === 'deposit' ? 'var(--mint)' : 'var(--down)';

                const sub = whenLabel(row.ts);
                const note = flowNote(row.kind, row.status);

                // Row body shared by the button (details) and div (pending wd) variants.
                // Three stacked lines: header (mark · title/date · status badge),
                // figures (amount · flow note) and progress/action. A one-line
                // table row cannot hold a badge + a 6-figure amount + a title on
                // a 320–390 px phone — the columns collapse and the text paints
                // over its neighbours (see mobile-shell.css § 9b).
                const body = (
                  <>
                    <span className="k-txn">
                      {row.kind === 'investment' ? (
                        <Emblem variant={emblem} />
                      ) : (
                        <CoinMark row={row} />
                      )}
                      <span className="k-txn__main">
                        <span className="k-txn__title">{rowTitle(row)}</span>
                        <span className="k-row__sub num">{sub}</span>
                      </span>
                      <span className={pillClass(row.status)}>{row.status}</span>
                    </span>

                    <span className="k-txn__meta">
                      <span className="k-txn__amount">
                        <span className="num" style={{ color: trailColor }}>{trailMain}</span>
                        <small>{trailSub}</small>
                      </span>
                      <span className="k-txn__note" title={note}>{note}</span>
                    </span>
                  </>
                );

                return (
                  <li key={row.id} data-kind={row.kind === 'withdrawal' ? 'withdraw' : row.kind} data-state={row.status.toLowerCase()}>
                    {isPendingWd ? (
                      <div className="k-row k-row--stack">{body}</div>
                    ) : (
                      <button type="button" className="k-row k-row--stack" onClick={() => goDetails(row)}>
                        {body}
                      </button>
                    )}

                    {/* Progress (pending / partial) + Cancel for pending withdrawals — on its
                        own full-width line so neither the bar nor the button squeezes the row. */}
                    {showProgress && (
                      <div className="k-txn__bar" style={{ margin: '0 14px 12px' }}>
                        <div className="k-progress" aria-hidden>
                          <i style={{ width: `${Math.min(100, Math.max(0, row.fillPct))}%` }} />
                        </div>
                        <span className="k-txn__note">
                          {isPendingWd ? `${Math.round(row.fillPct)}% processed` : `${Math.round(row.fillPct)}%`}
                        </span>
                        {isPendingWd && (
                          <button type="button" className="k-btn k-btn--ghost k-btn--sm" onClick={onCancelWithdrawal}>
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
