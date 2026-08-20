'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn, fadeUp } from '@/lib/animation';
import Navbar from '@/components/Navbar';
import { FaGavel, FaBalanceScale, FaFileContract, FaGlobeEurope } from 'react-icons/fa';

const docs = [
  { region: 'Global', title: 'Terms of Service', href: '/screens/Terms', desc: 'Applies to users unless they reside in Canada or the European Economic Area.' },
  { region: 'Canada', title: 'Canadian Terms of Service', href: '/screens/Terms', desc: 'Separate terms for Canadian residents, reflecting provincial and federal requirements.' },
  { region: 'EEA', title: 'EEA Terms of Service', href: '/screens/Terms', desc: 'Separate terms for residents of the European Economic Area under MiCA and national laws.' },
  { region: 'Risk', title: 'Margin Disclosure Statement', href: '/screens/Terms', desc: 'Formal disclosures regarding the risks inherent in leveraged spot margin trading.' },
  { region: 'Risk', title: 'Risk Disclosure Statement', href: '/screens/Terms', desc: 'Comprehensive risk disclosure for derivatives and other financial instruments.' },
  { region: 'Privacy', title: 'Privacy Notice', href: '/screens/Privacy', desc: 'How we collect, use, and protect personal data — with clear cookie-by-cookie controls.' },
];

export default function LegalPage() {
  return (
    <div style={{ background: '#06090F', color: '#F5F1EA', minHeight: '100vh' }}>
      <Navbar />

      <section className="px-6 md:px-10 pt-32 pb-16 max-w-5xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-5">
            <span style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Legal & Compliance</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', lineHeight: 1.05, fontWeight: 400 }}>
            Plain-English documents.{' '}
            <span style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Region-specific terms.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            The Global Terms of Service governing your relationship with Kandella, with
            region-specific addenda for Canada and the EEA, the Margin Disclosure Statement,
            and full Risk Disclosure for derivatives. Each document is versioned with change
            logs available to clients on request.
          </motion.p>
        </motion.div>
      </section>

      {/* Regulatory footprint */}
      <section className="px-6 md:px-10 py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(212,175,127,0.14)', border: '1px solid rgba(212,175,127,0.18)', borderRadius: 2, overflow: 'hidden' }}>
          {[
            { t: 'FCA · UK', d: 'Financial Conduct Authority' },
            { t: 'ASIC · AU', d: 'Securities & Investments Commission' },
            { t: 'CFTC · US', d: 'Derivatives licensing' },
            { t: 'MiCA · EU', d: 'Markets in Crypto-Assets' },
          ].map((r) => (
            <div key={r.t} style={{ background: '#0A0E17', padding: '28px 24px' }}>
              <div className="text-[10px] uppercase mb-2" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>{r.t}</div>
              <div className="text-sm" style={{ color: '#F5F1EA', fontFamily: 'var(--font-serif-display, Georgia, serif)' }}>{r.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Documents Available</span>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          {docs.map((d) => (
            <motion.div
              key={d.title}
              variants={fadeUp}
              className="group px-6 py-6 flex items-start justify-between gap-6"
              style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }}
            >
              <div className="flex-1">
                <div className="text-[10px] uppercase mb-2" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>{d.region}</div>
                <h3 className="text-xl md:text-2xl mb-2" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, color: '#F5F1EA' }}>
                  {d.title}
                </h3>
                <p className="text-sm" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>{d.desc}</p>
              </div>
              <Link href={d.href} className="flex-shrink-0 px-5 py-2.5 text-[10px] uppercase" style={{ background: 'transparent', border: '1px solid rgba(212,175,127,0.35)', color: '#D4AF7F', letterSpacing: '0.22em', borderRadius: 2 }}>
                Read →
              </Link>
            </motion.div>
          ))}
          <div style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }} />
        </motion.div>
      </section>

      {/* Contact */}
      <section className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
        <div className="px-8 md:px-12 py-10" style={{ background: '#0A0E17', border: '1px solid rgba(212,175,127,0.12)', borderRadius: 2 }}>
          <div className="flex items-center gap-3 mb-4">
            <FaBalanceScale size={14} style={{ color: '#D4AF7F' }} />
            <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>Office of the General Counsel</span>
          </div>
          <h3 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400, lineHeight: 1.2 }}>
            Legal notices and regulatory enquiries.
          </h3>
          <p className="text-sm mb-2" style={{ color: '#A9B1C0', lineHeight: 1.7 }}>
            For formal notices, subpoenas, and compliance inquiries, direct
            correspondence to the Office of the General Counsel at Kandella
            Global Holdings.
          </p>
          <p className="text-sm" style={{ color: '#D4AF7F' }}>legal@cryptotradeprime.io</p>
        </div>
      </section>
    </div>
  );
}
