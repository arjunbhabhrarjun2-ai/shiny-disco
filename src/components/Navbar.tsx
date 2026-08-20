"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

type NavItem = { label: string; href: string; desc?: string };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Company",
    items: [
      { label: "About", href: "/screens/About", desc: "Our story, principles, and leadership." },
      { label: "Culture", href: "/screens/Culture", desc: "How we work — remote-first, craft-oriented." },
      { label: "Blog", href: "/screens/Blog", desc: "Editorial notes from the desks." },
      { label: "Institutional", href: "/screens/Institutional", desc: "For funds, family offices, and treasuries." },
      { label: "Contact", href: "/screens/Contact", desc: "Reach the desks, press, and partnerships." },
    ],
  },
  {
    label: "Products",
    items: [
      { label: "Features", href: "/screens/Features", desc: "The full product surface at a glance." },
      { label: "OTC Trading", href: "/screens/OTC", desc: "Large tickets, quietly filled." },
      { label: "Wallet", href: "/screens/Wallet", desc: "Self-custody, all-in-one." },
      { label: "Futures", href: "/screens/Futures", desc: "Hedge with precision, lever with intent." },
      { label: "Margin", href: "/screens/Margin", desc: "Up to 5× on 230+ pairs." },
      { label: "Custody", href: "/screens/Custody", desc: "Qualified custody with proof of reserves." },
      { label: "Bonds", href: "/screens/Bonds", desc: "Tokenised Treasuries — on-chain yield." },
    ],
  },
  {
    label: "Network",
    items: [
      { label: "ATSO Oracle", href: "/screens/ATSO", desc: "Prices signed by consensus itself." },
      { label: "State Connector", href: "/screens/CTPDC", desc: "Cross-chain state, no trust bridge." },
      { label: "ATAssets", href: "/screens/ATAssets", desc: "Canonical 1:1 tokenised assets." },
      { label: "Stake & Earn", href: "/screens/Stake", desc: "Delegate ATM, earn ATSO rewards." },
      { label: "ATAirdrops", href: "/screens/Airdrops", desc: "24 months, 24.2B tokens." },
      { label: "Kandella+ Membership", href: "/screens/Membership", desc: "Fee waivers, priority desk." },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Learn Center", href: "/screens/Learn", desc: "Editorial crypto education." },
      { label: "Fee Schedule", href: "/screens/Fees", desc: "Spot, futures, and treasury fees." },
      { label: "System Status", href: "/screens/Status", desc: "Live uptime and incident history." },
      { label: "Security", href: "/screens/Security", desc: "How we protect client assets." },
      { label: "Legal & Compliance", href: "/screens/Legal", desc: "Regional terms and disclosures." },
    ],
  },
];

function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 pt-5 pb-2 sm:px-8 md:px-12 relative z-50"
    >
      <div className="max-w-[1440px] mx-auto">
        <div
          className="flex justify-between items-center rounded-2xl px-5 py-3 md:px-7 md:py-3.5 transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(6,9,15,0.92)' : 'rgba(13,19,32,0.55)',
            backdropFilter: 'blur(18px) saturate(150%)',
            WebkitBackdropFilter: 'blur(18px) saturate(150%)',
            border: scrolled ? '1px solid rgba(212,175,127,0.14)' : '1px solid rgba(255,255,255,0.06)',
            boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.55)' : 'none',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Kandella — Home">
            <Logo size={38} wordmarkSize="1.25rem" />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1 text-[13px] font-medium">
            {navGroups.map((group) => {
              const isOpen = openGroup === group.label;
              return (
                <li
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => { cancelClose(); setOpenGroup(group.label); }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    className="relative px-4 py-2 rounded-lg transition-all duration-200 group flex items-center gap-1.5"
                    style={{
                      color: isOpen ? '#F5F1EA' : 'rgba(245,241,234,0.6)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {group.label}
                    <FiChevronDown
                      size={12}
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        color: isOpen ? '#D4AF7F' : 'rgba(245,241,234,0.45)',
                      }}
                    />
                    <span
                      className="absolute bottom-1 left-4 right-4 h-px transition-transform duration-300 origin-left rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #D4AF7F, transparent)',
                        transform: isOpen ? 'scaleX(1)' : 'scaleX(0)',
                      }}
                    />
                  </button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-full mt-3 w-[340px] rounded-2xl overflow-hidden"
                        style={{
                          background: 'rgba(10,14,23,0.97)',
                          backdropFilter: 'blur(22px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(22px) saturate(150%)',
                          border: '1px solid rgba(212,175,127,0.18)',
                          boxShadow: '0 20px 56px rgba(0,0,0,0.6)',
                        }}
                      >
                        <div className="px-5 pt-4 pb-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(212,175,127,0.10)' }}>
                          <span style={{ width: 18, height: 1, background: 'linear-gradient(90deg, transparent 0%, #D4AF7F 100%)' }} />
                          <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.28em' }}>{group.label}</span>
                        </div>
                        <div className="py-2">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpenGroup(null)}
                              className="block px-5 py-3 transition-colors duration-150 group/item"
                              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,127,0.06)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm" style={{ color: '#F5F1EA', fontFamily: 'var(--font-serif-display, Georgia, serif)', fontWeight: 400 }}>
                                  {item.label}
                                </span>
                                <span className="text-[10px]" style={{ color: '#D4AF7F', letterSpacing: '0.2em', opacity: 0.5 }}>→</span>
                              </div>
                              {item.desc && (
                                <div className="text-xs mt-1" style={{ color: '#A9B1C0', lineHeight: 1.5 }}>
                                  {item.desc}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/screens/auth/Signin")}
              className="px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
              style={{
                color: 'rgba(245,241,234,0.78)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F5F1EA'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,241,234,0.78)'; }}
            >
              Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/screens/auth/Signup")}
              className="btn-gold px-5 py-2.5 rounded-lg text-[13px] font-semibold"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition focus:outline-none"
              style={{
                background: 'rgba(212,175,127,0.10)',
                border: '1px solid rgba(212,175,127,0.22)',
                color: '#D4AF7F',
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[78px] left-4 right-4 sm:left-8 sm:right-8 rounded-2xl overflow-hidden z-50 md:hidden max-h-[75vh] overflow-y-auto"
            style={{
              background: 'rgba(10,15,26,0.97)',
              backdropFilter: 'blur(22px) saturate(150%)',
              border: '1px solid rgba(212,175,127,0.14)',
              boxShadow: '0 20px 56px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex flex-col px-3 pt-3 pb-2">
              {navGroups.map((group, gIdx) => {
                const isOpen = mobileGroup === group.label;
                return (
                  <div key={group.label} className="border-b last:border-b-0" style={{ borderColor: 'rgba(212,175,127,0.08)' }}>
                    <button
                      onClick={() => setMobileGroup(isOpen ? null : group.label)}
                      className="w-full px-4 py-3.5 text-base font-medium transition-all duration-150 flex items-center justify-between"
                      style={{ color: isOpen ? '#F5F1EA' : 'rgba(245,241,234,0.75)' }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[10px]" style={{ color: '#D4AF7F', letterSpacing: '0.2em' }}>
                          0{gIdx + 1}
                        </span>
                        {group.label}
                      </span>
                      <FiChevronDown
                        size={14}
                        style={{
                          transition: 'transform 0.2s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                          color: '#D4AF7F',
                        }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="pb-3 pl-10 pr-4 flex flex-col gap-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => { setMenuOpen(false); setMobileGroup(null); }}
                                className="px-3 py-2.5 rounded-lg text-sm transition-colors duration-150"
                                style={{ color: 'rgba(245,241,234,0.68)' }}
                                onTouchStart={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,175,127,0.08)'; }}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <div className="mx-4 divider-gold" />
            <div className="flex flex-col gap-2.5 px-4 py-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setMenuOpen(false); router.push("/screens/auth/Signin"); }}
                className="btn-ghost-gold w-full py-2.5 rounded-lg text-sm font-medium"
              >
                Sign In
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setMenuOpen(false); router.push("/screens/auth/Signup"); }}
                className="btn-gold w-full py-2.5 rounded-lg text-sm font-semibold"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
