'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaRocket, FaChartArea, FaCube, FaBolt, FaCodeBranch, FaChartLine } from 'react-icons/fa';

const features = [
  { icon: FaRocket, title: 'Up to 50× Leverage', desc: 'Amplify buying or selling power with up to 50x leverage on perpetual and quarterly futures contracts.' },
  { icon: FaChartArea, title: 'Wide Product Range', desc: 'A broad range of derivatives on a robust, low-latency, high-performance trading platform.' },
  { icon: FaCube, title: 'Multi-Collateral Futures', desc: 'Multi-M futures allow profits to be paid in any supported collateral currency, simplifying treasury.' },
  { icon: FaChartLine, title: 'CME Futures Access', desc: 'Kandella Derivatives US provides direct access to cryptocurrency futures listed on the CME exchange.' },
  { icon: FaCodeBranch, title: 'API Support', desc: 'Comprehensive API documentation for futures trading — REST endpoints, WebSocket feeds, FIX 4.4 connectivity.' },
  { icon: FaBolt, title: 'Low-Latency Engine', desc: 'Benchmark round-trip latency of 2.5ms, 99.9% uptime, over 1 million requests per minute capacity.' },
];

const stats = [
  { v: '50×', l: 'Max leverage' },
  { v: '2.5ms', l: 'RTT latency' },
  { v: '99.9%', l: 'Uptime' },
  { v: '1M/min', l: 'Req capacity' },
];

export default function FuturesPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
              Futures & Derivatives · Regulated
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}
          >
            Hedge with precision.{' '}
            <span
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Lever with intention.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Cryptocurrency derivatives with up to 50× leverage on perpetual and quarterly futures.
            Multi-collateral futures, CME futures access via Kandella Derivatives US, and full
            API support for institutional desks. Opening fee: 0.25% of notional value.
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
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {stats.map((s) => (
            <motion.div key={s.l} variants={fadeUp} className="px-6 py-8" style={{ background: '#06090F' }}>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#F5F1EA', lineHeight: 1, fontWeight: 400 }}>
                {s.v}
              </div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Derivative Capabilities</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="p-7" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 34, height: 34, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <f.icon size={13} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{f.title}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Risk note */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div
          className="px-8 md:px-12 py-10"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14',
            border: '1px solid rgba(212,175,127,0.1)',
            borderRadius: 2,
          }}
        >
          <div className="text-[10px] uppercase mb-4" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
            Risk Disclosure
          </div>
          <p className="text-base" style={{ color: '#A9B1C0', lineHeight: 1.8, maxWidth: 840 }}>
            Derivatives and margin products amplify both gains and losses.
            Leveraged trading is subject to eligibility screening, margin calls,
            and complete loss of invested capital. Review the Margin Disclosure
            Statement and Risk Disclosure on the Legal page before trading. Not
            available in all jurisdictions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Start trading{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            futures today.
          </span>
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/screens/auth/Signup" className="px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
            Open futures account →
          </Link>
          <Link href="/screens/Legal" className="px-10 py-4 text-[11px] uppercase" style={{ background: 'transparent', border: '1px solid rgba(212,175,127,0.35)', color: '#D4AF7F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
            Read disclosures
          </Link>
        </div>
      </section>
    </div>
  );
}
