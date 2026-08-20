'use client';

/**
 * Kandella — shared Trading Terminal (production).
 *
 * Live terminal used by /trade/spot, /trade/margin, /trade/futures:
 *   • Watchlist        → useTickers (live reference prices)
 *   • Order book/tape  → useMarketData (anchored to live price)
 *   • Balances         → useHoldings (quote = USDT/mainBalance, base holdings)
 *   • Orders           → useSpotOrders (authenticated submit / cancel / poll)
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useTickers } from '@/lib/hooks/useTickers';
import TickerTape from '@/components/TickerTape';
import { useMarketData } from '@/lib/hooks/useMarketData';
import { useHoldings } from '@/lib/hooks/useHoldings';
import { useSpotOrders } from '@/lib/hooks/useSpotOrders';
import { MARKETS, getMarket, TRADE_FEE_RATE } from '@/lib/market/symbols';
import Sidebar from '@/components/Sidebar';
import TradingChart from '@/components/trade/TradingChart';
import { FaSearch, FaPowerOff, FaTimes } from 'react-icons/fa';

type Product = 'spot' | 'margin' | 'futures';

const fmt = (n: number, d = 2) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUsd = (n: number) => `$${fmt(n)}`;

interface TradeTerminalProps {
  product?: Product;
  maxLeverage?: number;
}

export default function TradeTerminal({ product = 'spot', maxLeverage = 1 }: TradeTerminalProps) {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [priceInput, setPriceInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [search, setSearch] = useState('');
  const [bottomTab, setBottomTab] = useState<'positions' | 'open' | 'history'>('open');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const market = getMarket(activeSymbol) ?? MARKETS[0];
  const { tickers } = useTickers();
  const { orderBook, trades } = useMarketData(activeSymbol, 5000);
  const { quote, holdings, mutate: refreshHoldings } = useHoldings();
  const { orders, openOrders, isSubmitting, submitOrder, cancelOrder } =
    useSpotOrders({ symbol: activeSymbol, product });

  const livePrice = useMemo(() => {
    const t = tickers.find((x) => x.symbol === activeSymbol);
    return t?.price ?? orderBook?.mid ?? market.reference;
  }, [tickers, activeSymbol, orderBook, market.reference]);

  useEffect(() => {
    setPriceInput(livePrice ? livePrice.toFixed(market.priceDecimals) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSymbol]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const baseHolding = holdings.find((h) => h.asset === market.base)?.amount ?? 0;
  const effectivePrice = orderType === 'limit' ? parseFloat(priceInput) || livePrice : livePrice;
  const size = parseFloat(sizeInput) || 0;
  const notional = size * effectivePrice;
  const fee = notional * TRADE_FEE_RATE;
  const buyCost = notional + fee;
  const sellProceeds = Math.max(0, notional - fee);

  const setPercent = (pct: number) => {
    if (side === 'buy') {
      const affordable = effectivePrice > 0 ? (quote.amount * pct) / (effectivePrice * (1 + TRADE_FEE_RATE)) : 0;
      setSizeInput(affordable.toFixed(market.sizeDecimals));
    } else {
      setSizeInput((baseHolding * pct).toFixed(market.sizeDecimals));
    }
  };

  const validation = useMemo(() => {
    if (!(size > 0)) return 'Enter a size';
    if (orderType === 'limit' && !(parseFloat(priceInput) > 0)) return 'Enter a limit price';
    if (side === 'buy' && buyCost > quote.amount) return 'Insufficient USDT balance';
    if (side === 'sell' && size > baseHolding) return `Insufficient ${market.base} balance`;
    return null;
  }, [size, orderType, priceInput, side, buyCost, quote.amount, baseHolding, market.base]);

  const handleSubmit = async () => {
    if (validation) {
      setToast({ type: 'error', msg: validation });
      return;
    }
    const order = await submitOrder({
      symbol: activeSymbol,
      side,
      type: orderType,
      size,
      price: orderType === 'limit' ? parseFloat(priceInput) : undefined,
      product,
      leverage: product === 'spot' ? 1 : leverage,
    });
    if (order) {
      setToast({
        type: 'success',
        msg:
          order.status === 'filled'
            ? `Filled ${fmt(order.size, market.sizeDecimals)} ${market.base} @ ${fmt(order.filledPrice ?? 0, market.priceDecimals)}`
            : `Limit order placed (${order.status})`,
      });
      setSizeInput('');
      refreshHoldings();
    } else {
      setToast({ type: 'error', msg: 'Order rejected. Check your balance and try again.' });
    }
  };

  const portfolioValue = useMemo(() => {
    const holdingsValue = holdings.reduce((sum, h) => {
      const t = tickers.find((x) => x.base === h.asset);
      return sum + h.amount * (t?.price ?? 0);
    }, 0);
    return quote.amount + holdingsValue;
  }, [holdings, tickers, quote.amount]);

  const filteredMarkets = tickers.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.symbol.toLowerCase().includes(q) ||            // pair, e.g. BTCUSDT
      t.base.toLowerCase().includes(q) ||              // ticker, e.g. BTC
      `${t.base}/${t.quote}`.toLowerCase().includes(q) || // BTC/USDT
      (t.name?.toLowerCase().includes(q) ?? false)     // coin name, e.g. Bitcoin
    );
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <p className="text-sm" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>REDIRECTING…</p>
      </div>
    );
  }

  const accent = product === 'futures' ? '#A855F7' : product === 'margin' ? '#F59E0B' : '#06B6D4';
  const productLabel = product.toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden text-[#F5F1EA] font-['Inter',_sans-serif] text-[12px]" style={{ background: '#06090F' }}>
      <div className="luxe-ambient-orb" style={{ background: accent, top: -250, right: -150 }} />
      <div className="luxe-ambient-orb" style={{ background: '#A855F7', bottom: -250, left: -150 }} />

      <Sidebar />

      <div className="flex-1 min-w-0 min-h-0 flex flex-col relative">
        <header
          className="sticky top-0 z-30 h-14 flex justify-between items-center px-3 sm:px-5 border-b"
          style={{ background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <FaSearch size={11} style={{ color: 'rgba(212,175,127,0.6)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search pair…"
                className="bg-transparent border-none text-[11px] focus:outline-none w-32 lg:w-44"
                style={{ color: '#F5F1EA' }}
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: accent }}>
              {productLabel}
            </span>
            <TickerTape maxWidth="42vw" />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[11px]" style={{ color: 'rgba(245,241,234,0.7)' }}>
              USDT {fmt(quote.amount)}
            </span>
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
            <button onClick={() => router.push('/addFunds')} className="luxe-grad-purple-pink luxe-neumorphic text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Deposit</button>
          </div>
        </header>

        {toast && (
          <div
            className="fixed top-16 right-5 z-50 px-4 py-2.5 rounded-lg text-[12px] font-medium shadow-xl"
            style={{
              background: toast.type === 'success' ? 'rgba(0,200,83,0.15)' : 'rgba(255,61,113,0.15)',
              border: `1px solid ${toast.type === 'success' ? '#00C853' : '#FF3D71'}`,
              color: toast.type === 'success' ? '#00FFA3' : '#FF3D71',
            }}
            role="status"
          >
            {toast.msg}
          </div>
        )}

        <main className="flex-1 min-h-0 grid gap-3 p-3 overflow-hidden relative" style={{ gridTemplateColumns: '220px 1fr 320px', gridTemplateRows: 'minmax(0, 1fr) 240px' }}>
          <section className="luxe-glass rounded-xl overflow-hidden flex flex-col" style={{ gridColumn: '1', gridRow: '1 / span 2' }}>
            <div className="p-3 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: '#D4AF7F' }}>Markets</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 backdrop-blur-md" style={{ background: 'rgba(11,14,17,0.6)' }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th className="px-3 py-2 text-[9px] font-medium uppercase" style={{ color: 'rgba(245,241,234,0.4)' }}>Pair</th>
                    <th className="px-2 py-2 text-[9px] font-medium uppercase text-right" style={{ color: 'rgba(245,241,234,0.4)' }}>Price</th>
                    <th className="px-3 py-2 text-[9px] font-medium uppercase text-right" style={{ color: 'rgba(245,241,234,0.4)' }}>24h%</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {filteredMarkets.length === 0 && (
                    <tr><td colSpan={3} className="px-3 py-6 text-center text-[10px]" style={{ color: '#8F9BB3' }}>Loading markets…</td></tr>
                  )}
                  {filteredMarkets.map((w) => (
                    <tr
                      key={w.symbol}
                      onClick={() => setActiveSymbol(w.symbol)}
                      className="cursor-pointer transition-colors hover:bg-white/5"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: activeSymbol === w.symbol ? 'rgba(212,175,127,0.08)' : undefined }}
                    >
                      <td className="px-3 py-2 font-bold">{w.base}<span className="text-[9px] ml-1" style={{ color: 'rgba(245,241,234,0.4)' }}>/{w.quote}</span></td>
                      <td className="px-2 py-2 text-right">{fmt(w.price, getMarket(w.symbol)?.priceDecimals ?? 2)}</td>
                      <td className="px-3 py-2 text-right" style={{ color: w.change24h >= 0 ? '#00FFA3' : '#FF3D71' }}>{w.change24h >= 0 ? '+' : ''}{w.change24h.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="luxe-glass rounded-xl flex flex-col overflow-hidden" style={{ gridColumn: '2', gridRow: '1 / span 2' }}>
            <div className="h-11 flex items-center px-4 gap-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black tracking-tight">{market.base}/{market.quote}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: accent }}>{productLabel}</span>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: '#F5F1EA' }}>{fmt(livePrice, market.priceDecimals)}</span>
              <div className="flex-1" />
            </div>
            <div className="flex-1 relative" style={{ background: 'rgba(0,0,0,0.2)', minHeight: 0 }}>
              <TradingChart
                symbol={activeSymbol}
                priceDecimals={market.priceDecimals}
                livePrice={livePrice}
                accent={accent}
              />
            </div>
          </section>

          <section className="flex flex-col gap-3 overflow-hidden" style={{ gridColumn: '3', gridRow: '1' }}>
            <div className="luxe-glass-border rounded-xl p-4 flex-1 flex flex-col overflow-y-auto">
              <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {(['limit', 'market'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${orderType === t ? 'text-white' : ''}`}
                    style={orderType === t ? { background: `linear-gradient(135deg, ${accent} 0%, #3B82F6 100%)` } : { color: 'rgba(245,241,234,0.5)' }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {product !== 'spot' && (
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-2">
                    <span style={{ color: 'rgba(245,241,234,0.5)' }}>Leverage</span>
                    <span style={{ color: accent }}>{leverage}×</span>
                  </div>
                  <input type="range" min={1} max={maxLeverage} value={leverage} onChange={(e) => setLeverage(parseInt(e.target.value))} className="w-full" style={{ accentColor: accent }} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => setSide('buy')} className={`py-2 text-[11px] font-black uppercase tracking-widest rounded-md transition-all ${side === 'buy' ? 'text-white' : ''}`} style={side === 'buy' ? { background: '#00C853' } : { background: 'rgba(0,200,83,0.10)', color: '#00C853' }}>
                  Buy / Long
                </button>
                <button onClick={() => setSide('sell')} className={`py-2 text-[11px] font-black uppercase tracking-widest rounded-md transition-all ${side === 'sell' ? 'text-white' : ''}`} style={side === 'sell' ? { background: '#FF3D71' } : { background: 'rgba(255,61,113,0.10)', color: '#FF3D71' }}>
                  Sell / Short
                </button>
              </div>

              <div className="mb-3">
                <label className="text-[10px] uppercase font-bold tracking-widest mb-1.5 block" style={{ color: 'rgba(245,241,234,0.5)' }}>Price</label>
                <div className="relative">
                  <input
                    type="number"
                    value={orderType === 'market' ? '' : priceInput}
                    placeholder={orderType === 'market' ? `Market ≈ ${fmt(livePrice, market.priceDecimals)}` : ''}
                    disabled={orderType === 'market'}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full bg-black/40 border rounded-md px-3 py-2 text-sm font-mono disabled:opacity-50"
                    style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono" style={{ color: 'rgba(245,241,234,0.4)' }}>{market.quote}</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-[10px] uppercase font-bold tracking-widest mb-1.5 block" style={{ color: 'rgba(245,241,234,0.5)' }}>Size</label>
                <div className="relative">
                  <input
                    type="number"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/40 border rounded-md px-3 py-2 text-sm font-mono"
                    style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono" style={{ color: 'rgba(245,241,234,0.4)' }}>{market.base}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[0.25, 0.5, 0.75, 1].map((p) => (
                  <button key={p} onClick={() => setPercent(p)} className="py-1.5 text-[10px] font-bold rounded transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,241,234,0.65)' }}>
                    {p * 100}%
                  </button>
                ))}
              </div>

              <div className="mb-3 space-y-1 text-[10px]">
                <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }}>Available</span><span className="font-mono" style={{ color: 'rgba(245,241,234,0.85)' }}>{side === 'buy' ? `${fmt(quote.amount)} ${market.quote}` : `${fmt(baseHolding, market.sizeDecimals)} ${market.base}`}</span></div>
                <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }}>Est. fee (0.1%)</span><span className="font-mono" style={{ color: 'rgba(245,241,234,0.85)' }}>{fmt(fee)} {market.quote}</span></div>
                <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }}>{side === 'buy' ? 'Total cost' : 'You receive'}</span><span className="font-mono font-bold" style={{ color: '#F5F1EA' }}>{fmt(side === 'buy' ? buyCost : sellProceeds)} {market.quote}</span></div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !!validation}
                title={validation ?? 'Submit order'}
                className="w-full py-3 luxe-neumorphic text-white rounded-lg text-xs font-black uppercase tracking-widest transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={side === 'buy' ? { background: '#00C853' } : { background: '#FF3D71' }}
              >
                {isSubmitting ? 'Submitting…' : validation ? validation : `${side === 'buy' ? 'Buy' : 'Sell'} ${market.base}`}
              </button>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 overflow-hidden" style={{ gridColumn: '3', gridRow: '2' }}>
            <div className="luxe-glass rounded-xl flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#D4AF7F' }}>Order Book</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] uppercase font-bold" style={{ color: 'rgba(245,241,234,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span>Price</span><span className="text-right">Size</span><span className="text-right">Total</span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[11px]">
                {(orderBook?.asks ?? []).slice(0, 6).reverse().map((r, i) => (
                  <div key={`a${i}`} className="grid grid-cols-3 px-3 py-1 hover:bg-white/5">
                    <span style={{ color: '#FF3D71' }}>{fmt(r.price, market.priceDecimals)}</span>
                    <span className="text-right" style={{ color: 'rgba(245,241,234,0.8)' }}>{fmt(r.size, 3)}</span>
                    <span className="text-right" style={{ color: 'rgba(245,241,234,0.5)' }}>{fmt(r.total ?? 0, 2)}</span>
                  </div>
                ))}
                <div className="grid grid-cols-2 px-3 py-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="font-bold text-white">{fmt(orderBook?.mid ?? livePrice, market.priceDecimals)}</span>
                  <span className="text-right text-[10px]" style={{ color: 'rgba(245,241,234,0.5)' }}>Spread {fmt(orderBook?.spread ?? 0, market.priceDecimals)}</span>
                </div>
                {(orderBook?.bids ?? []).slice(0, 6).map((r, i) => (
                  <div key={`b${i}`} className="grid grid-cols-3 px-3 py-1 hover:bg-white/5">
                    <span style={{ color: '#00FFA3' }}>{fmt(r.price, market.priceDecimals)}</span>
                    <span className="text-right" style={{ color: 'rgba(245,241,234,0.8)' }}>{fmt(r.size, 3)}</span>
                    <span className="text-right" style={{ color: 'rgba(245,241,234,0.5)' }}>{fmt(r.total ?? 0, 2)}</span>
                  </div>
                ))}
                {!orderBook && <div className="p-6 text-center text-[10px]" style={{ color: '#8F9BB3' }}>Loading book…</div>}
              </div>
            </div>

            <div className="luxe-glass rounded-xl flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#D4AF7F' }}>Recent Trades</span>
              </div>
              <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] uppercase font-bold" style={{ color: 'rgba(245,241,234,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span>Price</span><span className="text-right">Size</span><span className="text-right">Time</span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[11px]">
                {(trades ?? []).slice(0, 12).map((t) => (
                  <div key={t.id} className="grid grid-cols-3 px-3 py-1 hover:bg-white/5">
                    <span style={{ color: t.side === 'buy' ? '#00FFA3' : '#FF3D71' }}>{fmt(t.price, market.priceDecimals)}</span>
                    <span className="text-right" style={{ color: 'rgba(245,241,234,0.8)' }}>{fmt(t.size, 3)}</span>
                    <span className="text-right" style={{ color: 'rgba(245,241,234,0.5)' }}>{new Date(t.timestamp).toUTCString().slice(17, 25)}</span>
                  </div>
                ))}
                {(trades ?? []).length === 0 && <div className="p-6 text-center text-[10px]" style={{ color: '#8F9BB3' }}>Loading trades…</div>}
              </div>
            </div>
          </section>
        </main>

        <section className="luxe-glass border-t flex flex-col overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)', maxHeight: 240 }}>
          <div className="flex items-center gap-4 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {([['positions', `Holdings (${holdings.length})`], ['open', `Open Orders (${openOrders.length})`], ['history', 'Order History']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setBottomTab(key)}
                className="text-[11px] font-bold uppercase tracking-widest pb-1.5"
                style={bottomTab === key ? { color: accent, borderBottom: `2px solid ${accent}` } : { color: 'rgba(245,241,234,0.5)' }}
              >
                {label}
              </button>
            ))}
            <div className="flex-1" />
            <button onClick={() => router.push('/transaction')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,241,234,0.65)' }}>
              View All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {bottomTab === 'positions' && (
              holdings.length === 0 ? (
                <Empty text="No asset holdings yet. Buy an asset to get started." />
              ) : (
                <table className="w-full text-left min-w-[560px]">
                  <Head cols={['Asset', 'Amount', 'Last Price', 'Value']} />
                  <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {holdings.map((h) => {
                      const t = tickers.find((x) => x.base === h.asset);
                      const px = t?.price ?? 0;
                      return (
                        <tr key={h.asset}>
                          <td className="p-3 font-bold text-xs" style={{ color: '#00FFA3' }}>{h.asset}</td>
                          <td className="p-3 font-mono text-xs" style={{ color: 'rgba(245,241,234,0.85)' }}>{fmt(h.amount, 6)}</td>
                          <td className="p-3 font-mono text-xs text-right" style={{ color: 'rgba(245,241,234,0.85)' }}>{fmtUsd(px)}</td>
                          <td className="p-3 font-mono text-xs text-right font-bold" style={{ color: '#F5F1EA' }}>{fmtUsd(h.amount * px)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}

            {bottomTab === 'open' && (
              openOrders.length === 0 ? (
                <Empty text="No open orders." />
              ) : (
                <table className="w-full text-left min-w-[640px]">
                  <Head cols={['Pair', 'Side', 'Type', 'Price', 'Size', 'Status', '']} />
                  <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {openOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="p-3 font-bold text-xs">{o.base}/{o.quote}</td>
                        <td className="p-3 text-xs font-bold" style={{ color: o.side === 'buy' ? '#00FFA3' : '#FF3D71' }}>{o.side.toUpperCase()}</td>
                        <td className="p-3 text-xs uppercase" style={{ color: 'rgba(245,241,234,0.7)' }}>{o.type}</td>
                        <td className="p-3 font-mono text-xs">{o.price != null ? fmt(o.price, 2) : '—'}</td>
                        <td className="p-3 font-mono text-xs">{fmt(o.size, 6)}</td>
                        <td className="p-3 text-xs" style={{ color: '#FFAA00' }}>{o.status}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => cancelOrder(o.id)} title="Cancel order" className="p-1.5 rounded hover:bg-white/10" style={{ color: '#FF3D71' }}><FaTimes size={11} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {bottomTab === 'history' && (
              orders.filter((o) => o.status === 'filled' || o.status === 'cancelled' || o.status === 'rejected').length === 0 ? (
                <Empty text="No order history yet." />
              ) : (
                <table className="w-full text-left min-w-[640px]">
                  <Head cols={['Pair', 'Side', 'Type', 'Fill Price', 'Size', 'Fee', 'Status']} />
                  <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {orders.filter((o) => o.status !== 'open' && o.status !== 'pending').map((o) => (
                      <tr key={o.id}>
                        <td className="p-3 font-bold text-xs">{o.base}/{o.quote}</td>
                        <td className="p-3 text-xs font-bold" style={{ color: o.side === 'buy' ? '#00FFA3' : '#FF3D71' }}>{o.side.toUpperCase()}</td>
                        <td className="p-3 text-xs uppercase" style={{ color: 'rgba(245,241,234,0.7)' }}>{o.type}</td>
                        <td className="p-3 font-mono text-xs">{o.filledPrice != null ? fmt(o.filledPrice, 2) : '—'}</td>
                        <td className="p-3 font-mono text-xs">{fmt(o.size, 6)}</td>
                        <td className="p-3 font-mono text-xs">{fmt(o.fee, 2)}</td>
                        <td className="p-3 text-xs" style={{ color: o.status === 'filled' ? '#00FFA3' : '#8F9BB3' }}>{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>

          <div className="flex justify-between items-center px-4 py-2 text-[10px] font-mono" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(245,241,234,0.5)' }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FFA3', boxShadow: '0 0 6px #00FFA3' }} />
              <span>LIVE PRICING</span>
            </div>
            <div className="flex items-center gap-4">
              <span>PORTFOLIO {fmtUsd(portfolioValue)}</span>
              <span>USDT {fmt(quote.amount)}</span>
              <span>UTC {new Date().toUTCString().slice(17, 25)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Head({ cols }: { cols: string[] }) {
  return (
    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
      <tr>
        {cols.map((h, i) => (
          <th key={i} className={`p-3 text-[10px] uppercase font-bold tracking-widest ${i >= 3 ? 'text-right' : ''}`} style={{ color: 'rgba(212,175,127,0.7)' }}>{h}</th>
        ))}
      </tr>
    </thead>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="p-8 text-center text-xs" style={{ color: '#8F9BB3' }}>{text}</div>;
}
