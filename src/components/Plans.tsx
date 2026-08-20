'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

import {
  fadeIn,
  slideUp,
  staggerContainer,
  scaleIn,
  cardHover,
  buttonMotion
} from '@/lib/animation';

interface Plan {
  id: number;
  title: string;
  price: string;
  list: {
    label: string;
    icon?: React.ReactNode;
  }[];
  btn: string;
}

const plansData: Plan[] = [
  {
    id: 1,
    title: 'Tier 01: Core Yield Fund',
    price: '$1,000 – $19,999',
    list: [
      { label: '30% ROI', icon: <FaCheck /> },
      { label: '1 month duration', icon: <FaCheck /> },
      { label: 'Interest + Capital', icon: <FaCheck /> },
    ],
    btn: 'Invest Now',
  },
  {
    id: 2,
    title: 'Tier 02: Strategic Growth Fund',
    price: '$20,000 – $99,999',
    list: [
      { label: '40% ROI', icon: <FaCheck /> },
      { label: '1 month duration', icon: <FaCheck /> },
      { label: 'Interest + Capital', icon: <FaCheck /> },
    ],
    btn: 'Invest Now',
  },
  {
    id: 3,
    title: 'Tier 03: Institutional Capital Fund',
    price: '$100,000 – $1,000,000',
    list: [
      { label: '55% ROI', icon: <FaCheck /> },
      { label: '1 month duration', icon: <FaCheck /> },
      { label: 'Interest + Capital', icon: <FaCheck /> },
    ],
    btn: 'Invest Now',
  },
];

const tierConfig = {
  1: {
    accent: '#60A5FA',
    accentBg: 'rgba(59,130,246,0.08)',
    accentBorder: 'rgba(59,130,246,0.22)',
    badge: 'Starter',
    roiValue: '30%',
    isFeatured: false,
  },
  2: {
    accent: '#22D3EE',
    accentBg: 'rgba(34,211,238,0.08)',
    accentBorder: 'rgba(34,211,238,0.28)',
    badge: 'Popular',
    roiValue: '40%',
    isFeatured: true,
  },
  3: {
    accent: '#D4AF7F',
    accentBg: 'rgba(212,175,127,0.08)',
    accentBorder: 'rgba(212,175,127,0.28)',
    badge: 'Elite',
    roiValue: '55%',
    isFeatured: false,
  },
} as const;

function Plans() {
  const router = useRouter();

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-24 px-5 relative"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Ambient gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,127,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Section header */}
      <motion.div variants={slideUp} className="text-center mb-16 relative">
        <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 mb-5">
          <span className="accent-rule" />
          <span className="text-editorial-kicker">Investment Plans</span>
          <span className="accent-rule" />
        </motion.div>

        <motion.h2
          variants={fadeIn}
          className="leading-[1.1] mb-5"
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
        >
          <span className="font-serif-display text-gradient-editorial">Choose your growth </span>
          <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>plan</span>
        </motion.h2>

        <motion.p variants={fadeIn} className="text-base max-w-md mx-auto leading-relaxed" style={{ color: '#A9B1C0' }}>
          Secure, stress-free investing with mitigated risk and real profit maximization.
        </motion.p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative"
      >
        {plansData.map((plan) => {
          const cfg = tierConfig[plan.id as keyof typeof tierConfig];

          return (
            <motion.div
              key={plan.id}
              variants={scaleIn}
              {...cardHover}
              className={`relative flex flex-col p-8 overflow-hidden transition-all duration-500 ${cfg.isFeatured ? 'md:-translate-y-4' : ''}`}
              style={{
                background: cfg.isFeatured
                  ? 'linear-gradient(180deg, rgba(23,34,58,0.7) 0%, rgba(11,15,26,0.85) 100%)'
                  : 'linear-gradient(180deg, rgba(13,19,32,0.6) 0%, rgba(11,15,26,0.8) 100%)',
                border: `1px solid ${cfg.accentBorder}`,
                borderRadius: '24px',
                boxShadow: cfg.isFeatured ? '0 24px 64px -20px rgba(0,0,0,0.7)' : 'none',
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`,
                  opacity: cfg.isFeatured ? 1 : 0.6,
                }}
              />

              {/* Gold pattern for Elite */}
              {plan.id === 3 && (
                <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-40"
                  style={{
                    background: 'radial-gradient(circle at top right, rgba(212,175,127,0.2), transparent 70%)',
                  }} />
              )}

              {/* Featured ribbon */}
              {cfg.isFeatured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-4 py-1.5 rounded-full uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #EBD4AA, #D4AF7F, #B08A55)',
                    color: '#0B0F1A',
                    letterSpacing: '0.15em',
                    boxShadow: '0 8px 20px -4px rgba(212,175,127,0.5)',
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Tier number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase" style={{ color: cfg.accent, letterSpacing: '0.22em' }}>
                  Tier · 0{plan.id}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium px-3 py-1 rounded-full uppercase"
                  style={{
                    background: cfg.accentBg,
                    border: `1px solid ${cfg.accentBorder}`,
                    color: cfg.accent,
                    letterSpacing: '0.15em',
                  }}
                >
                  {cfg.badge}
                </span>
              </div>

              {/* ROI headline */}
              <div className="mb-5">
                <p className="font-serif-display tabular-nums" style={{ fontSize: '3rem', lineHeight: '1', color: cfg.accent, fontWeight: 400 }}>
                  {cfg.roiValue}
                </p>
                <p className="text-[11px] uppercase mt-1" style={{ color: '#6B7280', letterSpacing: '0.18em' }}>ROI per cycle</p>
              </div>

              {/* Divider */}
              <div className="divider-hairline mb-5" />

              {/* Title */}
              <h3 className="font-serif-display text-gradient-editorial text-2xl mb-1.5">
                {plan.title}
              </h3>

              {/* Price range */}
              <p className="text-sm mb-7 tabular-nums" style={{ color: '#A9B1C0' }}>
                {plan.price}
              </p>

              {/* Features */}
              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.list.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm" style={{ color: '#F5F1EA' }}>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
                      style={{
                        background: cfg.accentBg,
                        border: `1px solid ${cfg.accentBorder}`,
                        color: cfg.accent,
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                {...buttonMotion}
                className={`w-full py-3.5 rounded-lg text-sm transition-all duration-300 ${
                  cfg.isFeatured
                    ? 'btn-gold'
                    : plan.id === 3
                      ? 'btn-ghost-gold font-semibold'
                      : 'btn-ghost font-semibold'
                }`}
                onClick={() => router.push('/screens/auth/Signup')}
              >
                {plan.btn}
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

export default Plans;
