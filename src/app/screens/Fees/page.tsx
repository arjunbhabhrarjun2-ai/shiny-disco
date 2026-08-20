'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaReceipt, FaExchangeAlt, FaPercent, FaShieldAlt } from 'react-icons/fa';

const spot = [
  { tier: 'Retail', maker: '0.16%', taker: '0.26%', note: '< $50k 30-day volume' },
  { tier: 'Pro',    maker: '0.14%', taker: '0.22%', note: '$50k – $1M 30-day volume' },
  { tier: 'Pro+',   maker: '0.10%', taker: '0.18%', note: '$1M – $10M 30-day volume' },
  { tier: 'Elite',  maker: '0.08%', taker: '0.14%', note: '$10M – $50M 30-day volume' },
  { tier: 'Prime',  maker: '0.02%', taker: '0.10%', note: '> $50M 30-day volume · negotiated' },
];

const futures = [
  { tier: 'Retail', maker: '0.02%', taker: '0.05%' },
  { tier: 'Pro',    maker: '0.02%', taker: '0.04%' },
  { tier: 'Elite',  maker: '0.00%', taker: '0.03%' },
  { tier: 'Prime',  maker: '−0.005%', taker: '0.02%' },
];

const other = [
  { icon: FaExchangeAlt, t: 'Wire Transfers', d: 'Inbound USD / EUR / GBP wires are free. Outbound wires flat $18 / €15 / £15.' },
  { icon: FaPercent, t: 'Margin Funding', d: 'Variable borrow rate, capped at 0.04% per day. Interest accrues on utilised balance only.' },
  { icon: FaShieldAlt, t: 'Custody Services', d: 'Institutional cold storage — 10 bps per annum. Included free for Prime tier clients.' },
  { icon: FaReceipt, t: 'Deposits & Withdrawals', d: 'On-chain crypto deposits are free. Withdrawals charged at prevailing network fee with no markup.' },
];

export default function FeesPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Fee Schedule · Effective 2026</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            No hidden spreads.{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Everything printed.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Instant Buy/Sell: 1% fee (1.5% for wallet transfer numbered orders). Kandella+ members
            enjoy zero trading fees on monthly volume up to $10,000 for major cryptocurrencies. On-chain
            staking has no transaction fees (20% commission for flexible staking with unbonding periods).
            Derivatives opening fee: 0.25% of notional value.
          </motion.p>
        </motion.div>
      </section>

      {/* Spot fees */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Spot Trading · Maker / Taker</span>
        </div>

        <div style={{ border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          <div className="grid grid-cols-12 px-6 py-4 text-[10px] uppercase" style={{ background: '#0A0E17', color: '#A9B1C0', letterSpacing: '0.22em', borderBottom: '1px solid rgba(212,175,127,0.12)' }}>
            <div className="col-span-3">Tier</div>
            <div className="col-span-2">Maker</div>
            <div className="col-span-2">Taker</div>
            <div className="col-span-5">Qualification</div>
          </div>
          {spot.map((s, i) => (
            <div key={s.tier} className="grid grid-cols-12 px-6 py-5 items-center" style={{ background: '#06090F', borderTop: i === 0 ? 'none' : '1px solid rgba(212,175,127,0.08)' }}>
              <div className="col-span-3">
                <div className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>{s.tier}</div>
              </div>
              <div className="col-span-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '1.5rem', color: '#F5F1EA' }}>{s.maker}</div>
              <div className="col-span-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '1.5rem', color: '#F5F1EA' }}>{s.taker}</div>
              <div className="col-span-5 text-sm" style={{ color: '#A9B1C0' }}>{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Futures fees */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Futures · Maker / Taker</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {futures.map((f) => (
            <motion.div key={f.tier} variants={fadeUp} style={{ background: '#0A0E17', padding: '28px 24px' }}>
              <div className="text-[10px] uppercase mb-3" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>{f.tier}</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '1.75rem', color: '#F5F1EA' }}>{f.maker}</span>
                <span className="text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Maker</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '1.75rem', color: '#F5F1EA' }}>{f.taker}</span>
                <span className="text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Taker</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Other fees */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Other Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {other.map((o) => (
            <div key={o.t} className="p-8" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <o.icon size={14} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{o.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{o.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fine print */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-10" style={{ background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14', border: '1px solid rgba(212,175,127,0.1)', borderRadius: 2 }}>
          <div className="text-[10px] uppercase mb-3" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Notes on Our Fee Schedule</div>
          <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.8 }}>
            All fees are quoted as a percentage of notional and denominated in the
            settlement currency of the trade. Tier qualification is reviewed daily
            based on a trailing 30-day USD-equivalent volume. Kandella Prime and
            institutional clients may negotiate bespoke schedules; contact the
            institutional desk for a sheet.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Want a negotiated{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            schedule?
          </span>
        </h2>
        <Link href="/screens/Institutional" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Contact the desk →
        </Link>
      </section>
    </div>
  );
}
