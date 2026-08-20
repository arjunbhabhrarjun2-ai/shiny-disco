"use client";

import { motion } from "framer-motion";

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background:
              i % 3 === 0
                ? "rgba(230,50,90,0.5)"
                : "rgba(255,255,255,0.15)",
            animation: `float-particle ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      <Particles />

      {/* Radial orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-flare-pink/[0.04] blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-flare-coral/[0.03] blur-[100px]" />

      {/* 3D Sphere shape with CSS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
        <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-flare-pink/10"
              style={{
                transform: `rotateX(${i * 22.5}deg) rotateY(${i * 15}deg)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute inset-0 rounded-full border border-flare-coral/[0.06]"
              style={{
                transform: `rotateY(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-flare-pink/20 rounded-full bg-flare-pink/[0.06] backdrop-blur-sm"
        >
          <div className="w-2 h-2 rounded-full bg-flare-pink animate-pulse" />
          <span className="text-xs font-medium text-flare-salmon tracking-wide uppercase">
            Layer 3 Blockchain
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-8"
        >
          <span className="block">The blockchain</span>
          <span className="block bg-gradient-to-r from-flare-pink via-flare-coral to-flare-salmon bg-clip-text text-transparent">
            for data
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-xl mx-auto text-lg md:text-xl text-flare-muted leading-relaxed mb-12"
        >
          Crypto Trade Prime is a full-stack layer 3 solution designed for data intensive use
          cases. Fast, decentralized, and secure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#developers"
            className="group relative px-8 py-3.5 text-sm font-semibold bg-flare-pink text-white rounded-full transition-all duration-300 hover:shadow-[0_0_32px_rgba(230,50,90,0.5)] hover:bg-flare-coral"
          >
            <span className="relative z-10">Start building</span>
          </a>
          <a
            href="#technology"
            className="px-8 py-3.5 text-sm font-semibold text-white border border-white/10 rounded-full hover:border-flare-pink/40 hover:bg-flare-pink/[0.06] transition-all duration-300"
          >
            Learn more
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-flare-pink"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
