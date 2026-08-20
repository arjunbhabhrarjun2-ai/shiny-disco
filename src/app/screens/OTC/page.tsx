'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import {
  FaHandshake,
  FaLock,
  FaComments,
  FaCoins,
  FaBalanceScale,
  FaUserTie,
} from 'react-icons/fa';

const services = [
  {
    icon: FaHandshake,
    title: 'Deep Liquidity',
    desc: 'Spot and derivatives trades exceeding $50,000 for eligible OTC clients in applicable jurisdictions.',
  },
  {
    icon: FaLock,
    title: 'Discreet & Secure Execution',
    desc: 'Competitive pricing with flexible settlement — the desk moves size without disrupting market order.',
  },
  {
    icon: FaComments,
    title: 'Chat Trading',
    desc: 'Secure dialogue with the trading desk. Personalised service from initial consultation through execution.',
  },
  {
    icon: FaCoins,
    title: 'Lending',
    desc: 'Tailored financing to unlock liquidity with precise execution. Minimum loan amount $500,000.',
  },
  {
    icon: FaBalanceScale,
    title: 'Derivatives',
    desc: 'Flexible options across a wide range of assets for leveraged exposure without market slippage.',
  },
  {
    icon: FaUserTie,
    title: 'Dedicated Managers',
    desc: 'Institutional client managers on standby 24/7 — the same voice from onboarding to settlement.',
  },
];

const stats = [
  { v: '$50k+', l: 'Minimum ticket' },
  { v: '24/7', l: 'Desk coverage' },
  { v: '<5 min', l: 'Quote response' },
  { v: 'T+0', l: 'Settlement window' },
];

export default function OTCPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
              OTC Trade Desk · Private Execution
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}
          >
            Large tickets, quietly{' '}
            <span
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              filled.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Private execution for transactions above $50,000 — RFQ Portal, Chat Trading, Lending
            from $500,000, and Derivatives. Tight spreads, flexible settlement, and 24/7 support
            from the Kandella Trade Desk.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{
            background: 'rgba(212,175,127,0.14)',
            border: '1px solid rgba(212,175,127,0.18)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {stats.map((s) => (
            <motion.div key={s.l} variants={fadeUp} className="px-6 py-8" style={{ background: '#06090F' }}>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#F5F1EA', lineHeight: 1, fontWeight: 400 }}>
                {s.v}
              </div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Services grid */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
            The Desk Services
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {services.map((s) => (
            <motion.div key={s.title} variants={fadeUp} className="p-7" style={{ background: '#0A0E17' }}>
              <div
                className="flex items-center justify-center mb-5"
                style={{ width: 34, height: 34, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}
              >
                <s.icon size={13} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>
                {s.title}
              </h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Workflow */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
            RFQ Workflow
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl mb-10 max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
          From request to settlement in{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            four steps.
          </span>
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-0" style={{ background: 'rgba(212,175,127,0.14)', gap: 1 }}>
          {[
            { n: '01', t: 'Request', d: 'Submit size, asset, direction via RFQ portal or chat.' },
            { n: '02', t: 'Quote', d: 'Receive executable quote within minutes, valid for 30 seconds.' },
            { n: '03', t: 'Confirm', d: 'Accept the quote; position locked against your account.' },
            { n: '04', t: 'Settle', d: 'Instant settlement from existing account funds or wire.' },
          ].map((s) => (
            <div key={s.n} style={{ background: '#0A0E17', padding: '32px 24px' }}>
              <div className="text-[10px] uppercase mb-4" style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontFamily: 'var(--font-mono, monospace)' }}>
                {s.n}
              </div>
              <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>
                {s.t}
              </h3>
              <p className="text-xs" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div
          className="px-8 md:px-12 py-12"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14',
            border: '1px solid rgba(212,175,127,0.1)',
            borderRadius: 2,
          }}
        >
          <div className="text-5xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', color: '#D4AF7F', lineHeight: 1 }}>&ldquo;</div>
          <blockquote className="text-xl md:text-2xl max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontStyle: 'normal', fontWeight: 300, lineHeight: 1.45 }}>
            Size should never move the market. When it does, the desk has failed its purpose.
          </blockquote>
          <div className="mt-6 text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.28em' }}>
            — Head of OTC · Kandella Trade Desk
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Request a quote{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            privately.
          </span>
        </h2>
        <Link
          href="/screens/Contact"
          className="inline-block px-10 py-4 text-[11px] uppercase"
          style={{
            background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
            color: '#06090F',
            letterSpacing: '0.22em',
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Contact the Desk →
        </Link>
      </section>
    </div>
  );
}
