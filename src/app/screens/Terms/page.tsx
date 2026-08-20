"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaTelegramPlane,
  FaInstagram,
  FaLinkedin,
  FaGavel,
  FaBalanceScale,
  FaFileSignature,
  FaHandshake,
} from "react-icons/fa";
import { staggerContainer, fadeIn, fadeUp, scaleIn } from "@/lib/animation";

const toc = [
  { label: "01 — Acceptance", href: "#acceptance" },
  { label: "02 — Eligibility", href: "#eligibility" },
  { label: "03 — Account responsibilities", href: "#account" },
  { label: "04 — Trading & risk", href: "#risk" },
  { label: "05 — Fees", href: "#fees" },
  { label: "06 — Prohibited conduct", href: "#prohibited" },
  { label: "07 — Intellectual property", href: "#ip" },
  { label: "08 — Liability", href: "#liability" },
  { label: "09 — Termination", href: "#termination" },
  { label: "10 — Changes to terms", href: "#changes" },
  { label: "11 — Governing law", href: "#law" },
  { label: "12 — Notices", href: "#notices" },
];

const sections = [
  {
    id: "acceptance",
    kicker: "01 — Acceptance",
    heading: "By using Kandella, you agree to these terms.",
    body: "These Terms of Service govern your access to the Kandella platform, including web, mobile, and institutional APIs. By opening an account, funding a wallet, or placing an order you accept these terms and the supplemental policies referenced throughout.",
  },
  {
    id: "eligibility",
    kicker: "02 — Eligibility",
    heading: "Who can use the platform.",
    body: "You must be at least 18 years of age, legally capable of entering binding contracts in your jurisdiction, and not a resident of a sanctioned country or a person on any restricted-party list. Certain products \u2014 derivatives, margin, OTC \u2014 require additional eligibility checks and may not be available in your region.",
    list: [
      "Minimum age: 18 years",
      "Valid government-issued identification",
      "Clean sanctions and politically-exposed-person screening",
      "Product-specific suitability for regulated instruments",
    ],
  },
  {
    id: "account",
    kicker: "03 — Account responsibilities",
    heading: "You are the custodian of your credentials.",
    body: "You must safeguard your account credentials, enable multi-factor authentication, and notify us without delay of any suspected unauthorized access. We are not liable for losses arising from credential compromise that we could not have reasonably detected, including SIM-swap attacks on communications outside our control.",
  },
  {
    id: "risk",
    kicker: "04 — Trading & risk",
    heading: "Digital assets are volatile.",
    body: "The value of digital assets can fall as well as rise. Historic performance is not indicative of future results. Leveraged positions can result in losses exceeding initial collateral. You should not trade with funds you cannot afford to lose, and you should seek independent financial advice where appropriate.",
  },
  {
    id: "fees",
    kicker: "05 — Fees",
    heading: "Transparent, published in schedule.",
    body: "Trading, withdrawal, financing, and staking commissions are published in the Fee Schedule and updated from time to time. Kandella commits to 14 days' notice on any material fee increase affecting existing customers.",
  },
  {
    id: "prohibited",
    kicker: "06 — Prohibited conduct",
    heading: "Behaviour that will close an account.",
    body: "Account holders must not engage in market manipulation, layering, spoofing, wash-trading, money laundering, terrorist financing, tax evasion, or circumvention of sanctions. Suspected breaches trigger immediate account freeze, mandatory reporting to competent authorities, and potential permanent termination.",
  },
  {
    id: "ip",
    kicker: "07 — Intellectual property",
    heading: "The Kandella marks and platform are ours.",
    body: "All trademarks, service marks, logos, software, designs, and data feeds that make up the Kandella platform are owned by, or licensed to, Kandella. You may not scrape, reverse-engineer, or republish any part of the platform without written consent.",
  },
  {
    id: "liability",
    kicker: "08 — Liability",
    heading: "Limits of our responsibility.",
    body: "To the maximum extent permitted by law, Kandella's aggregate liability to you is capped at the greater of $500 or the total fees you have paid to us in the preceding twelve months. We exclude liability for indirect, consequential, or lost-opportunity damages.",
  },
  {
    id: "termination",
    kicker: "09 — Termination",
    heading: "Either party may end the relationship.",
    body: "You may close your account at any time, subject to settlement of open positions and completion of regulatory record-keeping. Kandella may suspend or terminate accounts where required by law or where a material breach of these Terms has occurred.",
  },
  {
    id: "changes",
    kicker: "10 — Changes to terms",
    heading: "We notify you in advance.",
    body: "Material changes to these Terms take effect after 30 days' notice delivered to the email associated with your account. Continued use of the platform after the effective date constitutes acceptance of the revised Terms.",
  },
  {
    id: "law",
    kicker: "11 — Governing law",
    heading: "Jurisdiction and dispute resolution.",
    body: "These Terms are governed by the laws of the jurisdiction in which your account is domiciled. Disputes are resolved through binding arbitration under the rules of the applicable financial-services ombudsman, except where statute mandates a specific forum.",
  },
  {
    id: "notices",
    kicker: "12 — Notices",
    heading: "How we stay in touch.",
    body: "All formal notices are delivered electronically to the email of record. You agree to keep that email current and to check it at least once every 30 days. Paper notices are available on request to account holders in jurisdictions that require them.",
  },
];

const principles = [
  { icon: <FaGavel />, title: "Regulated", blurb: "Licensed and supervised in every jurisdiction of operation." },
  { icon: <FaBalanceScale />, title: "Fair", blurb: "Published fee schedule. No silent increases, ever." },
  { icon: <FaFileSignature />, title: "Signed", blurb: "Every change goes into a versioned, auditable log." },
  { icon: <FaHandshake />, title: "Reciprocal", blurb: "Your obligations to us balance ours to you." },
];

export default function TermsOfServicePage() {
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
            <span className="font-serif-display text-gradient-editorial">Terms of </span>
            <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>service.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg" style={{ color: "#A9B1C0" }}>
            The Global Terms of Service governing your use of Kandella products, accounts,
            and APIs — with region-specific addenda for Canada and the EEA, the Margin Disclosure
            Statement, and Risk Disclosure for derivatives trading.
          </p>
          <p className="text-xs uppercase" style={{ color: "#6B7280", letterSpacing: "0.2em" }}>
            Effective April 1, 2026
          </p>
        </div>
      </section>

      {/* Principles */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 md:px-12 py-12"
      >
        <motion.div variants={fadeIn} className="text-center space-y-3 mb-8">
          <span className="text-editorial-kicker">Our principles</span>
          <h2
            className="font-serif-display text-gradient-editorial leading-[1.1]"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
          >
            Contracts, but <span className="font-serif-italic" style={{ color: "#D4AF7F" }}>readable.</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="card-editorial rounded-2xl p-6 space-y-3 text-center"
            >
              <div
                className="w-11 h-11 mx-auto rounded-xl flex items-center justify-center"
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

      {/* TOC */}
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

        <motion.blockquote
          variants={fadeIn}
          className="card-editorial rounded-2xl p-10 text-center space-y-4"
          style={{ borderColor: "rgba(212,175,127,0.22)" }}
        >
          <p
            className="font-serif-italic leading-[1.3]"
            style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)", color: "#F5F1EA" }}
          >
            &ldquo;A good contract protects both sides equally.&rdquo;
          </p>
          <p className="text-xs uppercase" style={{ color: "#D4AF7F", letterSpacing: "0.22em" }}>
            — The Kandella Legal Desk
          </p>
        </motion.blockquote>

        <motion.div variants={fadeIn} className="card-editorial rounded-2xl p-8 text-center space-y-4">
          <p className="text-sm" style={{ color: "#A9B1C0" }}>
            For clarification on any clause in these terms, reach our compliance desk.
          </p>
          <Link href="/screens/Contact" className="btn-gold inline-flex px-6 py-2.5 rounded-lg text-sm">
            Contact Compliance
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
