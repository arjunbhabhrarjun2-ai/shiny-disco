'use client';

/**
 * Wallet asset swap — convert one held asset into another at live rates.
 * Replaces the old static "Internal Transfer" placeholder. Uses the same
 * holdings model as trading; USDT maps to the cash balance, base assets to
 * Holdings. Quotes are live (debounced) and execution is atomic server-side.
 */

import { useEffect, useState } from 'react';
import { useHoldings } from '@/lib/hooks/useHoldings';
import { tradeApi, type SwapQuoteResult } from '@/lib/services/tradeApi';
import { MARKETS } from '@/lib/market/symbols';
import { FaExchangeAlt } from 'react-icons/fa';

const ALL_ASSETS = ['USDT', ...MARKETS.map((m) => m.base)];
const fmt = (n: number, d = 6) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: d });

export default function SwapWidget({ onSwapped }: { onSwapped?: () => void }) {
  const { quote, holdings, mutate } = useHoldings();
  const [from, setFrom] = useState('USDT');
  const [to, setTo] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [q, setQ] = useState<SwapQuoteResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const balanceOf = (a: string) => (a === 'USDT' ? quote.amount : holdings.find((h) => h.asset === a)?.amount ?? 0);
  const fromBal = balanceOf(from);

  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 3500);
      return () => clearTimeout(t);
    }
  }, [msg]);

  useEffect(() => {
    const amt = parseFloat(amount);
    if (!(amt > 0) || from === to) { setQ(null); return; }
    let cancel = false;
    const t = setTimeout(async () => {
      try {
        const r = await tradeApi.getSwapQuote(from, to, amt);
        if (!cancel) setQ(r.quote);
      } catch {
        if (!cancel) setQ(null);
      }
    }, 350);
    return () => { cancel = true; clearTimeout(t); };
  }, [from, to, amount]);

  const setPct = (p: number) => setAmount(String(+(fromBal * p).toFixed(8)));

  const flip = () => { setFrom(to); setTo(from); setAmount(''); setQ(null); };

  const doSwap = async () => {
    const amt = parseFloat(amount);
    if (!(amt > 0)) return setMsg({ type: 'error', text: 'Enter an amount' });
    if (from === to) return setMsg({ type: 'error', text: 'Pick two different assets' });
    if (amt > fromBal) return setMsg({ type: 'error', text: `Insufficient ${from} balance` });
    setBusy(true);
    try {
      const r = await tradeApi.executeSwap(from, to, amt);
      setMsg({ type: 'success', text: `Swapped ${amt} ${from} → ${fmt(r.swap.toAmount)} ${to}` });
      setAmount('');
      setQ(null);
      mutate();
      onSwapped?.();
    } catch (e) {
      setMsg({ type: 'error', text: e instanceof Error ? e.message : 'Swap failed' });
    } finally {
      setBusy(false);
    }
  };

  const sel = "w-full bg-black/40 border rounded-lg px-3 py-2 text-xs";
  const selStyle = { borderColor: 'rgba(255,255,255,0.1)', color: '#F5F1EA' } as const;

  return (
    <div className="luxe-glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <FaExchangeAlt style={{ color: '#D4AF7F' }} size={12} />
        <h3 className="text-sm font-black uppercase tracking-widest">Swap Assets</h3>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 mb-4">
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>From</p>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={sel} style={selStyle}>
            {ALL_ASSETS.map((a) => <option key={a} value={a} style={{ background: '#0B0E11' }}>{a}</option>)}
          </select>
        </div>
        <button onClick={flip} title="Flip" type="button" className="mb-1 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,127,0.08)', border: '1px solid rgba(212,175,127,0.25)', color: '#D4AF7F' }}>
          <FaExchangeAlt size={12} />
        </button>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>To</p>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={sel} style={selStyle}>
            {ALL_ASSETS.map((a) => <option key={a} value={a} style={{ background: '#0B0E11' }}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: 'rgba(245,241,234,0.5)' }}>
          <span>Amount</span>
          <span>Balance: {fmt(fromBal)} {from}</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="flex-1 bg-black/40 border rounded-lg px-3 py-2 text-sm font-mono" style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#F5F1EA' }} />
          {[['25%', 0.25], ['50%', 0.5], ['MAX', 1]].map(([label, p]) => (
            <button key={label as string} type="button" onClick={() => setPct(p as number)} className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: 'rgba(212,175,127,0.06)', border: '1px solid rgba(212,175,127,0.25)', color: '#D4AF7F' }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="mb-4 space-y-1 text-[10px]" style={{ minHeight: 34 }}>
        {q && (
          <>
            <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }}>You receive</span><span className="font-mono font-bold" style={{ color: '#00FFA3' }}>≈ {fmt(q.toAmount)} {to}</span></div>
            <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }}>Rate</span><span className="font-mono" style={{ color: 'rgba(245,241,234,0.8)' }}>1 {from} = {fmt(q.rate)} {to}</span></div>
            <div className="flex justify-between"><span style={{ color: 'rgba(245,241,234,0.5)' }}>Fee (0.1%)</span><span className="font-mono" style={{ color: 'rgba(245,241,234,0.8)' }}>${fmt(q.feeUsd, 2)}</span></div>
          </>
        )}
      </div>

      {msg && (
        <p className="text-[11px] mb-3 text-center" style={{ color: msg.type === 'success' ? '#00FFA3' : '#FF3D71' }}>{msg.text}</p>
      )}

      <button onClick={doSwap} disabled={busy || from === to || !(parseFloat(amount) > 0)} className="w-full py-3 luxe-grad-cyan-blue luxe-neumorphic text-white rounded-lg text-xs font-black uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
        {busy ? 'Swapping…' : 'Swap'}
      </button>
      <p className="text-[10px] mt-3 text-center" style={{ color: 'rgba(245,241,234,0.5)' }}>Live rates · instant settlement</p>
    </div>
  );
}
