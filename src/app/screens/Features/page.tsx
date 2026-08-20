'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import {
  FaShieldAlt,
  FaExchangeAlt,
  FaCoins,
  FaHeadset,
  FaWallet,
  FaChartLine,
  FaRocket,
  FaHandshake,
  FaDatabase,
  FaGem,
  FaNetworkWired,
  FaCube,
} from 'react-icons/fa';

const categories = [
  {
    icon: FaShieldAlt,
    title: 'Security',
    desc: 'A team of top security experts works around the clock to protect user assets and privacy from potential vulnerabilities.',
  },
  {
    icon: FaExchangeAlt,
    title: 'Flexible Buying & Selling',
    desc: 'Build portfolios through recurring purchases or create custom orders that execute automatically at target prices.',
  },
  {
    icon: FaCoins,
    title: 'Low Fees',
    desc: 'A competitive fee structure with rates as low as 0%. Kandella+ members enjoy zero trading fees on monthly volume up to $10,000.',
  },
  {
    icon: FaHeadset,
    title: '24/7 Global Support',
    desc: 'A round-the-clock live chat service and an extensive support centre are available to assist users anywhere in the world.',
  },
  {
    icon: FaWallet,
    title: 'Funding Options',
    desc: 'Fast and convenient fiat and cryptocurrency funding services regardless of the user&rsquo;s location.',
  },
  {
    icon: FaChartLine,
    title: 'Margin Trading',
    desc: 'Trade with up to 5x leverage using Kandella margin, subject to eligibility criteria and geographic restrictions.',
  },
  {
    icon: FaRocket,
    title: 'Futures Trading',
    desc: 'Hedge spot trades with crypto futures and maximise returns with up to 50x leverage on perpetuals and quarterlies.',
  },
  {
    icon: FaHandshake,
    title: 'OTC Trading',
    desc: 'Personalised service for executing large trades without disrupting market order via the Kandella Trade Desk.',
  },
  {
    icon: FaDatabase,
    title: 'Index Services',
    desc: 'Real-time reference rate indices provide accurate composite prices for crypto assets across major venues.',
  },
  {
    icon: FaGem,
    title: 'VIP Account Management',
    desc: 'One-on-one advisory services for VIP clients, covering strategy, execution, and structured product access.',
  },
  {
    icon: FaNetworkWired,
    title: 'ATSO Oracle',
    desc: 'The network&rsquo;s native, enshrined oracle for decentralised data feeds, submitted every 1.8 seconds.',
  },
  {
    icon: FaCube,
    title: 'EVM Compatibility',
    desc: 'Kandella is an Ethereum Virtual Machine compatible Layer 3 chain, making it easy for Solidity developers to build.',
  },
];

const primitives = [
  {
    label: 'ATSO',
    full: 'Kandella Time Series Oracle',
    desc: 'The enshrined oracle submits median-priced data every 1.8 seconds from 98+ independent providers.',
  },
  {
    label: 'ATAssets',
    full: 'Trust-minimised bridges',
    desc: 'Brings non-smart contract assets — XRP, BTC, DOGE — into Kandella DeFi without wrapping intermediaries.',
  },
  {
    label: 'CTPDC',
    full: 'Kandella Data Connector',
    desc: 'Verifies state and event data from external blockchains and Web2 APIs with >50% attestation consensus.',
  },
  {
    label: 'Kandella Stake',
    full: 'Dual-purpose staking',
    desc: 'Secures the chain and data provision simultaneously. Validators and ATSO delegators share rewards.',
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
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
              style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontWeight: 500 }}
            >
              Platform Features · Full Surface
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
            Smarter, faster, easier — across every{' '}
            <span
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              trading surface.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg max-w-2xl"
            style={{ color: '#A9B1C0', lineHeight: 1.7 }}
          >
            Kandella makes trading smarter, faster and easier for both experienced traders
            and beginners — security, flexible buying & selling, low fees, 24/7 support, fiat &
            crypto funding, margin, futures, OTC, index services, VIP account management, and
            native primitives like ATSO, ATAssets and CTPDC, all in one account.
          </motion.p>
        </motion.div>
      </section>

      {/* 12 feature grid */}
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
            style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontWeight: 500 }}
          >
            Twelve Pillars · Core Capabilities
          </span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{
            background: 'rgba(212,175,127,0.14)',
            border: '1px solid rgba(212,175,127,0.18)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {categories.map((c, i) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              className="p-7"
              style={{ background: '#0A0E17' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 34,
                    height: 34,
                    border: '1px solid rgba(212,175,127,0.25)',
                    background: 'rgba(212,175,127,0.05)',
                    borderRadius: 2,
                  }}
                >
                  <c.icon size={13} style={{ color: '#D4AF7F' }} />
                </div>
                <span
                  className="text-[10px] uppercase"
                  style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3
                className="text-xl mb-3"
                style={{
                  fontFamily: 'var(--font-serif-display, Georgia, serif)',
                  fontWeight: 400,
                  color: '#F5F1EA',
                }}
              >
                {c.title}
              </h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
                {c.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Primitives strip */}
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
            style={{ color: '#D4AF7F', letterSpacing: '0.28em', fontWeight: 500 }}
          >
            Protocol Primitives
          </span>
        </div>

        <h2
          className="text-3xl md:text-4xl mb-10 max-w-3xl"
          style={{
            fontFamily: 'var(--font-serif-display, Georgia, serif)',
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          The four building blocks that run{' '}
          <span
            style={{
              fontStyle: 'normal',
              background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            beneath the surface.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'rgba(212,175,127,0.14)' }}>
          {primitives.map((p) => (
            <div key={p.label} style={{ background: '#0A0E17', padding: '32px 28px' }}>
              <div
                className="text-[10px] uppercase mb-2"
                style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}
              >
                {p.label}
              </div>
              <h3
                className="text-2xl mb-3"
                style={{
                  fontFamily: 'var(--font-serif-display, Georgia, serif)',
                  fontWeight: 400,
                  color: '#F5F1EA',
                }}
              >
                {p.full}
              </h3>
              <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <div
          className="px-8 md:px-16 py-14 text-center"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(212,175,127,0.05) 0%, transparent 60%), #080C14',
            border: '1px solid rgba(212,175,127,0.15)',
            borderRadius: 2,
          }}
        >
          <h2
            className="text-3xl md:text-5xl mb-5"
            style={{
              fontFamily: 'var(--font-serif-display, Georgia, serif)',
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Access the full surface{' '}
            <span
              style={{
                fontStyle: 'normal',
                background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              from a single account.
            </span>
          </h2>
          <p className="text-base mb-8 max-w-2xl mx-auto" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            Spot, margin, derivatives, custody, OTC, staking and yield — all
            under one regulated perimeter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/screens/auth/Signup"
              className="px-8 py-3 text-[11px] uppercase"
              style={{
                background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                color: '#06090F',
                letterSpacing: '0.22em',
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              Open an account →
            </Link>
            <Link
              href="/screens/Institutional"
              className="px-8 py-3 text-[11px] uppercase"
              style={{
                background: 'transparent',
                border: '1px solid rgba(212,175,127,0.35)',
                color: '#D4AF7F',
                letterSpacing: '0.22em',
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              Institutional tier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
