"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Lock } from "lucide-react";

const stats = [
  {
    icon: <Zap size={28} />,
    label: "Fast",
    value: "< 1s",
    description: "Block finality in under one second for lightning-fast transactions",
    gradient: "from-flare-pink via-flare-coral to-flare-salmon",
  },
  {
    icon: <Globe size={28} />,
    label: "Decentralized",
    value: "100+",
    description: "Data Providers with 3.3% maximum stake per provider",
    gradient: "from-flare-coral via-flare-salmon to-flare-pink",
  },
  {
    icon: <Lock size={28} />,
    label: "Secure",
    value: "PoS",
    description: "Proof-of-stake consensus with enshrined protocol security",
    gradient: "from-flare-salmon via-flare-pink to-flare-coral",
  },
];

export default function Stats() {
  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-flare-pink/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-0 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`relative p-10 md:p-14 text-center group ${
                i < stats.length - 1 ? "md:border-r border-white/[0.04]" : ""
              } ${i > 0 ? "border-t md:border-t-0 border-white/[0.04]" : ""}`}
            >
              {/* Hover orb */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-flare-pink/[0.06] blur-[60px]" />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-flare-pink/10 flex items-center justify-center text-flare-pink mb-6 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div
                  className={`font-[family-name:var(--font-display)] text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-3">
                  {stat.label}
                </h3>
                <p className="text-flare-muted text-sm leading-relaxed max-w-xs mx-auto">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
