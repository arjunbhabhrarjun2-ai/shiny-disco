'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { Parallax } from '@/components/motion';
import { FaClock, FaNetworkWired, FaShieldAlt, FaCode } from 'react-icons/fa';

const capabilities = [
  { icon: FaClock, t: 'Sub-second Feeds', d: 'Time-series price feeds delivered with sub-second latency to the K-Chain and partnered EVMs.' },
  { icon: FaNetworkWired, t: 'Enshrined Consensus', d: 'ATSO is part of K-Chain consensus — no external committee, no off-chain trust assumption.' },
  { icon: FaShieldAlt, t: 'Cryptographic Attestation', d: 'Every price quote is signed by the validator set and verifiable at settlement.' },
  { icon: FaCode, t: 'Developer-First', d: 'A single contract interface across chains. Price, TWAP, and latency metadata are returned in one call.' },
];

const specs = [
  { k: '0.8s', l: 'Median feed latency' },
  { k: '65+', l: 'Assets covered' },
  { k: '12', l: 'Chains supported' },
  { k: '100%', l: 'Consensus-backed' },
];

export default function ATSOPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="relative px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto overflow-hidden">
        <Parallax offset={120} className="absolute -top-6 right-2 sm:right-10 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-italic" style={{ fontSize: 'clamp(6rem, 18vw, 16rem)', color: 'rgba(0,102,255,0.05)', lineHeight: 1, letterSpacing: '-0.03em' }}>oracle</span>
        </Parallax>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-4xl z-10">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>ATSO · ATRIUM Time Series Oracle</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Decentralized data feeds,{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              enshrined in the chain.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            ATSO is Kandella's native, enshrined oracle — built directly into the network's
            core protocol. It inherits the full economic security of the chain: over 98 independent
            data providers submit price estimates every 1.8 seconds; the system publishes the median
            as the official feed. Today, 66+ live price feeds are secured by over $75M of staked ATRIUM.
          </motion.p>
        </motion.div>
      </section>

      {/* Specs */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {specs.map((s) => (
            <div key={s.l} style={{ background: '#06090F', padding: '28px 24px' }}>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#D4AF7F', lineHeight: 1 }}>{s.k}</div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>What Makes ATSO Different</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {capabilities.map((c) => (
            <motion.div key={c.t} variants={fadeUp} className="p-8" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <c.icon size={14} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{c.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{c.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Code sample */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>A Single Read</span>
        </div>
        <div className="px-6 py-6 md:px-8 md:py-8" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.12)', borderRadius: 2 }}>
          <pre className="text-xs md:text-sm overflow-x-auto" style={{ color: '#E8D3B0', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1.7 }}>
{`interface IATSO {
  function getPrice(bytes32 feedId) external view returns (
    uint256 price,
    uint256 timestamp,
    bytes   signature
  );
}

// Consume from any K-Chain or supported EVM contract.
(uint256 ethUsd, , ) = atso.getPrice(FEED_ETH_USD);`}
          </pre>
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-12" style={{ background: 'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14', border: '1px solid rgba(212,175,127,0.1)', borderRadius: 2 }}>
          <div className="text-5xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', color: '#D4AF7F', lineHeight: 1 }}>&ldquo;</div>
          <blockquote className="text-xl md:text-2xl max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontStyle: 'normal', fontWeight: 300, lineHeight: 1.45 }}>
            An oracle is only as trustworthy as the smallest honest majority that signs it. Ours is the network itself.
          </blockquote>
          <div className="mt-6 text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.28em' }}>
            — Protocol Engineering · Kandella K-Chain
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Integrate in{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            one line.
          </span>
        </h2>
        <Link href="/screens/Institutional" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Developer docs →
        </Link>
      </section>
    </div>
  );
}
