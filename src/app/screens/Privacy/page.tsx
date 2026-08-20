"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedin,
  FaShieldAlt,
  FaUserLock,
  FaGlobe,
  FaCookieBite,
  FaDatabase,
  FaRegFileAlt,
} from "react-icons/fa";
import { staggerContainer, fadeIn, fadeUp, scaleIn } from "@/lib/animation";

const toc = [
  { label: "01 — Overview", href: "#overview" },
  { label: "02 — What we collect", href: "#what" },
  { label: "03 — How we use it", href: "#how" },
  { label: "04 — Sharing & disclosure", href: "#sharing" },
  { label: "05 — International transfers", href: "#intl" },
  { label: "06 — Retention", href: "#retention" },
  { label: "07 — Your rights", href: "#rights" },
  { label: "08 — Cookies", href: "#cookies" },
  { label: "09 — Children", href: "#children" },
  { label: "10 — Contact", href: "#contact" },
];

const sections = [
  {
    id: "overview",
    kicker: "01 — Overview",
    heading: "What this policy covers.",
    body: "This Privacy Policy explains how Kandella (\u201cKandella\u201d, \u201cwe\u201d, \u201cus\u201d) collects, uses, stores, and discloses personal information when you access our products, websites, and institutional services. It applies globally and complements the regional supplements we publish for specific jurisdictions such as the EU (GDPR), the United Kingdom (UK GDPR), California (CCPA/CPRA), Singapore (PDPA), and Switzerland (revFADP).",
  },
  {
    id: "what",
    kicker: "02 — What we collect",
    heading: "Data gathered at account opening and during trading.",
    body: "We collect identity data (name, date of birth, government identifiers), contact data (email, phone), financial data (source-of-funds disclosures, transaction history), device and telemetry data (IP, device fingerprint, fraud signals), and support interactions. We do not collect private keys or the content of hardware-signed transactions.",
    list: [
      "Identity & KYC documents",
      "Banking, wallet and blockchain-address information",
      "Trading, deposit and withdrawal history",
      "Communications with our support and desk teams",
      "Cookies, session analytics and device fingerprints",
      "Sanctions and adverse-media screening data",
    ],
  },
  {
    id: "how",
    kicker: "03 — How we use it",
    heading: "Lawful basis for processing.",
    body: "We process personal data to provide our services, fulfill regulatory obligations (AML/CFT, sanctions screening, tax reporting), investigate fraud, improve security, and \u2014 with your explicit consent \u2014 tailor product communications. We do not sell your data. We rely on the following lawful bases depending on jurisdiction: contractual necessity, legal obligation, legitimate interest, and consent.",
  },
  {
    id: "sharing",
    kicker: "04 — Sharing & disclosure",
    heading: "Who sees your data, and why.",
    body: "We share personal information with vetted service providers (cloud hosting, KYC vendors, payment rails), affiliates within the Kandella group, auditors, professional advisors, and, where required by law, with regulators and law-enforcement bodies. Every vendor is bound by strict data-processing agreements.",
    list: [
      "KYC and sanctions-screening vendors",
      "Cloud and infrastructure providers (encrypted, region-locked)",
      "Payment rails and banking partners",
      "Regulatory authorities when legally compelled",
      "Internal auditors and external legal counsel",
    ],
  },
  {
    id: "intl",
    kicker: "05 — International transfers",
    heading: "Where your data travels.",
    body: "Where personal data crosses borders, we rely on EU Standard Contractual Clauses, UK International Data Transfer Addenda, or equivalent safeguards recognised in your jurisdiction. We maintain a Transfer Impact Assessment for every destination country.",
  },
  {
    id: "retention",
    kicker: "06 — Retention",
    heading: "How long we keep records.",
    body: "Retention follows the longer of statutory minimums and six years post-closure. Trade-reconstruction records are kept for at least seven years. Anonymous analytics data may be retained indefinitely for product improvement.",
  },
  {
    id: "rights",
    kicker: "07 — Your rights",
    heading: "Access, correction, erasure and portability.",
    body: "Depending on your jurisdiction, you may request access to the personal data we hold, correct inaccuracies, request portability in a machine-readable format, or ask us to restrict processing. Some rights may be limited where we have overriding legal obligations (for example, continued AML record-keeping).",
  },
  {
    id: "cookies",
    kicker: "08 — Cookies",
    heading: "Strictly necessary, analytics and marketing.",
    body: "Strictly-necessary cookies keep the platform functional and are set without consent. Analytics and marketing cookies are opt-in through the consent banner. You can revisit your preferences at any time through the footer link titled \u201cCookie Preferences\u201d.",
  },
  {
    id: "children",
    kicker: "09 — Children",
    heading: "Kandella is not directed at minors.",
    body: "Our products are not intended for use by anyone under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a minor has provided us with personal data, we will take reasonable steps to delete it.",
  },
  {
    id: "contact",
    kicker: "10 — Contact",
    heading: "Reach the Data Protection Office.",
    body: "Questions about this policy, data-subject requests, or incident reports can be directed to our Data Protection Office through the Contact page. We respond to verified requests within 30 days.",
  },
];

const pillars = [
  { icon: <FaShieldAlt />, title: "Sovereign by design", blurb: "You own your account, your data and your keys." },
  { icon: <FaUserLock />, title: "Minimised by default", blurb: "We collect only what we must, and keep it only as long as we must." },
  { icon: <FaGlobe />, title: "Regulated end-to-end", blurb: "Compliant in every jurisdiction we operate in, from the EU to Singapore." },
  { icon: <FaCookieBite />, title: "Cookie-honest", blurb: "Opt-in analytics, never silent tracking." },
  { icon: <FaDatabase />, title: "Encryption everywhere", blurb: "TLS 1.3 in transit, FIPS-validated HSMs at rest." },
  { icon: <FaRegFileAlt />, title: "Auditable", blurb: "Immutable audit trails, quarterly independent review." },
];

export default function PrivacyPolicyPage() {
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
            <span className="text-editorial-kicker">Legal</span>
            <span className="accent-rule" />
          </div>
          <h1 className="leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
            <span className="font-serif-display text-gradient-editorial">Privacy </span>
            <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>policy.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#A9B1C0" }}>
            How Kandella collects, uses, and safeguards your personal data — including cookie
            policies (advertising and security), confidentiality safeguards, and your rights as a
            client across the jurisdictions in which we operate.
          </p>
          <p className="text-xs uppercase" style={{ color: "#6B7280", letterSpacing: "0.2em" }}>
            Effective April 1, 2026
          </p>
        </div>
      </section>

      {/* Principle pillars */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-12"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-8">
          <span className="text-editorial-kicker">Six principles</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
          >
            Privacy is a <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>product choice.</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="card-editorial rounded-2xl p-6 space-y-3"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(212,175,127,0.08)",
                  border: "1px solid rgba(212,175,127,0.22)",
                  color: "#D4AF7F",
                }}
              >
                {p.icon}
              </div>
              <h3 className="font-serif-display text-lg" style={{ color: "#F5F1EA" }}>{p.title}</h3>
              <p className="text-sm" style={{ color: "#A9B1C0" }}>{p.blurb}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Table of contents */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 pb-6"
      >
        <div className="card-editorial rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Table of contents</span>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            {toc.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors duration-200"
                  style={{ color: "#A9B1C0" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#D4AF7F")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#A9B1C0")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Body */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 md:px-12 py-8 space-y-8"
      >
        {sections.map((s, i) => (
          <motion.article
            key={i}
            id={s.id}
            variants={fadeUp}
            className="card-editorial rounded-2xl p-8 sm:p-10 space-y-4 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] uppercase"
                style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}
              >
                {s.kicker}
              </span>
              <span className="w-8 h-px" style={{ background: "rgba(212,175,127,0.4)" }} />
            </div>
            <h2
              className="font-serif-display text-gradient-editorial leading-[1.15]"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}
            >
              {s.heading}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#A9B1C0" }}>
              {s.body}
            </p>
            {s.list && (
              <ul className="space-y-2.5 pt-2">
                {s.list.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#A9B1C0" }}>
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#D4AF7F" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </motion.article>
        ))}

        {/* Pull-quote callout */}
        <motion.blockquote
          variants={fadeIn}
          className="card-editorial rounded-2xl p-10 text-center space-y-4"
          style={{ borderColor: "rgba(212,175,127,0.22)" }}
        >
          <p
            className="font-serif-italic leading-[1.3]"
            style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", color: "#F5F1EA" }}
          >
            &ldquo;Privacy is the default, not a feature you upgrade to.&rdquo;
          </p>
          <p className="text-xs uppercase" style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}>
            — The Kandella Data Protection Office
          </p>
        </motion.blockquote>

        <motion.div variants={fadeIn} className="card-editorial rounded-2xl p-8 text-center space-y-4">
          <p className="text-sm" style={{ color: "#A9B1C0" }}>
            For data-subject requests or incident reports, contact our Data Protection Office.
          </p>
          <Link href="/screens/Contact" className="btn-gold inline-flex px-6 py-2.5 rounded-lg text-sm">
            Contact the DPO
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer
        className="border-t mt-8 py-10"
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
