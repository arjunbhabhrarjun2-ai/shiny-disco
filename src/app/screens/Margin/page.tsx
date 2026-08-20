'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaArrowUp, FaArrowDown, FaCoins, FaCogs, FaChartBar } from 'react-icons/fa';

const stats = [
  { v: '5×', l: 'Max leverage' },
  { v: '30+', l: 'Collateral assets' },
  { v: '230+', l: 'Margin markets' },
  { v: '0.01–0.04%', l: 'Trading fees' },
];

const pairs = [
  'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT',
  'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'DOT/USDT',
  'LINK/USDT', 'ATOM/USDT', 'BNB/USDT', 'MATIC/USDT',
];

export default function MarginPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
              Margin Trading · 230+ Markets
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Leverage, with{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              restraint built in.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Up to 5× leverage on spot markets across 230+ margin-enabled pairs. Use over 30 digital
            assets as collateral — ETH, DOGE, ADA, BTC, XRP, SOL and more. Both long and short
            positions supported. Margin fees range 0.01% – 0.04%.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {stats.map((s) => (
            <motion.div key={s.l} variants={fadeUp} className="px-6 py-8" style={{ background: '#06090F' }}>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.25rem', color: '#F5F1EA', lineHeight: 1, fontWeight: 400 }}>{s.v}</div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Long/Short split */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ background: 'rgba(212,175,127,0.14)', gap: 1, border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ background: '#0A0E17', padding: '48px 36px' }}>
            <div className="flex items-center gap-3 mb-5">
              <FaArrowUp style={{ color: '#D4AF7F' }} size={14} />
              <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Long</span>
            </div>
            <h3 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
              Express directional conviction with amplified exposure.
            </h3>
            <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              Borrow against your collateral to take larger positions in assets
              you believe will appreciate. Leverage is adjustable per pair up to
              the maximum limit set for that market.
            </p>
          </div>
          <div style={{ background: '#0A0E17', padding: '48px 36px' }}>
            <div className="flex items-center gap-3 mb-5">
              <FaArrowDown style={{ color: '#D4AF7F' }} size={14} />
              <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Short</span>
            </div>
            <h3 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
              Hedge exposure or profit from anticipated declines.
            </h3>
            <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              Borrow the asset, sell at the prevailing market price, and
              repurchase when the market moves. Short positions carry the same
              margin requirements as longs.
            </p>
          </div>
        </div>
      </section>

      {/* Markets list */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Sample Markets</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {pairs.map((p) => (
            <div key={p} className="px-5 py-4" style={{ background: '#0A0E17' }}>
              <span className="text-sm" style={{ color: '#F5F1EA', fontFamily: 'var(--font-mono, monospace)' }}>{p}</span>
              <span className="text-[10px] uppercase ml-2" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>Margin</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fees */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {[
            { icon: FaCoins, t: 'Maker fee', v: '0.01%', sub: 'Adds liquidity to order book' },
            { icon: FaChartBar, t: 'Taker fee', v: '0.04%', sub: 'Removes liquidity from book' },
            { icon: FaCogs, t: 'Unwinding', v: 'Rate cards', sub: 'Variable by asset and duration' },
          ].map((f) => (
            <div key={f.t} style={{ background: '#0A0E17', padding: '32px 28px' }}>
              <f.icon size={14} style={{ color: '#D4AF7F', marginBottom: 16 }} />
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{f.t}</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2rem', color: '#F5F1EA', lineHeight: 1 }}>{f.v}</div>
              <div className="text-xs mt-2" style={{ color: '#A9B1C0' }}>{f.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Leverage starts with{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            discipline.
          </span>
        </h2>
        <Link href="/screens/auth/Signup" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Open margin account →
        </Link>
      </section>
    </div>
  );
}
