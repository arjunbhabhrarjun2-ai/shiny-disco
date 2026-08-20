'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { Parallax } from '@/components/motion';
import { FaCoins, FaLock, FaSyncAlt, FaLayerGroup } from 'react-icons/fa';

const primitives = [
  { icon: FaCoins, t: 'Canonical Issuance', d: 'Non-fractional, 1:1 tokenisation of BTC, ETH, SOL, and major L1s with provable reserve attestations.' },
  { icon: FaLock, t: 'Enshrined Custody', d: 'Reserves held by qualified custodians; bridging is controlled by the K-Chain validator set, not a multisig.' },
  { icon: FaSyncAlt, t: 'Atomic Redemption', d: 'Burn an ATAsset on K-Chain, receive the underlying on the native chain in the same block finality.' },
  { icon: FaLayerGroup, t: 'DeFi-native Collateral', d: 'ATAssets are accepted as margin and collateral across the Kandella primitives — no synthetic risk layers.' },
];

const supported = [
  { sym: 'atBTC', n: 'Bitcoin' },
  { sym: 'atETH', n: 'Ethereum' },
  { sym: 'atSOL', n: 'Solana' },
  { sym: 'atUSDC', n: 'USD Coin' },
  { sym: 'atUSDT', n: 'Tether' },
  { sym: 'atMATIC', n: 'Polygon' },
];

export default function ATAssetsPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="relative px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto overflow-hidden">
        <Parallax offset={110} className="absolute -top-6 right-2 sm:right-10 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-italic" style={{ fontSize: 'clamp(6rem, 18vw, 16rem)', color: 'rgba(0,229,255,0.05)', lineHeight: 1, letterSpacing: '-0.03em' }}>bridge</span>
        </Parallax>
        <Parallax offset={-80} className="absolute bottom-0 left-2 sm:left-10 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-display" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: 'rgba(212,175,127,0.05)', lineHeight: 1 }}>XRP · BTC · DOGE</span>
        </Parallax>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-4xl z-10">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>ADAssets · Trust-Minimized Bridging</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Non-smart-contract assets,{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              now programmable.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            ADAssets bring value from non-smart-contract chains — XRP, Bitcoin, Dogecoin — into
            the Kandella DeFi ecosystem. Users lock the native asset on its origin chain;
            the State Connector verifies the lock-up; an equivalent ADAsset is minted on Trade
            Global. Over 90M ADAssets minted; ~80% actively used in SparkDex, Kinetic, and Enosys.
          </motion.p>
        </motion.div>
      </section>

      {/* Primitives grid */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Design Principles</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          {primitives.map((p) => (
            <motion.div key={p.t} variants={fadeUp} className="p-8" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <p.icon size={14} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{p.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Supported assets */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Supported Assets</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {supported.map((a) => (
            <div key={a.sym} style={{ background: '#06090F', padding: '24px 20px' }}>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '1.5rem', color: '#D4AF7F', lineHeight: 1 }}>{a.sym}</div>
              <div className="text-[10px] uppercase mt-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{a.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reserves block */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-10" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.12)', borderRadius: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <FaLock size={14} style={{ color: '#D4AF7F' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Proof of Reserves</span>
          </div>
          <h3 className="text-2xl md:text-3xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.2 }}>
            Every ATAsset is reconcilable on-chain.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Attestations</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2rem', color: '#D4AF7F', lineHeight: 1 }}>Every 15 min</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Auditor</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2rem', color: '#D4AF7F', lineHeight: 1 }}>Big Four</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Reserve Ratio</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2rem', color: '#D4AF7F', lineHeight: 1 }}>1.00×</div>
            </div>
          </div>
          <p className="text-sm mt-6" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Reserve hashes are published directly to the K-Chain. Anyone can
            verify the ratio without trusting Kandella or a third party — the proof
            is enshrined in the block it settles in.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Hold the canonical{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            version.
          </span>
        </h2>
        <Link href="/screens/Wallet" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Open a wallet →
        </Link>
      </section>
    </div>
  );
}
