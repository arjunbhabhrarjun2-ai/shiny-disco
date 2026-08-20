"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaKey,
  FaUserShield,
  FaFingerprint,
  FaEye,
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { staggerContainer, fadeIn, fadeUp, scaleIn } from "@/lib/animation";

const pillars = [
  {
    icon: <FaShieldAlt />,
    kicker: "Custody",
    heading: "Qualified, segregated, audited.",
    body:
      "Client assets are held in a qualified custody structure, segregated from operational capital, and audited on a continuous basis. Multi-party computation signers remove single-point-of-failure risk on hot-wallet withdrawals.",
  },
  {
    icon: <FaLock />,
    kicker: "Encryption",
    heading: "256-bit in transit, FIPS-validated at rest.",
    body:
      "All traffic is TLS 1.3 with perfect forward secrecy. Sensitive fields are encrypted at rest in FIPS 140-2 validated HSMs. Private keys never leave hardware boundary.",
  },
  {
    icon: <FaUserShield />,
    kicker: "Account",
    heading: "MFA, withdrawal whitelists, cooldown windows.",
    body:
      "Hardware-backed 2FA, anti-phishing codes, IP/device fingerprint alerting, and withdrawal whitelists with configurable cooldown windows protect the account perimeter.",
  },
  {
    icon: <FaKey />,
    kicker: "Access",
    heading: "Role-based, least-privilege internally.",
    body:
      "Staff access follows least-privilege, enforced by hardware security keys, time-boxed approvals, and immutable audit trails. No single engineer can move client funds unilaterally.",
  },
  {
    icon: <FaFingerprint />,
    kicker: "Monitoring",
    heading: "Continuous threat detection, 24/7 SOC.",
    body:
      "Our Security Operations Center runs 24/7 monitoring with behavioural analytics, sanctions screening, and on-chain forensics. Suspicious activity triggers automatic containment in under sixty seconds.",
  },
  {
    icon: <FaEye />,
    kicker: "Transparency",
    heading: "Proof-of-reserves, SOC 2, independent audit.",
    body:
      "Proof-of-reserves attestations are published quarterly. Our systems are assessed under SOC 2 Type II and independently audited by Big Four firms. Bug-bounty payouts reach $250,000 per critical finding.",
  },
];

const habits = [
  "Enable hardware-backed two-factor authentication on every account",
  "Use a hardware wallet for long-term positions",
  "Whitelist withdrawal addresses and enforce a cooldown window",
  "Never reuse passwords — always pair with a password manager",
  "Keep a separate, cold email address for financial accounts",
  "Beware of unsolicited \u201csupport\u201d contact on social media",
  "Verify URLs manually — never trust search-engine sponsored results",
  "Audit connected dApps quarterly; revoke stale token approvals",
];

export default function SecurityPage() {
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
            <span className="text-editorial-kicker">Trust & Safety</span>
            <span className="accent-rule" />
          </div>
          <h1 className="leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
            <span className="font-serif-display text-gradient-editorial">Security at </span>
            <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>Kandella.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#A9B1C0" }}>
            Proof of Reserves with 1:1 asset backing and Merkle Tree cryptography, external security
            reviews from CER.live, Hacken and others, plus an active Bug Bounty programme
            (report to bugbounty@cryptotradeprime.io).
          </p>
        </div>
      </section>

      {/* Quick stats */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "99.9%", desc: "Platform uptime" },
          { label: "24/7", desc: "SOC monitoring" },
          { label: "SOC 2", desc: "Type II certified" },
          { label: "$250k", desc: "Max bug bounty" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className="rounded-2xl px-5 py-5 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(212,175,127,0.14)",
            }}
          >
            <p className="font-serif-display text-2xl sm:text-3xl text-gradient-champagne tabular-nums">
              {stat.label}
            </p>
            <p
              className="text-[10px] mt-1.5 uppercase"
              style={{ color: "#6B7280", letterSpacing: "0.18em" }}
            >
              {stat.desc}
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
          <div className="flex items-center justify-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Six pillars</span>
            <span className="accent-rule" />
          </div>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Defence, <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>in depth.</span>
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
                {p.heading}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#A9B1C0" }}>
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Habits */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-16"
      >
        <motion.div variants={fadeIn} className="text-center space-y-4 mb-8">
          <span className="text-editorial-kicker">For clients</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)" }}
          >
            Eight habits that <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>protect portfolios.</span>
          </h2>
        </motion.div>

        <motion.ul variants={staggerContainer} className="card-editorial rounded-2xl p-8 sm:p-10 space-y-3.5">
          {habits.map((h, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className="flex items-start gap-3.5 text-sm sm:text-base"
              style={{ color: "#A9B1C0" }}
            >
              <span
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-serif-display"
                style={{
                  background: "rgba(212,175,127,0.10)",
                  border: "1px solid rgba(212,175,127,0.3)",
                  color: "#D4AF7F",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {h}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      {/* Certifications strip */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 pb-14"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-8">
          <span className="text-editorial-kicker">Audited & attested</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
          >
            Certifications that <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>travel with us.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "SOC 2", desc: "Type II — annual" },
            { label: "ISO 27001", desc: "Information security" },
            { label: "PCI DSS", desc: "Level 1 — payments" },
            { label: "NIST CSF", desc: "Continuous alignment" },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="card-editorial rounded-2xl p-6 text-center space-y-2"
            >
              <p className="font-serif-display text-xl" style={{ color: "#F5F1EA" }}>
                {c.label}
              </p>
              <p
                className="text-[10px] uppercase"
                style={{ color: "#6B7280", letterSpacing: "0.18em" }}
              >
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Incident response timeline */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-16"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-10">
          <span className="text-editorial-kicker">Incident response</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
          >
            From signal to <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>containment.</span>
          </h2>
        </motion.div>

        <div className="relative space-y-5 pl-10 sm:pl-14">
          <div
            className="absolute top-2 bottom-2 left-3 sm:left-5 w-px"
            style={{
              background:
                "linear-gradient(180deg, rgba(212,175,127,0.6), rgba(212,175,127,0.15))",
            }}
          />
          {[
            {
              t: "0s",
              h: "Detection",
              b: "Behavioural analytics, IDS, and on-chain forensics fire an alert into the SOC queue.",
            },
            {
              t: "< 60s",
              h: "Containment",
              b: "Automated playbooks isolate affected systems and freeze suspicious withdrawal queues.",
            },
            {
              t: "< 15m",
              h: "Escalation",
              b: "Incident commander assembles bridge with engineering, compliance, and legal.",
            },
            {
              t: "< 24h",
              h: "Disclosure",
              b: "If client data is impacted, we notify regulators and affected users under breach-notification rules.",
            },
            {
              t: "< 30d",
              h: "Post-mortem",
              b: "Written RCA, control-gap analysis, and remediation plan published internally and summarised publicly.",
            },
          ].map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div
                className="absolute -left-[33px] sm:-left-[43px] top-2 w-3.5 h-3.5 rounded-full"
                style={{
                  background: "rgba(10,15,26,0.95)",
                  border: "2px solid #D4AF7F",
                }}
              />
              <div className="card-editorial rounded-2xl p-6 space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] uppercase tabular-nums"
                    style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}
                  >
                    T + {step.t}
                  </span>
                  <span className="w-8 h-px" style={{ background: "rgba(212,175,127,0.4)" }} />
                </div>
                <h4 className="font-serif-display text-lg" style={{ color: "#F5F1EA" }}>{step.h}</h4>
                <p className="text-sm" style={{ color: "#A9B1C0" }}>{step.b}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-20"
      >
        <motion.div
          variants={fadeIn}
          className="card-editorial rounded-2xl p-10 text-center space-y-5"
        >
          <span className="text-editorial-kicker">Report a vulnerability</span>
          <h3
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}
          >
            See something? <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>Say something.</span>
          </h3>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#A9B1C0" }}>
            Our bug-bounty program rewards responsible disclosure up to $250,000. Reach the Security Office through the Contact page.
          </p>
          <Link
            href="/screens/Contact"
            className="btn-gold inline-flex px-7 py-3 rounded-lg text-sm"
          >
            Contact Security
          </Link>
        </motion.div>
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
