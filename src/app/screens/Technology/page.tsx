"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaBitcoin,
  FaEthereum,
  FaLink,
  FaLayerGroup,
  FaMicrochip,
  FaCubes,
  FaNetworkWired,
  FaClock,
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import {
  staggerContainer,
  fadeIn,
  fadeUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  floating,
} from "@/lib/animation";

const headlineStats = [
  { label: "1.8s", desc: "Oracle refresh cadence" },
  { label: "98+", desc: "Independent data providers" },
  { label: "66+", desc: "Live price feeds" },
  { label: "$75M+", desc: "Providers staked" },
];

const pillars = [
  {
    icon: <FaMicrochip />,
    kicker: "ATSO",
    title: "Kandella Time Series Oracle.",
    body:
      "A native oracle enshrined in consensus. Independent providers submit price estimates every 1.8 seconds; a median value becomes the official feed. More than 98 providers currently secure 66+ live feeds, backed by over $75M in staked ATRIUM.",
  },
  {
    icon: <FaCubes />,
    kicker: "FAssets",
    title: "Programmable BTC, XRP & DOGE.",
    body:
      "FAssets bring trust-minimized versions of non-smart-contract tokens to Kandella. Users lock native assets on their origin chain; the State Connector verifies the lock-up and mints an equivalent FAsset \u2014 freely composable across Kandella DeFi.",
  },
  {
    icon: <FaLink />,
    kicker: "State Connector",
    title: "Consensus-verified external events.",
    body:
      "The State Connector is Kandella\u2019s bridge to the outside world. It allows smart contracts on Kandella to prove that an event occurred on another blockchain \u2014 without centralized custody or trusted intermediaries.",
  },
  {
    icon: <FaLayerGroup />,
    kicker: "CTPDC",
    title: "Kandella Data Connector.",
    body:
      "CTPDC delivers off-chain data feeds \u2014 market prices, weather, sports, FX rates \u2014 with the same economic security that protects the chain itself. No third-party oracle trust assumption required.",
  },
  {
    icon: <FaNetworkWired />,
    kicker: "EVM",
    title: "Fully EVM compatible.",
    body:
      "Kandella is Ethereum Virtual Machine compatible. Solidity contracts deploy as-is. Developer tooling \u2014 Hardhat, Foundry, Remix \u2014 works out of the box. MetaMask connects natively.",
  },
  {
    icon: <FaClock />,
    kicker: "Throughput",
    title: "Sub-two-second finality.",
    body:
      "Kandella finalises blocks in under two seconds with throughput measured in the thousands of transactions per second. Consensus is protected by a rotating validator set and a commit-reveal price aggregation scheme.",
  },
];

const lifecycle = [
  { stage: "Submit", desc: "Providers push price estimates every 1.8s." },
  { stage: "Aggregate", desc: "Chain computes a weighted median." },
  { stage: "Publish", desc: "Median price is written into consensus." },
  { stage: "Consume", desc: "Contracts read the feed with one call." },
];

const tokenomics = [
  { label: "24.2B", desc: "ATAirDrops pool" },
  { label: "670M", desc: "Monthly distribution" },
  { label: "24 mo", desc: "Distribution cycle" },
  { label: "10%", desc: "Year 1 inflation" },
  { label: "7%", desc: "Year 2 inflation" },
  { label: "5%", desc: "Year 3 inflation" },
];

const assets = [
  { icon: <FaBitcoin />, name: "BTC", color: "#F7931A" },
  { icon: <FaEthereum />, name: "ETH", color: "#627EEA" },
  { icon: <SiSolana />, name: "SOL", color: "#9945FF" },
];

export default function TechnologyPage() {
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
            <span className="text-editorial-kicker">The Kandella Protocol</span>
            <span className="accent-rule" />
          </div>
          <h1 className="leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
            <span className="font-serif-display text-gradient-editorial">EVM-compatible </span>
            <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>Layer 3.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#A9B1C0" }}>
            ATSO, CTPDC and ADAssets — protocol-level primitives that turn non-smart-contract tokens
            (XRP, BTC, DOGE) into first-class programmable money, secured by validator consensus
            and an EVM execution layer compatible with the Solidity tooling you already know.
          </p>
        </div>
      </section>

      {/* Headline stats */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {headlineStats.map((s, i) => (
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

      {/* Pillars */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-14"
      >
        <motion.div variants={fadeIn} className="text-center space-y-4 mb-10">
          <span className="text-editorial-kicker">Six primitives</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Data, in <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>consensus.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.article
              key={i}
              variants={fadeUp}
              className="card-editorial rounded-2xl p-7 space-y-4"
            >
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

      {/* Oracle lifecycle visual */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-16"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-10">
          <span className="text-editorial-kicker">Oracle lifecycle</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            One feed. <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>Four stages.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 relative">
          <div
            className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,127,0), rgba(212,175,127,0.45), rgba(212,175,127,0))",
            }}
          />
          {lifecycle.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card-editorial rounded-2xl p-6 space-y-2 text-center relative"
            >
              <span
                className="text-[10px] uppercase"
                style={{ color: "#D4AF7F", letterSpacing: "0.25em" }}
              >
                Stage 0{i + 1}
              </span>
              <h3 className="font-serif-display text-lg" style={{ color: "#F5F1EA" }}>
                {step.stage}
              </h3>
              <p className="text-xs" style={{ color: "#A9B1C0" }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAssets visual */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-16 grid lg:grid-cols-2 gap-8 items-center"
      >
        <motion.div variants={slideInLeft} className="space-y-5">
          <span className="text-editorial-kicker">FAssets</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            Programmable bitcoin, without bridges.
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#A9B1C0" }}>
            Lock native BTC, XRP or DOGE. The State Connector proves the lock-up. Kandella mints an equivalent FAsset, fully composable across SparkDex, Kinetic and Enosys. Over 90M FAssets have been minted to date, with roughly 80% actively deployed in DeFi.
          </p>
          <ul className="space-y-2.5 pt-2">
            {[
              "90M+ FAssets minted to date",
              "Composable across every Kandella dApp",
              "Trust-minimised — no centralised custody",
            ].map((b, j) => (
              <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#A9B1C0" }}>
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#D4AF7F" }}
                />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={slideInRight}
          className="card-editorial rounded-3xl p-10 flex items-center justify-center"
          style={{ minHeight: "340px" }}
        >
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            <motion.div
              variants={floating}
              animate="animate"
              className="relative z-10 w-[45%] aspect-square rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(212,175,127,0.35) 0%, rgba(212,175,127,0.12) 40%, rgba(10,15,26,0.95) 80%)",
                border: "1px solid rgba(212,175,127,0.4)",
              }}
            >
              <span
                className="font-serif-display"
                style={{ color: "#D4AF7F", fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                ATRIUM
              </span>
            </motion.div>

            {assets.map((a, i) => {
              const angle = (i / assets.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 38;
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;
              return (
                <motion.div
                  key={a.name}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3 + i, repeat: Infinity }}
                  className="absolute w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    background: "rgba(10,15,26,0.95)",
                    border: `1px solid ${a.color}66`,
                    color: a.color,
                  }}
                >
                  {a.icon}
                </motion.div>
              );
            })}

            {/* Dashed orbit ring */}
            <div
              className="absolute inset-[8%] rounded-full pointer-events-none"
              style={{ border: "1px dashed rgba(212,175,127,0.22)" }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Tokenomics */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-16"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-10">
          <span className="text-editorial-kicker">ATAirDrops</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            A 24-month, 24.2-billion-token <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>community cycle.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tokenomics.map((t, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="rounded-2xl px-4 py-5 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(212,175,127,0.14)",
              }}
            >
              <p className="font-serif-display text-2xl text-gradient-champagne tabular-nums">
                {t.label}
              </p>
              <p
                className="text-[10px] mt-1.5 uppercase"
                style={{ color: "#6B7280", letterSpacing: "0.18em" }}
              >
                {t.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Developer CTA */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-20"
      >
        <div className="card-editorial rounded-2xl p-10 text-center space-y-5">
          <span className="text-editorial-kicker">For builders</span>
          <h3
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
          >
            EVM compatible, oracle-native, composable.
          </h3>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#A9B1C0" }}>
            Deploy your Solidity contracts as-is. Read from ATSO with one call. Mint FAssets inside your dApp. The protocol takes the plumbing off your plate.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/screens/Blog/Kandella-layer-1-blockchain-for-data"
              className="btn-gold inline-flex px-6 py-3 rounded-lg text-sm"
            >
              Read the technical brief
            </Link>
            <Link
              href="/screens/Contact"
              className="btn-ghost-gold inline-flex px-6 py-3 rounded-lg text-sm"
            >
              Contact research
            </Link>
          </div>
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
