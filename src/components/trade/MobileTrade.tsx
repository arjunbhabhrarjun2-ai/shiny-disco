'use client';

/**
 * Kandella · mobile-only Trade (spot) composition (< md).
 * Faithful port of the trade mock's <main> (instrument header, market chips,
 * live candlestick SVG, Ticket / Order book / Open orders tabs) using the .k-*
 * shell system + inline styles. Desktop rendering is separate and untouched.
 *
 * Every action is wired to the same live data/API the desktop TradeTerminal
 * uses: useTickers / useMarketData / useHoldings / useSpotOrders, the
 * /api/market/candles history feed and tradeApi.createSpotOrder — so Buy/Sell,
 * market switching, Max / Use-market and balance checks behave like the app.
 *
 * v2 additions (mobile only):
 *  · "Search pair" field in the k-topbar (magnifier + clear) filtering the
 *    market row live by base / quote / symbol / name, with an empty state.
 *  · The FULL market table (MARKETS, same source the desktop terminal uses)
 *    as a scrollable k-chiprow — symbol + live price + 24h change per chip.
 *  · A responsive SVG candlestick chart (bodies + wicks, price axis, time
 *    axis, gradient backdrop, dashed last-price marker + live badge) with an
 *    Expand control that opens the same chart full-screen.
 */

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useTickers } from '@/lib/hooks/useTickers';
import { useMarketData } from '@/lib/hooks/useMarketData';
import { useHoldings } from '@/lib/hooks/useHoldings';
import { useSpotOrders } from '@/lib/hooks/useSpotOrders';
import { getMarket, MARKETS, TRADE_FEE_RATE } from '@/lib/market/symbols';
import NotificationButton from '@/components/NotificationButton';

/* ── Formatting (identical to TradeTerminal) ────────────────────────── */
const fmt = (n: number, d = 2) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => `$${fmt(n)}`;

/** Axis / tag prices: the visible range decides how many decimals actually
 *  read (a BTC axis wants 64,000 while a SHIB axis needs 0.0000241). */
const axisDigits = (min: number, max: number, decimals: number) => {
  const span = max - min;
  if (!(span > 0)) return decimals;
  return Math.max(0, Math.min(decimals, Math.ceil(-Math.log10(span / 4)) + 1));
};

/* ── Chart ─────────────────────────────────────────────────────────────── */
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TF_CHIPS = ['1H', '4H', '1D', '1W'] as const; // intervals the candles feed supports
type Tf = (typeof TF_CHIPS)[number];

const CHART_PAD = { left: 10, right: 68, top: 14, bottom: 22 };
const INLINE_CHART_H = 180;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/* Small amount of self-contained motion for the live badge / overlay, plus the
   native search-field reset. Kept in this file (no shell CSS edits) and
   namespaced so it cannot clash with the shipped shell classes. */
const CHART_CSS = `
@keyframes k-mtrade-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.72); } }
.k-mtrade-live::before { animation: k-mtrade-pulse 1.9s ease-in-out infinite; }
@keyframes k-mtrade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.k-mtrade-overlay { animation: k-mtrade-in .2s cubic-bezier(.22, 1, .36, 1) both; }
.k-mtrade-search input[type="search"]::-webkit-search-cancel-button,
.k-mtrade-search input[type="search"]::-webkit-search-decoration { -webkit-appearance: none; appearance: none; }
@media (prefers-reduced-motion: reduce) {
  .k-mtrade-live::before, .k-mtrade-overlay { animation: none !important; }
}
`;

interface Bar {
  key: number;
  up: boolean;
  time: number;
  cx: number;
  yHigh: number;
  yLow: number;
  yTop: number;
  bh: number;
}

interface Plot {
  bars: Bar[];
  bodyW: number;
  ticks: { y: number; label: string }[];
  timeTicks: { key: number; x: number; label: string }[];
  plotW: number;
  plotH: number;
  lastY: number;
  lastLabel: string;
  lastCx: number;
}

/**
 * Responsive SVG candlestick chart. Measured in CSS pixels (1 viewBox unit =
 * 1 px) so bodies, wicks, axis type and gridlines stay crisp and identical in
 * the inline card and in the full-screen viewer — no chart library, and the
 * data is the same /api/market/candles feed the desktop TradingChart reads.
 */
function CandleChart({
  candles,
  interval,
  loading,
  error,
  priceDecimals,
  expanded = false,
}: {
  candles: Candle[];
  interval: Tf;
  loading: boolean;
  error: string | null;
  priceDecimals: number;
  expanded?: boolean;
}) {
  const rawId = useId();
  const uid = useMemo(() => `kch${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [rawId]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // Track the live pixel box (inline card, rotation, expanded overlay).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const plot = useMemo<Plot | null>(() => {
    const { w, h } = box;
    if (!candles.length || w < 60 || h < 60) return null;
    const plotW = w - CHART_PAD.left - CHART_PAD.right;
    const plotH = h - CHART_PAD.top - CHART_PAD.bottom;
    if (plotW < 40 || plotH < 40) return null;

    // Bucket the feed into a readable number of bars for the available width.
    const maxBars = Math.round(clamp(Math.floor(plotW / 9), 12, expanded ? 72 : 40));
    const total = Math.min(maxBars, candles.length);
    const buckets: Candle[] = [];
    for (let i = 0; i < total; i++) {
      const from = Math.floor((candles.length * i) / total);
      const to = Math.max(from + 1, Math.floor((candles.length * (i + 1)) / total));
      const chunk = candles.slice(from, Math.min(to, candles.length));
      let hi = -Infinity;
      let lo = Infinity;
      for (const c of chunk) {
        if (c.high > hi) hi = c.high;
        if (c.low < lo) lo = c.low;
      }
      buckets.push({
        time: chunk[0].time,
        open: chunk[0].open,
        close: chunk[chunk.length - 1].close,
        high: hi,
        low: lo,
      });
    }

    let lo = Infinity;
    let hi = -Infinity;
    for (const b of buckets) {
      if (b.low < lo) lo = b.low;
      if (b.high > hi) hi = b.high;
    }
    const span = hi - lo || Math.abs(hi) * 0.01 || 1;
    const min = lo - span * 0.08;
    const max = hi + span * 0.08;
    const range = max - min || 1;

    const slot = plotW / buckets.length;
    const y = (p: number) => CHART_PAD.top + (1 - (p - min) / range) * plotH;
    const bodyW = Math.max(1.5, Math.min(slot * 0.62, expanded ? 24 : 14));

    const bars: Bar[] = buckets.map((b, i) => {
      const yO = y(b.open);
      const yC = y(b.close);
      return {
        key: i,
        up: b.close >= b.open,
        time: b.time,
        cx: CHART_PAD.left + (i + 0.5) * slot,
        yHigh: y(b.high),
        yLow: y(b.low),
        yTop: Math.min(yO, yC),
        bh: Math.max(1.2, Math.abs(yC - yO)),
      };
    });

    const digits = axisDigits(min, max, priceDecimals);
    const fmtTick = (p: number) =>
      p.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    const ticks = [0, 1, 2, 3, 4].map((s) => {
      const p = min + (range * s) / 4;
      return { y: y(p), label: fmtTick(p) };
    });

    const stops = expanded ? 6 : 4;
    const timeTicks = Array.from({ length: stops + 1 }, (_, s) => {
      const b = bars[Math.round(((bars.length - 1) * s) / stops)];
      const d = new Date(b.time * 1000);
      return {
        key: s,
        x: clamp(b.cx, CHART_PAD.left + 16, CHART_PAD.left + plotW - 16),
        label:
          interval === '1D' || interval === '1W'
            ? `${d.getMonth() + 1}/${d.getDate()}`
            : `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
      };
    });

    const last = buckets[buckets.length - 1];
    return {
      bars,
      bodyW,
      ticks,
      timeTicks,
      plotW,
      plotH,
      lastY: y(last.close),
      lastLabel: fmtTick(last.close),
      lastCx: bars[bars.length - 1].cx,
    };
  }, [box, candles, expanded, interval, priceDecimals]);

  const ready = box.w >= 60 && box.h >= 60;
  const emptyMsg = loading ? 'Loading chart…' : error ? 'Chart unavailable' : 'No data yet';
  const upSeries = candles.length
    ? candles[candles.length - 1].close >= candles[0].open
    : true;
  const tint = upSeries ? 'var(--up)' : 'var(--down)';
  const axisFont = expanded ? 11 : 10.5;
  const tagW = CHART_PAD.right - 4;

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: expanded ? undefined : INLINE_CHART_H,
        flex: expanded ? '1 1 auto' : undefined,
        minHeight: expanded ? 0 : undefined,
      }}
    >
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11.5,
            color: 'var(--fg-3)',
          }}
        >
          {emptyMsg}
        </div>
      )}

      {ready && (
        <svg
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          role="img"
          aria-label={`${interval} candlestick price chart`}
          style={{ display: 'block', width: '100%', height: '100%' }}
        >
          <defs>
            {/* soft backdrop tinted by the visible trend */}
            <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: tint, stopOpacity: 0.15 }} />
              <stop offset="52%" style={{ stopColor: tint, stopOpacity: 0.04 }} />
              <stop offset="100%" style={{ stopColor: tint, stopOpacity: 0 }} />
            </linearGradient>
            {/* live-edge glow behind the newest candles */}
            <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" style={{ stopColor: tint, stopOpacity: 0 }} />
              <stop offset="100%" style={{ stopColor: tint, stopOpacity: 0.24 }} />
            </linearGradient>
          </defs>

          {!plot && (
            <text
              x={box.w / 2}
              y={box.h / 2}
              textAnchor="middle"
              fontSize="11.5"
              style={{ fill: 'var(--fg-3)' }}
            >
              {emptyMsg}
            </text>
          )}

          {plot && (
            <>
              {/* plot backdrop + hairline frame */}
              <rect
                x={CHART_PAD.left}
                y={CHART_PAD.top}
                width={plot.plotW}
                height={plot.plotH}
                rx="12"
                fill={`url(#${uid}-area)`}
              />
              <rect
                x={CHART_PAD.left + 0.5}
                y={CHART_PAD.top + 0.5}
                width={plot.plotW - 1}
                height={plot.plotH - 1}
                rx="12"
                fill="none"
                strokeWidth="1"
                style={{ stroke: 'var(--line-soft)' }}
              />

              {/* horizontal gridlines + right-hand price axis */}
              <g>
                {plot.ticks.map((t, i) => (
                  <line
                    key={`g${i}`}
                    x1={CHART_PAD.left}
                    x2={CHART_PAD.left + plot.plotW}
                    y1={t.y}
                    y2={t.y}
                    strokeWidth="1"
                    style={{ stroke: 'var(--line)' }}
                  />
                ))}
                <g fontSize={axisFont} className="num" style={{ fill: 'var(--fg-3)' }}>
                  {plot.ticks.map((t, i) => (
                    <text key={`p${i}`} x={CHART_PAD.left + plot.plotW + 8} y={t.y + 3.6}>
                      {t.label}
                    </text>
                  ))}
                </g>
              </g>

              {/* live-edge glow */}
              <rect
                x={clamp(plot.lastCx - 30, CHART_PAD.left, CHART_PAD.left + plot.plotW - 60)}
                y={CHART_PAD.top}
                width={60}
                height={plot.plotH}
                fill={`url(#${uid}-glow)`}
              />

              {/* candles: wick + body, coloured from the shell tokens */}
              <g>
                {plot.bars.map((b) => (
                  <g
                    key={b.key}
                    style={{
                      fill: b.up ? 'var(--up)' : 'var(--down)',
                      stroke: b.up ? 'var(--up)' : 'var(--down)',
                    }}
                  >
                    <line x1={b.cx} x2={b.cx} y1={b.yHigh} y2={b.yLow} strokeWidth="1" />
                    <rect
                      x={b.cx - plot.bodyW / 2}
                      y={b.yTop}
                      width={plot.bodyW}
                      height={b.bh}
                      rx={Math.min(2, plot.bodyW / 3)}
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  </g>
                ))}
              </g>

              {/* last price: dashed marker line + accent axis tag */}
              <line
                x1={CHART_PAD.left}
                x2={CHART_PAD.left + plot.plotW}
                y1={plot.lastY}
                y2={plot.lastY}
                strokeWidth="1"
                strokeDasharray="3 3"
                style={{ stroke: 'var(--accent)', opacity: 0.6 }}
              />
              <rect
                x={CHART_PAD.left + plot.plotW + 2}
                y={plot.lastY - 8.5}
                width={tagW}
                height={17}
                rx="5"
                style={{ fill: 'var(--accent)' }}
              />
              <text
                className="num"
                x={CHART_PAD.left + plot.plotW + 7}
                y={plot.lastY + 3.6}
                fontSize={axisFont}
                fontWeight="700"
                style={{ fill: '#0B0D10' }}
              >
                {plot.lastLabel}
              </text>

              {/* time axis */}
              <g fontSize={axisFont} textAnchor="middle" className="num" style={{ fill: 'var(--fg-3)' }}>
                {plot.timeTicks.map((t) => (
                  <text key={`t${t.key}`} x={t.x} y={CHART_PAD.top + plot.plotH + 14}>
                    {t.label}
                  </text>
                ))}
              </g>
            </>
          )}
        </svg>
      )}
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function MobileTrade() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [priceInput, setPriceInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [tab, setTab] = useState<'ticket' | 'book' | 'orders'>('ticket');
  const [tf, setTf] = useState<Tf>('1D');
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  // ── Live data (same sources as TradeTerminal) ──
  const { tickers } = useTickers();
  const { orderBook } = useMarketData(activeSymbol, 5000);
  const { quote, holdings, mutate: refreshHoldings } = useHoldings();
  const { openOrders, isSubmitting, submitOrder, cancelOrder } = useSpotOrders({
    symbol: activeSymbol,
    product: 'spot',
  });

  const market = getMarket(activeSymbol) ?? MARKETS[0];

  const livePrice = useMemo(() => {
    const t = tickers.find((x) => x.symbol === activeSymbol);
    if (t?.price) return t.price;
    // Guard against a stale book belonging to the previously selected market.
    if (orderBook && orderBook.symbol === activeSymbol) return orderBook.mid;
    return market.reference;
  }, [tickers, activeSymbol, orderBook, market.reference]);

  const ticker = tickers.find((t) => t.symbol === activeSymbol);
  const change24h = ticker?.change24h ?? 0;
  const chgUp = change24h >= 0;
  const sign = change24h > 0 ? '+' : change24h < 0 ? '-' : '';
  // 24h $ move derived from the pct change (mock shows a $ delta next to the pill).
  const deltaUsd =
    change24h !== 0 && livePrice ? livePrice - livePrice / (1 + change24h / 100) : 0;

  // ── Market list: the app's full market table, enriched with live tickers ──
  const markets = useMemo(() => {
    const bySymbol = new Map(tickers.map((t) => [t.symbol, t]));
    return MARKETS.map((m) => {
      const t = bySymbol.get(m.symbol);
      return {
        symbol: m.symbol,
        base: m.base,
        quote: m.quote,
        name: m.name,
        priceDecimals: m.priceDecimals,
        price: t?.price ?? m.reference,
        chg: t ? t.change24h : null,
      };
    });
  }, [tickers]);

  const q = query.trim().toLowerCase();
  const filteredMarkets = useMemo(() => {
    if (!q) return markets;
    return markets.filter(
      (m) =>
        m.base.toLowerCase().includes(q) ||
        m.quote.toLowerCase().includes(q) ||
        m.symbol.toLowerCase().includes(q) ||
        `${m.base}/${m.quote}`.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q),
    );
  }, [markets, q]);

  // Keep the selected chip in view (the row holds the whole market table).
  const activeChipRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const el = activeChipRef.current;
    if (!el || typeof el.scrollIntoView !== 'function') return;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeSymbol, q]);

  // Keep the limit price field in sync with the selected market.
  useEffect(() => {
    setPriceInput(livePrice ? livePrice.toFixed(market.priceDecimals) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSymbol]);

  // Redirect unsigned visitors (mirrors TradeTerminal).
  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  // Auto-dismiss toast.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Expanded chart: Esc closes, backdrop scroll is locked while open.
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  // ── Order ticket math (same as TradeTerminal) ──
  const baseHolding = holdings.find((h) => h.asset === market.base)?.amount ?? 0;
  const effectivePrice = orderType === 'limit' ? parseFloat(priceInput) || livePrice : livePrice;
  const size = parseFloat(sizeInput) || 0;
  const notional = size * effectivePrice;
  const fee = notional * TRADE_FEE_RATE;

  const validation = useMemo(() => {
    if (!(size > 0)) return 'Enter a size';
    if (orderType === 'limit' && !(parseFloat(priceInput) > 0)) return 'Enter a limit price';
    if (side === 'buy' && notional + fee > quote.amount) return 'Insufficient USDT balance';
    if (side === 'sell' && size > baseHolding) return `Insufficient ${market.base} balance`;
    return null;
  }, [size, orderType, priceInput, side, notional, fee, quote.amount, baseHolding, market.base]);

  const fillMarketPrice = () => {
    setPriceInput(livePrice.toFixed(market.priceDecimals));
    setToast('Price set to market');
  };

  const handleMax = () => {
    if (side === 'buy') {
      const affordable =
        effectivePrice > 0 ? quote.amount / (effectivePrice * (1 + TRADE_FEE_RATE)) : 0;
      setSizeInput(affordable.toFixed(market.sizeDecimals));
    } else {
      setSizeInput(baseHolding.toFixed(market.sizeDecimals));
    }
  };

  const handleSubmit = async () => {
    if (validation) {
      setToast(validation);
      return;
    }
    const order = await submitOrder({
      symbol: activeSymbol,
      side,
      type: orderType,
      size,
      price: orderType === 'limit' ? parseFloat(priceInput) : undefined,
      product: 'spot',
      leverage: 1,
    });
    if (order) {
      setToast(
        order.status === 'filled'
          ? `Filled ${fmt(order.size, market.sizeDecimals)} ${market.base} @ ${fmt(order.filledPrice ?? 0, market.priceDecimals)}`
          : `Limit order placed (${order.status})`,
      );
      setSizeInput('');
      refreshHoldings();
    } else {
      setToast('Order rejected. Check your balance and try again.');
    }
  };

  // Chart history (last candle is nudged to the live price, like TradingChart).
  const [candles, setCandles] = useState<Candle[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setChartLoading(true);
    setChartError(null);
    (async () => {
      try {
        const res = await fetch(
          `/api/market/candles?symbol=${encodeURIComponent(activeSymbol)}&interval=${tf}`,
        );
        if (!res.ok) throw new Error(`Chart load failed (${res.status})`);
        const data = await res.json();
        if (!cancelled) setCandles(data.candles || []);
      } catch (e) {
        if (!cancelled) setChartError(e instanceof Error ? e.message : 'Chart error');
      } finally {
        if (!cancelled) setChartLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSymbol, tf]);

  useEffect(() => {
    if (!livePrice || !candles.length) return;
    setCandles((prev) => {
      const last = prev[prev.length - 1];
      const close = Number(livePrice.toFixed(market.priceDecimals));
      if (!last || Math.abs(last.close - close) < 1e-9) return prev;
      const next = prev.slice();
      next[next.length - 1] = {
        ...last,
        close,
        high: Math.max(last.high, close),
        low: Math.min(last.low, close),
      };
      return next;
    });
  }, [livePrice, market.priceDecimals, candles.length]);

  if (authLoading || !user) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-3)',
          fontSize: 12,
        }}
      >
        Checking session…
      </div>
    );
  }

  const changeText = (chg: number | null, decimals = 2) =>
    chg == null ? '—' : `${chg > 0 ? '+' : ''}${chg.toFixed(decimals)}%`;
  const changeColor = (chg: number | null) =>
    chg == null ? 'var(--fg-3)' : chg >= 0 ? 'var(--up)' : 'var(--down)';

  const tfChips = (
    <div className="k-chiprow" style={{ padding: 0, flex: '0 1 auto', minWidth: 0 }}>
      {TF_CHIPS.map((t) => (
        <button
          key={t}
          type="button"
          className={tf === t ? 'k-chip k-chip--accent' : 'k-chip'}
          aria-pressed={tf === t}
          onClick={() => setTf(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );

  const liveBadge = (
    <span
      className={`k-pill k-mtrade-live ${chgUp ? 'k-pill--up' : 'k-pill--danger'}`}
      title="Live price"
    >
      Live&nbsp;
      <span className="num">{fmtUsd(livePrice)}</span>
    </span>
  );

  return (
    <div
      className="k-frame"
      style={{
        minHeight: '100dvh',
        paddingBottom: 'calc(var(--tabbar-h) + 44px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <style>{CHART_CSS}</style>

      {/* ── Top bar: pair search + notifications (unchanged behaviour) ── */}
      <header className="k-topbar" data-od-id="trade-topbar">
        <div
          className="k-mtrade-search"
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 44,
            padding: '0 6px 0 12px',
            borderRadius: 999,
            background: 'oklch(0.118 0.014 262.0 / 0.72)',
            border: '1px solid var(--line-strong)',
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
            style={{ flex: '0 0 auto', color: 'var(--accent)' }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5 21 21" />
          </svg>
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Search pair"
            placeholder="Search pair"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setQuery('');
            }}
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              background: 'none',
              border: 0,
              outline: 0,
              color: 'var(--fg)',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          />
          {query !== '' && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              style={{
                flex: '0 0 auto',
                width: 44,
                height: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-3)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
        <div style={{ flex: '0 0 auto' }}>
          <NotificationButton />
        </div>
      </header>

      <main>
        {/* Markets: the whole tradable table, filtered by the search field */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 10,
            padding: '14px 16px 0',
          }}
        >
          <span className="eyebrow">Markets</span>
          <span className="num" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            {q ? `${filteredMarkets.length} of ${markets.length}` : `${markets.length} pairs`}
          </span>
        </div>

        {filteredMarkets.length > 0 && (
          <div className="k-chiprow" style={{ paddingTop: 8 }} data-group="market">
            {filteredMarkets.map((m) => {
              const active = m.symbol === activeSymbol;
              return (
                <button
                  key={m.symbol}
                  type="button"
                  ref={active ? activeChipRef : undefined}
                  className={active ? 'k-chip k-chip--accent' : 'k-chip'}
                  aria-pressed={active}
                  aria-label={`${m.base}/${m.quote}, ${fmtUsd(m.price)}, ${changeText(m.chg)} 24h`}
                  onClick={() => setActiveSymbol(m.symbol)}
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1,
                    minHeight: 52,
                    padding: '6px 13px',
                    borderRadius: 14,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {m.base}
                    <span style={{ color: 'var(--fg-3)', fontWeight: 600 }}>/{m.quote}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span className="num" style={{ fontSize: 12, color: 'var(--fg-2)' }}>
                      {fmt(m.price, m.priceDecimals)}
                    </span>
                    <span
                      className="num"
                      style={{ fontSize: 11, fontWeight: 700, color: changeColor(m.chg) }}
                    >
                      {changeText(m.chg)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {filteredMarkets.length === 0 && (
          <div
            style={{
              margin: '12px 16px 0',
              padding: '16px 16px 14px',
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'oklch(0.959 0.010 81.8 / 0.03)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 650 }}>No markets found</p>
            <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>
              Nothing matches “{query.trim()}”.
            </p>
            <button
              type="button"
              className="k-btn k-btn--soft k-btn--sm"
              style={{ marginTop: 12 }}
              onClick={() => setQuery('')}
            >
              Clear search
            </button>
          </div>
        )}

        {/* Price header */}
        <div
          style={{
            padding: '14px 16px 0',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <p className="eyebrow">{market.base} / {market.quote}</p>
            <p
              className="num"
              style={{ fontSize: 'clamp(28px, 8vw, 34px)', fontWeight: 780, letterSpacing: '-0.03em', marginTop: 2 }}
            >
              {fmtUsd(livePrice)}
            </p>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
            <span className={chgUp ? 'k-pill k-pill--up' : 'k-pill k-pill--pending'}>
              {sign}
              {change24h.toFixed(2)}%
            </span>
            <p className="num" style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>
              {sign}
              {fmtUsd(Math.abs(deltaUsd))} · 24h
            </p>
          </div>
        </div>

        {/* Chart card */}
        <section className="k-card" style={{ margin: '12px 16px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 8px 0 12px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--fg-3)' }}>
              {market.base}/{market.quote}
            </span>
            {liveBadge}
            <span className="k-grow" />
            <button
              type="button"
              className="k-iconbtn"
              aria-label="Expand chart"
              title="Expand chart"
              onClick={() => setExpanded(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" />
              </svg>
            </button>
          </div>

          <div className="k-chiprow" style={{ padding: '2px 12px 0' }}>
            {TF_CHIPS.map((t) => (
              <button
                key={t}
                type="button"
                className={tf === t ? 'k-chip k-chip--accent' : 'k-chip'}
                aria-pressed={tf === t}
                onClick={() => setTf(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ padding: '6px 8px 10px' }}>
            <CandleChart
              candles={candles}
              interval={tf}
              loading={chartLoading}
              error={chartError}
              priceDecimals={market.priceDecimals}
            />
          </div>
        </section>

        {/* Tabs: Ticket · Order book · Open orders */}
        <div className="k-tabs" style={{ marginTop: 16 }} role="tablist" aria-label="Trade panels">
          {(
            [
              ['ticket', 'Ticket'],
              ['book', 'Order book'],
              ['orders', 'Open orders'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="k-tabs__tab"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Ticket panel ── */}
        {tab === 'ticket' && (
          <section style={{ padding: '0 16px 8px' }}>
            <div
              className="k-seg"
              style={{ marginTop: 14 }}
              role="group"
              aria-label="Buy or sell"
            >
              <button
                type="button"
                aria-pressed={side === 'buy'}
                onClick={() => setSide('buy')}
                style={side === 'buy' ? { color: 'oklch(0.6 0.16 162.5)' } : undefined}
              >
                Buy
              </button>
              <button
                type="button"
                aria-pressed={side === 'sell'}
                onClick={() => setSide('sell')}
                style={side === 'sell' ? { color: 'oklch(0.62 0.2 12)' } : undefined}
              >
                Sell
              </button>
            </div>

            <div className="k-seg" style={{ marginTop: 10 }} role="group" aria-label="Order type">
              <button type="button" aria-pressed={orderType === 'limit'} onClick={() => setOrderType('limit')}>
                Limit
              </button>
              <button type="button" aria-pressed={orderType === 'market'} onClick={() => setOrderType('market')}>
                Market
              </button>
            </div>

            {orderType === 'limit' && (
              <div className="k-field" style={{ marginTop: 14 }}>
                <div className="k-field__label">
                  <span>Limit price</span>
                  <button type="button" className="k-field__hint" style={{ letterSpacing: 0 }} onClick={fillMarketPrice}>
                    Use market
                  </button>
                </div>
                <div className="k-amount" style={{ padding: '2px 8px' }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label="Limit price"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                  />
                  <span className="k-amount__max" style={{ background: 'none', color: 'var(--fg-3)' }}>
                    {market.quote}
                  </span>
                </div>
              </div>
            )}

            <div className="k-field" style={{ marginTop: 14 }}>
              <div className="k-field__label">
                <span>Amount</span>
                <button type="button" className="k-field__hint" onClick={handleMax}>
                  Max
                </button>
              </div>
              <div className="k-amount" style={{ padding: '2px 8px' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.0000"
                  aria-label="Amount"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                />
                <span className="k-amount__max" style={{ background: 'none', color: 'var(--fg-3)' }}>
                  {market.base}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 6 }}>
                Available{' '}
                <span className="num" style={{ color: 'var(--fg-2)' }}>
                  {side === 'buy' ? fmtUsd(quote.amount) : `${fmt(baseHolding, market.sizeDecimals)} ${market.base}`}
                </span>{' '}
                {side === 'buy' ? market.quote : ''}
              </p>
            </div>

            <div className="k-card" style={{ marginTop: 12 }}>
              <ul className="k-summary" style={{ padding: '10px 14px' }}>
                <li>
                  <span>Estimated total</span>
                  <span className="num">{fmtUsd(notional)}</span>
                </li>
                <li>
                  <span>Fee (0.1%)</span>
                  <span className="num">{fmtUsd(fee)}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className={`k-btn k-btn--lg k-btn--block ${side === 'buy' ? 'k-btn--buy' : 'k-btn--sell'}`}
              style={{ marginTop: 12 }}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting
                ? 'Submitting…'
                : `${side === 'buy' ? 'Buy' : 'Sell'} ${market.base}`}
            </button>
            <p className="k-center k-muted" style={{ fontSize: 11.5, margin: '8px 0 2px' }}>
              Orders execute instantly against Kandella liquidity.
            </p>
          </section>
        )}

        {/* ── Order book panel ── */}
        {tab === 'book' && (
          <section style={{ padding: '0 16px 8px' }}>
            <div className="k-card" style={{ marginTop: 14, overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px 2px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-3)',
                }}
              >
                <span>Price ({market.quote})</span>
                <span>Amount ({market.base})</span>
              </div>
              <ul style={{ padding: '4px 8px 6px' }}>
                {(orderBook?.asks ?? []).slice(0, 3).reverse().map((r, i) => (
                  <li key={`a${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 38 }}>
                    <span className="num" style={{ width: 96, color: 'oklch(0.62 0.2 12)' }}>
                      {fmt(r.price, market.priceDecimals)}
                    </span>
                    <span className="num" style={{ flex: 1, textAlign: 'right', color: 'var(--fg-3)' }}>
                      {fmt(r.size, 4)}
                    </span>
                    <span className="num" style={{ width: 88, textAlign: 'right', fontSize: 11.5, color: 'var(--fg-faint)' }}>
                      {fmt(r.total ?? r.price * r.size, 0)}
                    </span>
                  </li>
                ))}
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    minHeight: 44,
                    margin: '2px 0',
                    borderTop: '1px dashed var(--line)',
                    borderBottom: '1px dashed var(--line)',
                  }}
                >
                  <span className="num" style={{ width: 96, fontWeight: 800, color: 'var(--fg)' }}>
                    {fmt(orderBook?.mid ?? livePrice, market.priceDecimals)}
                  </span>
                  <span style={{ flex: 1, textAlign: 'right', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                    Last price
                  </span>
                  <span className="k-pill k-pill--up" style={{ width: 88, justifyContent: 'center' }}>
                    Mid
                  </span>
                </li>
                {(orderBook?.bids ?? []).slice(0, 4).map((r, i) => (
                  <li key={`b${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 38 }}>
                    <span className="num" style={{ width: 96, color: 'oklch(0.6 0.16 162.5)' }}>
                      {fmt(r.price, market.priceDecimals)}
                    </span>
                    <span className="num" style={{ flex: 1, textAlign: 'right', color: 'var(--fg-3)' }}>
                      {fmt(r.size, 4)}
                    </span>
                    <span className="num" style={{ width: 88, textAlign: 'right', fontSize: 11.5, color: 'var(--fg-faint)' }}>
                      {fmt(r.total ?? r.price * r.size, 0)}
                    </span>
                  </li>
                ))}
                {!orderBook && (
                  <li style={{ padding: '16px 8px', textAlign: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
                    Loading depth…
                  </li>
                )}
              </ul>
            </div>
            <p className="k-center k-muted" style={{ fontSize: 12, margin: '12px 0 2px' }}>
              Live depth from Kandella market data.
            </p>
          </section>
        )}

        {/* ── Open orders panel ── */}
        {tab === 'orders' && (
          <section style={{ padding: '0 16px 8px' }}>
            {openOrders.length === 0 ? (
              <div className="k-card" style={{ marginTop: 14, padding: '28px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 650 }}>No open orders</p>
                <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 14px' }}>
                  Limit orders you place will appear here.
                </p>
                <button
                  type="button"
                  className="k-btn k-btn--soft k-btn--sm"
                  onClick={() => router.push('/transaction')}
                >
                  Order history
                </button>
              </div>
            ) : (
              <div className="k-card" style={{ marginTop: 14 }}>
                <ul style={{ padding: '6px 14px 10px' }}>
                  {openOrders.map((o) => (
                    <li
                      key={o.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 46 }}
                    >
                      <span style={{ width: 120, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>
                          {o.base}/{o.quote}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 10.5,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: o.side === 'buy' ? 'oklch(0.6 0.16 162.5)' : 'oklch(0.62 0.2 12)',
                          }}
                        >
                          {o.side} · {o.type}
                        </span>
                      </span>
                      <span className="num" style={{ flex: 1, textAlign: 'right', fontSize: 12, color: 'var(--fg-2)' }}>
                        {o.price != null ? fmt(o.price, market.priceDecimals) : 'Market'}
                      </span>
                      <span className="num" style={{ width: 84, textAlign: 'right', fontSize: 12, color: 'var(--fg-2)' }}>
                        {fmt(o.size, 4)}
                      </span>
                      <button
                        type="button"
                        aria-label={`Cancel ${o.side} ${o.base} order`}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--down)',
                          background: 'oklch(0.645 0.215 16.4 / 0.1)',
                        }}
                        onClick={async () => {
                          const ok = await cancelOrder(o.id);
                          if (!ok) setToast('Cancel failed');
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── Expanded chart viewer (same feed + timeframe state) ── */}
      {expanded && (
        <>
          <div className="k-scrim is-open" aria-hidden="true" onClick={() => setExpanded(false)} />
          <div
            className="k-mtrade-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`${market.base}/${market.quote} chart, expanded`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setExpanded(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 70,
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              padding: 'calc(env(safe-area-inset-top, 0px) + 10px) 10px calc(env(safe-area-inset-bottom, 0px) + 10px)',
            }}
          >
            <div
              className="k-card"
              style={{
                width: 'min(100%, 1040px)',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: 10,
                background: 'oklch(0.168 0.022 262.5 / 0.98)',
                WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                backdropFilter: 'blur(18px) saturate(150%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px 6px' }}>
                <span style={{ fontSize: 14.5, fontWeight: 750, letterSpacing: '-0.01em' }}>
                  {market.base}
                  <span style={{ color: 'var(--fg-3)', fontWeight: 600 }}>/{market.quote}</span>
                </span>
                <span className="k-muted num" style={{ fontSize: 12 }}>
                  {tf}
                </span>
                {liveBadge}
                <span className="k-grow" />
                <button
                  type="button"
                  className="k-iconbtn"
                  aria-label="Close expanded chart"
                  title="Close (Esc)"
                  ref={closeBtnRef}
                  onClick={() => setExpanded(false)}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}>
                <CandleChart
                  expanded
                  candles={candles}
                  interval={tf}
                  loading={chartLoading}
                  error={chartError}
                  priceDecimals={market.priceDecimals}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingTop: 8,
                  flexWrap: 'wrap',
                }}
              >
                {tfChips}
                <span className="k-grow" />
                <span className="k-muted" style={{ fontSize: 11.5 }}>
                  Esc or ✕ to close
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast (k-shell styling) */}
      <div className={`k-toast ${toast ? 'is-open' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
