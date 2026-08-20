"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaLock,
  FaCoins,
  FaArrowRight,
  FaChartLine,
  FaShieldAlt,
  FaRegCalendarCheck,
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { staggerContainer, fadeIn, fadeUp, scaleIn } from "@/lib/animation";

const heroStats = [
  { label: "17%", desc: "Up to APY" },
  { label: "$100M+", desc: "Paid to clients" },
  { label: "3.5 days", desc: "Oracle rewards cadence" },
  { label: "0", desc: "Transaction fees" },
];

const products = [
  {
    icon: <FaLock />,
    kicker: "Validator staking",
    title: "50,000 ATRIUM minimum, 14-day lock.",
    body:
      "Stakers lock ATRIUM to a validator securing the chain itself. Rewards are distributed every two weeks. It is the deepest level of participation in network security \u2014 and the highest yield on offer for non-bonded capital.",
    badge: "Up to 14% APY",
  },
  {
    icon: <FaCoins />,
    kicker: "ATSO delegation",
    title: "Wrap, delegate, earn every 3.5 days.",
    body:
      "Holders wrap ATRIUM into WATRIUM and delegate voting power to data providers. Delegators earn a share of the provider\u2019s oracle rewards \u2014 usually paid in WATRIUM every 3.5 days. A near-continuous yield stream with no principal lock-up.",
    badge: "Up to 9% APY",
  },
  {
    icon: <FaChartLine />,
    kicker: "Earn — Flexible",
    title: "No lock-up, withdraw any time.",
    body:
      "Flexible Earn offers the market-making desk\u2019s yield curve with zero lock-up and zero transaction fees. Ideal for cash balances you want working between trades. Commission on flexible staking with unbonding periods is 20%.",
    badge: "Up to 6% APY",
  },
  {
    icon: <FaRegCalendarCheck />,
    kicker: "Earn — Bonded",
    title: "Commit, and the rate steps up.",
    body:
      "Bonded Earn commits assets for a set period \u2014 30, 60 or 90 days \u2014 in exchange for higher reward potential. Early withdrawal forfeits accrued interest; maturity is automatic and paid in the original asset.",
    badge: "Up to 17% APY",
  },
];

const steps = [
  { label: "Deposit", desc: "Move funds into your Kandella Earn wallet." },
  { label: "Pick a product", desc: "Flexible, bonded, or validator staking." },
  { label: "Confirm", desc: "One signature. Allocation is live instantly." },
  { label: "Earn", desc: "Rewards accrue continuously; claim any time." },
];

const faqs = [
  {
    q: "When are rewards paid?",
    a: "Validator rewards settle every 14 days. ATSO delegation pays every 3.5 days. Flexible Earn accrues continuously and compounds daily.",
  },
  {
    q: "Is principal locked?",
    a: "Only for validator staking (14-day lock) and bonded Earn (term-dependent). Flexible Earn and ATSO delegation are fully liquid.",
  },
  {
    q: "What is the commission?",
    a: "Flexible staking with unbonding periods carries a 20% performance commission. Bonded and validator products publish their commission inside the product detail page.",
  },
  {
    q: "Is there a minimum?",
    a: "Validator staking requires a 50,000 ATRIUM minimum. Flexible and bonded Earn accept deposits from $100 equivalent.",
  },
];

export default function EarnPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "#F5F1EA" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative text-center pt-16 pb-14 hero-bg-editorial overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(212,175,127,0.10) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 space-y-5">
          <div className="flex items-center justify-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Kandella Earn · Staking & Rewards</span>
            <span className="accent-rule" />
          </div>
          <h1 className="leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
            <span className="font-serif-display text-gradient-editorial">Earn up to </span>
            <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>17% yearly.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#A9B1C0" }}>
            On-chain staking, flexible staking with no lock-up, and bonded earn for higher rewards
            over a fixed period. Rewards paid every Tuesday and Friday. No transaction fees;
            20% commission applies to flexible staking on assets with unbonding periods.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/screens/auth/Signup" className="btn-gold inline-flex px-6 py-3 rounded-lg text-sm">
              Start earning
            </Link>
            <Link
              href="/screens/Blog/staking-and-earn-on-Kandella"
              className="btn-ghost-gold inline-flex px-6 py-3 rounded-lg text-sm"
            >
              Read the guide
            </Link>
          </div>
        </div>
      </section>

      {/* Hero stats */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {heroStats.map((s, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className="rounded-2xl px-5 py-6 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(212,175,127,0.14)",
            }}
          >
            <p className="font-serif-display text-3xl sm:text-4xl text-gradient-champagne tabular-nums">
              {s.label}
            </p>
            <p
              className="text-[10px] mt-2 uppercase"
              style={{ color: "#6B7280", letterSpacing: "0.2em" }}
            >
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Product grid */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-14"
      >
        <motion.div variants={fadeIn} className="text-center space-y-4 mb-10">
          <div className="flex items-center justify-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Four products</span>
            <span className="accent-rule" />
          </div>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Pick your <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>cadence.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p, i) => (
            <motion.article
              key={i}
              variants={fadeUp}
              className="card-editorial rounded-2xl p-7 space-y-4 relative overflow-hidden"
            >
              <div
                className="absolute top-6 right-6 text-[10px] uppercase px-3 py-1 rounded-full"
                style={{
                  background: "rgba(212,175,127,0.10)",
                  border: "1px solid rgba(212,175,127,0.3)",
                  color: "#D4AF7F",
                  letterSpacing: "0.2em",
                }}
              >
                {p.badge}
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{
                  background: "rgba(212,175,127,0.08)",
                  border: "1px solid rgba(212,175,127,0.22)",
                  color: "#D4AF7F",
                }}
              >
                {p.icon}
              </div>
              <span
                className="block text-[10px] uppercase"
                style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}
              >
                {p.kicker}
              </span>
              <h3
                className="font-serif-display leading-[1.2]"
                style={{ fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)", color: "#F5F1EA" }}
              >
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#A9B1C0" }}>
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Steps */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-14"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-10">
          <span className="text-editorial-kicker">How it works</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            Four steps, <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>under a minute.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 relative">
          <div
            className="hidden md:block absolute top-[22px] left-[5%] right-[5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,127,0), rgba(212,175,127,0.5), rgba(212,175,127,0))",
            }}
          />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card-editorial rounded-2xl p-6 space-y-3 text-center"
            >
              <div
                className="w-11 h-11 mx-auto rounded-full flex items-center justify-center font-serif-display relative z-10"
                style={{
                  background: "rgba(10,15,26,0.95)",
                  border: "1px solid rgba(212,175,127,0.4)",
                  color: "#D4AF7F",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-serif-display text-base" style={{ color: "#F5F1EA" }}>{s.label}</h3>
              <p className="text-xs" style={{ color: "#A9B1C0" }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security strip */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-14"
      >
        <div className="card-editorial rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: "rgba(212,175,127,0.08)",
              border: "1px solid rgba(212,175,127,0.22)",
              color: "#D4AF7F",
            }}
          >
            <FaShieldAlt />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <span className="text-editorial-kicker">Safety</span>
            <h3
              className="font-serif-display text-gradient-editorial leading-[1.2]"
              style={{ fontSize: "clamp(1.25rem, 2vw, 1.65rem)" }}
            >
              Yield, without surprises.
            </h3>
            <p className="text-sm" style={{ color: "#A9B1C0" }}>
              Earn balances sit inside the same qualified custody structure that protects institutional funds. Rewards are sourced from consensus and oracle economics — not counter-party leverage.
            </p>
          </div>
          <Link
            href="/screens/Security"
            className="btn-ghost-gold inline-flex px-5 py-2.5 rounded-lg text-xs whitespace-nowrap"
          >
            Read our security model <FaArrowRight className="ml-1" />
          </Link>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-16"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-10">
          <span className="text-editorial-kicker">FAQ</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            The short <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>answers.</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card-editorial rounded-2xl p-7 space-y-2"
            >
              <span
                className="text-[10px] uppercase"
                style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}
              >
                Q{String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-serif-display text-lg" style={{ color: "#F5F1EA" }}>{f.q}</h4>
              <p className="text-sm" style={{ color: "#A9B1C0" }}>{f.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-20"
      >
        <div className="card-editorial rounded-2xl p-10 text-center space-y-5">
          <h3
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
          >
            Yield, made ordinary.
          </h3>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#A9B1C0" }}>
            Open an account, fund it, and start earning in under a minute. No transaction fees, transparent commission, no gatekeeping.
          </p>
          <Link href="/screens/auth/Signup" className="btn-gold inline-flex px-7 py-3 rounded-lg text-sm">
            Create an account
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer
        className="border-t py-10"
        style={{ borderColor: "rgba(212,175,127,0.12)", background: "rgba(10,15,26,0.4)" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs uppercase" style={{ color: "#6B7280", letterSpacing: "0.22em" }}>
            © {new Date().getFullYear()} Kandella
          </p>
          <div className="flex gap-3">
            {[FaTwitter, FaTelegramPlane, FaInstagram, FaLinkedin].map((Icon, i) => (
              <span
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,175,127,0.18)",
                  color: "#A9B1C0",
                }}
              >
                <Icon size={12} />
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
