"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-24 md:py-36 relative">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-flare-pink/[0.12] via-flare-dark to-flare-coral/[0.08]" />
          <div className="absolute inset-0 bg-[#0c0c0c]/80" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-flare-pink/[0.08] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-flare-coral/[0.06] blur-[100px] pointer-events-none" />

          {/* Border glow */}
          <div className="absolute inset-0 rounded-3xl border border-flare-pink/[0.12]" />

          {/* Decorative orbs */}
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full border border-flare-pink/10 opacity-40" />
          <div className="absolute top-14 right-14 w-12 h-12 rounded-full border border-flare-coral/10 opacity-30" />
          <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full border border-flare-salmon/10 opacity-30" />

          {/* Content */}
          <div className="relative z-10 px-8 md:px-16 py-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold mb-5">
                Subscribe to the
                <br />
                <span className="bg-gradient-to-r from-flare-pink via-flare-coral to-flare-salmon bg-clip-text text-transparent">
                  Flare Newsletter
                </span>
              </h2>
              <p className="text-flare-muted text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Join over 30,000 Flare community members. Sign up today to hear
                the latest on product releases, ecosystem announcements, and
                global events.
              </p>

              {/* Email form */}
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-5 py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm text-white placeholder:text-flare-dim focus:outline-none focus:border-flare-pink/40 focus:ring-1 focus:ring-flare-pink/20 transition-all"
                  />
                </div>
                <button className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-flare-pink text-white text-sm font-semibold rounded-full hover:bg-flare-coral transition-all duration-300 hover:shadow-[0_0_32px_rgba(230,50,90,0.5)]">
                  Subscribe
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
