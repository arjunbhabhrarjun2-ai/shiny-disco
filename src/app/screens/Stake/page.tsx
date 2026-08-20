'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaNetworkWired, FaSatellite, FaCoins, FaClock } from 'react-icons/fa';

const stats = [
  { v: '50,000', l: 'Validator minimum (ATRIUM)' },
  { v: '14 days', l: 'Minimum lock-up' },
  { v: '3.5 days', l: 'ATSO payout cadence' },
  { v: '2 weeks', l: 'Validator payout cadence' },
];

export default function StakePage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Staking & Delegation · Dual Purpose</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Secure the chain.{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Earn the yield.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Kandella runs a dual-purpose staking system. Validator Staking (minimum 50,000 ATRIUM,
            14-day lock-up) secures the chain — rewards every 2 weeks. ATSO Delegation lets you wrap
            ATRIUM into WATRIUM and delegate to data providers — rewards paid every ~3.5 days.
          </motion.p>
        </motion.div>
      </section>

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
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2rem', color: '#F5F1EA', lineHeight: 1, fontWeight: 400 }}>{s.v}</div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Two types */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Two Types of Participation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ background: 'rgba(212,175,127,0.14)', gap: 1, border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ background: '#0A0E17', padding: '44px 32px' }}>
            <div className="flex items-center gap-3 mb-5">
              <FaNetworkWired style={{ color: '#D4AF7F' }} size={16} />
              <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>01 · Validator Staking</span>
            </div>
            <h3 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
              Secure the Kandella blockchain itself.
            </h3>
            <p className="text-sm mb-4" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              Stake ATRIUM to validators to secure consensus on the network. This
              requires a minimum stake of 50,000 ATRIUM and a minimum lock-up
              period of 14 days.
            </p>
            <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              Validator staking rewards are distributed every two weeks to all
              active delegators.
            </p>
          </div>
          <div style={{ background: '#0A0E17', padding: '44px 32px' }}>
            <div className="flex items-center gap-3 mb-5">
              <FaSatellite style={{ color: '#D4AF7F' }} size={16} />
              <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>02 · ATSO Delegation</span>
            </div>
            <h3 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
              Power the oracle that powers DeFi.
            </h3>
            <p className="text-sm mb-4" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              Wrap ATRIUM into WATRIUM and delegate to ATSO data providers. Delegation
              increases the provider&rsquo;s voting power in the oracle system,
              and in return, delegators earn a share of rewards.
            </p>
            <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
              ATSO delegation rewards are paid out roughly every 3.5 days.
            </p>
          </div>
        </div>
      </section>

      {/* Reward flow */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl mb-10 max-w-3xl" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.15 }}>
          How rewards{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            accrue and compound.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {[
            { icon: FaCoins, t: 'Accrual', d: 'Rewards accrue block-by-block on-chain with no custodial handoff.' },
            { icon: FaClock, t: 'Payout', d: 'Distributed on fixed cadences — every 3.5 days for ATSO, every 2 weeks for validator.' },
            { icon: FaNetworkWired, t: 'Compounding', d: 'Auto-restake toggle available. Your yield compounds back into your delegation balance.' },
          ].map((x) => (
            <div key={x.t} style={{ background: '#0A0E17', padding: '32px 28px' }}>
              <x.icon size={14} style={{ color: '#D4AF7F', marginBottom: 16 }} />
              <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{x.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Stake your share of{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            the network.
          </span>
        </h2>
        <Link href="/screens/Earn" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Start staking →
        </Link>
      </section>
    </div>
  );
}
