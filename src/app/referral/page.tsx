'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import {
  FaUserFriends,
  FaCopy,
  FaShareAlt,
  FaCoins,
  FaUsers,
  FaCheck,
  FaExclamationTriangle,
  FaTimes,
  FaArrowRight,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Logo from '@/components/Logo';
import { useReferralStats } from '@/lib/hooks/useReferralStats';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, fadeUp, staggerContainer, scaleIn } from '@/lib/animation';

const C = {
  bgBase: '#0B0D10',
  textPri: '#F8FAFC',
  textSec: '#94A3B8',
  textTer: '#64748B',
  border: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(255,255,255,0.12)',
  primary: '#6366F1',
  purple: '#A855F7',
  pink: '#EC4899',
  cyan: '#06B6D4',
  green: '#00FFA3',
  red: '#FF4D4D',
  gold: '#FFD700',
};

const GRAD_PRIMARY = 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)';
const GRAD_SUCCESS = 'linear-gradient(135deg, #00FFA3 0%, #00D68F 100%)';

const formatMoney = (val: number) =>
  val?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ReferralPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [refLink, setRefLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const { data: referralStats, isLoading, isError } = useReferralStats(user?.id);

  useEffect(() => {
    if (!user) {
      router.push('/screens/auth/Signin');
      return;
    }
    if (user?.referralCode) {
      const link = `https://kandella.net/signup?ref=${encodeURIComponent(user.referralCode)}`;
      setRefLink(link);
    }
  }, [user, router]);

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Kandella',
          text: 'Sign up with my referral link and start investing!',
          url: refLink,
        });
      } catch {
        // ignore
      }
    } else {
      copyReferralLink();
    }
  };

  if (!user)
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: C.bgBase, color: C.textSec }}
      >
        <span
          className="text-[11px] uppercase font-medium"
          style={{ letterSpacing: '0.22em', color: C.purple }}
        >
          Redirecting to sign in…
        </span>
      </div>
    );

  if (isLoading || !referralStats)
    return (
      <div
        className="flex flex-col items-center justify-center h-screen space-y-6"
        style={{ background: C.bgBase }}
      >
        <AiOutlineLoading3Quarters className="animate-spin" size={30} style={{ color: C.purple }} />
        <Logo size={32} wordmarkSize="1.35rem" />
        <span
          className="text-[10px] uppercase font-medium"
          style={{ color: C.textSec, letterSpacing: '0.28em' }}
        >
          Loading referral programme
        </span>
      </div>
    );

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen space-y-4"
        style={{ background: C.bgBase }}
      >
        <FaExclamationTriangle size={30} style={{ color: C.red }} />
        <p
          className="font-serif-display text-lg"
          style={{
            color: C.textPri,
            fontStyle: 'normal',
          }}
        >
          We couldn&rsquo;t load your referral data.
        </p>
        <p className="text-sm" style={{ color: C.textSec }}>
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen overflow-x-hidden"
      style={{ background: C.bgBase }}
    >
      <Sidebar />

      {/* Intro modal */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.78)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px',
            }}
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{
                background: 'rgba(20, 22, 27, 0.95)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: `1px solid ${C.borderAccent}`,
                borderRadius: 24,
                padding: '36px 32px',
                width: '100%',
                maxWidth: '480px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(168,85,247,0.20) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute transition-colors duration-200 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  color: C.textSec,
                  top: 16,
                  right: 16,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${C.border}`,
                }}
                aria-label="Close"
              >
                <FaTimes size={11} />
              </button>

              <div className="relative">
                <img
                  src="/referral-illustration.png"
                  alt="Refer friends and earn rewards"
                  style={{ display: 'block', width: 200, maxWidth: '64%', height: 'auto', margin: '0 auto 18px' }}
                />
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="inline-block w-5 h-px"
                    style={{ background: GRAD_PRIMARY }}
                  />
                  <span
                    className="text-[10px] uppercase font-medium"
                    style={{ color: C.purple, letterSpacing: '0.28em' }}
                  >
                    The Referral Programme
                  </span>
                </div>

                <h2
                  className="font-serif-display mb-2"
                  style={{
                    color: C.textPri,
                    fontSize: 'clamp(1.5rem, 2.4vw, 1.85rem)',
                    lineHeight: 1.12,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Refer Friends. Earn Rewards. Get Up to{' '}
                  <span
                    className="font-serif-italic"
                    style={{
                      background: GRAD_PRIMARY,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    $150!
                  </span>
                </h2>

                <p
                  className="font-serif-italic mb-3"
                  style={{ color: C.purple, fontSize: '1rem', lineHeight: 1.4 }}
                >
                  Why keep a good thing to yourself?
                </p>

                <p className="text-sm mb-7" style={{ color: C.textSec, lineHeight: 1.6 }}>
                  Share your referral link with friends, family, and your network, and get
                  rewarded every time someone joins through your link. It&apos;s simple, fast,
                  and rewarding.
                </p>

                <h3
                  className="font-serif-display mb-4"
                  style={{ color: C.textPri, fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  How It Works
                </h3>

                <div className="space-y-4 mb-7">
                  {[
                    {
                      step: '01',
                      title: 'Get your link',
                      desc: 'Sign up and get your unique referral link.',
                    },
                    {
                      step: '02',
                      title: 'Share it with others',
                      desc: 'Send it to friends, family, or anyone in your network.',
                    },
                    {
                      step: '03',
                      title: 'Earn rewards',
                      desc: 'Earn rewards when your referrals complete the required actions.',
                    },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span
                        className="font-serif-display tabular-nums w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                        style={{
                          background: 'rgba(168,85,247,0.10)',
                          border: '1px solid rgba(168,85,247,0.28)',
                          color: C.purple,
                        }}
                      >
                        {step}
                      </span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: C.textPri }}
                        >
                          {title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: C.textSec, lineHeight: 1.6 }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3
                  className="font-serif-display mb-2"
                  style={{ color: C.textPri, fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  Earn Up to{' '}
                  <span
                    className="font-serif-italic"
                    style={{
                      background: GRAD_PRIMARY,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    $150
                  </span>
                </h3>
                <p className="text-sm mb-7" style={{ color: C.textSec, lineHeight: 1.6 }}>
                  The more people you refer, the more you earn. Every successful referral brings
                  you closer to bigger rewards, with earning opportunities of up to $150 and
                  beyond.
                </p>

                <h3
                  className="font-serif-display mb-3"
                  style={{ color: C.textPri, fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  Why Refer?
                </h3>
                <ul className="space-y-2.5 mb-7">
                  {[
                    'Instant access to your personal referral link',
                    'Easy tracking of your referrals and earnings',
                    'No complicated process',
                    'Unlimited sharing potential',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                        style={{
                          marginTop: 2,
                          color: C.green,
                          background: 'rgba(0,255,163,0.10)',
                          border: '1px solid rgba(0,255,163,0.28)',
                        }}
                      >
                        ✓
                      </span>
                      <span className="text-sm" style={{ color: C.textSec, lineHeight: 1.5 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3
                  className="font-serif-display mb-2"
                  style={{ color: C.textPri, fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  Start Earning Today
                </h3>
                <p className="text-sm mb-2" style={{ color: C.textSec, lineHeight: 1.6 }}>
                  Turn your connections into rewards. Share your link, invite others, and watch
                  your earnings grow.
                </p>
                <p
                  className="font-serif-italic mb-7"
                  style={{ color: C.purple, fontSize: '0.95rem', lineHeight: 1.5 }}
                >
                  Refer. Earn. Repeat. Your next reward could be just one referral away.
                </p>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 text-[11px] uppercase font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
                  style={{
                    background: GRAD_PRIMARY,
                    color: C.textPri,
                    letterSpacing: '0.22em',
                    boxShadow: '0 4px 14px -2px rgba(168,85,247,0.4)',
                  }}
                >
                  Start Earning
                  <FaArrowRight size={10} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main
        className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-8 md:py-12 relative pb-24 md:pb-12"
        style={{ color: C.textPri }}
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute top-[40%] -left-40 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,163,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        {/* Editorial header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-10 relative"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-px" style={{ background: GRAD_PRIMARY }} />
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: C.purple, letterSpacing: '0.32em' }}
            >
              Kandella Referral Programme · Active
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-serif-display tracking-tight"
            style={{
              fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
              color: C.textPri,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Your network, rewarded{' '}
            <span
              className="font-serif-italic"
              style={{
                background: GRAD_PRIMARY,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              in full.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base mt-4 max-w-2xl"
            style={{ color: C.textSec, lineHeight: 1.7 }}
          >
            Introduce qualified clients to Kandella. Earn up to{' '}
            <span style={{ color: C.green }}>$150</span> per approved referral,
            credited instantly to your account on their first deposit.
          </motion.p>
        </motion.div>

        {/* Stats — glass cards */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 relative"
        >
          {[
            {
              icon: <FaUsers size={13} />,
              label: 'Total Referrals',
              value: (referralStats?.totalReferrals || 0).toString(),
              sub: 'People you have brought in',
              color: C.purple,
              gradient: GRAD_PRIMARY,
            },
            {
              icon: <FaCoins size={13} />,
              label: 'Total Earnings',
              value: `$${formatMoney(referralStats?.totalEarnings || 0)}`,
              sub: 'From approved referrals',
              color: C.green,
              gradient: GRAD_SUCCESS,
            },
            {
              icon: <FaCoins size={13} />,
              label: 'Pending Rewards',
              value: `$${formatMoney(referralStats?.pendingRewards || 0)}`,
              sub: 'Awaiting approval',
              color: '#FFB800',
              gradient: 'linear-gradient(135deg, #FFB800 0%, #FF8800 100%)',
            },
          ].map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              className="px-6 py-7 flex flex-col gap-3 rounded-2xl glass-card"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${C.borderAccent}`,
              }}
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: card.gradient, color: '#0B0D10' }}
              >
                {card.icon}
              </span>
              <div
                className="text-[10px] uppercase font-medium"
                style={{ color: C.textSec, letterSpacing: '0.22em' }}
              >
                {card.label}
              </div>
              <div
                className="font-serif-display tabular-nums"
                style={{
                  color: C.textPri,
                  fontSize: '2.25rem',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {card.value}
              </div>
              <div className="text-xs" style={{ color: C.textTer }}>
                {card.sub}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Referral link */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 relative"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-block w-5 h-px" style={{ background: GRAD_PRIMARY }} />
            <h2
              className="text-[10px] uppercase font-medium"
              style={{ color: C.purple, letterSpacing: '0.28em' }}
            >
              Your Personal Invite Link
            </h2>
          </div>

          <div
            className="p-6 md:p-7 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: `1px solid ${C.borderAccent}`,
            }}
          >
            <div className="flex flex-col lg:flex-row gap-3 mb-5">
              <div
                className="flex-1 px-4 py-3.5 rounded-xl"
                style={{
                  background: 'linear-gradient(145deg, #0f1115, #1a1d24)',
                  boxShadow: 'inset 4px 4px 8px #0a0c10, inset -4px -4px 8px rgba(36,40,48,0.45)',
                  border: `1px solid ${C.border}`,
                }}
              >
                <p
                  className="text-xs break-all"
                  style={{
                    color: C.textPri,
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {refLink || 'Generating your link…'}
                </p>
              </div>
              <div className="flex gap-2 lg:flex-shrink-0">
                <button
                  onClick={copyReferralLink}
                  className="flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase font-medium transition-all duration-200 rounded-lg"
                  style={{
                    background: copied ? GRAD_SUCCESS : GRAD_PRIMARY,
                    color: '#0B0D10',
                    letterSpacing: '0.22em',
                    boxShadow: copied
                      ? '0 4px 14px -2px rgba(0,255,163,0.4)'
                      : '0 4px 14px -2px rgba(168,85,247,0.4)',
                  }}
                >
                  {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={shareReferralLink}
                  className="flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase font-medium transition-all duration-200 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${C.borderAccent}`,
                    color: C.textPri,
                    letterSpacing: '0.22em',
                  }}
                >
                  <FaShareAlt size={10} />
                  Share
                </button>
              </div>
            </div>
            <p className="text-xs" style={{ color: C.textSec, lineHeight: 1.7 }}>
              Share your link — when friends sign up and make their first deposit, you earn up to{' '}
              <span style={{ color: C.green }}>$150</span> in rewards, credited directly to your
              balance.
            </p>
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 relative"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-5 h-px" style={{ background: GRAD_PRIMARY }} />
            <h2
              className="text-[10px] uppercase font-medium"
              style={{ color: C.purple, letterSpacing: '0.28em' }}
            >
              The Process — Three Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Share your link',
                desc:
                  'Send your unique referral link to friends, family, or your professional network.',
                color: C.cyan,
                gradient: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
              },
              {
                step: '02',
                title: 'They join and invest',
                desc:
                  'When they create an account and make their first qualifying deposit, you are rewarded.',
                color: C.purple,
                gradient: GRAD_PRIMARY,
              },
              {
                step: '03',
                title: 'You earn',
                desc:
                  'Up to $150 per referral, credited directly to your balance upon approval.',
                color: C.green,
                gradient: GRAD_SUCCESS,
              },
            ].map(({ step, title, desc, color, gradient }) => (
              <div
                key={step}
                className="p-6 md:p-7 rounded-2xl glass-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: `1px solid ${C.borderAccent}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 font-serif-display"
                  style={{
                    background: gradient,
                    color: '#0B0D10',
                    fontSize: 12,
                  }}
                >
                  {step}
                </div>
                <h3
                  className="font-serif-display mb-3"
                  style={{
                    color: C.textPri,
                    fontSize: '1.1rem',
                  }}
                >
                  {title}
                </h3>
                <p className="text-xs" style={{ color: C.textSec, lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Pull quote */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 px-6 md:px-10 py-10 md:py-12 rounded-2xl relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(11,13,16,0.85) 100%)',
            border: `1px solid ${C.borderAccent}`,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <div
            className="font-serif-display mb-6 relative"
            style={{
              background: GRAD_PRIMARY,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '4rem',
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>
          <blockquote
            className="font-serif-display text-xl md:text-2xl max-w-3xl relative"
            style={{
              color: C.textPri,
              fontStyle: 'normal',
              fontWeight: 300,
              lineHeight: 1.45,
            }}
          >
            Introductions compound. Every referred account becomes part of a network effect we
            share with you, quarter after quarter.
          </blockquote>
          <div
            className="mt-6 text-[10px] uppercase font-medium relative"
            style={{ color: C.purple, letterSpacing: '0.28em' }}
          >
            — Programme Terms · Kandella
          </div>
        </motion.section>

        {/* Rules */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-block w-5 h-px" style={{ background: GRAD_PRIMARY }} />
            <h2
              className="text-[10px] uppercase font-medium"
              style={{ color: C.purple, letterSpacing: '0.28em' }}
            >
              Programme Rules
            </h2>
          </div>

          <div
            className="p-6 md:p-7 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: `1px solid ${C.borderAccent}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: GRAD_PRIMARY,
                  color: '#0B0D10',
                }}
              >
                <FaUserFriends size={13} />
              </div>
              <ul className="text-sm space-y-3" style={{ color: C.textSec, lineHeight: 1.6 }}>
                {[
                  'You cannot use your own referral code.',
                  'Rewards are granted only for verified, successful referrals.',
                  'Abuse, manipulation, or fraudulent activity leads to suspension.',
                  "Rewards are processed after the referred user's first deposit is approved.",
                  'The referral programme is subject to change at any time.',
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="w-1 h-1 rounded-full mt-2 shrink-0"
                      style={{ background: C.purple }}
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
