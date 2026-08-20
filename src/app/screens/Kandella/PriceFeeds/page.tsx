'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import {
  FaSatelliteDish,
  FaShieldAlt,
  FaChartLine,
  FaCertificate,
  FaServer,
  FaSearchLocation,
  FaClock,
  FaArrowRight,
} from 'react-icons/fa';

const C = {
  bgBase: '#06090F',
  textPri: '#F5F1EA',
  textSec: '#A9B1C0',
  textTer: '#6B7280',
  gold: '#D4AF7F',
  goldSoft: '#E8D3B0',
};

const GRAD_GOLD = 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)';

const stats = [
  { k: '98+', l: 'Active providers' },
  { k: '$75M+', l: 'Economic security' },
  { k: '~1.8s', l: 'Median update' },
  { k: '660+', l: 'Reference assets' },
];

const capabilities = [
  {
    icon: FaSatelliteDish,
    t: 'Distributed price discovery',
    d: 'Hundreds of independent providers stake ATRIUM to publish quotes. Median consensus is published on-chain every 1.8 seconds.',
  },
  {
    icon: FaShieldAlt,
    t: 'Economic security',
    d: 'Each feed is backed by hundreds of millions in staked ATRIUM. Misreporting is slashed; honest participation is rewarded.',
  },
  {
    icon: FaChartLine,
    t: 'Index reference rates',
    d: 'A neutral mid-rate independent of any single venue. Used for liquidations, settlement, and benchmark comparisons.',
  },
  {
    icon: FaCertificate,
    t: 'Proof of Reserves',
    d: 'Cryptographically attested 1:1 backing. Verify your account inclusion in the Merkle tree with a single click.',
  },
  {
    icon: FaServer,
    t: 'Provider transparency',
    d: 'Every feed exposes its full provider list, stake-weight, accuracy score, and historical uptime — open to inspection.',
  },
  {
    icon: FaSearchLocation,
    t: 'Anomaly detection',
    d: 'Consensus drops below 50% or freshness exceeds 5 seconds — affected trading screens surface an amber warning automatically.',
  },
];

const trustChecks = [
  {
    label: 'Last audit',
    value: 'Q4 2025',
    sub: 'External — CER.live & Hacken',
  },
  {
    label: '1:1 backing',
    value: 'Verified',
    sub: 'Cryptographic Merkle proof',
  },
  {
    label: 'Stale-data warning',
    value: '≥ 5s',
    sub: 'Trips amber across UI',
  },
  {
    label: 'Quorum threshold',
    value: '> 50%',
    sub: 'Below = consensus halt',
  },
];

export default function PriceFeedsPage() {
  return (
    <div style={{ background: C.bgBase, color: C.textPri, minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="px-6 md:px-10 pt-32 pb-16 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span
              style={{
                width: 28,
                height: 1,
                background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)',
              }}
            />
            <span
              className="text-[10px] uppercase"
              style={{ color: C.gold, letterSpacing: '0.28em' }}
            >
              Kandella · Price Feeds
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl tracking-tight mb-6"
            style={{
              fontFamily: 'var(--font-serif-display, Georgia, serif)',
              lineHeight: 1.05,
              fontWeight: 400,
            }}
          >
            Verifiable data,{' '}
            <span
              style={{
                fontStyle: 'normal',
                background: GRAD_GOLD,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              economically secured.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg max-w-2xl"
            style={{ color: C.textSec, lineHeight: 1.7 }}
          >
            Price feeds, index rates, and Proof of Reserves are the spine of the
            Kandella platform. Every number you see — every liquidation calculated,
            every settlement booked, every yield accrued — flows from the ATSO
            oracle network. Open, attested, and continuously audited.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/data"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase"
              style={{
                background: GRAD_GOLD,
                color: C.bgBase,
                letterSpacing: '0.22em',
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              Open Data Console
              <FaArrowRight size={10} />
            </Link>
            <Link
              href="/screens/ATSO"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] uppercase"
              style={{
                background: 'transparent',
                color: C.gold,
                letterSpacing: '0.22em',
                fontWeight: 500,
                border: '1px solid rgba(212,175,127,0.35)',
                borderRadius: 2,
              }}
            >
              Read the ATSO Spec
              <FaArrowRight size={10} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{
            background: 'rgba(212,175,127,0.14)',
            border: '1px solid rgba(212,175,127,0.18)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {stats.map((s) => (
            <div key={s.l} style={{ background: C.bgBase, padding: '28px 24px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif-display, Georgia, serif)',
                  fontSize: '2.5rem',
                  color: C.gold,
                  lineHeight: 1,
                }}
              >
                {s.k}
              </div>
              <div
                className="text-[10px] uppercase mt-3"
                style={{ color: C.textSec, letterSpacing: '0.22em' }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span
            style={{
              width: 24,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)',
            }}
          />
          <span
            className="text-[10px] uppercase"
            style={{ color: C.gold, letterSpacing: '0.28em' }}
          >
            What ships in this layer
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{
            background: 'rgba(212,175,127,0.14)',
            border: '1px solid rgba(212,175,127,0.18)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {capabilities.map((c) => (
            <motion.div
              key={c.t}
              variants={fadeUp}
              className="p-8"
              style={{ background: '#0A0E17' }}
            >
              <div
                className="flex items-center justify-center mb-5"
                style={{
                  width: 36,
                  height: 36,
                  border: '1px solid rgba(212,175,127,0.25)',
                  background: 'rgba(212,175,127,0.05)',
                  borderRadius: 2,
                }}
              >
                <c.icon size={14} style={{ color: C.gold }} />
              </div>
              <h3
                className="text-xl mb-3"
                style={{
                  fontFamily: 'var(--font-serif-display, Georgia, serif)',
                  fontWeight: 400,
                }}
              >
                {c.t}
              </h3>
              <p className="text-sm" style={{ color: C.textSec, lineHeight: 1.7 }}>
                {c.d}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust checks strip */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span
            style={{
              width: 24,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)',
            }}
          />
          <span
            className="text-[10px] uppercase"
            style={{ color: C.gold, letterSpacing: '0.28em' }}
          >
            Trust Surface
          </span>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{
            background: 'rgba(212,175,127,0.14)',
            border: '1px solid rgba(212,175,127,0.18)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {trustChecks.map((t) => (
            <div key={t.label} style={{ background: '#0A0E17', padding: '24px 22px' }}>
              <div
                className="text-[10px] uppercase mb-2"
                style={{ color: C.gold, letterSpacing: '0.22em' }}
              >
                {t.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif-display, Georgia, serif)',
                  fontSize: '1.6rem',
                  color: C.textPri,
                  lineHeight: 1.05,
                  fontWeight: 400,
                }}
              >
                {t.value}
              </div>
              <div className="text-xs mt-2" style={{ color: C.textSec, lineHeight: 1.5 }}>
                {t.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Provider transparency code sample */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span
            style={{
              width: 24,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)',
            }}
          />
          <span
            className="text-[10px] uppercase"
            style={{ color: C.gold, letterSpacing: '0.28em' }}
          >
            Read a feed
          </span>
        </div>
        <div
          className="px-6 py-6 md:px-8 md:py-8"
          style={{
            background: '#0A0E17',
            border: '1px solid rgba(212,175,127,0.12)',
            borderRadius: 2,
          }}
        >
          <pre
            className="text-xs md:text-sm overflow-x-auto"
            style={{
              color: C.goldSoft,
              fontFamily: 'var(--font-mono, monospace)',
              lineHeight: 1.7,
            }}
          >
{`// Read the Kandella ATSO median feed
const feed = await tradeGlobal.priceFeeds.read('ATRIUM/USD');

console.log(feed.median);     //  $0.4823
console.log(feed.providers);  //  98 active
console.log(feed.staked);     //  $75M+ ATRIUM
console.log(feed.timestamp);  //  2026-04-27T11:32:18Z

// Verify Proof of Reserves inclusion
const proof = await tradeGlobal.por.verify({
  account: '0xYourAccount…',
  asOf:    '2026-Q1'
});

if (proof.included) console.log('1:1 backing confirmed');`}
          </pre>
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div
          className="px-8 md:px-12 py-12"
          style={{
            background:
              'radial-gradient(ellipse at top left, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14',
            border: '1px solid rgba(212,175,127,0.1)',
            borderRadius: 2,
          }}
        >
          <div
            className="text-5xl mb-5"
            style={{
              fontFamily: 'var(--font-serif-display, Georgia, serif)',
              color: C.gold,
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>
          <blockquote
            className="text-xl md:text-2xl max-w-3xl"
            style={{
              fontFamily: 'var(--font-serif-display, Georgia, serif)',
              fontStyle: 'normal',
              fontWeight: 300,
              lineHeight: 1.45,
            }}
          >
            A price isn&rsquo;t a price unless someone has skin in saying so.
            Kandella price feeds are signed, staked, and verifiable — by design.
          </blockquote>
          <div
            className="mt-6 text-[10px] uppercase"
            style={{ color: C.textSec, letterSpacing: '0.28em' }}
          >
            — Protocol Engineering · Kandella
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FaClock size={12} style={{ color: C.gold }} />
          <span
            className="text-[10px] uppercase"
            style={{ color: C.gold, letterSpacing: '0.28em' }}
          >
            Live now · Updated every 1.8 seconds
          </span>
        </div>
        <h2
          className="text-3xl md:text-5xl mb-8"
          style={{
            fontFamily: 'var(--font-serif-display, Georgia, serif)',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          See the feeds powering{' '}
          <span
            style={{
              fontStyle: 'normal',
              background: GRAD_GOLD,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            your portfolio.
          </span>
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/data"
            className="inline-flex items-center gap-2 px-10 py-4 text-[11px] uppercase"
            style={{
              background: GRAD_GOLD,
              color: C.bgBase,
              letterSpacing: '0.22em',
              fontWeight: 500,
              borderRadius: 2,
            }}
          >
            Open Data Console
            <FaArrowRight size={10} />
          </Link>
          <Link
            href="/wallet/bridge"
            className="inline-flex items-center gap-2 px-10 py-4 text-[11px] uppercase"
            style={{
              background: 'transparent',
              color: C.gold,
              letterSpacing: '0.22em',
              fontWeight: 500,
              border: '1px solid rgba(212,175,127,0.35)',
              borderRadius: 2,
            }}
          >
            Bridge ATAssets
            <FaArrowRight size={10} />
          </Link>
        </div>
      </section>
    </div>
  );
}
