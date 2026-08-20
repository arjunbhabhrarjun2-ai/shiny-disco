"use client";

import { FaArrowRight, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaQuoteLeft, FaShieldAlt, FaBalanceScale, FaHandshake, FaGlobeAmericas, FaRocket, FaCompass } from "react-icons/fa";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import AboutAccordion from "@/components/AboutAccordion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ScrollReveal,
  StaggerReveal,
  RevealItem,
  Parallax,
  ParallaxWord,
  TiltCard,
  FlipCard,
  CountUp,
  Carousel,
} from "@/components/motion";

type StatItem = {
  label: string;
  to: number;
  suffix: string;
  color: string;
  prefix?: string;
  decimals?: number;
};

export default function AboutPage() {
  const router = useRouter();

  const principles = [
    { icon: <FaShieldAlt />, kicker: "01", title: "Custodial Integrity", body: "Client assets are sacred. Cold storage, multi-sig and continuous audit are non-negotiable.", color: "#10B981" },
    { icon: <FaBalanceScale />, kicker: "02", title: "Measured Risk", body: "We size positions for survival first, performance second. Drawdowns are managed, not endured.", color: "#D4AF7F" },
    { icon: <FaHandshake />, kicker: "03", title: "Transparent Pricing", body: "No hidden spreads. No surprise fees. Every cost surfaced before the trade is placed.", color: "#60A5FA" },
    { icon: <FaGlobeAmericas />, kicker: "04", title: "Borderless Access", body: "Wealth opportunities should not be gated by geography. Our doors open in 20+ jurisdictions.", color: "#A78BFA" },
    { icon: <FaRocket />, kicker: "05", title: "Engineering Excellence", body: "Sub-second execution, 99.98% uptime, and infrastructure built by senior practitioners.", color: "#F472B6" },
    { icon: <FaCompass />, kicker: "06", title: "Long-Horizon Thinking", body: "We optimize for the decade, not the quarter. Compounding rewards patience.", color: "#FACC15" },
  ];

  const milestones = [
    { year: "2019", title: "Foundation", body: "Kandella was founded under Haywire, Inc. — a regulated full-stack crypto prime brokerage bridging off-chain liquidity to on-chain finance." },
    { year: "2023", title: "Regulatory Posture", body: "Earned FCA (UK) and ASIC (Australia) authorisations, with CFTC licensing for the derivatives platform — the rails customers asked for." },
    { year: "2025", title: "ATAirDrops Genesis", body: "Snapshot of ETH and SOL holders on Dec 12, 2025; the 24-month distribution of 24.2B ATRIUM tokens to the community began on Jan 30, 2025." },
    { year: "2026", title: "1 Million Clients", body: "Cleared over $1B in cumulative trading volume across 15+ countries with 700+ pairs and 65+ supported crypto assets." },
  ];

  const cities = [
    { city: "New York", tz: "GMT-5", region: "Americas Hub", status: "Live", lat: "40.71° N", lng: "74.01° W" },
    { city: "London", tz: "GMT+0", region: "EMEA Operations", status: "Live", lat: "51.50° N", lng: "0.13° W" },
    { city: "Singapore", tz: "GMT+8", region: "APAC Trading", status: "Live", lat: "1.35° N", lng: "103.82° E" },
    { city: "Dubai", tz: "GMT+4", region: "MENA Desk", status: "Live", lat: "25.20° N", lng: "55.27° E" },
  ];

  return (
    <div style={{ color: "#F5F1EA" }}>
      <Navbar />

      {/* ─── HERO — typographic, no boxed image ─────────────────────── */}
      <section
        className="relative px-5 sm:px-10 md:px-16 lg:px-24 pt-32 sm:pt-36 pb-24 sm:pb-32 overflow-hidden"
      >
        {/* Floating parallax glyphs in background */}
        <Parallax offset={120} className="absolute -top-10 right-2 sm:right-12 pointer-events-none select-none z-0">
          <span
            aria-hidden
            className="font-serif-display"
            style={{
              fontSize: "clamp(8rem, 24vw, 22rem)",
              color: "rgba(212,175,127,0.06)",
              fontStyle: "normal",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              filter: "blur(0.5px)",
            }}
          >
            About
          </span>
        </Parallax>
        <Parallax offset={-80} className="absolute -bottom-20 left-2 sm:left-12 pointer-events-none select-none z-0">
          <span
            aria-hidden
            className="font-serif-display"
            style={{
              fontSize: "clamp(6rem, 18vw, 16rem)",
              color: "rgba(0,102,255,0.06)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            2018 →
          </span>
        </Parallax>

        <div className="relative max-w-6xl mx-auto z-10">
          <ScrollReveal from="up" delay={0.05}>
            <div className="flex items-center gap-3 mb-7">
              <span className="accent-rule-solid" />
              <span className="text-editorial-kicker">A Regulated Crypto Prime Brokerage · Est. 2019</span>
            </div>
          </ScrollReveal>

          <ScrollReveal from="up" delay={0.15}>
            <h1
              className="leading-[0.96]"
              style={{ fontSize: "clamp(3rem, 9vw, 8rem)", letterSpacing: "-0.03em" }}
            >
              <span className="font-serif-display text-gradient-editorial">The blockchain </span>
              <br className="hidden sm:block" />
              <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>for data.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal from="up" delay={0.3}>
            <p
              className="mt-8 max-w-2xl leading-relaxed"
              style={{
                color: "#C9D2E0",
                fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
              }}
            >
              Kandella is a regulated, full-stack crypto prime brokerage built on an
              EVM-compatible Layer 3 chain. We secure compliant access to DeFi, bridge off-chain
              liquidity to on-chain applications, and solve the oracle problem with continuous,
              decentralized price feeds across 66+ live pairs.
            </p>
          </ScrollReveal>

          <ScrollReveal from="up" delay={0.45}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/screens/auth/Signup")}
                className="btn-gold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                Start with us <FaArrowRight />
              </button>
              <button
                onClick={() => router.push("/screens/auth/Signin")}
                className="btn-ghost-gold px-8 py-3.5 rounded-lg text-sm font-semibold"
              >
                Client Login
              </button>
            </div>
          </ScrollReveal>

          {/* Scroll cue */}
          <ScrollReveal from="up" delay={0.7} className="mt-16 hidden md:flex items-center gap-3">
            <span className="text-[10px] uppercase" style={{ letterSpacing: "0.28em", color: "#D4AF7F" }}>
              Scroll
            </span>
            <span style={{ width: 56, height: 1, background: "linear-gradient(90deg, #D4AF7F, transparent)" }} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── NUMBERS STRIP — count-up reveal ─────────────────────────── */}
      <section className="px-5 sm:px-10 md:px-16 lg:px-24 py-20 sm:py-28">
        <ScrollReveal from="up">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">By the numbers</span>
              <span className="accent-rule" />
            </div>
            <h2 className="leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              <span className="font-serif-display text-gradient-editorial">Trust, measured in </span>
              <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>tangible terms.</span>
            </h2>
          </div>
        </ScrollReveal>

        <StaggerReveal stagger={0.12} className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
          {([
            { label: "Countries Served", to: 15, suffix: "+", color: "#00e5ff" },
            { label: "Total Volume", to: 1, prefix: "$", suffix: "B+", color: "#D4AF7F" },
            { label: "Active Clients", to: 650, suffix: "K+", color: "#A78BFA" },
            { label: "Crypto Assets", to: 65, suffix: "+", color: "#10B981" },
          ] as StatItem[]).map((stat) => (
            <RevealItem
              key={stat.label}
              from="up"
              className="px-6 py-8 text-center md:text-left"
              style={{
                borderLeft: "1px solid rgba(212,175,127,0.12)",
              }}
            >
              <p
                className="text-[10px] uppercase mb-4"
                style={{ color: stat.color, letterSpacing: "0.22em" }}
              >
                {stat.label}
              </p>
              <CountUp
                to={stat.to}
                decimals={stat.decimals ?? 0}
                prefix={stat.prefix ?? ""}
                suffix={stat.suffix ?? ""}
                duration={1.8}
                className="font-serif-display tabular-nums text-gradient-champagne block"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1 }}
              />
            </RevealItem>
          ))}
        </StaggerReveal>
      </section>

      {/* ─── PHILOSOPHY QUOTE — full-bleed editorial ─────────────────── */}
      <section className="relative px-5 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-32 overflow-hidden">
        {/* Parallax oversized quotation mark */}
        <Parallax offset={140} className="absolute top-10 -left-6 sm:left-8 pointer-events-none select-none z-0">
          <span
            aria-hidden
            style={{
              fontSize: "clamp(14rem, 36vw, 30rem)",
              color: "rgba(212,175,127,0.06)",
              fontFamily: "var(--font-geist-stack)",
              lineHeight: 0.7,
            }}
          >
            "
          </span>
        </Parallax>

        <div className="relative max-w-5xl mx-auto z-10">
          <ScrollReveal from="up">
            <div className="flex items-center gap-3 mb-8">
              <span className="accent-rule-solid" />
              <span className="text-editorial-kicker">Leadership Philosophy</span>
            </div>
          </ScrollReveal>

          <ScrollReveal from="up" delay={0.1}>
            <FaQuoteLeft size={28} style={{ color: "#D4AF7F", opacity: 0.55 }} className="mb-6" />
          </ScrollReveal>

          <ScrollReveal from="up" delay={0.2}>
            <blockquote
              className="font-serif-display leading-[1.18]"
              style={{
                fontSize: "clamp(1.6rem, 4vw, 3rem)",
                color: "#F5F1EA",
                letterSpacing: "-0.01em",
              }}
            >
              The future of finance belongs to those who pair conviction with discipline. Every
              product we ship, every line of compliance code, every dollar custodied — exists to
              honour the trust our clients place in us
              <span className="font-serif-italic" style={{ color: "#D4AF7F" }}> every single day.</span>
            </blockquote>
          </ScrollReveal>

          <ScrollReveal from="up" delay={0.35}>
            <div className="mt-12 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-serif-display"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,127,0.18) 0%, rgba(232,211,176,0.06) 100%)",
                  border: "1px solid rgba(212,175,127,0.4)",
                  color: "#D4AF7F",
                  fontSize: "1.3rem",
                }}
              >
                A
              </div>
              <div>
                <p className="font-serif-display text-base" style={{ color: "#F5F1EA" }}>
                  The Kandella Council
                </p>
                <p className="text-[11px] uppercase mt-1" style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}>
                  Office of the Chairman
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── PRINCIPLES — interactive flip cards ─────────────────────── */}
      <section className="relative px-5 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-28 overflow-hidden">
        <ParallaxWord offset={80} className="absolute -top-6 right-4 sm:right-12 pointer-events-none select-none z-0">
          <span
            aria-hidden
            className="font-serif-italic"
            style={{
              fontSize: "clamp(6rem, 18vw, 16rem)",
              color: "rgba(0,229,255,0.05)",
              lineHeight: 1,
            }}
          >
            principles
          </span>
        </ParallaxWord>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid md:grid-cols-2 gap-10 mb-14 items-end">
            <ScrollReveal from="left">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="accent-rule-solid" />
                  <span className="text-editorial-kicker">Our Principles</span>
                </div>
                <h2 className="leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  <span className="font-serif-display text-gradient-editorial">Six convictions that </span>
                  <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>guide everything.</span>
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal from="right" delay={0.15}>
              <p
                className="text-sm sm:text-base leading-relaxed md:pl-10 md:border-l"
                style={{ color: "#C9D2E0", borderColor: "rgba(212,175,127,0.18)" }}
              >
                These aren't slogans. They're the operating principles every team member commits to —
                etched into how we hire, how we build, and how we treat each portfolio entrusted to us.
                <span className="block mt-2 text-[11px] uppercase" style={{ color: "#00e5ff", letterSpacing: "0.22em" }}>
                  Hover each card to read more
                </span>
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {principles.map((p) => (
              <RevealItem key={p.title} from="up">
                <FlipCard
                  height={280}
                  className="rounded-2xl"
                  style={{ width: "100%" }}
                  front={
                    <div
                      className="h-full w-full p-7 rounded-2xl flex flex-col justify-between"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(23,34,58,0.5) 0%, rgba(11,15,26,0.85) 100%)",
                        border: `1px solid ${p.color}38`,
                        backdropFilter: "blur(10px) saturate(125%)",
                        WebkitBackdropFilter: "blur(10px) saturate(125%)",
                        boxShadow: `0 0 40px -16px ${p.color}45, 0 0 0 1px rgba(0,102,255,0.06)`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-lg"
                          style={{
                            background: `${p.color}18`,
                            border: `1px solid ${p.color}55`,
                            color: p.color,
                          }}
                        >
                          {p.icon}
                        </div>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.22em]"
                          style={{ color: "rgba(212,175,127,0.55)" }}
                        >
                          {p.kicker} / 06
                        </span>
                      </div>
                      <div>
                        <h3
                          className="font-serif-display"
                          style={{ fontSize: "1.5rem", color: "#F5F1EA" }}
                        >
                          {p.title}
                        </h3>
                        <span
                          className="text-[10px] uppercase mt-3 inline-block"
                          style={{ color: p.color, letterSpacing: "0.22em" }}
                        >
                          Hover to explore →
                        </span>
                      </div>
                    </div>
                  }
                  back={
                    <div
                      className="h-full w-full p-7 rounded-2xl flex flex-col justify-between"
                      style={{
                        background: `linear-gradient(160deg, ${p.color}1f 0%, rgba(11,15,26,0.92) 100%)`,
                        border: `1px solid ${p.color}66`,
                        backdropFilter: "blur(10px) saturate(125%)",
                        WebkitBackdropFilter: "blur(10px) saturate(125%)",
                        boxShadow: `0 0 50px -12px ${p.color}66`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.22em]"
                          style={{ color: p.color }}
                        >
                          {p.kicker}
                        </span>
                        <span
                          className="h-px flex-1"
                          style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}
                        />
                      </div>
                      <p
                        className="leading-relaxed"
                        style={{ color: "#F5F1EA", fontSize: "0.95rem" }}
                      >
                        {p.body}
                      </p>
                      <div className="flex items-center justify-between text-[10px] uppercase" style={{ letterSpacing: "0.22em" }}>
                        <span style={{ color: p.color }}>Principle {p.kicker}</span>
                        <span style={{ color: "rgba(212,175,127,0.55)" }}>Kandella</span>
                      </div>
                    </div>
                  }
                />
              </RevealItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ─── JOURNEY — vertical scroll-anchored timeline ─────────────── */}
      <section className="relative px-5 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-28 overflow-hidden">
        <Parallax offset={100} className="absolute -bottom-10 -left-6 sm:left-8 pointer-events-none select-none z-0">
          <span
            aria-hidden
            className="font-serif-display"
            style={{
              fontSize: "clamp(7rem, 22vw, 20rem)",
              color: "rgba(167,139,250,0.05)",
              lineHeight: 1,
            }}
          >
            journey
          </span>
        </Parallax>

        <div className="relative max-w-7xl mx-auto z-10">
          <ScrollReveal from="up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="accent-rule" />
                <span className="text-editorial-kicker">Our Journey</span>
                <span className="accent-rule" />
              </div>
              <h2 className="leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                <span className="font-serif-display text-gradient-editorial">Milestones that defined our </span>
                <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>trajectory.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Animated vertical line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.4) 15%, rgba(212,175,127,0.4) 50%, rgba(167,139,250,0.4) 85%, transparent 100%)",
              }}
            />

            <div className="space-y-12 md:space-y-20">
              {milestones.map((m, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <ScrollReveal
                    key={m.year}
                    from={isLeft ? "left" : "right"}
                    delay={idx * 0.05}
                  >
                    <div
                      className={`relative flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-6 md:gap-10`}
                    >
                      <div className="md:w-[calc(50%-2.5rem)] w-full">
                        <TiltCard max={5} glare={0.12} className="rounded-2xl">
                          <div
                            className="relative p-7 sm:p-8 rounded-2xl"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(23,34,58,0.55) 0%, rgba(11,15,26,0.88) 100%)",
                              border: "1px solid rgba(212,175,127,0.22)",
                              backdropFilter: "blur(10px) saturate(125%)",
                              WebkitBackdropFilter: "blur(10px) saturate(125%)",
                              boxShadow: "0 0 40px -16px rgba(0,102,255,0.25)",
                            }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <span
                                className="font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded"
                                style={{
                                  color: "#D4AF7F",
                                  background: "rgba(212,175,127,0.06)",
                                  border: "1px solid rgba(212,175,127,0.3)",
                                }}
                              >
                                {m.year}
                              </span>
                              <span className="h-px flex-1" style={{ background: "rgba(212,175,127,0.18)" }} />
                            </div>
                            <h3
                              className="font-serif-display mb-3"
                              style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)", color: "#F5F1EA" }}
                            >
                              {m.title}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#C9D2E0" }}>
                              {m.body}
                            </p>
                          </div>
                        </TiltCard>
                      </div>

                      {/* Center pulse node */}
                      <div className="hidden md:flex items-center justify-center w-20">
                        <span
                          className="relative w-4 h-4 rounded-full"
                          style={{
                            background: "#D4AF7F",
                            boxShadow:
                              "0 0 0 4px rgba(212,175,127,0.18), 0 0 0 10px rgba(212,175,127,0.06), 0 0 28px rgba(212,175,127,0.7)",
                          }}
                        >
                          <span
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ background: "#D4AF7F", opacity: 0.4 }}
                          />
                        </span>
                      </div>

                      <div className="md:w-[calc(50%-2.5rem)] w-full hidden md:flex justify-center">
                        <span
                          className="font-serif-display tabular-nums"
                          style={{
                            fontSize: "clamp(3rem, 7vw, 6rem)",
                            color: "rgba(212,175,127,0.16)",
                            lineHeight: 1,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {m.year}
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL DESKS — interactive carousel ─────────────────────── */}
      <section className="relative px-5 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-28">
        <ScrollReveal from="up">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Global Footprint</span>
              <span className="accent-rule" />
            </div>
            <h2 className="leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              <span className="font-serif-display text-gradient-editorial">Operating across continents — </span>
              <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>around the clock.</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "#C9D2E0" }}>
              Drag, swipe, or use the dots — each desk is staffed by senior practitioners who have run
              private books through every major regime change since 2008.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto">
          <Carousel gap={20} autoPlay={5500}>
            {cities.map((loc) => (
              <TiltCard
                key={loc.city}
                max={6}
                glare={0.15}
                className="rounded-2xl"
                style={{ width: "min(82vw, 380px)" }}
              >
                <div
                  className="p-8 rounded-2xl h-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(23,34,58,0.55) 0%, rgba(11,15,26,0.88) 100%)",
                    border: "1px solid rgba(0,229,255,0.16)",
                    backdropFilter: "blur(12px) saturate(130%)",
                    WebkitBackdropFilter: "blur(12px) saturate(130%)",
                    boxShadow:
                      "0 0 0 1px rgba(0,102,255,0.08), 0 24px 60px -28px rgba(0,102,255,0.30)",
                    minHeight: 280,
                  }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#10B981", boxShadow: "0 0 10px #10B981" }}
                    />
                    <span
                      className="text-[10px] uppercase"
                      style={{ letterSpacing: "0.22em", color: "#10B981" }}
                    >
                      {loc.status}
                    </span>
                  </div>
                  <h3
                    className="font-serif-display mb-2"
                    style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)", color: "#F5F1EA", letterSpacing: "-0.02em" }}
                  >
                    {loc.city}
                  </h3>
                  <p
                    className="text-[11px] uppercase mb-6"
                    style={{ color: "#D4AF7F", letterSpacing: "0.2em" }}
                  >
                    {loc.region}
                  </p>
                  <div className="space-y-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(212,175,127,0.16)" }}>
                    {[
                      ["Timezone", loc.tz],
                      ["Latitude", loc.lat],
                      ["Longitude", loc.lng],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span
                          className="text-[10px] uppercase"
                          style={{ color: "#A9B1C0", letterSpacing: "0.18em" }}
                        >
                          {k}
                        </span>
                        <span className="font-mono text-xs tabular-nums" style={{ color: "#F5F1EA" }}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </Carousel>
        </div>

        <ScrollReveal from="up" delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {["Regulated Entities", "KYC / AML Compliant", "ISO 27001", "SOC 2 Type II"].map((label) => (
              <span
                key={label}
                className="text-[10px] uppercase px-3.5 py-1.5 rounded-full transition-colors duration-300 hover:border-cyan-300/60"
                style={{
                  letterSpacing: "0.22em",
                  color: "#D4AF7F",
                  background: "rgba(212,175,127,0.05)",
                  border: "1px solid rgba(212,175,127,0.22)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────── */}
      <section className="px-2 sm:px-6">
        <ScrollReveal from="up">
          <AboutAccordion />
        </ScrollReveal>
      </section>

      {/* ─── FINAL CTA — full-bleed, parallax accent ─────────────────── */}
      <section className="relative px-5 sm:px-10 md:px-16 lg:px-24 py-24 sm:py-32 overflow-hidden">
        <Parallax offset={100} className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
          <span
            aria-hidden
            className="font-serif-italic"
            style={{
              fontSize: "clamp(8rem, 22vw, 22rem)",
              color: "rgba(0,229,255,0.05)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            begin
          </span>
        </Parallax>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <ScrollReveal from="up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="accent-rule" />
              <span className="text-editorial-kicker">Begin</span>
              <span className="accent-rule" />
            </div>
          </ScrollReveal>
          <ScrollReveal from="up" delay={0.1}>
            <h2 className="leading-[1.02]" style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}>
              <span className="font-serif-display text-gradient-editorial">Start your financial </span>
              <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>freedom</span>
              <span className="font-serif-display text-gradient-editorial"> with us.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal from="up" delay={0.25}>
            <p className="mt-7 max-w-xl mx-auto text-sm sm:text-base leading-relaxed" style={{ color: "#C9D2E0" }}>
              Whether you're new to digital assets or a seasoned investor, the desks at Kandella are
              ready to onboard you with the calm and rigour that capital deserves.
            </p>
          </ScrollReveal>
          <ScrollReveal from="up" delay={0.4}>
            <div className="pt-9">
              <Link href="/screens/auth/Signup">
                <button className="btn-gold px-9 py-4 rounded-lg inline-flex items-center gap-2 text-sm">
                  Get Started <FaArrowRight />
                </button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="py-10">
        <div
          className="py-12 px-6 sm:px-10 md:px-14 w-[92%] md:w-[85%] mx-auto rounded-3xl"
          style={{
            background: "linear-gradient(180deg, rgba(23,34,58,0.4) 0%, rgba(11,15,26,0.7) 100%)",
            border: "1px solid rgba(212,175,127,0.14)",
            backdropFilter: "blur(8px) saturate(120%)",
            WebkitBackdropFilter: "blur(8px) saturate(120%)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 items-start text-center sm:text-left">
            <div className="space-y-5 flex flex-col items-center sm:items-start">
              <Logo size={42} wordmarkSize="1.75rem" />
              <p className="text-sm" style={{ color: "#C9D2E0" }}>
                Giving you the best investment opportunities
              </p>
              <div className="flex gap-3 mt-2 justify-center sm:justify-start">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <a
                    key={i}
                    className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(212,175,127,0.18)",
                      color: "#A9B1C0",
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = "#00e5ff";
                      e.currentTarget.style.borderColor = "rgba(0,229,255,0.5)";
                      e.currentTarget.style.background = "rgba(0,229,255,0.08)";
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = "#A9B1C0";
                      e.currentTarget.style.borderColor = "rgba(212,175,127,0.18)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            <div className="sm:col-span-1 md:col-span-3 space-y-5">
              <h1 className="text-editorial-caps" style={{ color: "#D4AF7F" }}>Useful Links</h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-6 sm:gap-8">
                {[
                  [{ href: "/", label: "Home" }, { href: "/screens/About", label: "About" }],
                  [{ href: "/screens/Contact", label: "Contact Us" }, { href: "/screens/Bonds", label: "Investment Plans" }],
                  [{ href: "/screens/auth/Signin", label: "Login" }, { href: "/screens/auth/Signup", label: "Sign up" }],
                ].map((group, gi) => (
                  <div key={gi} className="space-y-2.5">
                    {group.map((item) => (
                      <Link key={item.label} href={item.href}>
                        <li
                          className="list-none text-sm cursor-pointer transition-colors duration-200"
                          style={{ color: "#C9D2E0" }}
                          onMouseEnter={(e: any) => { e.currentTarget.style.color = "#00e5ff"; }}
                          onMouseLeave={(e: any) => { e.currentTarget.style.color = "#C9D2E0"; }}
                        >
                          {item.label}
                        </li>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="text-editorial-caps" style={{ color: "#D4AF7F" }}>Legal</h1>
              <div className="space-y-2.5">
                {[
                  { label: "Terms of Use", href: "/screens/Terms" },
                  { label: "Privacy Policy", href: "/screens/Privacy" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <p
                      className="text-sm cursor-pointer transition-colors duration-200"
                      style={{ color: "#C9D2E0" }}
                      onMouseEnter={(e: any) => { e.currentTarget.style.color = "#00e5ff"; }}
                      onMouseLeave={(e: any) => { e.currentTarget.style.color = "#C9D2E0"; }}
                    >
                      {item.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="text-center py-6 text-xs uppercase"
          style={{ color: "#9AA5B8", letterSpacing: "0.16em" }}
        >
          <p>© Kandella · {new Date().getFullYear()} · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
