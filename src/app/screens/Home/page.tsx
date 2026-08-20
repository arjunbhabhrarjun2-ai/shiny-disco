"use client"
import Navbar from "@/components/Navbar";
import React from "react";
import { FaInstagram, FaLinkedin, FaLongArrowAltRight, FaTelegramPlane, FaTwitter, FaShieldAlt, FaCertificate, FaHeadset } from "react-icons/fa";
import Image from "next/image";

import image3 from "@/app/assets/home/card/cardmg.png";
import bannerImg from "@/app/assets/editorial/banner_img.svg";
import slider2 from "@/app/assets/editorial/slider_2.svg";
import HomeCard from "@/components/HomeCard";
import Plans from "@/components/Plans";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Accordion from "@/components/Accordion";
import Feedback from "@/components/Feedback";
import CryptoTicker from "@/components/CryptoTicker";
import { fadeIn, staggerContainer, slideUp, slideInLeft, slideInRight, floating, buttonMotion, scaleIn } from "@/lib/animation";
import { motion } from "framer-motion";
import { sponsors } from "@/components/Sponsors";
import { FaBitcoin, FaEthereum, FaLock, FaChartLine, FaGlobe, FaBolt } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

function Home() {
  const router = useRouter();

  const sample = [
    {
      id: "one",
      title: "Create your account",
      content: (
        <p>
          Sign up in minutes by providing basic details. Our platform is user-friendly, and setting up your account is quick and secure.
        </p>
      ),
    },
    {
      id: "two",
      title: "Fund your wallet",
      content: (
        <p>Deposit funds using your preferred currency like Bitcoin, Ethereum, or others. Our payment options are fast, secure, and flexible to meet your needs.</p>
      ),
    },
    {
      id: "three",
      title: "Start Investing",
      content: (
        <p>Choose an investment plan and watch your assets grow. You can track your investment in real-time and withdraw your earnings anytime, hassle-free.</p>
      ),
    },
  ];

  return (
    <div
      className="space-page-snap"
      style={{ background: 'transparent', overflowX: 'hidden' }}
    >

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative min-h-screen hero-bg bg-grid-editorial overflow-hidden"
      >
        {/* Ambient radial glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -24, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(70px)' }}
          />
          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -right-40 w-[560px] h-[560px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', filter: 'blur(90px)' }}
          />
        </div>

        {/* Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col min-h-screen"
        >
          <motion.div variants={fadeIn}>
            <Navbar />
          </motion.div>

          {/* Two-column hero */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-6 sm:px-10 md:px-16 lg:px-24 py-10 lg:py-8 max-w-[1400px] mx-auto w-full flex-1">

            {/* LEFT — Text */}
            <motion.div
              variants={staggerContainer}
              className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-7"
            >
              {/* Editorial kicker */}
              <motion.div variants={slideUp} className="flex items-center gap-3">
                <span className="accent-rule-solid" />
                <span className="text-editorial-kicker">The Blockchain for Data · Est. 2019</span>
              </motion.div>

              {/* Trust badge */}
              <motion.div variants={slideUp}>
                <span
                  className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(212,175,127,0.06)',
                    border: '1px solid rgba(212,175,127,0.22)',
                    color: '#D4AF7F',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full pulse-gold" style={{ background: '#D4AF7F' }} />
                  Trusted by 650k investors worldwide
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={slideUp}
                className="leading-[1.02] tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5rem)', fontWeight: 400 }}
              >
                <span className="font-serif-display text-gradient-editorial">Invest in the </span>
                <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>future.</span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-base sm:text-lg leading-relaxed max-w-lg"
                style={{ color: 'rgba(169,177,192,0.85)' }}
              >
                Kandella is a regulated, full-stack crypto prime brokerage —
                an EVM-compatible Layer 3 built for data-intensive use cases.
                Compliant access to DeFi, continuous oracle price feeds, and
                cross-chain capital flow, all in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={slideUp}
                className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2"
              >
                <Link href="/screens/auth/Signin">
                  <motion.button
                    {...buttonMotion}
                    className="btn-gold flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm w-full sm:w-auto"
                  >
                    Start Investing <FaLongArrowAltRight />
                  </motion.button>
                </Link>

                <motion.button
                  {...buttonMotion}
                  onClick={() => router.push("/screens/auth/Signup")}
                  className="btn-ghost-gold px-8 py-3.5 rounded-lg font-semibold text-sm w-full sm:w-auto"
                >
                  Create Account
                </motion.button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeIn}
                className="flex items-center gap-10 pt-3 mt-2"
                style={{ borderTop: '1px solid rgba(212,175,127,0.12)', paddingTop: '1.5rem' }}
              >
                {[
                  { value: "15+", label: "Countries" },
                  { value: "$1B+", label: "Volume" },
                  { value: "65+", label: "Crypto Assets" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start">
                    <span className="font-serif-display text-2xl sm:text-3xl tabular-nums text-gradient-champagne">
                      {stat.value}
                    </span>
                    <span className="text-[10px] mt-1 uppercase" style={{ color: '#6B7280', letterSpacing: '0.18em' }}>{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-5 pt-1">
                {[
                  { icon: <FaShieldAlt />, label: '256-bit Encryption' },
                  { icon: <FaCertificate />, label: 'Licensed & Regulated' },
                  { icon: <FaHeadset />, label: '24/7 Support' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: '#D4AF7F' }}>{icon}</span>
                    <span className="text-[11px]" style={{ color: '#A9B1C0', letterSpacing: '0.04em' }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Hero visual */}
            <motion.div
              variants={fadeIn}
              className="flex-1 flex justify-center items-center w-full relative"
            >
              {/* Gold glow halo */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ filter: 'blur(80px)' }}
              >
                <div
                  className="w-96 h-96 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.15) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)' }}
                />
              </div>

              {/* Decorative frame ring */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden
              >
                <div
                  className="w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full"
                  style={{
                    border: '1px dashed rgba(212,175,127,0.22)',
                  }}
                />
              </div>

              <div className="relative flex justify-center items-center w-full max-w-xl aspect-square">
                {/* CORE — Central medallion with BTC glyph */}
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20 flex items-center justify-center"
                  style={{
                    width: '42%',
                    aspectRatio: '1',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(212,175,127,0.35) 0%, rgba(212,175,127,0.12) 40%, rgba(10,15,26,0.95) 80%)',
                    border: '1px solid rgba(212,175,127,0.4)',
                    boxShadow:
                      '0 0 80px -10px rgba(212,175,127,0.3), inset 0 0 40px rgba(212,175,127,0.08), 0 30px 60px -20px rgba(0,0,0,0.8)',
                  }}
                >
                  <FaBitcoin style={{ color: '#D4AF7F', fontSize: 'clamp(3.5rem, 9vw, 6rem)', filter: 'drop-shadow(0 4px 24px rgba(212,175,127,0.55))' }} />

                  {/* Inner rotating ring */}
                  <motion.div
                    aria-hidden
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: '1px dashed rgba(212,175,127,0.3)',
                    }}
                  />
                </motion.div>

                {/* ORBITAL RING 1 — ETH satellite */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: '75%',
                      aspectRatio: '1',
                      border: '1px solid rgba(96,126,234,0.22)',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="absolute flex items-center justify-center rounded-full"
                    style={{
                      width: '56px',
                      height: '56px',
                      top: 'calc(50% - 28px)',
                      left: 'calc(12.5% - 28px)',
                      background: 'linear-gradient(135deg, rgba(96,126,234,0.18), rgba(10,15,26,0.95))',
                      border: '1px solid rgba(96,126,234,0.5)',
                      boxShadow: '0 8px 32px -4px rgba(96,126,234,0.4)',
                    }}
                  >
                    <FaEthereum style={{ color: '#627EEA', fontSize: '1.6rem' }} />
                  </motion.div>
                </motion.div>

                {/* ORBITAL RING 2 — SOL satellite */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: -360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: '95%',
                      aspectRatio: '1',
                      border: '1px dashed rgba(153,69,255,0.18)',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    className="absolute flex items-center justify-center rounded-full"
                    style={{
                      width: '52px',
                      height: '52px',
                      top: 'calc(50% - 26px)',
                      right: 'calc(2.5% - 26px)',
                      background: 'linear-gradient(135deg, rgba(153,69,255,0.18), rgba(10,15,26,0.95))',
                      border: '1px solid rgba(153,69,255,0.5)',
                      boxShadow: '0 8px 32px -4px rgba(153,69,255,0.4)',
                    }}
                  >
                    <SiSolana style={{ color: '#9945FF', fontSize: '1.4rem' }} />
                  </motion.div>
                </motion.div>

                {/* Grid anchor dots (4 quadrants) */}
                {[
                  { top: '6%', left: '50%', color: '#10B981' },
                  { top: '50%', right: '6%', color: '#22D3EE' },
                  { bottom: '6%', left: '50%', color: '#F59E0B' },
                  { top: '50%', left: '6%', color: '#EC4899' },
                ].map((dot, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                    aria-hidden
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                    style={{
                      background: dot.color,
                      boxShadow: `0 0 12px ${dot.color}`,
                      transform: 'translate(-50%, -50%)',
                      ...dot,
                    }}
                  />
                ))}

                {/* Floating Yield badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-[6%] right-0 sm:-right-4 rounded-xl px-4 py-3 z-30"
                  style={{
                    background: 'rgba(10,15,26,0.94)',
                    border: '1px solid rgba(212,175,127,0.3)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 20px 48px -12px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,127,0.08)',
                  }}
                >
                  <p className="text-[9px] uppercase mb-1" style={{ color: '#D4AF7F', letterSpacing: '0.2em' }}>Total Yield</p>
                  <p className="font-serif-display text-xl tabular-nums" style={{ color: '#10B981' }}>+$12,800</p>
                </motion.div>

                {/* Floating live markets badge */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-[8%] -left-2 sm:-left-6 rounded-xl px-4 py-3 z-30"
                  style={{
                    background: 'rgba(10,15,26,0.94)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 20px 48px -12px rgba(0,0,0,0.6)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs font-semibold" style={{ color: '#F5F1EA' }}>Markets Live</p>
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: '#6B7280', letterSpacing: '0.08em' }}>BTC · ETH · SOL</p>
                </motion.div>

                {/* Floating ATSO feed badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute top-[45%] -right-2 sm:right-0 rounded-xl px-3.5 py-2.5 z-30 hidden sm:block"
                  style={{
                    background: 'rgba(10,15,26,0.94)',
                    border: '1px solid rgba(96,126,234,0.28)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 20px 48px -12px rgba(0,0,0,0.6)',
                  }}
                >
                  <p className="text-[9px] uppercase mb-1" style={{ color: '#60A5FA', letterSpacing: '0.2em' }}>ATSO Feed</p>
                  <p className="font-mono text-[11px] tabular-nums" style={{ color: '#F5F1EA' }}>66+ Live Pairs</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom scroll hint */}
          <div className="hidden lg:flex justify-center pb-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-editorial-caps" style={{ fontSize: '0.62rem' }}>Scroll to explore</span>
              <span className="w-px h-6" style={{ background: 'linear-gradient(180deg, rgba(212,175,127,0.6), transparent)' }} />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ─── LIVE MARKETS TICKER ──────────────────────────────── */}
      <CryptoTicker />

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="relative z-10 py-14" style={{ background: 'var(--color-bg)' }}>
        <HomeCard />
      </section>

      {/* ─── MARKET PERFORMANCE ───────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-20"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={staggerContainer} className="text-center mb-14 space-y-5">
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Market Performance</span>
              <span className="accent-rule" />
            </motion.div>
            <motion.h2
              variants={slideUp}
              className="leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">Watch the markets </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>move.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: '#A9B1C0' }}>
              Structured performance across major digital assets. Every position tracked, every move logged, every gain compounded.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Bitcoin',
                symbol: 'BTC',
                price: '$68,412.50',
                change: '+2.34%',
                up: true,
                icon: <FaBitcoin />,
                color: '#F7931A',
                points: '0,40 20,36 40,32 60,28 80,22 100,18 120,15 140,10 160,8 180,5',
              },
              {
                name: 'Ethereum',
                symbol: 'ETH',
                price: '$3,842.18',
                change: '+1.92%',
                up: true,
                icon: <FaEthereum />,
                color: '#627EEA',
                points: '0,38 20,35 40,30 60,32 80,26 100,24 120,20 140,18 160,14 180,10',
              },
              {
                name: 'Solana',
                symbol: 'SOL',
                price: '$178.92',
                change: '+4.12%',
                up: true,
                icon: <SiSolana />,
                color: '#9945FF',
                points: '0,42 20,38 40,36 60,30 80,32 100,24 120,26 140,18 160,14 180,8',
              },
            ].map((coin, i) => (
              <motion.div
                key={coin.symbol}
                variants={slideUp}
                className="relative p-7 rounded-3xl card-editorial overflow-hidden"
              >
                {/* Gold corner index */}
                <span
                  className="absolute top-5 right-6 text-[10px] uppercase tabular-nums"
                  style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.55)' }}
                >
                  0{i + 1} / 03
                </span>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{
                      background: `${coin.color}15`,
                      border: `1px solid ${coin.color}35`,
                      color: coin.color,
                    }}
                  >
                    {coin.icon}
                  </div>
                  <div>
                    <p className="font-serif-display text-xl" style={{ color: '#F5F1EA' }}>
                      {coin.name}
                    </p>
                    <p className="text-[10px] uppercase" style={{ letterSpacing: '0.22em', color: 'rgba(169,177,192,0.65)' }}>
                      {coin.symbol} / USD
                    </p>
                  </div>
                </div>

                {/* Price */}
                <p className="font-serif-display text-3xl sm:text-4xl tabular-nums mb-1" style={{ color: '#F5F1EA' }}>
                  {coin.price}
                </p>
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="font-mono text-xs tabular-nums px-2.5 py-1 rounded-md"
                    style={{
                      color: coin.up ? '#10B981' : '#F43F5E',
                      background: coin.up ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                      border: coin.up ? '1px solid rgba(16,185,129,0.22)' : '1px solid rgba(244,63,94,0.22)',
                    }}
                  >
                    {coin.up ? '▲' : '▼'} {coin.change}
                  </span>
                  <span className="text-[10px] uppercase" style={{ letterSpacing: '0.22em', color: '#6B7280' }}>
                    24h
                  </span>
                </div>

                {/* Sparkline */}
                <svg viewBox="0 0 180 50" className="w-full h-14 mb-4" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`grad-${coin.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={coin.color} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={coin.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={coin.points}
                    fill="none"
                    stroke={coin.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={`${coin.points} 180,50 0,50`}
                    fill={`url(#grad-${coin.symbol})`}
                  />
                </svg>

                {/* Footer stats */}
                <div
                  className="grid grid-cols-3 gap-2 pt-4"
                  style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }}
                >
                  {[
                    { label: '24h High', val: coin.up ? '+$1.8k' : '+$400' },
                    { label: '24h Low',  val: coin.up ? '-$620'  : '-$1.2k' },
                    { label: 'Volume',   val: i === 0 ? '$24.8B' : i === 1 ? '$12.1B' : '$3.4B' },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col">
                      <span className="text-[9px] uppercase" style={{ letterSpacing: '0.2em', color: '#6B7280' }}>
                        {s.label}
                      </span>
                      <span className="font-mono text-xs tabular-nums mt-1" style={{ color: '#F5F1EA' }}>
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom hairline */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${coin.color}60, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CORE TECHNOLOGY PILLARS ──────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-20 section-bg-soft"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={staggerContainer} className="text-center mb-14 space-y-5">
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Core Technology</span>
              <span className="accent-rule" />
            </motion.div>
            <motion.h2
              variants={slideUp}
              className="leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">The blockchain for </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>data.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: '#A9B1C0' }}>
              A full-stack Layer 3 designed for data-intensive use cases — enshrined oracles, trust-minimized bridging, and EVM-compatible programmability.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                ticker: 'ATSO',
                title: 'Time Series Oracle',
                color: '#D4AF7F',
                desc: 'Kandella\u2019s native, enshrined oracle delivers decentralized price feeds every 1.8 seconds — inherits the full economic security of the chain.',
                stats: [
                  { label: 'Providers', val: '98+' },
                  { label: 'Live Feeds', val: '66+' },
                  { label: 'Staked', val: '$75M' },
                ],
              },
              {
                ticker: 'FASSETS',
                title: 'Non-smart-contract DeFi',
                color: '#60A5FA',
                desc: 'Trust-minimized bridging that brings XRP, BTC and DOGE into programmable DeFi. Users lock native assets, mint equivalents on Kandella.',
                stats: [
                  { label: 'Minted', val: '90M+' },
                  { label: 'In DeFi', val: '~80%' },
                  { label: 'Chains', val: '3' },
                ],
              },
              {
                ticker: 'CTPDC',
                title: 'Kandella Data Connector',
                color: '#A78BFA',
                desc: 'Decentralized state-connector protocol proving events across other blockchains and Web2 APIs via majority attestation consensus.',
                stats: [
                  { label: 'Consensus', val: '>50%' },
                  { label: 'Sources', val: 'Multi' },
                  { label: 'Mode', val: 'Trustless' },
                ],
              },
              {
                ticker: 'EVM',
                title: 'EVM Compatibility',
                color: '#22D3EE',
                desc: 'A fully Ethereum-Virtual-Machine compatible Layer 3 — Solidity developers deploy on day one without rewriting contracts.',
                stats: [
                  { label: 'Languages', val: '5+' },
                  { label: 'Solidity', val: 'Native' },
                  { label: 'Tooling', val: 'EVM' },
                ],
              },
              {
                ticker: 'STAKE',
                title: 'Kandella Stake',
                color: '#10B981',
                desc: 'Dual-purpose staking secures both consensus and data provision — validator locking and ATSO delegation both earn continuous rewards.',
                stats: [
                  { label: 'Validator Min', val: '50k ATRIUM' },
                  { label: 'Lock', val: '14d' },
                  { label: 'Payouts', val: '3.5d' },
                ],
              },
              {
                ticker: 'CUSTODY',
                title: 'Qualified Custody',
                color: '#EC4899',
                desc: 'Institutional-grade digital asset custody with vault-level access permissions, role-based approvals and 24/7 OTC integration.',
                stats: [
                  { label: 'Access', val: 'Role' },
                  { label: 'Uptime', val: '24/7' },
                  { label: 'OTC', val: 'Instant' },
                ],
              },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.ticker}
                variants={slideUp}
                className="relative p-7 rounded-3xl card-editorial overflow-hidden flex flex-col"
              >
                <span
                  className="absolute top-5 right-6 text-[10px] uppercase tabular-nums"
                  style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.55)' }}
                >
                  0{i + 1} / 06
                </span>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 font-mono text-[10px] font-bold uppercase"
                  style={{
                    background: `${pillar.color}14`,
                    border: `1px solid ${pillar.color}3a`,
                    color: pillar.color,
                    letterSpacing: '0.12em',
                  }}
                >
                  {pillar.ticker}
                </div>

                <h3 className="font-serif-display text-xl mb-2" style={{ color: '#F5F1EA' }}>
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#A9B1C0' }}>
                  {pillar.desc}
                </p>

                <div
                  className="grid grid-cols-3 gap-2 mt-5 pt-4"
                  style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }}
                >
                  {pillar.stats.map((s) => (
                    <div key={s.label} className="flex flex-col">
                      <span className="text-[9px] uppercase" style={{ letterSpacing: '0.2em', color: '#6B7280' }}>
                        {s.label}
                      </span>
                      <span className="font-mono text-xs tabular-nums mt-1" style={{ color: '#F5F1EA' }}>
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}55, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── OUR STORY ────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="px-4 sm:px-8 md:px-12 lg:px-20 py-20 sm:py-28 section-bg-soft"
      >
        <motion.div variants={slideUp} className="text-center mb-14 sm:mb-20 space-y-5">
          <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Our Story</span>
            <span className="accent-rule" />
          </motion.div>

          <motion.h2
            variants={fadeIn}
            className="leading-[1.1]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            <span className="font-serif-display text-gradient-editorial">We are empowering traders</span>
            <br />
            <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>globally</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={fadeIn}
          className="relative rounded-3xl overflow-hidden max-w-6xl mx-auto"
          style={{
            border: '1px solid rgba(212,175,127,0.14)',
            background: 'linear-gradient(160deg, rgba(23,34,58,0.45) 0%, rgba(11,15,26,0.75) 100%)',
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

          <div className="relative flex flex-col md:flex-row items-stretch">
            <motion.div
              variants={slideInLeft}
              className="md:w-[48%] flex items-center justify-center p-10 sm:p-14 min-h-[320px]"
              style={{ background: 'rgba(255,255,255,0.015)' }}
            >
              <motion.div variants={floating} animate="animate">
                <Image
                  src={image3}
                  alt="Traders illustration"
                  className="w-full max-w-md h-auto rounded-2xl object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="md:w-[52%] flex flex-col justify-center px-8 sm:px-12 py-12 space-y-8"
            >
              <div
                className="inline-flex w-fit items-center gap-2 text-[11px] font-medium px-3.5 py-1.5 rounded-full"
                style={{
                  background: 'rgba(212,175,127,0.08)',
                  border: '1px solid rgba(212,175,127,0.25)',
                  color: '#D4AF7F',
                  letterSpacing: '0.1em',
                }}
              >
                Est. 2017 · Parent: Haywire, Inc.
              </div>

              <div className="space-y-4">
                <motion.p variants={fadeIn} className="text-sm sm:text-base leading-relaxed" style={{ color: '#A9B1C0' }}>
                  Kandella is a regulated, full-stack crypto prime brokerage —
                  built to bridge off-chain exchange liquidity with on-chain
                  financial applications. We pair compliant custody with the
                  velocity of digital markets so capital moves with intent.
                </motion.p>
                <motion.p variants={fadeIn} className="text-sm sm:text-base leading-relaxed" style={{ color: '#A9B1C0' }}>
                  Our Layer 3 chain is EVM-compatible, secured by validators and
                  enshrined oracles. We offer trader funding, high-yield bonds,
                  and institutional-grade derivatives — regulated by the FCA
                  (UK) and ASIC (Australia), with a CFTC-licensed derivatives platform.
                </motion.p>
              </div>

              <div className="flex flex-wrap gap-10 pt-6" style={{ borderTop: '1px solid rgba(212,175,127,0.14)' }}>
                {[
                  { value: "15+", label: "Countries" },
                  { value: "2019", label: "Founded" },
                  { value: "650K+", label: "Clients" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="font-serif-display text-2xl text-gradient-champagne tabular-nums">{s.value}</p>
                    <p className="text-[10px] mt-1 uppercase" style={{ color: '#6B7280', letterSpacing: '0.18em' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* ─── SPONSORS ─────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-16"
        style={{ background: 'var(--color-bg)' }}
      >
        <motion.div variants={fadeIn} className="text-center mb-14 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Partners</span>
            <span className="accent-rule" />
          </div>
          <h2 className="font-serif-display text-gradient-editorial text-2xl sm:text-3xl md:text-4xl">
            Trusted by Leading FX Partners
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#A9B1C0' }}>
            We collaborate with globally recognized financial institutions and crypto exchanges.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center max-w-5xl mx-auto py-8"
          style={{
            borderTop: '1px solid rgba(212,175,127,0.14)',
            borderBottom: '1px solid rgba(212,175,127,0.14)',
          }}
        >
          {sponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              variants={scaleIn}
              whileHover={{ scale: 1.08, opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 transition"
              style={{ opacity: 0.55 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.55'; }}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={64}
                height={64}
                className="object-contain grayscale hover:grayscale-0 transition"
              />
              <p className="text-[10px] uppercase" style={{ color: '#6B7280', letterSpacing: '0.2em' }}>{sponsor.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ─── PLANS ────────────────────────────────────────────── */}
      <section>
        <Plans />
      </section>

      {/* ─── ATAIRDROPS PROGRAM ───────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-20 relative overflow-hidden"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.09) 0%, transparent 70%)', filter: 'blur(90px)' }} />

        <div className="max-w-7xl mx-auto relative">
          <motion.div variants={staggerContainer} className="text-center mb-16 space-y-5">
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">ATAirDrops · Community Allocation</span>
              <span className="accent-rule" />
            </motion.div>
            <motion.h2
              variants={slideUp}
              className="leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">24.2 billion tokens, </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>distributed.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: '#A9B1C0' }}>
              85% of the initial community allocation — released monthly to active participants across a 24-month payout cycle.
            </motion.p>
          </motion.div>

          {/* Distribution headline numbers */}
          <motion.div
            variants={scaleIn}
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden mb-12"
            style={{ background: 'rgba(212,175,127,0.12)' }}
          >
            {[
              { value: '24.2B',  label: 'ATRIUM Tokens',     sub: 'Community allocation' },
              { value: '670M',   label: 'Monthly Release', sub: 'Every 30 days' },
              { value: '24 mo',  label: 'Payout Cycle',   sub: 'From Jan 30, 2025' },
              { value: '15%',    label: 'Initial Drop',    sub: 'Distributed Jan 2026' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={slideUp}
                className="p-6 sm:p-8 relative"
                style={{ background: 'var(--color-bg)' }}
              >
                <span
                  className="absolute top-5 right-5 text-[10px] uppercase tabular-nums"
                  style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.45)' }}
                >
                  0{i + 1}
                </span>
                <p className="font-serif-display text-3xl sm:text-4xl tabular-nums text-gradient-champagne mb-2">
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase mb-1" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Timeline — how it started */}
          <div className="relative max-w-5xl mx-auto">
            <div
              className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(212,175,127,0.5), transparent)' }}
            />

            <div className="space-y-10">
              {[
                {
                  date: 'Dec 12, 2025',
                  title: 'The Snapshot',
                  body: 'ETH and SOL ledger snapshot taken. Holders of qualifying wallets earmarked for future token distribution.',
                  side: 'left',
                },
                {
                  date: 'Jan 9, 2026',
                  title: 'Initial Distribution',
                  body: 'First 15% of allocation distributed directly to snapshot participants — the opening tranche of the program.',
                  side: 'right',
                },
                {
                  date: 'Jul — Sep 2026',
                  title: 'Observation Modes',
                  body: 'Private observation (beta) transitions into public validator onboarding — the network comes online in stages.',
                  side: 'left',
                },
                {
                  date: 'Every 30 days',
                  title: 'Monthly Installments',
                  body: 'Rewards calculated from three random WATRIUM balance snapshots across the 23 days preceding each claim date.',
                  side: 'right',
                },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  variants={slideUp}
                  className="relative flex flex-col sm:flex-row items-start gap-6"
                >
                  <div
                    className={`flex-1 order-2 ${m.side === 'right' ? 'sm:order-3 sm:pl-10' : 'sm:order-1 sm:pr-10 sm:text-right'}`}
                  />

                  <div className="absolute left-4 sm:left-1/2 top-2 -translate-x-1/2 z-10">
                    <span
                      className="block w-3 h-3 rounded-full"
                      style={{
                        background: '#D4AF7F',
                        boxShadow: '0 0 0 4px rgba(212,175,127,0.18), 0 0 20px rgba(212,175,127,0.4)',
                      }}
                    />
                  </div>

                  <div
                    className={`flex-1 order-3 pl-12 sm:pl-0 ${m.side === 'right' ? 'sm:order-1 sm:pr-10 sm:text-right' : 'sm:order-3 sm:pl-10'}`}
                  >
                    <div
                      className="inline-block card-editorial rounded-2xl p-6 text-left max-w-md"
                    >
                      <p
                        className="text-[10px] uppercase mb-2 font-mono tabular-nums"
                        style={{ color: '#D4AF7F', letterSpacing: '0.24em' }}
                      >
                        {m.date}
                      </p>
                      <h3
                        className="font-serif-display text-xl mb-2"
                        style={{ color: '#F5F1EA' }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#A9B1C0' }}>
                        {m.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Inflation / Governance */}
          <motion.div
            variants={fadeIn}
            className="mt-14 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto"
          >
            {[
              { kicker: 'Year One',  value: '10%', label: 'Inflation' },
              { kicker: 'Year Two',  value: '7%',  label: 'Inflation' },
              { kicker: 'Year Three', value: '5%', label: 'Inflation' },
            ].map((r) => (
              <div
                key={r.kicker}
                className="rounded-2xl p-6 flex items-center justify-between"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(212,175,127,0.16)',
                }}
              >
                <div>
                  <p className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.26em' }}>{r.kicker}</p>
                  <p className="text-sm mt-1" style={{ color: '#A9B1C0' }}>{r.label}</p>
                </div>
                <p className="font-serif-display text-3xl tabular-nums text-gradient-champagne">
                  {r.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ─── WHY US ───────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-4 sm:px-8 md:px-12 lg:px-20"
        style={{ background: 'var(--color-bg)' }}
      >
        <motion.div
          variants={scaleIn}
          className="relative overflow-hidden rounded-3xl max-w-6xl mx-auto"
          style={{
            background: 'linear-gradient(160deg, rgba(23,34,58,0.6) 0%, rgba(11,15,26,0.85) 100%)',
            border: '1px solid rgba(212,175,127,0.18)',
          }}
        >
          {/* Gold glow */}
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

          {/* Decorative slider image */}
          <div className="absolute top-0 right-0 w-[380px] h-full opacity-[0.07] pointer-events-none hidden lg:block">
            <Image src={slider2} alt="" fill className="object-cover object-right" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-10 px-8 sm:px-14 py-14 sm:py-20">
            <motion.div
              variants={staggerContainer}
              className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
            >
              <motion.div variants={fadeIn} className="flex items-center gap-3">
                <span className="accent-rule-solid" />
                <span className="text-editorial-kicker">Why Kandella</span>
              </motion.div>

              <motion.h2
                variants={slideUp}
                className="leading-[1.1]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
              >
                <span className="font-serif-display text-gradient-editorial">Expertise in Crypto </span>
                <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Excellence</span>
              </motion.h2>

              <motion.p variants={fadeIn} className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: '#A9B1C0' }}>
                Experience secure, stress-free investing where risk is mitigated
                and profit maximization is a reality.
              </motion.p>

              <motion.button
                {...buttonMotion}
                variants={fadeIn}
                className="btn-gold mt-2 px-8 py-3.5 rounded-lg text-sm"
                onClick={() => router.push("/screens/auth/Signup")}
              >
                Start Investing Now
              </motion.button>
            </motion.div>

            <motion.div variants={fadeIn} className="flex-1 flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {[
                  { value: "55%", label: "Max ROI", sub: "Gold Plan", accent: '#D4AF7F' },
                  { value: "$0", label: "Hidden Fees", sub: "Always", accent: '#D4AF7F' },
                  { value: "24/7", label: "Support", sub: "Live chat", accent: '#D4AF7F' },
                  { value: "256-bit", label: "Encryption", sub: "Bank-grade", accent: '#D4AF7F' },
                ].map((tile, i) => (
                  <div
                    key={i}
                    className="rounded-2xl px-5 py-6 transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="w-8 h-px mb-3" style={{ background: tile.accent }} />
                    <p className="font-serif-display text-2xl sm:text-3xl tabular-nums" style={{ color: tile.accent }}>{tile.value}</p>
                    <p className="text-sm font-medium mt-1.5" style={{ color: '#F5F1EA' }}>{tile.label}</p>
                    <p className="text-[10px] mt-1 uppercase" style={{ color: '#6B7280', letterSpacing: '0.18em' }}>{tile.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 section-bg-soft"
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-16">
          <motion.div variants={staggerContainer} className="text-center space-y-5 mb-16">
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Simple Process</span>
              <span className="accent-rule" />
            </motion.div>

            <motion.h2
              variants={slideUp}
              className="leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">How it </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Works</span>
            </motion.h2>

            <motion.p variants={fadeIn} className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#A9B1C0' }}>
              Getting started with <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Kandella</span> is simple.
              Follow these steps to begin your investment journey.
            </motion.p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Accordion items={sample} multiple={false} />
          </motion.div>
        </div>
      </motion.section>

      {/* ─── SECURITY PILLARS ─────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-20"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={staggerContainer} className="text-center mb-14 space-y-5">
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Security Architecture</span>
              <span className="accent-rule" />
            </motion.div>
            <motion.h2
              variants={slideUp}
              className="leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">Built for </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>institutional</span>
              <span className="font-serif-display text-gradient-editorial"> trust.</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: '#A9B1C0' }}>
              Four pillars of protection — encryption, compliance, custody, and monitoring — woven into every transaction.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <FaLock />,
                color: '#10B981',
                title: 'AES-256 Encryption',
                desc: 'Military-grade encryption securing every data transmission and stored record at rest.',
                metric: '256-bit',
                metricLabel: 'Cipher',
              },
              {
                icon: <FaChartLine />,
                color: '#D4AF7F',
                title: 'Audit Logging',
                desc: 'Tamper-evident audit trails track every action on your portfolio in real time.',
                metric: '100%',
                metricLabel: 'Coverage',
              },
              {
                icon: <FaGlobe />,
                color: '#60A5FA',
                title: 'Cold Custody',
                desc: 'Multi-sig cold wallets keep the majority of client assets insulated from online threats.',
                metric: '95%',
                metricLabel: 'Offline',
              },
              {
                icon: <FaBolt />,
                color: '#A78BFA',
                title: '24/7 Monitoring',
                desc: 'SOC analysts and anomaly detection flag suspicious activity the moment it surfaces.',
                metric: '< 30s',
                metricLabel: 'Response',
              },
            ].map((pillar, i) => (
              <motion.div
                key={pillar.title}
                variants={slideUp}
                className="relative p-7 rounded-3xl card-editorial overflow-hidden flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg"
                    style={{
                      background: `${pillar.color}14`,
                      border: `1px solid ${pillar.color}40`,
                      color: pillar.color,
                    }}
                  >
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] uppercase tabular-nums" style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.5)' }}>
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-serif-display text-xl mb-2" style={{ color: '#F5F1EA' }}>
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#A9B1C0' }}>
                  {pillar.desc}
                </p>

                <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }}>
                  <p className="font-serif-display text-2xl tabular-nums" style={{ color: pillar.color }}>
                    {pillar.metric}
                  </p>
                  <p className="text-[10px] uppercase mt-0.5" style={{ letterSpacing: '0.22em', color: '#6B7280' }}>
                    {pillar.metricLabel}
                  </p>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}55, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── INSTITUTIONAL SERVICES ───────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-20 section-bg-soft"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={staggerContainer} className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            {/* LEFT — Editorial headline */}
            <motion.div variants={slideInLeft} className="space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <span className="accent-rule-solid" />
                <span className="text-editorial-kicker">Institutional</span>
              </div>
              <h2
                className="leading-[1.08]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
              >
                <span className="font-serif-display text-gradient-editorial">One platform. </span>
                <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Every workflow.</span>
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#A9B1C0', maxWidth: '460px' }}>
                Trading, custody and financing on a single rail — spot, derivatives, OTC and structured products built for professional capital.
              </p>

              <div
                className="rounded-2xl p-5 flex items-center gap-4 mt-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,127,0.08), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(212,175,127,0.25)',
                }}
              >
                <div>
                  <p className="font-serif-display text-3xl tabular-nums text-gradient-champagne">2.5ms</p>
                  <p className="text-[10px] uppercase mt-1" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>Benchmark latency</p>
                </div>
                <div style={{ width: '1px', height: '44px', background: 'rgba(212,175,127,0.25)' }} />
                <div>
                  <p className="font-serif-display text-3xl tabular-nums text-gradient-champagne">99.9%</p>
                  <p className="text-[10px] uppercase mt-1" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>Uptime</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Service stack */}
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  kicker: 'OTC',
                  title: 'Over-the-Counter',
                  desc: 'Deep liquidity for trades exceeding $50k. RFQ portal, chat trading, discreet execution with flexible settlement.',
                  color: '#D4AF7F',
                },
                {
                  kicker: 'Custody',
                  title: 'Qualified Custody',
                  desc: 'Vault-level permissions, role-based approvals and 24/7/365 instant access to OTC liquidity from a single interface.',
                  color: '#60A5FA',
                },
                {
                  kicker: 'Derivatives',
                  title: 'Futures & Options',
                  desc: 'Perpetual and quarterly futures with up to 50x leverage. Multi-collateral profits, CME Futures access via Kandella.',
                  color: '#A78BFA',
                },
                {
                  kicker: 'Margin',
                  title: '5x Spot Margin',
                  desc: '230+ margin-enabled markets, 30+ collateral assets. Long or short with fees from 0.01% — eligibility-restricted.',
                  color: '#22D3EE',
                },
                {
                  kicker: 'Lending',
                  title: 'Tailored Financing',
                  desc: 'Relationship-based credit for strategic positions. Unlock liquidity with precise execution — minimum $500k.',
                  color: '#10B981',
                },
                {
                  kicker: 'Benchmark',
                  title: 'Reference Rates',
                  desc: 'Index construction, performance tracking, L3 market data, and API / WebSockets / FIX 4.4 connectivity.',
                  color: '#EC4899',
                },
              ].map((s, i) => (
                <motion.div
                  key={s.title}
                  variants={slideUp}
                  className="relative rounded-2xl p-6 card-editorial overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-md"
                      style={{
                        background: `${s.color}14`,
                        border: `1px solid ${s.color}3a`,
                        color: s.color,
                        letterSpacing: '0.2em',
                        fontWeight: 600,
                      }}
                    >
                      {s.kicker}
                    </span>
                    <span className="text-[10px] tabular-nums" style={{ color: 'rgba(212,175,127,0.4)', letterSpacing: '0.22em' }}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif-display text-lg mb-2" style={{ color: '#F5F1EA' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#A9B1C0' }}>
                    {s.desc}
                  </p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.color}40, transparent)` }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── STAKING & EARN ───────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-4 sm:px-8 md:px-12 lg:px-20"
        style={{ background: 'var(--color-bg)' }}
      >
        <motion.div
          variants={scaleIn}
          className="relative overflow-hidden rounded-3xl max-w-6xl mx-auto"
          style={{
            background: 'linear-gradient(160deg, rgba(23,34,58,0.6) 0%, rgba(11,15,26,0.85) 100%)',
            border: '1px solid rgba(212,175,127,0.22)',
          }}
        >
          <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.12) 0%, transparent 70%)', filter: 'blur(90px)' }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center px-8 sm:px-14 py-14 sm:py-20">
            <motion.div variants={staggerContainer} className="space-y-7">
              <motion.div variants={fadeIn} className="flex items-center gap-3">
                <span className="accent-rule-solid" />
                <span className="text-editorial-kicker">Staking · Delegation · Earn</span>
              </motion.div>

              <motion.h2
                variants={slideUp}
                className="leading-[1.08]"
                style={{ fontSize: 'clamp(2rem, 4.2vw, 3.4rem)' }}
              >
                <span className="font-serif-display text-gradient-editorial">Earn up to </span>
                <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>17%</span>
                <span className="font-serif-display text-gradient-editorial"> in yearly rewards.</span>
              </motion.h2>

              <motion.p variants={fadeIn} className="text-sm sm:text-base leading-relaxed" style={{ color: '#A9B1C0', maxWidth: '520px' }}>
                Over $100M in rewards earned by clients to date. Stake eligible assets with flexible or bonded terms — rewards paid Tuesday and Friday in the staked asset.
              </motion.p>

              <motion.div variants={fadeIn} className="grid grid-cols-2 gap-3 pt-2 max-w-md">
                {[
                  { k: 'Validator Stake', v: '50k ATRIUM', sub: '14-day lock' },
                  { k: 'Validator Payout', v: '2 weeks', sub: 'Consensus rewards' },
                  { k: 'ATSO Delegation', v: '3.5 days', sub: 'Oracle rewards' },
                  { k: 'Commission', v: '20%', sub: 'Flexible staking' },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(212,175,127,0.14)',
                    }}
                  >
                    <p className="text-[10px] uppercase mb-2" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>{m.k}</p>
                    <p className="font-serif-display text-xl tabular-nums" style={{ color: '#F5F1EA' }}>{m.v}</p>
                    <p className="text-[10px] mt-1" style={{ color: '#6B7280' }}>{m.sub}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={slideInRight} className="relative flex items-center justify-center">
              {/* Central APY dial */}
              <div
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: '280px',
                  height: '280px',
                  background: 'radial-gradient(circle, rgba(212,175,127,0.12) 0%, rgba(10,15,26,0.95) 75%)',
                  border: '1px solid rgba(212,175,127,0.3)',
                  boxShadow: '0 0 80px -10px rgba(212,175,127,0.25), inset 0 0 40px rgba(212,175,127,0.05)',
                }}
              >
                {/* Rotating rings */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full"
                  style={{ border: '1px dashed rgba(212,175,127,0.3)' }}
                />
                <motion.div
                  aria-hidden
                  animate={{ rotate: -360 }}
                  transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-6 rounded-full"
                  style={{ border: '1px dashed rgba(16,185,129,0.22)' }}
                />

                <div className="text-center relative z-10">
                  <p className="text-[10px] uppercase mb-2" style={{ color: '#D4AF7F', letterSpacing: '0.3em' }}>Max APY</p>
                  <p
                    className="font-serif-display text-6xl tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    17%
                  </p>
                  <p className="text-[11px] mt-3" style={{ color: '#A9B1C0' }}>
                    Variable · Annualized
                  </p>
                  <span
                    className="inline-block mt-3 text-[10px] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      color: '#34D399',
                      letterSpacing: '0.22em',
                    }}
                  >
                    $100M+ paid
                  </span>
                </div>
              </div>

              {/* Floating tag */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 -right-2 rounded-xl px-4 py-3 hidden sm:block"
                style={{
                  background: 'rgba(10,15,26,0.94)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 48px -12px rgba(0,0,0,0.6)',
                }}
              >
                <p className="text-[9px] uppercase mb-1" style={{ color: '#34D399', letterSpacing: '0.22em' }}>Next Payout</p>
                <p className="font-mono text-xs tabular-nums" style={{ color: '#F5F1EA' }}>Tue · Fri</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* ─── BY THE NUMBERS ───────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-20 relative overflow-hidden section-bg-soft"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={staggerContainer} className="text-center mb-14 space-y-5">
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-3">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">By The Numbers</span>
              <span className="accent-rule" />
            </motion.div>
            <motion.h2
              variants={slideUp}
              className="leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">A portfolio of </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>proof.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden"
            style={{ background: 'rgba(212,175,127,0.12)' }}
          >
            {[
              { value: '$1B+',  label: 'Total Volume',  sub: 'cleared across markets' },
              { value: '1M+',    label: 'Active Clients', sub: 'in 15+ countries' },
              { value: '99.9%',  label: 'Uptime',         sub: '2.5ms RTT, last 12 mo' },
              { value: '55%',    label: 'Peak ROI',       sub: 'Institutional Capital Fund' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={slideUp}
                className="p-8 sm:p-10 relative"
                style={{ background: 'var(--color-bg)' }}
              >
                <span
                  className="absolute top-5 right-5 text-[10px] uppercase tabular-nums"
                  style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.45)' }}
                >
                  0{i + 1}
                </span>
                <p className="font-serif-display text-4xl sm:text-5xl tabular-nums text-gradient-champagne mb-2">
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase mb-1" style={{ letterSpacing: '0.22em', color: '#D4AF7F' }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ background: 'var(--color-bg)' }}>
        <Feedback />
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-20 px-6 md:px-16 relative overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-2xl mx-auto relative">
          <div
            className="relative overflow-hidden rounded-2xl px-6 sm:px-10 py-12 sm:py-14 text-center"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,16,28,0.86) 0%, rgba(5,8,14,0.92) 100%)',
              border: '1px solid rgba(212,175,127,0.20)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 28px 70px -24px rgba(0,0,0,0.75)',
            }}
          >
            {/* Coins banner — recolored from blue to brand gold, kept as a soft backdrop */}
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.18 }}>
              <Image
                src={bannerImg}
                alt=""
                fill
                className="object-cover object-center"
                style={{
                  filter:
                    'grayscale(1) sepia(1) saturate(2.4) hue-rotate(-12deg) brightness(1.05) contrast(1.02)',
                }}
              />
            </div>
            {/* Dark scrim keeps the heading and form fully legible over the banner */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(5,8,14,0.45) 0%, rgba(5,8,14,0.82) 78%)',
              }}
            />
            {/* Soft gold glow at top */}
            <div
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: 140,
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(212,175,127,0.16) 0%, transparent 70%)',
              }}
            />

            <div className="relative space-y-8">
              <motion.div variants={slideUp} className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="accent-rule" />
                  <span className="text-editorial-kicker" style={{ color: '#D4AF7F' }}>
                    Newsletter
                  </span>
                  <span className="accent-rule" />
                </div>
                <h2
                  className="font-serif-display text-3xl sm:text-4xl md:text-5xl leading-tight"
                  style={{
                    color: '#F5F1EA',
                    WebkitTextFillColor: '#F5F1EA',
                    textShadow: '0 2px 14px rgba(0,0,0,0.65)',
                  }}
                >
                  Stay{' '}
                  <span style={{ color: '#D4AF7F', WebkitTextFillColor: '#D4AF7F' }}>
                    Updated
                  </span>
                </h2>
                <p
                  className="text-sm sm:text-base max-w-md mx-auto"
                  style={{ color: '#C9D2E0' }}
                >
                  Subscribe to get the latest updates on crypto markets, investment
                  opportunities, and platform insights.
                </p>
              </motion.div>

              <motion.form
                variants={fadeIn}
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing!');
                }}
                className="flex flex-col sm:flex-row items-stretch gap-3 justify-center max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-lg text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(13,19,32,0.85)',
                    border: '1px solid rgba(212,175,127,0.22)',
                    color: '#F5F1EA',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,127,0.22)'; }}
                />
                <button
                  type="submit"
                  className="btn-gold px-7 py-3 rounded-lg text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <motion.footer
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        style={{
          background: 'linear-gradient(180deg, #0A0F1A 0%, #06090F 100%)',
          borderTop: '1px solid rgba(212,175,127,0.14)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-12">
            <motion.div variants={fadeIn} className="col-span-2 md:col-span-2 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="accent-rule-solid" />
                <span className="text-editorial-kicker">An Investment House</span>
              </div>
              <h2 className="font-serif-display text-gradient-champagne text-2xl">
                Kandella
              </h2>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#A9B1C0' }}>
                A regulated full-stack crypto prime brokerage — exchange,
                custody, derivatives, treasury, and a Layer 3 settlement chain
                under one roof.
              </p>
              <div className="flex gap-3 pt-2">
                {[FaTwitter, FaTelegramPlane, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <a
                    key={i}
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,175,127,0.18)',
                      color: '#A9B1C0',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,127,0.5)';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,127,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#A9B1C0';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,127,0.18)';
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h3 className="text-editorial-caps mb-5" style={{ color: '#D4AF7F' }}>Company</h3>
              <ul className="space-y-3 text-sm" style={{ color: '#A9B1C0' }}>
                {[
                  { href: '/screens/About', label: 'About' },
                  { href: '/screens/Culture', label: 'Culture' },
                  { href: '/screens/Blog', label: 'Blog' },
                  { href: '/screens/Institutional', label: 'Institutional' },
                  { href: '/screens/Contact', label: 'Contact' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors duration-200"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A9B1C0'; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h3 className="text-editorial-caps mb-5" style={{ color: '#D4AF7F' }}>Products</h3>
              <ul className="space-y-3 text-sm" style={{ color: '#A9B1C0' }}>
                {[
                  { href: '/screens/Features', label: 'Features' },
                  { href: '/screens/OTC', label: 'OTC Trading' },
                  { href: '/screens/Wallet', label: 'Wallet' },
                  { href: '/screens/Futures', label: 'Futures' },
                  { href: '/screens/Margin', label: 'Margin' },
                  { href: '/screens/Custody', label: 'Custody' },
                  { href: '/screens/Bonds', label: 'Bonds' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors duration-200"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A9B1C0'; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h3 className="text-editorial-caps mb-5" style={{ color: '#D4AF7F' }}>Network</h3>
              <ul className="space-y-3 text-sm" style={{ color: '#A9B1C0' }}>
                {[
                  { href: '/screens/ATSO', label: 'ATSO Oracle' },
                  { href: '/screens/CTPDC', label: 'State Connector' },
                  { href: '/screens/ATAssets', label: 'ATAssets' },
                  { href: '/screens/Stake', label: 'Stake & Earn' },
                  { href: '/screens/Airdrops', label: 'ATAirDrops' },
                  { href: '/screens/Membership', label: 'Kandella+ Membership' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors duration-200"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A9B1C0'; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h3 className="text-editorial-caps mb-5" style={{ color: '#D4AF7F' }}>Resources</h3>
              <ul className="space-y-3 text-sm" style={{ color: '#A9B1C0' }}>
                {[
                  { href: '/screens/Learn', label: 'Learn Center' },
                  { href: '/screens/Fees', label: 'Fee Schedule' },
                  { href: '/screens/Status', label: 'System Status' },
                  { href: '/screens/Security', label: 'Security' },
                  { href: '/screens/Legal', label: 'Legal & Compliance' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors duration-200"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#A9B1C0'; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn}
            className="mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
            style={{ borderTop: '1px solid rgba(212,175,127,0.12)', color: '#6B7280' }}
          >
            <span>© {new Date().getFullYear()} Kandella. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/screens/Privacy" className="transition-colors duration-200 hover:text-[#D4AF7F]">Privacy</Link>
              <Link href="/screens/Terms" className="transition-colors duration-200 hover:text-[#D4AF7F]">Terms</Link>
              <Link href="/screens/Legal" className="transition-colors duration-200 hover:text-[#D4AF7F]">Legal</Link>
              <span style={{ letterSpacing: '0.18em' }} className="uppercase">Licensed & Regulated</span>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default Home;
