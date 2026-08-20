'use client';

/**
 * Candlestick chart — self-contained Canvas renderer (zero dependencies).
 *
 * TradingView-style features: candlesticks, crosshair with OHLC + price/time
 * readouts, mouse-wheel zoom, click-drag pan, and multiple timeframes
 * (1H/4H/1D/1W). Data comes from /api/market/candles (OHLC anchored to the live
 * reference price); the most recent candle tracks the live price in real time.
 *
 * No external chart library is required, so it works without an extra install.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface Candle { time: number; open: number; high: number; low: number; close: number }

interface TradingChartProps {
  symbol: string;
  priceDecimals?: number;
  livePrice?: number;
  accent?: string;
}

const TIMEFRAMES = ['1H', '4H', '1D', '1W'] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

const PAD_RIGHT = 66;
const PAD_LEFT = 8;
const PAD_TOP = 18;
const PAD_BOTTOM = 22;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default function TradingChart({ symbol, priceDecimals = 2, livePrice, accent = '#06B6D4' }: TradingChartProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const candlesRef = useRef<Candle[]>([]);
  const viewRef = useRef({ count: 60, end: 0 }); // count = candles visible; end = candles hidden on the right
  const hoverRef = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startEnd: number } | null>(null);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });

  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const { w, h, dpr } = dimsRef.current;
    if (!canvas || !ctx || !w || !h) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.font = '10px Inter, sans-serif';
    ctx.textBaseline = 'middle';

    const candles = candlesRef.current;
    if (!candles.length) return;

    const plotW = w - PAD_RIGHT - PAD_LEFT;
    const plotH = h - PAD_TOP - PAD_BOTTOM;
    const total = candles.length;
    const visCount = Math.min(viewRef.current.count, total);
    const rightIdx = clamp(total - 1 - viewRef.current.end, visCount - 1, total - 1);
    const startIdx = rightIdx - visCount + 1;
    const vis = candles.slice(startIdx, rightIdx + 1);

    let min = Infinity, max = -Infinity;
    for (const k of vis) { if (k.low < min) min = k.low; if (k.high > max) max = k.high; }
    const span = max - min || max * 0.01 || 1;
    min -= span * 0.08; max += span * 0.08;
    const range = max - min;

    const slot = plotW / vis.length;
    const xOf = (i: number) => PAD_LEFT + (i + 0.5) * slot;
    const yOf = (p: number) => PAD_TOP + (1 - (p - min) / range) * plotH;

    // horizontal grid + price axis
    ctx.textAlign = 'left';
    for (let s = 0; s <= 4; s++) {
      const p = min + (range * s) / 4;
      const yy = yOf(p);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath(); ctx.moveTo(PAD_LEFT, yy); ctx.lineTo(PAD_LEFT + plotW, yy); ctx.stroke();
      ctx.fillStyle = 'rgba(245,241,234,0.4)';
      ctx.fillText(p.toFixed(priceDecimals), PAD_LEFT + plotW + 6, yy);
    }

    // candles
    const bodyW = Math.max(1, slot * 0.62);
    for (let i = 0; i < vis.length; i++) {
      const k = vis[i];
      const cx = xOf(i);
      const up = k.close >= k.open;
      ctx.strokeStyle = up ? '#00C853' : '#FF3D71';
      ctx.fillStyle = up ? '#00C853' : '#FF3D71';
      ctx.beginPath(); ctx.moveTo(cx, yOf(k.high)); ctx.lineTo(cx, yOf(k.low)); ctx.stroke();
      const yO = yOf(k.open), yC = yOf(k.close);
      ctx.fillRect(cx - bodyW / 2, Math.min(yO, yC), bodyW, Math.max(1, Math.abs(yC - yO)));
    }

    // last price line + tag
    const last = vis[vis.length - 1];
    const ly = yOf(last.close);
    ctx.strokeStyle = 'rgba(212,175,127,0.5)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(PAD_LEFT, ly); ctx.lineTo(PAD_LEFT + plotW, ly); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = accent;
    ctx.fillRect(PAD_LEFT + plotW, ly - 8, PAD_RIGHT, 16);
    ctx.fillStyle = '#06090F';
    ctx.fillText(last.close.toFixed(priceDecimals), PAD_LEFT + plotW + 6, ly);

    // time axis
    ctx.fillStyle = 'rgba(245,241,234,0.4)';
    ctx.textAlign = 'center';
    const labels = 4;
    for (let s = 0; s <= labels; s++) {
      const i = Math.floor(((vis.length - 1) * s) / labels);
      const d = new Date(vis[i].time * 1000);
      const lbl = timeframe === '1D' || timeframe === '1W'
        ? `${d.getMonth() + 1}/${d.getDate()}`
        : `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      ctx.fillText(lbl, clamp(xOf(i), PAD_LEFT + 14, PAD_LEFT + plotW - 14), PAD_TOP + plotH + 12);
    }

    // crosshair + readouts
    const hv = hoverRef.current;
    if (hv && hv.x >= PAD_LEFT && hv.x <= PAD_LEFT + plotW && hv.y >= PAD_TOP && hv.y <= PAD_TOP + plotH) {
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(hv.x, PAD_TOP); ctx.lineTo(hv.x, PAD_TOP + plotH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PAD_LEFT, hv.y); ctx.lineTo(PAD_LEFT + plotW, hv.y); ctx.stroke();
      ctx.setLineDash([]);

      const p = min + (1 - (hv.y - PAD_TOP) / plotH) * range;
      ctx.fillStyle = 'rgba(20,24,32,0.96)';
      ctx.fillRect(PAD_LEFT + plotW, hv.y - 8, PAD_RIGHT, 16);
      ctx.fillStyle = '#F5F1EA';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(priceDecimals), PAD_LEFT + plotW + 6, hv.y);

      const idx = clamp(Math.round((hv.x - PAD_LEFT) / slot - 0.5), 0, vis.length - 1);
      const k = vis[idx];
      const up = k.close >= k.open;
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(245,241,234,0.55)';
      ctx.fillText('O', PAD_LEFT + 4, PAD_TOP - 9);
      ctx.fillStyle = up ? '#00C853' : '#FF3D71';
      let tx = PAD_LEFT + 14;
      const seg = (label: string, val: number) => {
        ctx.fillStyle = 'rgba(245,241,234,0.45)'; ctx.fillText(label, tx, PAD_TOP - 9); tx += ctx.measureText(label).width + 3;
        ctx.fillStyle = up ? '#00C853' : '#FF3D71'; const v = val.toFixed(priceDecimals); ctx.fillText(v, tx, PAD_TOP - 9); tx += ctx.measureText(v).width + 10;
      };
      tx = PAD_LEFT + 4;
      seg('O', k.open); seg('H', k.high); seg('L', k.low); seg('C', k.close);
    }
  }, [accent, priceDecimals, timeframe]);

  // Load candles on symbol / timeframe change.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/market/candles?symbol=${encodeURIComponent(symbol)}&interval=${timeframe}`);
        if (!res.ok) throw new Error(`Failed to load candles (${res.status})`);
        const data = await res.json();
        if (cancelled) return;
        candlesRef.current = data.candles || [];
        viewRef.current.end = 0;
        viewRef.current.count = Math.min(60, candlesRef.current.length || 60);
        draw();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Chart error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [symbol, timeframe, draw]);

  // Live price → mutate last candle.
  useEffect(() => {
    if (!livePrice) return;
    const arr = candlesRef.current;
    if (!arr.length) return;
    const last = arr[arr.length - 1];
    last.close = Number(livePrice.toFixed(priceDecimals));
    last.high = Math.max(last.high, last.close);
    last.low = Math.min(last.low, last.close);
    draw();
  }, [livePrice, priceDecimals, draw]);

  // Sizing (devicePixelRatio aware).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      dimsRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      draw();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [draw]);

  // Pointer interactions: zoom (wheel), pan (drag), crosshair (move).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const visCount = () => Math.min(viewRef.current.count, candlesRef.current.length || 1);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const total = candlesRef.current.length;
      if (!total) return;
      const factor = e.deltaY > 0 ? 1.15 : 0.87;
      viewRef.current.count = Math.round(clamp(viewRef.current.count * factor, 15, total));
      viewRef.current.end = clamp(viewRef.current.end, 0, total - Math.min(viewRef.current.count, total));
      draw();
    };
    const onDown = (e: MouseEvent) => { dragRef.current = { startX: e.offsetX, startEnd: viewRef.current.end }; };
    const onMove = (e: MouseEvent) => {
      hoverRef.current = { x: e.offsetX, y: e.offsetY };
      if (dragRef.current) {
        const total = candlesRef.current.length;
        const plotW = dimsRef.current.w - PAD_RIGHT - PAD_LEFT;
        const barW = plotW / visCount();
        const shift = Math.round((e.offsetX - dragRef.current.startX) / barW);
        viewRef.current.end = clamp(dragRef.current.startEnd + shift, 0, Math.max(0, total - visCount()));
      }
      draw();
    };
    const onUp = () => { dragRef.current = null; };
    const onLeave = () => { hoverRef.current = null; dragRef.current = null; draw(); };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [draw]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded transition-colors"
            style={timeframe === tf
              ? { background: accent, color: '#06090F' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(245,241,234,0.55)' }}
          >
            {tf}
          </button>
        ))}
        <div className="flex-1" />
        {isLoading && <span className="text-[10px]" style={{ color: 'rgba(245,241,234,0.4)' }}>Loading…</span>}
        {error && <span className="text-[10px]" style={{ color: '#FF3D71' }}>{error}</span>}
      </div>
      <div ref={wrapRef} className="flex-1 relative w-full" style={{ minHeight: 0, cursor: 'crosshair' }}>
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
