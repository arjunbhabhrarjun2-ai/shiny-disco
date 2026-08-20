'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaCheckCircle, FaServer, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';

const systems = [
  { icon: FaServer, t: 'Spot Markets', d: 'Order matching, settlement, and public market data feeds.', status: 'Operational', latency: '1.9ms' },
  { icon: FaNetworkWired, t: 'Derivatives', d: 'Perpetuals, dated futures, and options matching.', status: 'Operational', latency: '2.4ms' },
  { icon: FaShieldAlt, t: 'Custody', d: 'Deposits, withdrawals, and institutional cold storage.', status: 'Operational', latency: 'n/a' },
  { icon: FaCheckCircle, t: 'APIs & Websockets', d: 'Public REST, FIX, and streaming websocket endpoints.', status: 'Operational', latency: '1.6ms' },
];

const incidents = [
  { d: '18 Apr 2026', t: 'Scheduled maintenance — futures matching', s: 'Resolved', b: 'Routine failover test; zero user impact. Window 03:00–04:00 UTC.' },
  { d: '02 Apr 2026', t: 'Elevated latency in EU region', s: 'Resolved', b: 'Transient upstream carrier issue. Automatic rerouting completed in 6 minutes.' },
  { d: '21 Mar 2026', t: 'API rate-limit tuning', s: 'Resolved', b: 'Institutional-tier rate limits adjusted upward; no downtime observed.' },
];

export default function StatusPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-5xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>System Status · Live</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            All systems{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              operational.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Real-time operational status for every component of the Kandella platform —
            markets, derivatives, custody, APIs, and ATSO feeds. Subscribe via email or query
            the public status API at status.cryptotradeprime.io for incident and maintenance history.
          </motion.p>
        </motion.div>
      </section>

      {/* Overall banner */}
      <section className="px-6 md:px-10 py-6 max-w-5xl mx-auto">
        <div className="px-6 py-5 flex items-center gap-4" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2 }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#4ADE80', boxShadow: '0 0 0 4px rgba(74,222,128,0.18)' }} />
          <div>
            <div className="text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>Last 90 days</div>
            <div className="text-base" style={{ color: '#F5F1EA', fontFamily: 'var(--font-serif-display, Georgia, serif)' }}>99.997% uptime · no open incidents</div>
          </div>
        </div>
      </section>

      {/* Subsystems */}
      <section className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Components</span>
        </div>

        <div style={{ border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {systems.map((s, i) => (
            <div key={s.t} className="grid grid-cols-12 items-center px-6 py-6" style={{ background: '#06090F', borderTop: i === 0 ? 'none' : '1px solid rgba(212,175,127,0.08)' }}>
              <div className="col-span-1">
                <s.icon size={14} style={{ color: '#D4AF7F' }} />
              </div>
              <div className="col-span-6">
                <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{s.t}</h3>
                <p className="text-sm" style={{ color: '#A9B1C0' }}>{s.d}</p>
              </div>
              <div className="col-span-3 text-[10px] uppercase" style={{ color: '#A9B1C0', letterSpacing: '0.22em' }}>p50 · {s.latency}</div>
              <div className="col-span-2 text-right flex items-center justify-end gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }} />
                <span className="text-[10px] uppercase" style={{ color: '#4ADE80', letterSpacing: '0.22em' }}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incident history */}
      <section className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Recent Incidents</span>
        </div>

        <div className="relative pl-8 space-y-8">
          <div className="absolute left-[7px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, #D4AF7F 0%, rgba(212,175,127,0.1) 100%)' }} />
          {incidents.map((i) => (
            <div key={i.t} className="relative">
              <span className="absolute -left-8 top-1.5 w-[15px] h-[15px] rounded-full" style={{ background: '#06090F', border: '2px solid #D4AF7F' }} />
              <div className="text-[10px] uppercase mb-2" style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontFamily: 'var(--font-mono, monospace)' }}>{i.d} · {i.s}</div>
              <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>{i.t}</h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{i.b}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
