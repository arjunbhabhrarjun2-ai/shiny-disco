'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { Parallax } from '@/components/motion';
import { FaLink, FaExchangeAlt, FaShieldAlt, FaRoute } from 'react-icons/fa';

const features = [
  { icon: FaLink, t: 'Cross-chain State Proofs', d: 'Validates events and state across Bitcoin, Ethereum, Solana, and Cosmos chains without wrapping or trust bridges.' },
  { icon: FaRoute, t: 'Deterministic Routing', d: 'One contract interface verifies whether a remote event occurred — no off-chain relayer to bribe.' },
  { icon: FaShieldAlt, t: 'Slashing-secured', d: 'Validators attesting to state stake ATRIUM. False attestations are slashed by enshrined consensus.' },
  { icon: FaExchangeAlt, t: 'Native Cross-chain Liquidity', d: 'Powers lock-mint and burn-release flows for Kandella\'s canonical bridges and ATAssets issuance.' },
];

const specs = [
  { k: '4', l: 'Chains validated' },
  { k: '2.1s', l: 'Median proof time' },
  { k: '0', l: 'Wrapped trust' },
  { k: '100%', l: 'Consensus-enshrined' },
];

export default function CTPDCPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="relative px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto overflow-hidden">
        <Parallax offset={120} className="absolute -top-6 right-2 sm:right-10 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-italic" style={{ fontSize: 'clamp(6rem, 18vw, 16rem)', color: 'rgba(212,175,127,0.06)', lineHeight: 1, letterSpacing: '-0.03em' }}>connect</span>
        </Parallax>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-4xl z-10">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>CTPDC · ATRIUM Data Connector</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Cross-chain state,{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              no trust bridge.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            The ATRIUM Data Connector (ADC) is a decentralized protocol for trustless verification
            of state from external blockchains and the internet. Independent attestation providers
            observe outside networks and submit cryptographic proofs; once majority consensus
            ({'>'}50%) is reached, the event's state is finalized on Kandella — powering
            cross-chain dApps and ADAssets bridging.
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

      {/* Features */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Capabilities</span>
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

      {/* Architecture */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Proof Flow</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '01', t: 'Request', d: 'A K-Chain contract calls `requestAttestation(chainId, txHash)` with a bounty.' },
            { n: '02', t: 'Attest', d: 'Validators observe the remote chain and submit signed attestations within one epoch.' },
            { n: '03', t: 'Settle', d: 'Consensus finalises the attestation. Contracts read it like any other state variable.' },
          ].map((s) => (
            <div key={s.n} className="p-8" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.12)', borderRadius: 2 }}>
              <div className="text-[10px] uppercase mb-3" style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontFamily: 'var(--font-mono, monospace)' }}>Step {s.n}</div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{s.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Build cross-chain apps{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            without a bridge.
          </span>
        </h2>
        <Link href="/screens/Institutional" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Read the spec →
        </Link>
      </section>
    </div>
  );
}
