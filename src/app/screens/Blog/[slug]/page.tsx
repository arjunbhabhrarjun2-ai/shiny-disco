'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, slideUp, buttonMotion } from '@/lib/animation';
import { FaArrowLeft, FaRegClock, FaLongArrowAltRight, FaQuoteLeft, FaTwitter, FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import { blogPosts } from '../blogData';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '';

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">404 \u00B7 Not Found</span>
            <span className="accent-rule" />
          </div>
          <h1
            className="leading-[1.1] mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            <span className="font-serif-display text-gradient-editorial">Article </span>
            <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>not found.</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: '#A9B1C0' }}>
            The article you are looking for may have been moved or archived.
          </p>
          <motion.button
            {...buttonMotion}
            onClick={() => router.push('/screens/Blog')}
            className="btn-gold px-7 py-3 rounded-lg text-sm inline-flex items-center gap-2"
          >
            <FaArrowLeft size={11} /> Back to Journal
          </motion.button>
        </div>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ background: 'var(--color-bg)', overflowX: 'hidden' }}>
      {/* Hero */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative hero-bg bg-grid-editorial overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${post.categoryColor}14 0%, transparent 70%)`,
              filter: 'blur(80px)',
            }}
          />
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10">
          <motion.div variants={fadeIn}>
            <Navbar />
          </motion.div>

          <div className="px-6 sm:px-10 md:px-16 lg:px-24 max-w-[900px] mx-auto w-full pt-12 pb-16">
            <motion.button
              {...buttonMotion}
              variants={fadeIn}
              onClick={() => router.push('/screens/Blog')}
              className="inline-flex items-center gap-2 text-[11px] uppercase mb-8 transition-colors"
              style={{
                color: '#A9B1C0',
                letterSpacing: '0.22em',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#D4AF7F';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#A9B1C0';
              }}
            >
              <FaArrowLeft size={10} /> Back to Journal
            </motion.button>

            <motion.div variants={slideUp} className="flex items-center gap-3 flex-wrap mb-6">
              <span
                className="text-[10px] uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: `${post.categoryColor}14`,
                  border: `1px solid ${post.categoryColor}3a`,
                  color: post.categoryColor,
                  letterSpacing: '0.22em',
                  fontWeight: 600,
                }}
              >
                {post.category}
              </span>
              <span
                className="text-[10px] uppercase"
                style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
              >
                {post.date}
              </span>
              <span
                className="flex items-center gap-1.5 text-[10px] uppercase"
                style={{ color: '#6B7280', letterSpacing: '0.22em' }}
              >
                <FaRegClock size={9} />
                {post.readTime}
              </span>
            </motion.div>

            <motion.h1
              variants={slideUp}
              className="leading-[1.06] mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                fontFamily: 'var(--font-fraunces), serif',
                fontWeight: 500,
                color: '#F5F1EA',
              }}
            >
              {post.title}
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg sm:text-xl leading-relaxed mb-10"
              style={{
                color: 'rgba(169,177,192,0.9)',
                fontFamily: 'var(--font-fraunces), serif',
                fontStyle: 'normal',
              }}
            >
              {post.excerpt}
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex items-center gap-4 pt-6"
              style={{ borderTop: '1px solid rgba(212,175,127,0.16)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-serif-display text-sm"
                style={{
                  background: 'rgba(212,175,127,0.14)',
                  border: '1px solid rgba(212,175,127,0.35)',
                  color: '#D4AF7F',
                }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm" style={{ color: '#F5F1EA', fontWeight: 500 }}>
                  {post.author}
                </p>
                <p
                  className="text-[10px] uppercase mt-0.5"
                  style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                >
                  {post.authorRole}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                {[FaTwitter, FaLinkedin, FaTelegramPlane].map((Icon, i) => (
                  <a
                    key={i}
                    className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,175,127,0.18)',
                      color: '#A9B1C0',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#D4AF7F';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,127,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#A9B1C0';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,175,127,0.18)';
                    }}
                  >
                    <Icon size={12} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Body */}
      <motion.article
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 sm:px-10 md:px-16 lg:px-24 max-w-[780px] mx-auto w-full py-16 space-y-10"
      >
        {post.body.map((block, i) => {
          if (block.quote) {
            return (
              <motion.blockquote
                key={i}
                variants={fadeIn}
                className="relative py-8 pl-10 pr-6 rounded-2xl"
                style={{
                  background: 'rgba(212,175,127,0.04)',
                  border: '1px solid rgba(212,175,127,0.18)',
                }}
              >
                <FaQuoteLeft
                  className="absolute top-5 left-5"
                  size={18}
                  style={{ color: '#D4AF7F', opacity: 0.8 }}
                />
                <p
                  className="leading-relaxed mb-4 pl-4"
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    fontStyle: 'normal',
                    fontSize: 'clamp(1.125rem, 1.8vw, 1.5rem)',
                    color: '#F5F1EA',
                  }}
                >
                  \u201C{block.quote.text}\u201D
                </p>
                <cite
                  className="block not-italic text-[11px] uppercase pl-4"
                  style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                >
                  \u2014 {block.quote.attribution}
                </cite>
              </motion.blockquote>
            );
          }

          return (
            <motion.div key={i} variants={slideUp} className="space-y-4">
              {block.kicker && (
                <div className="flex items-center gap-3">
                  <span className="accent-rule-solid" />
                  <span className="text-editorial-kicker">{block.kicker}</span>
                </div>
              )}
              {block.heading && (
                <h2
                  className="leading-[1.1]"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    fontFamily: 'var(--font-fraunces), serif',
                    fontWeight: 500,
                    color: '#F5F1EA',
                  }}
                >
                  {block.heading}
                </h2>
              )}
              {block.paragraph && (
                <p
                  className="text-base sm:text-lg leading-[1.85]"
                  style={{ color: '#C7CDD8' }}
                >
                  {block.paragraph}
                </p>
              )}
              {block.list && (
                <ul className="space-y-3 pl-1">
                  {block.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full"
                        style={{
                          background: '#D4AF7F',
                          boxShadow: '0 0 8px rgba(212,175,127,0.4)',
                        }}
                      />
                      <span
                        className="text-base sm:text-lg leading-relaxed"
                        style={{ color: '#C7CDD8' }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          );
        })}

        {/* Tags */}
        <motion.div
          variants={fadeIn}
          className="flex flex-wrap items-center gap-2 pt-8"
          style={{ borderTop: '1px solid rgba(212,175,127,0.14)' }}
        >
          <span
            className="text-[10px] uppercase mr-2"
            style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
          >
            Tags
          </span>
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase px-2.5 py-1 rounded-md"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(212,175,127,0.16)',
                color: '#A9B1C0',
                letterSpacing: '0.18em',
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeIn}
          className="rounded-3xl p-8 sm:p-10 mt-10 text-center"
          style={{
            background: 'linear-gradient(160deg, rgba(23,34,58,0.6) 0%, rgba(11,15,26,0.85) 100%)',
            border: '1px solid rgba(212,175,127,0.22)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Start Trading</span>
            <span className="accent-rule" />
          </div>
          <h3
            className="mb-4"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 500,
              color: '#F5F1EA',
            }}
          >
            Ready to put this into practice?
          </h3>
          <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: '#A9B1C0' }}>
            Open an account and begin building your portfolio with Kandella.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              {...buttonMotion}
              onClick={() => router.push('/screens/auth/Signup')}
              className="btn-gold px-7 py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2"
            >
              Get Started <FaLongArrowAltRight size={12} />
            </motion.button>
            <motion.button
              {...buttonMotion}
              onClick={() => router.push('/investmentPlans')}
              className="btn-ghost-gold px-7 py-3 rounded-lg text-sm"
            >
              View Plans
            </motion.button>
          </div>
        </motion.div>
      </motion.article>

      {/* Related articles */}
      {related.length > 0 && (
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto w-full pb-20"
        >
          <motion.div variants={slideUp} className="flex items-center gap-3 mb-8">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Continue Reading</span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {related.map((p) => (
              <motion.div key={p.slug} variants={slideUp}>
                <Link href={`/screens/Blog/${p.slug}`}>
                  <article
                    className="h-full flex flex-col rounded-3xl p-6 card-editorial overflow-hidden cursor-pointer group relative"
                  >
                    <span
                      className="inline-block w-fit text-[10px] uppercase px-2.5 py-1 rounded-md mb-4"
                      style={{
                        background: `${p.categoryColor}14`,
                        border: `1px solid ${p.categoryColor}3a`,
                        color: p.categoryColor,
                        letterSpacing: '0.22em',
                        fontWeight: 600,
                      }}
                    >
                      {p.category}
                    </span>
                    <h4
                      className="font-serif-display text-lg mb-3 leading-snug"
                      style={{ color: '#F5F1EA' }}
                    >
                      {p.title}
                    </h4>
                    <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#A9B1C0' }}>
                      {p.excerpt}
                    </p>
                    <div
                      className="flex items-center justify-between pt-3 mt-auto"
                      style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }}
                    >
                      <span
                        className="text-[10px] uppercase"
                        style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                      >
                        {p.date}
                      </span>
                      <span
                        className="text-[10px] uppercase inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                        style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                      >
                        Read <FaLongArrowAltRight size={9} />
                      </span>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${p.categoryColor}55, transparent)`,
                      }}
                    />
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer
        style={{
          background: 'linear-gradient(180deg, #0A0F1A 0%, #06090F 100%)',
          borderTop: '1px solid rgba(212,175,127,0.14)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs" style={{ color: '#6B7280' }}>
            &copy; {new Date().getFullYear()} Kandella. All rights reserved.
          </span>
          <span
            className="text-[11px] uppercase"
            style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
          >
            Licensed &amp; Regulated
          </span>
        </div>
      </footer>
    </div>
  );
}
