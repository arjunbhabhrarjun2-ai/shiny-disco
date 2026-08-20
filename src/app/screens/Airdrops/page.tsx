'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaParachuteBox, FaCameraRetro, FaCalendarAlt, FaCoins } from 'react-icons/fa';

const stats = [
  { v: '24.2B', l: 'ATRIUM tokens allocated' },
  { v: '85%', l: 'Community share' },
  { v: '670M', l: 'Monthly installment' },
  { v: '24mo', l: 'Distribution cycle' },
];

const timeline = [
  { d: 'Dec 12, 2025', t: 'The Snapshot', b: 'Snapshot of the Ethereum and Solana ledgers. Holders of ETH and SOL in participating wallets were earmarked for the future ATRIUM distribution.' },
  { d: 'Jan 9, 2026', t: 'Initial Distribution', b: 'The first 15% of the allocation was distributed directly to all snapshot participants on this date.' },
  { d: 'Jan 30, 2025', t: 'Programme Start', b: 'ATAirDrops officially launched, distributing to active network participants across the 24-month cycle.' },
  { d: 'Jul 2025', t: 'Private Observation', b: 'Soft beta launch for early validator testing and internal network stress runs.' },
  { d: 'Sep 2026', t: 'Public Observation', b: 'Transition to public phase for validator onboarding. Governance goes fully participatory.' },
];

export default function AirdropsPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>ATAirDrops · Active Distribution</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            24 months.{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              24.2 billion ATRIUM.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            ATAirDrops distributes 24.2 billion ATRIUM tokens — 85% of the initial
            community allocation — to active network participants over a 24-month cycle.
            Eligibility requires holding Wrapped ATRIUM (WATRIUM) or having ATRIUM staked on
            the K-Chain. Three random WATRIUM balance snapshots in the 23 days prior to each
            claim date determine the reward. The programme officially started on January 30, 2025.
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
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#F5F1EA', lineHeight: 1, fontWeight: 400 }}>{s.v}</div>
              <div className="text-[10px] uppercase mt-3" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>How It Started</span>
        </div>

        <div className="relative pl-8 space-y-8 max-w-3xl">
          <div className="absolute left-[7px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, #D4AF7F 0%, rgba(212,175,127,0.1) 100%)' }} />
          {timeline.map((t) => (
            <div key={t.t} className="relative">
              <span className="absolute -left-8 top-1.5 w-[15px] h-[15px] rounded-full" style={{ background: '#06090F', border: '2px solid #D4AF7F' }} />
              <div className="text-[10px] uppercase mb-2" style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontFamily: 'var(--font-mono, monospace)' }}>{t.d}</div>
              <h3 className="text-xl md:text-2xl mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{t.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{t.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>The 24-Month Payout</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {[
            { icon: FaCalendarAlt, t: 'Monthly Installments', d: 'Roughly 670 million AWTH released every 30 days to eligible participants.' },
            { icon: FaCoins, t: 'WATRIUM Requirement', d: 'Eligible users hold Wrapped ATRIUM (WATRIUM) or stake ATRIUM on the K-Chain.' },
            { icon: FaCameraRetro, t: 'Calculation Window', d: 'Each month&rsquo;s reward: three random snapshots of WATRIUM balance during the 23 days prior to claim.' },
          ].map((r) => (
            <div key={r.t} style={{ background: '#0A0E17', padding: '32px 28px' }}>
              <r.icon size={14} style={{ color: '#D4AF7F', marginBottom: 16 }} />
              <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{r.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inflation */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="px-8 md:px-12 py-10" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.12)', borderRadius: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <FaParachuteBox size={14} style={{ color: '#D4AF7F' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Governance & Security</span>
          </div>
          <h3 className="text-2xl md:text-3xl mb-5" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.2 }}>
            Inflation schedule & enshrined oracle incentives.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Year 01</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#D4AF7F', lineHeight: 1 }}>10%</div>
              <div className="text-xs mt-1" style={{ color: '#A9B1C0' }}>Inflation</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Year 02</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#D4AF7F', lineHeight: 1 }}>7%</div>
              <div className="text-xs mt-1" style={{ color: '#A9B1C0' }}>Inflation</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Year 03+</div>
              <div style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontSize: '2.5rem', color: '#D4AF7F', lineHeight: 1 }}>5%</div>
              <div className="text-xs mt-1" style={{ color: '#A9B1C0' }}>Capped 5B/yr</div>
            </div>
          </div>
          <p className="text-sm mt-6" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            The distribution incentivises use of the Kandella Time Series Oracle
            (ATSO) — users earn ATSO rewards and ATAirDrops rewards
            simultaneously by wrapping and delegating their tokens.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Start wrapping to{' '}
          <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            earn.
          </span>
        </h2>
        <Link href="/screens/Stake" className="inline-block px-10 py-4 text-[11px] uppercase" style={{ background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', color: '#06090F', letterSpacing: '0.22em', fontWeight: 500, borderRadius: 2 }}>
          Delegate ATRIUM →
        </Link>
      </section>
    </div>
  );
}
