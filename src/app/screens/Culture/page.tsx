'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaGlobe, FaUsers, FaCompass, FaSeedling } from 'react-icons/fa';

const values = [
  { icon: FaCompass, t: 'Mission-Driven', d: 'Accelerate global adoption of crypto so everyone can achieve financial freedom and inclusion.' },
  { icon: FaGlobe, t: 'Remote-First', d: 'Kandella team members work from over 70 countries, speaking over 50 languages. The office is wherever the work is.' },
  { icon: FaUsers, t: 'Diverse Perspectives', d: 'A beautiful melting pot of individuals bringing together diverse ideas, perspectives, and opinions.' },
  { icon: FaSeedling, t: 'Craft-Oriented', d: 'We invest in deep work and craft. Every role has space for mastery, not just delivery.' },
];

export default function CulturePage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Culture at Kandella</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Accelerating crypto adoption for{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              financial inclusion.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Remote-first across 15 countries and 50+ languages. We hire for craft, not credentials,
            and for the discipline to ship the same product everywhere — whether the customer is
            in São Paulo, Singapore, or Stockholm.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {values.map((v) => (
            <motion.div key={v.t} variants={fadeUp} className="p-8" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <v.icon size={14} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{v.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{v.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Numbers */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {[
            { v: '15', l: 'Countries' },
            { v: '50+', l: 'Languages' },
            { v: '2019', l: 'Founded' },
            { v: '650K+', l: 'Clients' },
          ].map((s) => (
            <div key={s.l} style={{ background: '#06090F', padding: '28px 24px' }}>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.25rem', color: '#F5F1EA', lineHeight: 1 }}>{s.v}</div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-12" style={{ background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14', border: '1px solid rgba(212,175,127,0.1)', borderRadius: 2 }}>
          <div className="text-5xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', color: '#D4AF7F', lineHeight: 1 }}>&ldquo;</div>
          <blockquote className="text-xl md:text-2xl max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontStyle: 'normal', fontWeight: 300, lineHeight: 1.45 }}>
            Hire people who care about the craft more than the title, and give them room to disagree. The best answers rarely arrive politely.
          </blockquote>
          <div className="mt-6 text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.28em' }}>
            — Founding Team · Kandella
          </div>
        </div>
      </section>
    </div>
  );
}
