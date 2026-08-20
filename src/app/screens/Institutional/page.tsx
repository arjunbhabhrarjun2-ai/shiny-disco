"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaLock,
  FaBolt,
  FaChartLine,
  FaHandshake,
  FaCertificate,
  FaServer,
  FaGlobeAmericas,
  FaHeadset,
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import {
  staggerContainer,
  fadeIn,
  fadeUp,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/animation";

const stats = [
  { label: "2.5ms", desc: "Benchmark round-trip latency" },
  { label: "99.9%", desc: "Platform uptime" },
  { label: "$50k+", desc: "OTC minimum ticket" },
  { label: "24/7", desc: "Relationship support" },
];

const services = [
  {
    icon: <FaLock />,
    kicker: "01 — Custody",
    title: "Qualified custody, vault-partitioned.",
    body:
      "Assets sit in a qualified custody structure with vault-level access permissions, role-based approvals, and policy enforcement that meets the most demanding internal-control frameworks.",
    bullets: [
      "Sub-accounts with independent approvals",
      "Multi-party computation signers",
      "Insurance underwritten by Lloyd's of London",
    ],
  },
  {
    icon: <FaHandshake />,
    kicker: "02 — OTC",
    title: "Block trades above $50,000.",
    body:
      "An RFQ portal provides executable quotes and instant settlement from existing account balances. For anything more bespoke, the chat desk delivers discreet service from consultation through execution.",
    bullets: [
      "RFQ portal with streaming quotes",
      "White-glove chat-based execution",
      "Same-day settlement on native rails",
    ],
  },
  {
    icon: <FaChartLine />,
    kicker: "03 — Derivatives",
    title: "Perps, futures, and structured notes.",
    body:
      "Linear and inverse perpetuals, dated futures out to six months, and structured products built around volatility, basis, and funding. Cross-margined, risk-weighted, and cleared on-chain.",
    bullets: [
      "Up to 50x leverage on major pairs",
      "Cross-margin across spot and perps",
      "Institutional-grade risk engine",
    ],
  },
  {
    icon: <FaBolt />,
    kicker: "04 — Margin",
    title: "Portfolio margin for active desks.",
    body:
      "Portfolio margin recognises offsetting risk across spot, futures, and options. Ideal for basis traders, market-makers, and quantitative funds running book-wide strategies.",
    bullets: [
      "Scenario-based margin calculation",
      "Tailored haircut schedules",
      "Straight-through processing via FIX",
    ],
  },
  {
    icon: <FaServer />,
    kicker: "05 — Connectivity",
    title: "REST, WebSockets, and FIX 4.4.",
    body:
      "Institutional APIs designed for order-management systems, liquidity aggregators, and internal trading stacks. Co-located matching engine, predictable latency, and deterministic drop-copy.",
    bullets: [
      "Sub-millisecond order acknowledgement",
      "Rate-limit tiers scaled to volume",
      "Test environment with deterministic fills",
    ],
  },
  {
    icon: <FaCertificate />,
    kicker: "06 — Benchmark data",
    title: "The Kandella Benchmark feed.",
    body:
      "A consolidated reference-rate feed, audited by a Big Four firm, used for mark-to-market, NAV calculation, and on-chain settlement across the ecosystem.",
    bullets: [
      "1.8-second refresh cadence",
      "Independent attestation quarterly",
      "Available via REST and FIX",
    ],
  },
];

const flow = [
  {
    step: "Step 01",
    title: "Introductory call",
    body: "Map requirements against product fit — spot, OTC, derivatives, custody, or benchmark data.",
  },
  {
    step: "Step 02",
    title: "Enhanced due diligence",
    body: "Documentation review, source-of-funds, and suitability assessment for regulated products.",
  },
  {
    step: "Step 03",
    title: "Account opening",
    body: "Sub-account structure, API credentials, and connectivity testing in a sandbox environment.",
  },
  {
    step: "Step 04",
    title: "Live execution",
    body: "24/7 coverage, weekly service review, and a named relationship manager for the life of the mandate.",
  },
];

export default function InstitutionalPage() {
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
            <span className="text-editorial-kicker">Kandella for institutions</span>
            <span className="accent-rule" />
          </div>
          <h1 className="leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
            <span className="font-serif-display text-gradient-editorial">One platform for </span>
            <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>digital asset trading.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#A9B1C0" }}>
            A one-stop platform for digital asset trading, custody, and financing — deep market liquidity,
            yield opportunities, 2.5ms round-trip latency, 99.9% uptime, dedicated support, and full
            institutional APIs (REST, WebSockets, FIX 4.4) with historical and real-time data.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/screens/Contact" className="btn-gold inline-flex px-6 py-3 rounded-lg text-sm">
              Talk to the desk
            </Link>
            <Link
              href="/screens/Blog/institutional-custody-and-otc"
              className="btn-ghost-gold inline-flex px-6 py-3 rounded-lg text-sm"
            >
              Read the brief
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((s, i) => (
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

      {/* Services grid */}
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
            <span className="text-editorial-kicker">Six services, one desk</span>
            <span className="accent-rule" />
          </div>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            A full-stack <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>operating system.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
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
                {s.icon}
              </div>
              <span
                className="block text-[10px] uppercase"
                style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}
              >
                {s.kicker}
              </span>
              <h3
                className="font-serif-display leading-[1.2]"
                style={{ fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)", color: "#F5F1EA" }}
              >
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#A9B1C0" }}>
                {s.body}
              </p>
              <ul className="space-y-2 pt-1">
                {s.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-xs"
                    style={{ color: "#A9B1C0" }}
                  >
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "#D4AF7F" }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Onboarding flow */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-16"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-10">
          <span className="text-editorial-kicker">Onboarding</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            From call to live in <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>ten days.</span>
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
          {flow.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card-editorial rounded-2xl p-6 space-y-3 text-center relative"
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
              <span
                className="block text-[10px] uppercase"
                style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}
              >
                {f.step}
              </span>
              <h3 className="font-serif-display text-base" style={{ color: "#F5F1EA" }}>
                {f.title}
              </h3>
              <p className="text-xs" style={{ color: "#A9B1C0" }}>
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pull quote */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-16"
      >
        <div className="card-editorial rounded-2xl p-10 sm:p-14 text-center space-y-5">
          <span className="text-editorial-kicker">Desk note</span>
          <p
            className="font-serif-italic leading-[1.25]"
            style={{ fontSize: "clamp(1.35rem, 2.5vw, 2rem)", color: "#F5F1EA" }}
          >
            &ldquo;Institutions don&rsquo;t pick an exchange. They pick an operating system. Kandella is that operating system.&rdquo;
          </p>
          <p className="text-xs uppercase" style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}>
            — Head of Institutional Services
          </p>
        </div>
      </motion.section>

      {/* Coverage split */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-16 grid lg:grid-cols-2 gap-6"
      >
        <motion.div variants={slideInLeft} className="card-editorial rounded-2xl p-8 sm:p-10 space-y-5">
          <div className="flex items-center gap-3">
            <FaGlobeAmericas style={{ color: "#D4AF7F" }} />
            <span className="text-editorial-kicker">Global coverage</span>
          </div>
          <h3
            className="font-serif-display text-gradient-editorial leading-[1.15]"
            style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.85rem)" }}
          >
            Offices in London, Singapore, Zurich, and Dubai.
          </h3>
          <p className="text-sm" style={{ color: "#A9B1C0" }}>
            A follow-the-sun coverage model means a voice on every call within three rings, regardless of tape. Primary relationship managers, backed by named secondaries in each region.
          </p>
        </motion.div>

        <motion.div variants={slideInRight} className="card-editorial rounded-2xl p-8 sm:p-10 space-y-5">
          <div className="flex items-center gap-3">
            <FaHeadset style={{ color: "#D4AF7F" }} />
            <span className="text-editorial-kicker">Dedicated support</span>
          </div>
          <h3
            className="font-serif-display text-gradient-editorial leading-[1.15]"
            style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.85rem)" }}
          >
            A named desk, not a ticket queue.
          </h3>
          <p className="text-sm" style={{ color: "#A9B1C0" }}>
            From onboarding through daily ops, every institutional account is assigned a relationship manager and a technical account manager. Weekly service reviews, quarterly business reviews, and a dedicated Slack Connect channel.
          </p>
        </motion.div>
      </motion.section>

      {/* Final CTA */}
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
            Ready for a conversation?
          </h3>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#A9B1C0" }}>
            Introduce your desk, share your requirements, and we&rsquo;ll schedule an introductory call within the next business day.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/screens/Contact" className="btn-gold inline-flex px-7 py-3 rounded-lg text-sm">
              Contact institutional services
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
