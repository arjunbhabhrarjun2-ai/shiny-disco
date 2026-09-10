'use client';

/**
 * Kandella · mobile-only dashboard composition (< md).
 * Mirrors "mobile design/kdla-mobile_dashboard mock design.html" using the
 * .k-* shell system, fed by the same live dashboard data as the desktop view.
 * Desktop rendering is completely separate and untouched.
 */

import { useRouter } from 'next/navigation';
import { useMarketNews, formatTimeAgo } from '@/lib/hooks/useMarketNews';
import NotificationButton from '@/components/NotificationButton';

export interface MobilePositionRow {
  id: any;
  tier: string;
  principal: number;
  roiPct: number;
  accrued: number;
  realizedPct: number;
  daysTotal: number;
  daysElapsed: number;
  progress: number;
}

export interface MobileOrderRow {
  id: string;
  pair: string;
  side: string;
  size: number;
  price: number;
  progress: number;
}

interface Props {
  firstName?: string;
  totalBalance: number;
  available: number;
  accrued: number;
  deposited: number;
  earned: number;
  pnl24h: number;
  pnl24hPct: number;
  positions: MobilePositionRow[];
  openOrders: MobileOrderRow[];
  fmt: (n: number, d?: number) => string;
  fmtCur: (n: number) => string;
}

/** Asset chip colour keyed by base symbol (mimics the mock's coin chips). */
const ASSET_COLORS: Record<string, string> = {
  USDT: '#26A17B',
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  BNB: '#F0B90B',
  XRP: '#23292F',
};

export default function DashboardMobile({
  firstName,
  totalBalance,
  available,
  accrued,
  deposited,
  earned,
  pnl24h,
  pnl24hPct,
  positions,
  openOrders,
  fmt,
  fmtCur,
}: Props) {
  const router = useRouter();
  const { data: news, isLoading: newsLoading, isError: newsError } = useMarketNews();

  const up = pnl24h >= 0;

  return (
    <>
      {/* ── Top bar ── */}
      <header className="k-topbar">
        <span className="k-topbar__spacer" />
        <NotificationButton />
        <span className="k-avatar" style={{ marginLeft: 4 }} aria-hidden>
          {(firstName || 'K').charAt(0).toUpperCase()}
        </span>
      </header>

      <main className="k-mobile-dash" style={{ paddingBottom: 28 }}>
        {/* Greeting */}
        <div style={{ padding: '20px 16px 0' }}>
          <p className="eyebrow"></p>
          <h1 className="k-screen-title" style={{ marginTop: 6 }}>
            Welcome back, {firstName || 'Investor'}.
          </h1>
        </div>

        {/* Balance hero */}
        <section className="k-hero" style={{ margin: '14px 16px 0' }}>
          <p className="k-hero__label">Total balance</p>
          <p className="k-hero__amount num">{fmtCur(totalBalance)}</p>
          <div className="k-hero__delta">
            <span className={up ? 'k-delta k-delta--up' : 'k-delta k-delta--down'}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {up ? <path d="M12 19V5" /> : <path d="M12 5v14" />}
                {up ? <path d="m6 11 6-6 6 6" /> : <path d="m6 13 6 6 6-6" />}
              </svg>
              {up ? '+' : ''}
              {pnl24hPct.toFixed(2)}%
            </span>
            <span className="num" style={{ color: 'var(--fg-2)', fontSize: 13 }}>
              {up ? '+' : ''}
              {fmtCur(pnl24h)} today
            </span>
            <span className="k-pill k-pill--up" style={{ marginLeft: 'auto' }}>
              Portfolio
            </span>
          </div>
        </section>

        {/* Key account figures — 2×2 */}
        <div className="k-metrics" style={{ margin: '12px 16px 0' }}>
          <div className="k-metric"><p className="k-metric__label">Available</p><p className="k-metric__value num">{fmtCur(available)}</p></div>
          <div className="k-metric"><p className="k-metric__label">Accrued</p><p className="k-metric__value num">{fmtCur(accrued)}</p></div>
          <div className="k-metric"><p className="k-metric__label">Deposited</p><p className="k-metric__value num">{fmtCur(deposited)}</p></div>
          <div className="k-metric"><p className="k-metric__label">Earned</p><p className="k-metric__value num">{fmtCur(earned)}</p></div>
        </div>

        {/* Quick terminal */}
        <section className="k-card" style={{ margin: '12px 16px 0', padding: '14px 16px' }}>
          <div>
            <p className="eyebrow">Quick terminal</p>
            <p style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 2 }}>
              Move money or jump straight into a trade.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 12 }}>
            <button type="button" className="k-btn k-btn--primary" onClick={() => router.push('/addFunds')}>
              Deposit
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button type="button" className="k-btn k-btn--ghost" onClick={() => router.push('/withdrawal')}>
                Withdraw
              </button>
              <button type="button" className="k-btn k-btn--soft" onClick={() => router.push('/trade/spot')}>
                Instant trade
              </button>
            </div>
          </div>
        </section>

        {/* Active positions — stacked rows */}
        <div className="k-section">
          <h2 className="k-section__title">Active positions</h2>
          <button type="button" className="k-section__link" onClick={() => router.push('/portfolio')}>
            View all
          </button>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          <ul className="k-list k-list--flush">
            {positions.length === 0 && (
              <li>
                <div className="k-row" style={{ color: 'var(--fg-3)' }}>
                  <span className="k-row__main">
                    <span className="k-row__title" style={{ whiteSpace: 'normal' }}>No active positions</span>
                    <span className="k-row__sub" style={{ whiteSpace: 'normal' }}>Open a plan from Earn to get started.</span>
                  </span>
                </div>
              </li>
            )}
            {positions.map((p, i) => {
              const emblem = ['k-emblem--gold', 'k-emblem--cyan', 'k-emblem--violet'][i % 3];
              return (
                <li
                  key={p.id ?? i}
                  style={{ padding: '15px 16px 16px', borderTop: i > 0 ? '1px solid var(--line-soft)' : undefined }}
                >
                  <button
                    type="button"
                    onClick={() => router.push('/portfolio')}
                    style={{ display: 'block', width: '100%', textAlign: 'left' }}
                  >
                    {/* Header: emblem + name + days, chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className={`k-emblem ${emblem}`} style={{ flex: '0 0 auto' }}>
                        {i % 3 === 1 ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                            <path d="M5.4 18.5v-5.2h3.2v5.2" /><path d="M10.4 18.5v-7.9h3.2v7.9" /><path d="M15.4 18.5V9h3.2v9.5" /><path d="M4.5 18.5h15" />
                          </svg>
                        ) : i % 3 === 2 ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M12 4.2 5.6 6.6v5c0 3.9 2.5 6.5 6.4 7.6 3.9-1.1 6.4-3.7 6.4-7.6v-5L12 4.2Z" /><path d="m9.2 11.7 2 2 3.6-3.8" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                            <circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="3.2" /><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
                          </svg>
                        )}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className="k-row__title" style={{ display: 'block' }}>{p.tier}</span>
                        <span className="k-row__sub num" style={{ display: 'block', whiteSpace: 'normal' }}>
                          {p.daysElapsed} of {p.daysTotal} days elapsed
                        </span>
                      </span>
                      <svg className="k-row__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </div>

                    {/* Figures — given their own row so nothing gets squeezed */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 10,
                        marginTop: 13,
                        paddingTop: 12,
                        borderTop: '1px solid var(--line-soft)',
                      }}
                    >
                      {[
                        { label: 'Invested', value: fmtCur(p.principal), color: 'var(--fg)' },
                        { label: 'Value', value: fmtCur(p.principal + p.accrued), color: 'var(--fg)' },
                        { label: 'Profit', value: `+${fmtCur(p.accrued)}`, color: 'var(--up)' },
                      ].map((m) => (
                        <div key={m.label} style={{ minWidth: 0 }}>
                          <span
                            style={{
                              display: 'block',
                              fontSize: 9.5,
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--fg-3)',
                              marginBottom: 3,
                            }}
                          >
                            {m.label}
                          </span>
                          <span
                            className="num"
                            style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: m.color, whiteSpace: 'nowrap' }}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress + ROI */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                      <div className="k-progress k-progress--gold" style={{ flex: 1 }} aria-hidden>
                        <i style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="num" style={{ fontSize: 11, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
                        {p.progress}% · ROI {p.roiPct.toFixed(1)}%
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Pending queue */}
        <div className="k-section">
          <h2 className="k-section__title">Pending transactions</h2>
          <button type="button" className="k-section__link" onClick={() => router.push('/transaction')}>
            View all
          </button>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          <ul className="k-list k-list--flush">
            {openOrders.length === 0 && (
              <li>
                <div className="k-row" style={{ color: 'var(--fg-3)' }}>
                  <span className="k-row__main">
                    <span className="k-row__title" style={{ whiteSpace: 'normal' }}>Nothing pending</span>
                    <span className="k-row__sub" style={{ whiteSpace: 'normal' }}>Deposits and withdrawals will appear here.</span>
                  </span>
                </div>
              </li>
            )}
            {openOrders.map((o, idx) => {
              const isDeposit = o.side === 'DEPOSIT';
              const base = (o.pair || 'USDT').replace(/\/.*$/, '').toUpperCase();
              const coin = ASSET_COLORS[base] || '#D4AF7F';
              const approxUsd = o.price > 0 ? o.size * o.price : 0;
              const confirms = Math.max(1, Math.min(3, Math.round((o.progress / 100) * 3)));
              return (
                <li
                  key={o.id}
                  style={{ padding: '15px 16px 16px', borderTop: idx > 0 ? '1px solid var(--line-soft)' : undefined }}
                >
                  <button
                    type="button"
                    onClick={() => router.push('/transaction')}
                    style={{ display: 'block', width: '100%', textAlign: 'left' }}
                  >
                    {/* Header: coin + type + status pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="k-emblem" style={{ background: `${coin}26`, color: coin, flex: '0 0 auto' }}>
                        <span style={{ fontSize: 13, fontWeight: 800 }}>{base.charAt(0)}</span>
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className="k-row__title" style={{ display: 'block' }}>
                          {base} {isDeposit ? 'Deposit' : 'Withdraw'}
                        </span>
                        <span className="k-row__sub" style={{ display: 'block', whiteSpace: 'normal' }}>
                          {isDeposit ? `Confirmations ${confirms} / 3` : 'Network review in progress'}
                        </span>
                      </span>
                      <span className="k-pill k-pill--pending" style={{ flex: '0 0 auto' }}>Pending</span>
                    </div>

                    {/* Figures on their own row */}
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
                          Amount
                        </span>
                        <span
                          className="num"
                          style={{
                            display: 'block', fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap',
                            color: isDeposit ? 'var(--mint)' : 'var(--down)',
                          }}
                        >
                          {isDeposit ? '+' : '−'}{fmt(o.size, base === 'USDT' ? 2 : 4)} {base}
                        </span>
                      </div>
                      <div style={{ minWidth: 0, textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'block', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 3,
                          }}
                        >
                          Value
                        </span>
                        <span className="num" style={{ display: 'block', fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {approxUsd > 0 ? `≈ ${fmtCur(approxUsd)}` : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Progress + status detail */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                      <div className="k-progress" style={{ flex: 1 }} aria-hidden>
                        <i
                          style={{
                            width: `${o.progress}%`,
                            background: isDeposit
                              ? 'linear-gradient(90deg, var(--up-2), var(--up))'
                              : undefined,
                          }}
                        />
                      </div>
                      <span className="num" style={{ fontSize: 11, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
                        {isDeposit ? `${confirms} of 3 confirmations` : 'In review'}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Yield */}
        <div className="k-section">
          <h2 className="k-section__title">Yield</h2>
        </div>
        <section className="k-card" style={{ margin: '0 16px', padding: 16 }}>
          <p className="eyebrow">Staking rewards</p>
          <p className="num" style={{ fontSize: 28, fontWeight: 780, letterSpacing: '-0.03em', marginTop: 6, lineHeight: 1.1 }}>
            {fmtCur(earned)}
          </p>
          <p style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 5, lineHeight: 1.5 }}>
            Accrued yield on your active positions
          </p>
          <button
            type="button"
            className="k-btn k-btn--ghost k-btn--block"
            style={{ marginTop: 16 }}
            onClick={() => router.push('/stake')}
          >
            Manage yield
          </button>
        </section>

        {/* Market news */}
        <div className="k-section">
          <h2 className="k-section__title">Market news</h2>
          <span className="k-news__live" aria-hidden>LIVE</span>
        </div>
        <section className="k-card" style={{ margin: '0 16px' }}>
          {newsLoading && (
            <p className="k-muted" style={{ padding: 18, fontSize: 13 }}>
              Loading market news…
            </p>
          )}
          {!newsLoading && (newsError || !news?.articles?.length) && (
            <p className="k-muted" style={{ padding: 18, fontSize: 13 }}>
              {newsError ? 'Failed to load market news' : 'No market news available'}
            </p>
          )}
          {!newsLoading && !!news?.articles?.length && (
            <ul className="k-news">
              {news.articles.slice(0, 8).map((a: any, i: number) => (
                <li key={`${a.url}-${i}`}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      width: '100%',
                      textAlign: 'left',
                      padding: '11px 10px 12px',
                      borderRadius: 12,
                    }}
                  >
                    {a.image && (
                      <span className="k-news__thumb">
                        <img src={a.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </span>
                    )}
                    <span className="k-news__body">
                      <span className="k-news__title">{a.title}</span>
                      {a.description && <span className="k-news__desc">{a.description}</span>}
                      <span className="k-news__meta">
                        <b>{a.source}</b> · {formatTimeAgo(a.publishedAt)}
                        <svg className="k-news__ext" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M7 17 17 7" />
                          <path d="M8 7h9v9" />
                        </svg>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
