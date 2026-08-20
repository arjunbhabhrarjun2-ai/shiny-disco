'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaBitcoin, FaCube, FaCoins, FaChartLine, FaBookOpen, FaLightbulb, FaShieldAlt, FaGlobe } from 'react-icons/fa';

const categories = [
  { icon: FaBitcoin, t: 'Bitcoin', d: 'Exploration of the world&rsquo;s largest and most important cryptocurrency — history, network, and roadmap.' },
  { icon: FaCube, t: 'Blockchain', d: 'Deep dive into the innovative technology powering cryptocurrency networks, from UTXOs to consensus.' },
  { icon: FaCoins, t: 'Cryptocurrency', d: 'Internal workings of crypto assets and major projects — tokenomics, governance, supply dynamics.' },
  { icon: FaChartLine, t: 'DeFi', d: 'An introduction to decentralised finance and trading without intermediaries. AMMs, lending, perpetuals.' },
  { icon: FaBookOpen, t: 'Trading', d: 'Basics of buying, selling, and trading cryptocurrency — from market orders to advanced derivatives.' },
  { icon: FaLightbulb, t: 'Decipher Series', d: 'Breaking down crypto concepts into digestible episodes. Designed for the curious, written for beginners.' },
  { icon: FaShieldAlt, t: 'Security Guide', d: 'Basics of protecting privacy and financial security — 2FA, hardware wallets, cold storage, phishing defence.' },
  { icon: FaGlobe, t: 'Research Reports', d: 'In-depth analysis and quarterly reports covering macro trends, regulatory moves, and sector rotation.' },
];

export default function LearnPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Learn Center · Editorial</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Crypto shouldn&rsquo;t be{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              cryptic.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            An editorial resource covering Bitcoin, Blockchain, Cryptocurrency, DeFi, Trading,
            Research Reports, the Decipher Series, Breakout, Crypto Basics and the Crypto Security
            Guide — paywalled by nothing, written by practitioners.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Eight Content Pillars</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {categories.map((c) => (
            <motion.div key={c.t} variants={fadeUp} className="p-7" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 34, height: 34, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <c.icon size={13} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{c.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{c.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-12" style={{ background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14', border: '1px solid rgba(212,175,127,0.1)', borderRadius: 2 }}>
          <div className="text-5xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', color: '#D4AF7F', lineHeight: 1 }}>&ldquo;</div>
          <blockquote className="text-xl md:text-2xl max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontStyle: 'normal', fontWeight: 300, lineHeight: 1.45 }}>
            Informed investors make better clients. Every article in our library exists to reduce the gap between curiosity and conviction.
          </blockquote>
          <div className="mt-6 text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.28em' }}>
            — Editorial Desk · Kandella Learn
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Start with{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            the blog.
          </span>
        </h2>
        <Link href="/screens/Blog" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Browse the blog →
        </Link>
      </section>
    </div>
  );
}
