"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Participate", href: "#participate" },
  { label: "Products", href: "#products" },
  { label: "Developers", href: "#developers" },
  { label: "Network", href: "#network" },
  { label: "News & Events", href: "#community" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-flare-darker/70 border-b border-white/[0.04]"
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <circle cx="16" cy="16" r="14" fill="none" stroke="#e6325a" strokeWidth="2" />
              <circle cx="16" cy="16" r="6" fill="#e6325a" />
              <circle cx="16" cy="6" r="2.5" fill="#ff6b7a" />
              <circle cx="24.5" cy="21" r="2.5" fill="#ff6b7a" />
              <circle cx="7.5" cy="21" r="2.5" fill="#ff6b7a" />
            </svg>
            <div className="absolute inset-0 bg-flare-pink/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            flare
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 px-4 py-2 text-sm text-flare-muted hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              {item.label}
              <ChevronDown size={13} className="opacity-40" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#developers"
            className="px-5 py-2 text-sm font-medium bg-flare-pink hover:bg-flare-coral text-white rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(230,50,90,0.4)]"
          >
            Start Building
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-flare-muted hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-flare-darker/95 backdrop-blur-xl border-t border-white/[0.04] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-flare-muted hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#developers"
                  className="block w-full text-center px-5 py-3 text-sm font-medium bg-flare-pink text-white rounded-full"
                >
                  Start Building
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
