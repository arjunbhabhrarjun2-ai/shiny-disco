'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/context/AuthContext';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp, fadeIn } from '@/lib/animation';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const C = {
  bgBase: '#0B0D10',
  textPri: '#F8FAFC',
  textSec: '#94A3B8',
  textTer: '#64748B',
  border: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(255,255,255,0.12)',
};

export interface PreviewMetric {
  label: string;
  value: string;
  sub?: string;
}

export interface PreviewFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface PreviewCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
}

export interface SectionPreviewProps {
  /** Top-of-page accent kicker (e.g. "Trade · Spot Markets") */
  kicker: string;
  /** Display title (left part - regular weight) */
  title: string;
  /** Display title (right part - italic gradient) */
  titleAccent: string;
  /** Hero copy under title */
  description: string;
  /** Brand gradient used throughout the page */
  gradient: string;
  /** Solid accent color for borders / orbs */
  accent: string;
  /** Status pill ("Live", "In preview", "Institutional gate", etc.) */
  status?: string;
  /** Optional metrics row */
  metrics?: PreviewMetric[];
  /** Feature grid */
  features?: PreviewFeature[];
  /** Optional bullet list */
  bullets?: string[];
  /** Optional CTAs */
  ctas?: PreviewCTA[];
  /** Optional supplementary node — rendered below feature grid */
  supplement?: ReactNode;
}

export default function SectionPreview({
  kicker,
  title,
  titleAccent,
  description,
  gradient,
  accent,
  status = 'In preview',
  metrics,
  features,
  bullets,
  ctas,
  supplement,
}: SectionPreviewProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/screens/auth/Signin');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bgBase }}
      >
        <div className="text-sm" style={{ color: C.textSec }}>
          Loading…
        </div>
      </div>
    );
  }

  const handleCta = (cta: PreviewCTA) => {
    if (cta.onClick) cta.onClick();
    else if (cta.href) router.push(cta.href);
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen overflow-x-hidden"
      style={{ background: C.bgBase, color: C.textPri }}
    >
      <Sidebar />

      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-8 md:py-12 relative pb-24 md:pb-12">
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${accent}1A 0%, transparent 70%)`,
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute top-[40%] -left-40 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-8 h-px" style={{ background: gradient }} />
              <span
                className="text-[10px] uppercase font-medium"
                style={{ color: accent, letterSpacing: '0.32em' }}
              >
                {kicker}
              </span>
              {status && (
                <span
                  className="text-[9px] uppercase font-medium px-2 py-0.5 rounded-full ml-1"
                  style={{
                    background: `${accent}14`,
                    color: accent,
                    border: `1px solid ${accent}38`,
                    letterSpacing: '0.18em',
                  }}
                >
                  {status}
                </span>
              )}
            </div>
            <h1
              className="font-serif-display tracking-tight"
              style={{
                fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
                lineHeight: 1.05,
                color: C.textPri,
                letterSpacing: '-0.02em',
              }}
            >
              {title}{' '}
              <span
                className="font-serif-italic"
                style={{
                  background: gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {titleAccent}
              </span>
            </h1>
            <p
              className="text-sm md:text-base mt-4 max-w-2xl"
              style={{ color: C.textSec, lineHeight: 1.7 }}
            >
              {description}
            </p>
          </motion.div>

          {/* Metrics */}
          {metrics && metrics.length > 0 && (
            <motion.div
              variants={fadeUp}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${C.borderAccent}`,
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  }}
                >
                  <span
                    className="text-[10px] uppercase block mb-2 font-medium"
                    style={{ color: C.textSec, letterSpacing: '0.22em' }}
                  >
                    {m.label}
                  </span>
                  <span
                    className="font-serif-display tabular-nums block"
                    style={{
                      fontSize: '1.6rem',
                      color: C.textPri,
                      lineHeight: 1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {m.value}
                  </span>
                  {m.sub && (
                    <span
                      className="text-[11px] mt-1.5 block"
                      style={{ color: C.textTer }}
                    >
                      {m.sub}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Feature grid */}
          {features && features.length > 0 && (
            <motion.div variants={fadeUp} className="mt-10">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="inline-block w-5 h-px"
                  style={{ background: gradient }}
                />
                <span
                  className="text-[10px] uppercase font-medium"
                  style={{ color: accent, letterSpacing: '0.28em' }}
                >
                  Capabilities · Per Specification
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${C.borderAccent}`,
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    <span
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        background: gradient,
                        color: '#0B0D10',
                        boxShadow: `0 6px 18px -4px ${accent}66`,
                      }}
                    >
                      {f.icon}
                    </span>
                    <h3
                      className="font-serif-display mb-2"
                      style={{ color: C.textPri, fontSize: '1.05rem' }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: C.textSec, lineHeight: 1.7 }}
                    >
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Bullets */}
          {bullets && bullets.length > 0 && (
            <motion.div
              variants={fadeUp}
              className="mt-8 rounded-2xl p-6"
              style={{
                background: `linear-gradient(135deg, ${accent}0F 0%, rgba(11,13,16,0.85) 100%)`,
                border: `1px solid ${accent}38`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <span
                className="text-[10px] uppercase font-medium block mb-4"
                style={{ color: accent, letterSpacing: '0.24em' }}
              >
                What ships in this section
              </span>
              <ul className="space-y-2.5">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: C.textSec }}>
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: gradient, color: '#0B0D10' }}
                    >
                      <FaCheckCircle size={8} />
                    </span>
                    <span style={{ lineHeight: 1.6 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Optional supplement */}
          {supplement && (
            <motion.div variants={fadeUp} className="mt-8">
              {supplement}
            </motion.div>
          )}

          {/* CTAs */}
          {ctas && ctas.length > 0 && (
            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap gap-3">
              {ctas.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleCta(c)}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={
                    (c.variant ?? 'primary') === 'primary'
                      ? {
                          background: gradient,
                          color: '#0B0D10',
                          boxShadow: `0 8px 24px -4px ${accent}66`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${C.borderAccent}`,
                          color: C.textPri,
                        }
                  }
                >
                  {c.label}
                  <FaArrowRight
                    size={11}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
