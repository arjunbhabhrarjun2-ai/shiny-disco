'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, slideUp, buttonMotion } from '@/lib/animation';
import { FaLongArrowAltRight, FaRegClock, FaInstagram, FaLinkedin, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import { blogPosts } from './blogData';

const ALL_CATEGORIES = 'All';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);

  const categories = [
    ALL_CATEGORIES,
    ...Array.from(new Set(blogPosts.map((p) => p.category))),
  ];

  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const recent = blogPosts.filter((p) => p.slug !== featured.slug);

  const filtered =
    activeCategory === ALL_CATEGORIES
      ? recent
      : recent.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: 'var(--color-bg)', overflowX: 'hidden' }}>
      {/* ─── HERO ───────────────────────────────────────────── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative min-h-[80vh] hero-bg bg-grid-editorial overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -24, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,127,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 -right-40 w-[560px] h-[560px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(96,126,234,0.06) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col"
        >
          <motion.div variants={fadeIn}>
            <Navbar />
          </motion.div>

          <div className="px-6 sm:px-10 md:px-16 lg:px-24 max-w-[1400px] mx-auto w-full pt-16 pb-20">
            <motion.div variants={slideUp} className="flex items-center gap-3 mb-6">
              <span className="accent-rule-solid" />
              <span className="text-editorial-kicker">Journal · Research · Desk Notes</span>
            </motion.div>

            <motion.h1
              variants={slideUp}
              className="leading-[1.02] tracking-tight max-w-4xl"
              style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)', fontWeight: 400 }}
            >
              <span className="font-serif-display text-gradient-editorial">The Kandella </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>Journal.</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-base sm:text-lg leading-relaxed mt-6 max-w-xl"
              style={{ color: 'rgba(169,177,192,0.85)' }}
            >
              Protocol research, market outlooks and field notes from the desk. Long-form writing on the infrastructure,
              tokenomics and trading strategy that power Kandella.
            </motion.p>

            {/* Category chips */}
            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-2 mt-10">
              {categories.map((c) => {
                const isActive = c === activeCategory;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className="text-[11px] uppercase px-4 py-2 rounded-full transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(212,175,127,0.14)' : 'rgba(255,255,255,0.02)',
                      border: isActive
                        ? '1px solid rgba(212,175,127,0.5)'
                        : '1px solid rgba(212,175,127,0.14)',
                      color: isActive ? '#D4AF7F' : '#A9B1C0',
                      letterSpacing: '0.22em',
                      fontWeight: 600,
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* ─── FEATURED POST ──────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto w-full pb-16"
      >
        <motion.div variants={slideUp} className="flex items-center gap-3 mb-6">
          <span className="accent-rule-solid" />
          <span className="text-editorial-kicker">Editor\u2019s Pick</span>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Link href={`/screens/Blog/${featured.slug}`}>
            <article
              className="relative overflow-hidden rounded-3xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 p-8 sm:p-12 transition-all duration-300 cursor-pointer group"
              style={{
                background: 'linear-gradient(160deg, rgba(23,34,58,0.6) 0%, rgba(11,15,26,0.85) 100%)',
                border: '1px solid rgba(212,175,127,0.22)',
              }}
            >
              <div
                className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    'radial-gradient(circle, rgba(212,175,127,0.16) 0%, transparent 70%)',
                  filter: 'blur(90px)',
                }}
              />

              <div className="relative flex flex-col justify-between space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[10px] uppercase px-3 py-1.5 rounded-full"
                    style={{
                      background: `${featured.categoryColor}14`,
                      border: `1px solid ${featured.categoryColor}3a`,
                      color: featured.categoryColor,
                      letterSpacing: '0.22em',
                      fontWeight: 600,
                    }}
                  >
                    {featured.category}
                  </span>
                  <span
                    className="text-[10px] uppercase"
                    style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                  >
                    {featured.date}
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-[10px] uppercase"
                    style={{ color: '#6B7280', letterSpacing: '0.22em' }}
                  >
                    <FaRegClock size={9} />
                    {featured.readTime}
                  </span>
                </div>

                <h2
                  className="leading-[1.08] transition-colors"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                    fontFamily: 'var(--font-fraunces), serif',
                    fontWeight: 500,
                    color: '#F5F1EA',
                  }}
                >
                  {featured.title}
                </h2>

                <p
                  className="text-base leading-relaxed max-w-lg"
                  style={{ color: '#A9B1C0' }}
                >
                  {featured.excerpt}
                </p>

                <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid rgba(212,175,127,0.14)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-serif-display text-sm"
                    style={{
                      background: 'rgba(212,175,127,0.14)',
                      border: '1px solid rgba(212,175,127,0.35)',
                      color: '#D4AF7F',
                    }}
                  >
                    {featured.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#F5F1EA', fontWeight: 500 }}>
                      {featured.author}
                    </p>
                    <p
                      className="text-[10px] uppercase"
                      style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                    >
                      {featured.authorRole}
                    </p>
                  </div>
                  <span
                    className="ml-auto inline-flex items-center gap-2 text-[11px] uppercase px-4 py-2 rounded-full transition-transform group-hover:translate-x-1"
                    style={{
                      color: '#D4AF7F',
                      letterSpacing: '0.22em',
                      fontWeight: 600,
                      border: '1px solid rgba(212,175,127,0.35)',
                    }}
                  >
                    Read <FaLongArrowAltRight size={11} />
                  </span>
                </div>
              </div>

              <div className="relative flex items-center justify-center min-h-[260px]">
                <div
                  className="relative w-full h-full min-h-[240px] rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, rgba(212,175,127,0.25) 0%, rgba(10,15,26,0.95) 70%)',
                    border: '1px solid rgba(212,175,127,0.22)',
                  }}
                >
                  <div
                    className="font-serif-display"
                    style={{
                      fontSize: 'clamp(5rem, 12vw, 9rem)',
                      background: 'linear-gradient(135deg, #D4AF7F 0%, #E8D3B0 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      opacity: 0.8,
                    }}
                  >
                    A
                  </div>
                  <motion.div
                    aria-hidden
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-6 rounded-full pointer-events-none"
                    style={{ border: '1px dashed rgba(212,175,127,0.3)' }}
                  />
                  <motion.div
                    aria-hidden
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-12 rounded-full pointer-events-none"
                    style={{ border: '1px solid rgba(96,126,234,0.22)' }}
                  />
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      </motion.section>

      {/* ─── ARTICLES GRID ──────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto w-full pb-20"
      >
        <motion.div variants={slideUp} className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Latest</span>
          </div>
          <span className="text-[11px] uppercase" style={{ color: '#6B7280', letterSpacing: '0.22em' }}>
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </span>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            variants={fadeIn}
            className="rounded-2xl p-16 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,175,127,0.16)',
            }}
          >
            <p className="font-serif-display text-2xl mb-2" style={{ color: '#F5F1EA' }}>
              No articles in this category yet
            </p>
            <p className="text-sm" style={{ color: '#A9B1C0' }}>
              Try a different filter \u2014 more coverage is on the way.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post, idx) => (
              <motion.div key={post.slug} variants={slideUp}>
                <Link href={`/screens/Blog/${post.slug}`}>
                  <article
                    className="relative h-full flex flex-col rounded-3xl p-7 card-editorial overflow-hidden cursor-pointer transition-all duration-300 group"
                  >
                    <span
                      className="absolute top-5 right-6 text-[10px] uppercase tabular-nums"
                      style={{ letterSpacing: '0.22em', color: 'rgba(212,175,127,0.5)' }}
                    >
                      0{idx + 1} / {String(filtered.length).padStart(2, '0')}
                    </span>

                    <span
                      className="inline-block w-fit text-[10px] uppercase px-2.5 py-1 rounded-md mb-5"
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

                    <h3
                      className="font-serif-display text-xl mb-3 leading-snug transition-colors group-hover:text-[#E8D3B0]"
                      style={{ color: '#F5F1EA' }}
                    >
                      {post.title}
                    </h3>

                    <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: '#A9B1C0' }}>
                      {post.excerpt}
                    </p>

                    <div
                      className="flex items-center justify-between pt-4 mt-auto"
                      style={{ borderTop: '1px solid rgba(212,175,127,0.12)' }}
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px]" style={{ color: '#F5F1EA', fontWeight: 500 }}>
                          {post.author}
                        </span>
                        <span
                          className="text-[10px] uppercase mt-0.5"
                          style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}
                        >
                          {post.date}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-[10px] uppercase"
                        style={{ color: '#6B7280', letterSpacing: '0.22em' }}
                      >
                        <FaRegClock size={9} />
                        {post.readTime}
                      </span>
                    </div>

                    <div
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${post.categoryColor}60, transparent)`,
                      }}
                    />
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ─── NEWSLETTER ─────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="py-20 px-6 md:px-16"
        style={{ background: 'var(--color-bg)' }}
      >
        <motion.div
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center rounded-3xl p-10 sm:p-14"
          style={{
            background: 'linear-gradient(160deg, rgba(23,34,58,0.55) 0%, rgba(11,15,26,0.85) 100%)',
            border: '1px solid rgba(212,175,127,0.22)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="accent-rule" />
            <span className="text-editorial-kicker">Subscribe</span>
            <span className="accent-rule" />
          </div>
          <h2
            className="leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
          >
            <span className="font-serif-display text-gradient-editorial">Research in your </span>
            <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>inbox.</span>
          </h2>
          <p className="text-sm sm:text-base mb-8 max-w-lg mx-auto" style={{ color: '#A9B1C0' }}>
            The Kandella Journal is published weekly. Subscribe for protocol research, market outlooks and field notes.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing! We\u2019ll be in touch.');
            }}
            className="flex flex-col sm:flex-row items-center gap-3 justify-center"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full sm:w-80 px-5 py-3 rounded-lg text-sm transition-all duration-200"
              style={{
                background: 'rgba(13,19,32,0.8)',
                border: '1px solid rgba(212,175,127,0.22)',
                color: '#F5F1EA',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,127,0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,127,0.22)';
              }}
            />
            <motion.button
              {...buttonMotion}
              type="submit"
              className="btn-gold px-6 py-3 rounded-lg text-sm whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </motion.section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
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
          <div className="flex gap-3">
            {[FaTwitter, FaTelegramPlane, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
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
        </div>
      </footer>
    </div>
  );
}
