'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaLandmark, FaChartPie, FaLock, FaFileInvoiceDollar } from 'react-icons/fa';
import { Parallax } from '@/components/motion';

const features = [
  { icon: FaLandmark, t: 'Three Capital Tiers', d: 'Core Yield, Strategic Growth, and Institutional Capital — calibrated minimums and structured returns at every stage of investor sophistication.' },
  { icon: FaChartPie, t: 'One-Month Cycles', d: 'Every bond settles in a clean 30-day window. Interest plus principal returned in one payout — no rollovers, no rolling lock-ups.' },
  { icon: FaLock, t: 'Qualified Custody', d: 'Underlying capital held by a qualified custodian with 1:1 reserve backing, Merkle Tree cryptography, and external proof-of-reserves attestations.' },
  { icon: FaFileInvoiceDollar, t: 'Interest + Capital', d: 'Returns are paid at maturity as interest plus full capital. No hidden management fees — only the contractual ROI agreed at issuance.' },
];

const rates = [
  { term: 'Tier 01', apy: '30%', label: 'Core Yield' },
  { term: 'Tier 02', apy: '40%', label: 'Strategic Growth' },
  { term: 'Tier 03', apy: '55%', label: 'Institutional' },
  { term: '1 Month', apy: '24/7', label: 'Settlement' },
];

export default function BondsPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="relative px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto overflow-hidden">
        {/* Parallax decorative glyphs */}
        <Parallax offset={120} className="absolute -top-10 right-4 sm:right-12 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-italic" style={{ fontSize: 'clamp(6rem, 18vw, 16rem)', color: 'rgba(212,175,127,0.06)', lineHeight: 1, letterSpacing: '-0.03em' }}>yield</span>
        </Parallax>
        <Parallax offset={-80} className="absolute bottom-0 left-4 sm:left-12 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-display" style={{ fontSize: 'clamp(5rem, 14vw, 12rem)', color: 'rgba(0,229,255,0.05)', lineHeight: 1 }}>30 · 40 · 55%</span>
        </Parallax>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-4xl z-10">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Kandella Bonds · Structured Yield</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Three tiers.{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              One-month maturity.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Kandella Bonds offer structured monthly yield across three capital tiers —
            from $1,000 Core Yield through $1M Institutional Capital. Each cycle pays
            contractual interest plus capital at maturity, with returns up to 55% ROI.
          </motion.p>
        </motion.div>
      </section>

      {/* Live rates */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Capital Tiers · Fixed Monthly ROI</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {rates.map((r) => (
            <div key={r.term} style={{ background: '#06090F', padding: '28px 24px' }}>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{r.label}</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#D4AF7F', lineHeight: 1 }}>{r.apy}</div>
              <div className="text-xs mt-2" style={{ color: '#A9B1C0' }}>{r.term}</div>
            </div>
          ))}
        </div>

        {/* ── Tier detail grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mt-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderTop: 'none', borderRadius: 2, overflow: 'hidden' }}>
          {[
            { tier: 'Tier 01', name: 'Core Yield Fund', range: '$1,000 – $19,999', roi: '30% ROI', duration: '1 month · Interest + Capital', accent: '#10B981' },
            { tier: 'Tier 02', name: 'Strategic Growth Fund', range: '$20,000 – $99,999', roi: '40% ROI', duration: '1 month · Interest + Capital', accent: '#D4AF7F' },
            { tier: 'Tier 03', name: 'Institutional Capital Fund', range: '$100,000 – $1,000,000', roi: '55% ROI', duration: '1 month · Interest + Capital', accent: '#00e5ff' },
          ].map((p) => (
            <div key={p.tier} style={{ background: '#06090F', padding: '32px 28px' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded" style={{ color: p.accent, background: `${p.accent}14`, border: `1px solid ${p.accent}44`, letterSpacing: '0.22em' }}>
                  {p.tier}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '1.6rem', color: '#F5F1EA', lineHeight: 1.15, marginBottom: 6 }}>
                {p.name}
              </div>
              <div className="text-sm mb-5" style={{ color: '#A9B1C0' }}>{p.range}</div>
              <div className="flex items-baseline gap-3 mb-3">
                <span style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.6rem', color: p.accent, lineHeight: 1 }}>{p.roi}</span>
              </div>
              <div className="text-[11px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.18em' }}>{p.duration}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Why Kandella Bonds</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {features.map((f) => (
            <motion.div key={f.t} variants={fadeUp} className="p-8" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <f.icon size={14} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{f.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{f.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Structure block */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-10" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.12)', borderRadius: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <FaFileInvoiceDollar size={14} style={{ color: '#D4AF7F' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Programme Structure</span>
          </div>
          <h3 className="text-2xl md:text-3xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.2 }}>
            Tokens, custody, coupons — all reconciled on-chain.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>01 Issuance</div>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>Primary dealers source short-duration paper; Kandella mints a 1:1 claim token.</p>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>02 Custody</div>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>Underlying bonds remain at a qualified third-party custodian, attested monthly.</p>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>03 Distribution</div>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>Coupon streams distributed to token holders pro-rata on each settlement cycle.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Park your treasury in{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            something you can reconcile.
          </span>
        </h2>
        <Link href="/screens/Institutional" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Talk to Fixed Income →
        </Link>
      </section>
    </div>
  );
}
