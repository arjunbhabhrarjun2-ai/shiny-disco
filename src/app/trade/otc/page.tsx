'use client';

/**
 * Kandella — OTC Desk (production RFQ flow).
 *
 * Request a quote → receive a signed, 15-second executable quote → accept to
 * execute at the quoted price via the shared trading engine. Quotes are signed
 * server-side (tamper-proof) and expire; accepting debits/credits real balances.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { useHoldings } from '@/lib/hooks/useHoldings';
import { useSpotOrders } from '@/lib/hooks/useSpotOrders';
import { tradeApi, type OtcQuote } from '@/lib/services/tradeApi';
import { MARKETS } from '@/lib/market/symbols';
import Sidebar from '@/components/Sidebar';
import { FaPowerOff } from 'react-icons/fa';

const fmt = (n: number, d = 2) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function OtcDeskPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { quote: balance, mutate: refreshHoldings } = useHoldings();
  const { orders, mutate: refreshOrders } = useSpotOrders({});

  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [notional, setNotional] = useState('');
  const [quote, setQuote] = useState<OtcQuote | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/screens/auth/Signin');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (!quote) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((new Date(quote.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
        setQuote(null);
      }
    };
    tick();
    timerRef.current = setInterval(tick, 250);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quote]);

  const requestQuote = async () => {
    const amt = parseFloat(notional);
    if (!(amt > 0)) {
      setToast({ type: 'error', msg: 'Enter a notional amount' });
      return;
    }
    setBusy(true);
    try {
      const res = await tradeApi.requestOtcQuote({ symbol, side, notional: amt });
      setQuote(res.quote);
    } catch (e) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Quote failed' });
    } finally {
      setBusy(false);
    }
  };

  const acceptQuote = async () => {
    if (!quote) return;
    setBusy(true);
    try {
      const res = await tradeApi.acceptOtcQuote(quote.token);
      setToast({
        type: 'success',
        msg: `Executed: ${side} ${fmt(res.order.size, 6)} ${quote.base} @ ${fmt(res.order.filledPrice ?? quote.price, 2)}`,
      });
      setQuote(null);
      setNotional('');
      refreshHoldings();
      refreshOrders();
    } catch (e) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Execution failed' });
    } finally {
      setBusy(false);
    }
  };

  const otcFills = useMemo(() => orders.filter((o) => o.status === 'filled').slice(0, 8), [orders]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#06090F', color: '#F5F1EA' }}>
        <p className="text-sm" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>REDIRECTING…</p>
      </div>
    );
  }

  const accent = '#FFD700';

  return (
    <div className="flex min-h-screen text-[#F5F1EA] font-['Inter',_sans-serif] text-[13px]" style={{ background: '#06090F' }}>
      <div className="luxe-ambient-orb" style={{ background: accent, top: -250, right: -150 }} />
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col relative">
        <header className="sticky top-0 z-30 h-14 flex justify-between items-center px-5 border-b" style={{ background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black tracking-tight">OTC Desk</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: accent }}>RFQ</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px]" style={{ color: 'rgba(245,241,234,0.7)' }}>USDT {fmt(balance.amount)}</span>
            <button onClick={() => logout()} title="Logout" className="p-1.5" style={{ color: '#94a3b8' }}><FaPowerOff size={13} /></button>
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

        <main className="flex-1 grid gap-4 p-5 max-w-5xl w-full mx-auto" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <section className="luxe-glass-border rounded-xl p-5">
            <h2 className="text-[12px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: accent }}>Request for Quote</h2>

            <label className="text-[10px] uppercase font-bold tracking-widest mb-1.5 block" style={{ color: 'rgba(245,241,234,0.5)' }}>Asset</label>
            <select value={symbol} onChange={(e) => { setSymbol(e.target.value); setQuote(null); }} className="w-full bg-black/40 border rounded-md px-3 py-2 text-sm mb-4" style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }}>
              {MARKETS.map((m) => <option key={m.symbol} value={m.symbol} style={{ background: '#0B0E11' }}>{m.base}/{m.quote}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => { setSide('buy'); setQuote(null); }} className="py-2 text-[11px] font-black uppercase tracking-widest rounded-md" style={side === 'buy' ? { background: '#00C853', color: '#fff' } : { background: 'rgba(0,200,83,0.10)', color: '#00C853' }}>Buy</button>
              <button onClick={() => { setSide('sell'); setQuote(null); }} className="py-2 text-[11px] font-black uppercase tracking-widest rounded-md" style={side === 'sell' ? { background: '#FF3D71', color: '#fff' } : { background: 'rgba(255,61,113,0.10)', color: '#FF3D71' }}>Sell</button>
            </div>

            <label className="text-[10px] uppercase font-bold tracking-widest mb-1.5 block" style={{ color: 'rgba(245,241,234,0.5)' }}>Notional (USDT)</label>
            <input type="number" value={notional} onChange={(e) => setNotional(e.target.value)} placeholder="e.g. 25000" className="w-full bg-black/40 border rounded-md px-3 py-2 text-sm font-mono mb-4" style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#F5F1EA' }} />

            <button onClick={requestQuote} disabled={busy} className="w-full py-3 rounded-lg text-xs font-black uppercase tracking-widest disabled:opacity-50" style={{ background: accent, color: '#0B0E11' }}>
              {busy ? 'Requesting…' : 'Request Quote'}
            </button>
          </section>

          <section className="luxe-glass rounded-xl p-5 flex flex-col">
            <h2 className="text-[12px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: '#D4AF7F' }}>Live Quote</h2>
            {!quote ? (
              <div className="flex-1 flex items-center justify-center text-center text-xs" style={{ color: '#8F9BB3' }}>
                Submit an RFQ to receive an executable quote.
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="space-y-2 font-mono text-[13px] mb-4">
                  <Row k="Pair" v={`${quote.base}/${quote.quote}`} />
                  <Row k="Side" v={side.toUpperCase()} color={side === 'buy' ? '#00FFA3' : '#FF3D71'} />
                  <Row k="Quantity" v={`${fmt(quote.size, 6)} ${quote.base}`} />
                  <Row k="Price" v={`${fmt(quote.price, 2)} ${quote.quote}`} />
                  <Row k="Notional" v={`${fmt(quote.notional, 2)} ${quote.quote}`} bold />
                </div>
                <div className="mb-4">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full transition-all duration-200" style={{ width: `${(secondsLeft / 15) * 100}%`, background: secondsLeft <= 5 ? '#FF3D71' : accent }} />
                  </div>
                  <p className="text-[10px] mt-1 text-right font-mono" style={{ color: secondsLeft <= 5 ? '#FF3D71' : 'rgba(245,241,234,0.5)' }}>Expires in {secondsLeft}s</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button onClick={() => setQuote(null)} className="py-2.5 rounded-lg text-[11px] font-bold uppercase" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,241,234,0.7)' }}>Reject</button>
                  <button onClick={acceptQuote} disabled={busy || secondsLeft <= 0} className="py-2.5 rounded-lg text-[11px] font-black uppercase disabled:opacity-50" style={{ background: '#00C853', color: '#fff' }}>{busy ? 'Executing…' : 'Accept & Execute'}</button>
                </div>
              </div>
            )}
          </section>

          <section className="luxe-glass rounded-xl p-5 col-span-2">
            <h2 className="text-[12px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: '#D4AF7F' }}>Recent Fills</h2>
            {otcFills.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: '#8F9BB3' }}>No fills yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <tr>{['Pair', 'Side', 'Fill Price', 'Size', 'Fee', 'Time'].map((h, i) => (
                    <th key={h} className={`p-2.5 text-[10px] uppercase font-bold tracking-widest ${i >= 2 ? 'text-right' : ''}`} style={{ color: 'rgba(212,175,127,0.7)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y font-mono text-xs" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {otcFills.map((o) => (
                    <tr key={o.id}>
                      <td className="p-2.5 font-bold">{o.base}/{o.quote}</td>
                      <td className="p-2.5 font-bold" style={{ color: o.side === 'buy' ? '#00FFA3' : '#FF3D71' }}>{o.side.toUpperCase()}</td>
                      <td className="p-2.5 text-right">{fmt(o.filledPrice ?? 0, 2)}</td>
                      <td className="p-2.5 text-right">{fmt(o.size, 6)}</td>
                      <td className="p-2.5 text-right">{fmt(o.fee, 2)}</td>
                      <td className="p-2.5 text-right" style={{ color: 'rgba(245,241,234,0.5)' }}>{new Date(o.createdAt).toUTCString().slice(17, 25)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function Row({ k, v, color, bold }: { k: string; v: string; color?: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'rgba(245,241,234,0.5)' }}>{k}</span>
      <span style={{ color: color ?? '#F5F1EA', fontWeight: bold ? 700 : 400 }}>{v}</span>
    </div>
  );
}
