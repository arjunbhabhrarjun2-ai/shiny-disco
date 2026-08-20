'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaUsersCog, FaExchangeAlt, FaLayerGroup, FaShieldAlt, FaClipboardCheck } from 'react-icons/fa';
import { FaVault } from 'react-icons/fa6';

const features = [
  { icon: FaVault, title: 'Qualified Custodian', desc: 'Developed by experts who have protected Kandella digital assets for over a decade under the strictest regulatory regimes.' },
  { icon: FaUsersCog, title: 'Complex Org Structures', desc: 'Vault-level access permissions, role-based approvals, quorum policies, and strict enforcement mapped to your ops model.' },
  { icon: FaExchangeAlt, title: 'OTC Integration', desc: 'Instant access to Kandella OTC&rsquo;s deep liquidity via automated trading features, available 24/7/365.' },
  { icon: FaLayerGroup, title: 'Unified Interface', desc: 'A single interface for storing, managing, and trading digital assets — no context-switching between venues.' },
  { icon: FaShieldAlt, title: 'Proof of Reserves', desc: 'Regular PoR reviews allow clients to verify balances are backed 1:1 through Merkle-tree cryptographic accounting.' },
  { icon: FaClipboardCheck, title: 'SOC 2 & ISO 27001', desc: 'Continuous audit regime covering information security, availability, processing integrity, and confidentiality.' },
];

export default function CustodyPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Kandella Custody · Qualified</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Qualified custody,{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              built for balance sheets.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Qualified digital asset custody for institutions and private clients — support for
            complex organizational structures, integrated OTC execution, and a unified interface
            covering custody, transfers, and trading from a single regulated entity.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Custody Capabilities</span>
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

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-12" style={{ background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14', border: '1px solid rgba(212,175,127,0.1)', borderRadius: 2 }}>
          <div className="text-5xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', color: '#D4AF7F', lineHeight: 1 }}>&ldquo;</div>
          <blockquote className="text-xl md:text-2xl max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontStyle: 'normal', fontWeight: 300, lineHeight: 1.45 }}>
            Custody is the first product every institutional client asks about, and the last one they consider switching.
          </blockquote>
          <div className="mt-6 text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.28em' }}>
            — Head of Custody · Kandella Global
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Talk to{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            the custody desk.
          </span>
        </h2>
        <Link href="/screens/Contact" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Schedule onboarding →
        </Link>
      </section>
    </div>
  );
}
