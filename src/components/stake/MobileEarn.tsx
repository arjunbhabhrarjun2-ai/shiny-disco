'use client';

/**
 * Kandella Earn · mobile-only composition (< md).
 * Mirrors ".qa/bodies/earn.txt" (KANDELLA mobile prototype · earn) using the
 * shared .k-* shell system from src/app/mobile-shell.css. Every figure is fed
 * by the same live data the desktop /stake page renders (useDashboard +
 * the protocol/bond arrays defined there); only decorative copy follows the
 * mock. Desktop rendering lives in the page and is completely separate.
 *
 * The bottom tab bar is already rendered by <Sidebar /> (< md), so this
 * composition provides the content column only (top bar + main sections).
 */

import { useRouter } from 'next/navigation';
import NotificationButton from '@/components/NotificationButton';
import CoinIcon from '@/components/CoinIcon';

export interface EarnProtocolRow {
  symbol: string; // coin ticker for the real logo (eth/sol/trx)
  name: string; // e.g. "Ethereum"
  sub: string; // e.g. "Lido Liquid"
  apyPct: number; // annual APY percent (37.5 → "37.5%")
  staked: number; // USD principal allocated to this pool (live total × mix)
}

export interface EarnBondRow {
  plan: string; // INVESTMENT_PLANS key: mining | premium | gold
  tier: string; // e.g. "Core Yield Fund"
  tierColor: string; // e.g. "TIER 01"
  roiPct: number; // term coupon percent (30 / 40 / 55)
  duration: string; // e.g. "30 Days"
  icon: React.ReactNode;
}

export interface MobileEarnProps {
  /** Live USD sum of active investment principals. */
  totalActive: number;
  /** Live Σ (protocol stake × protocol APY) — shown as est. annual yield. */
  estAnnualYield: number;
  /** Number of protocol pools currently carrying capital (hero pill). */
  protocolsActive: number;
  /** Portfolio maturity: weighted elapsed days across active investments. */
  maturityElapsedDays: number;
  /** Portfolio maturity: weighted term length in days (30 for all plans). */
  maturityTotalDays: number;
  protocols: EarnProtocolRow[];
  bonds: EarnBondRow[];
  /** Live transactions from the dashboard API (recentActivities). */
  activities: any[];
  /** Display-currency formatter (same fn the desktop page uses). */
  fmtCur: (usd: number) => string;
}

// The private ATRIUM coin app the protocol cards drive (same env constants
// as the desktop stake page — keeps the mobile actions identical).
const ATRIUM_URL = process.env.NEXT_PUBLIC_ATRIUM_URL || 'http://localhost:3001';
const ATRIUM_KEY = process.env.NEXT_PUBLIC_ATRIUM_KEY || 'atrium-staking';

/* Presentational copy/tone from the mock, keyed to the live protocol rows.
   Kept short enough to survive a 320 px phone without being ellipsized. */
const PROTOCOL_SCHEDULE: Record<string, string> = {
  eth: 'Liquid · daily yield',
  sol: 'Fixed 32.2% · 21-day epoch',
  trx: 'Base 8.4% · hourly rewards',
};
const PROTOCOL_APY_TONE: Record<string, string> = {
  eth: 'var(--accent-soft)',
  sol: 'var(--up)',
  trx: 'var(--fg-2)',
};

/* Bond-card styling per plan key (mock tiers 01 / popular / elite). */
const BOND_STYLE: Record<
  string,
  { emblem: string; strip: string; caption: string; popular?: boolean }
> = {
  mining: {
    emblem: 'k-emblem--gold',
    strip: 'linear-gradient(90deg, var(--accent-deep), var(--accent))',
    caption: 'Paid at maturity',
  },
  premium: {
    emblem: 'k-emblem--cyan',
    strip: 'var(--pri-grad)',
    caption: 'Fixed coupon',
    popular: true,
  },
  gold: {
    emblem: 'k-emblem--violet',
    strip: 'linear-gradient(90deg, var(--violet), var(--pri-1))',
    caption: 'Priority desk',
  },
};

/* ── Reward-history helpers ─────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "19 Jun · 08:00" — matches the activity rows in the mock. */
function fmtStamp(value?: string | Date): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type ActivityGlyphKind = 'reward' | 'bond' | 'deposit' | 'withdrawal' | 'other';

const GLYPH_STYLE: Record<ActivityGlyphKind, { bg: string; fg: string }> = {
  reward: { bg: 'rgba(6,182,212,0.15)', fg: '#67E8F9' },
  bond: { bg: 'rgba(168,85,247,0.16)', fg: '#C4B5FD' },
  deposit: { bg: 'rgba(212,175,127,0.14)', fg: '#EBD4AA' },
  withdrawal: { bg: 'rgba(244,63,94,0.12)', fg: '#FB7185' },
  other: { bg: 'rgba(212,175,127,0.14)', fg: '#EBD4AA' },
};

function ActivityGlyph({ kind }: { kind: ActivityGlyphKind }) {
  const { bg, fg } = GLYPH_STYLE[kind];
  return (
    <span className="k-row__glyph" style={{ background: bg }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {kind === 'reward' && (<><path d="M4 17 9.5 11l4 3 6.5-8" /><path d="M15 6h5v5" /></>)}
        {kind === 'bond' && (<><path d="M5.4 18.5v-5.2h3.2v5.2" /><path d="M10.4 18.5v-7.9h3.2v7.9" /><path d="M15.4 18.5V9h3.2v9.5" /><path d="M4.5 18.5h15" /></>)}
        {kind === 'deposit' && (<><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /></>)}
        {kind === 'withdrawal' && (<><path d="M12 19V8" /><path d="m7 12 5-5 5 5" /></>)}
        {kind === 'other' && (<><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="3.2" /></>)}
      </svg>
    </span>
  );
}

interface ActivityRowSpec {
  glyph: ActivityGlyphKind;
  title: string;
  sub: string;
  sign: string;
  amountColor?: string;
  small: string;
  pill: { text: string; cls: string };
}

/** Maps a live transaction onto the mock's reward-history row shape. */
function describeActivity(a: any): ActivityRowSpec {
  const type = String(a?.type ?? a?.kind ?? '').toLowerCase();
  const amount = Number(a?.amount) || 0;
  const success = String(a?.status ?? '').toLowerCase() === 'success';
  const ts = fmtStamp(a?.createdAt ?? a?.timestamp);
  const paid = { text: 'Paid', cls: 'k-pill--ok' };
  const pending = { text: 'Pending', cls: 'k-pill--pending' };
  const sign = amount < 0 ? '-' : '+';
  // The sub-line carries only the timestamp: the row title already names the
  // kind of movement, and longer sentences were being ellipsized on a 320 px
  // phone (the amount line below carries the "Yield"/"Principal" caption).
  switch (type) {
    case 'roi':
    case 'interest':
    case 'reward':
      return {
        glyph: 'reward',
        title: type === 'interest' ? 'Interest credit' : 'Staking reward',
        sub: ts,
        sign,
        amountColor: 'var(--up)',
        small: 'Yield',
        pill: success ? paid : pending,
      };
    case 'invest':
    case 'investment':
    case 'bond':
      // Principal is committed for the full 30-day term (paid out at maturity).
      return {
        glyph: 'bond',
        title: 'Bond cycle',
        sub: ts,
        sign: '-',
        small: 'Principal',
        pill: { text: 'Running', cls: 'k-pill--neutral' },
      };
    case 'deposit':
      return { glyph: 'deposit', title: 'Deposit', sub: ts, sign, small: 'Credit', pill: success ? paid : pending };
    case 'withdrawal':
    case 'withdraw':
      return { glyph: 'withdrawal', title: 'Withdrawal', sub: ts, sign: '-', small: 'Debit', pill: success ? paid : pending };
    default: {
      const title = typeof a?.description === 'string' && a.description ? a.description : 'Activity';
      return { glyph: 'other', title, sub: ts, sign, small: '', pill: success ? paid : pending };
    }
  }
}

export default function MobileEarn({
  totalActive,
  estAnnualYield,
  protocolsActive,
  maturityElapsedDays,
  maturityTotalDays,
  protocols,
  bonds,
  activities,
  fmtCur,
}: MobileEarnProps) {
  const router = useRouter();

  // Same flow the desktop protocol cards use: open the private stake app.
  const openAtrium = () => {
    const sep = ATRIUM_URL.includes('?') ? '&' : '?';
    window.open(`${ATRIUM_URL}${sep}k=${encodeURIComponent(ATRIUM_KEY)}`, '_blank', 'noopener,noreferrer');
  };

  const maturityPct =
    maturityTotalDays > 0 ? Math.min(100, (maturityElapsedDays / maturityTotalDays) * 100) : 0;

  return (
    <>
      {/* ── Top bar (mock: spacer + notifications) ── */}
      <header className="k-topbar">
        <span className="k-topbar__spacer" />
        <NotificationButton />
      </header>

      <main style={{ paddingBottom: 12 }}>
        {/* Screen title */}
        <div style={{ padding: '20px 16px 0' }}>
          <p className="eyebrow">Active capital · Kandella Earn</p>
          <h1 className="k-screen-title" style={{ marginTop: 6 }}>
            Yield strategy desk
          </h1>
        </div>

        {/* ── Staked capital hero ── */}
        <section className="k-hero" style={{ margin: '14px 16px 0' }}>
          <p className="k-hero__label">Staked capital</p>
          <p className="k-hero__amount num">{fmtCur(totalActive)}</p>
          <div className="k-hero__delta">
            <span className="k-pill k-pill--up">
              {protocolsActive} {protocolsActive === 1 ? 'protocol' : 'protocols'} active
            </span>
            <span className="num" style={{ color: 'var(--fg-2)', fontSize: 13 }}>
              Est. annual yield
            </span>
            <span className="k-delta k-delta--up">+{fmtCur(estAnnualYield)}</span>
          </div>
          <div className="k-progress k-progress--gold" style={{ marginTop: 16 }} aria-hidden>
            <i style={{ width: `${Math.round(maturityPct)}%` }} />
          </div>
          <p className="num" style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 7 }}>
            Cycle maturity · {Math.round(maturityElapsedDays)} of {Math.round(maturityTotalDays)} days ·
            pays out at term end
          </p>
        </section>

        {/* ── Staking protocols ── */}
        <div className="k-section">
          <h2 className="k-section__title">Staking protocols</h2>
          <button type="button" className="k-section__link" onClick={openAtrium}>
            Stake more
          </button>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          <ul className="k-list k-list--flush">
            {protocols.map((p, i) => (
              <li
                key={p.symbol}
                style={{ padding: '15px 16px 16px', borderTop: i > 0 ? '1px solid var(--line-soft)' : undefined }}
              >
                <button
                  type="button"
                  onClick={openAtrium}
                  style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  {/* Header: coin + protocol name + schedule */}
                  <div className="k-txn">
                    <span className="k-logo" style={{ overflow: 'hidden', flex: '0 0 auto' }} aria-hidden>
                      <CoinIcon symbol={p.symbol} size={40} />
                    </span>
                    <span className="k-txn__main">
                      <span className="k-txn__title">
                        {p.name} · {p.sub}
                      </span>
                      <span className="k-row__sub">
                        {PROTOCOL_SCHEDULE[p.symbol] ?? `${p.apyPct.toFixed(1)}% APY schedule`}
                      </span>
                    </span>
                  </div>

                  {/* Figures — auto-fit grid keeps both values readable */}
                  <div className="k-figs">
                    <div className="k-fig">
                      <span className="k-fig__label">Staked</span>
                      <span className="k-fig__value num">{fmtCur(p.staked)}</span>
                    </div>
                    <div className="k-fig k-fig--end">
                      <span className="k-fig__label">APY</span>
                      <span
                        className="k-fig__value num"
                        style={{ color: PROTOCOL_APY_TONE[p.symbol] ?? 'var(--fg)' }}
                      >
                        {p.apyPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Yield bonds (live INVESTMENT_PLANS tiers) ── */}
        <div className="k-section">
          <h2 className="k-section__title">Yield bonds</h2>
          <button type="button" className="k-section__link" onClick={() => router.push('/investmentPlans')}>
            All plans
          </button>
        </div>
        <section style={{ margin: '0 16px' }}>
          {bonds.map((b) => {
            const s = BOND_STYLE[b.plan] ?? BOND_STYLE.mining;
            // Short display forms used by the mobile design (mock labels).
            const name = b.tier.replace(/ Fund$/, '');
            const tag = b.tierColor.replace(' TIER', '');
            return (
              <button
                key={b.plan}
                type="button"
                className="k-card"
                onClick={() => router.push('/investmentPlans')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: 18,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  ...(s.popular
                    ? { borderColor: 'color-mix(in oklch, var(--pri-1) 55%, transparent)' }
                    : {}),
                }}
              >
                <span aria-hidden style={{ position: 'absolute', inset: '0 0 auto 0', height: 3, background: s.strip }} />
                {/* Header row: the "Popular" badge sits in the flow (it used to be
                    absolutely positioned and painted over the title on narrow
                    phones); the label truncates instead. */}
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span className="eyebrow" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {/* The badge already says "Popular" — repeating it in the label
                        only pushed the label into an ellipsis on narrow phones. */}
                    {s.popular ? name : `${name} · ${tag}`}
                  </span>
                  {s.popular && <span className="k-pill k-pill--up" style={{ marginLeft: 'auto' }}>Popular</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
                  <span className={`k-emblem ${s.emblem}`} aria-hidden>
                    {b.icon}
                  </span>
                  <span
                    className="num"
                    style={{ fontSize: 34, fontWeight: 780, letterSpacing: '-0.03em', lineHeight: 1 }}
                  >
                    {b.roiPct}%
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 'auto' }}>
                    <span className="k-pill k-pill--neutral">{String(b.duration).toLowerCase()}</span>
                    <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{s.caption}</span>
                  </span>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            className="k-btn k-btn--primary k-btn--lg k-btn--block"
            style={{ marginTop: 14 }}
            onClick={() => router.push('/investmentPlans')}
          >
            Explore bond plans
          </button>
        </section>

        {/* ── Reward history (live recent activities) ── */}
        <div className="k-section">
          <h2 className="k-section__title">Reward history</h2>
          <button type="button" className="k-section__link" onClick={() => router.push('/transaction')}>
            View all
          </button>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          {activities.length === 0 ? (
            <div className="k-row" style={{ color: 'var(--fg-3)' }}>
              <span className="k-row__main">
                <span className="k-row__title">No reward distributions yet</span>
                <span className="k-row__sub">Subscribe to a bond plan above to start earning.</span>
              </span>
            </div>
          ) : (
            <ul className="k-list k-list--flush">
              {activities.slice(0, 4).map((a: any, i: number) => {
                const row = describeActivity(a);
                return (
                  <li
                    key={a?.id ?? i}
                    style={{ padding: '15px 16px 16px', borderTop: i > 0 ? '1px solid var(--line-soft)' : undefined }}
                  >
                    <button
                      type="button"
                      onClick={() => router.push('/transaction')}
                      style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                    >
                      {/* Header: glyph + title + status pill */}
                      <div className="k-txn">
                        <ActivityGlyph kind={row.glyph} />
                        <span className="k-txn__main">
                          <span className="k-txn__title">{row.title}</span>
                          <span className="k-row__sub num">{row.sub}</span>
                        </span>
                        <span className={`k-pill ${row.pill.cls}`}>{row.pill.text}</span>
                      </div>

                      {/* Amount line — label left, value right; the value keeps its
                          own width so it can never be squeezed into the label. */}
                      <div className="k-txn__meta">
                        <span className="k-fig__label" style={{ marginBottom: 0 }}>Amount</span>
                        <span className="k-txn__amount" style={{ textAlign: 'right' }}>
                          <span
                            className="num"
                            style={row.amountColor ? { color: row.amountColor } : undefined}
                          >
                            {row.sign}
                            {fmtCur(Math.abs(Number(a?.amount) || 0))}
                          </span>
                          {row.small && <small>{row.small}</small>}
                        </span>
                      </div>
                    </button>
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
