'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { Parallax } from '@/components/motion';
import { FaKey, FaFingerprint, FaEye, FaLayerGroup, FaLink, FaShieldAlt } from 'react-icons/fa';

const features = [
  { icon: FaKey, title: 'Self-Custody', desc: 'Users have full control over their digital assets and data. No custodial intermediaries between you and your keys.' },
  { icon: FaLayerGroup, title: 'All-in-One Storage', desc: 'Store and manage all cryptocurrencies and multiple wallets in one place — a single unified interface.' },
  { icon: FaFingerprint, title: 'World-Class Security', desc: 'Open-source software protected by the latest biometric verification and end-to-end encryption.' },
  { icon: FaLink, title: 'DeFi Simplified', desc: 'View and manage DeFi positions, confirm transactions, and interact with dApps without bouncing between apps.' },
  { icon: FaEye, title: 'Privacy First', desc: 'IP addresses and personal data are never tracked or shared with third parties. Zero telemetry, ever.' },
  { icon: FaShieldAlt, title: 'Backed by Kandella', desc: 'Leverages Kandella&rsquo;s reputation and security commitment — the same protections that guard the prime desk.' },
];

export default function WalletPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="relative px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto overflow-hidden">
        <Parallax offset={110} className="absolute -top-8 right-2 sm:right-10 pointer-events-none select-none z-0">
          <span aria-hidden className="font-serif-italic" style={{ fontSize: 'clamp(6rem, 18vw, 16rem)', color: 'rgba(0,229,255,0.05)', lineHeight: 1, letterSpacing: '-0.03em' }}>custody</span>
        </Parallax>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-4xl z-10">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
              Kandella Wallet · Self-Custody Suite
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}
          >
            Keys in your hands.{' '}
            <span
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Coin in your wallet.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            A self-custody wallet that gives you full control of your assets. All-in-one storage
            with world-class security — biometric verification, end-to-end encryption, simplified
            DeFi access, privacy-first design, and a unified dashboard, all backed by Kandella.
          </motion.p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
            What the Wallet Does
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
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="p-7" style={{ background: '#0A0E17' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 34, height: 34, border: '1px solid rgba(212,175,127,0.25)', background: 'rgba(212,175,127,0.05)', borderRadius: 2 }}>
                <f.icon size={13} style={{ color: '#D4AF7F' }} />
              </div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Dashboard preview (editorial block) */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
          style={{ background: 'rgba(212,175,127,0.14)', gap: 1, border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}
        >
          <div style={{ background: '#0A0E17', padding: '48px 36px' }}>
            <div className="text-[10px] uppercase mb-4" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>
              Unified Dashboard
            </div>
            <h2 className="text-3xl md:text-4xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
              One view, every chain, every position.
            </h2>
            <p className="text-sm mb-4" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              View everything from multiple DeFi positions, vested allocations,
              staked balances, NFT holdings, and cross-chain bridges — all in a
              single dashboard. No network switching required.
            </p>
            <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              Seamless setup, transparent transaction history, and the ability
              to export your full portfolio at any time.
            </p>
          </div>

          <div style={{ background: '#080C14', padding: '48px 36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 360 }}>
              {['Bitcoin · BTC', 'Ethereum · ETH', 'Solana · SOL', 'XRP Ledger · XRP', 'Dogecoin · DOGE'].map((asset) => (
                <div
                  key={asset}
                  className="flex justify-between items-center py-4"
                  style={{ borderBottom: '1px solid rgba(212,175,127,0.1)' }}
                >
                  <span className="text-xs uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.15em' }}>
                    {asset}
                  </span>
                  <span style={{ color: '#D4AF7F', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.875rem' }}>
                    $—
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Claim custody of{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            your coins.
          </span>
        </h2>
        <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
          Open the wallet in the Kandella app, enable biometrics, and you are custody-sovereign in under 60 seconds.
        </p>
        <Link
          href="/screens/auth/Signup"
          className="inline-block px-10 py-4 text-[11px] uppercase"
          style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}
        >
          Get the Wallet →
        </Link>
      </section>
    </div>
  );
}
