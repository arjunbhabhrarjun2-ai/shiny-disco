"use client";

import { motion } from "framer-motion";

const partners = [
  "Elliptic",
  "LayerZero",
  "Hypernative",
  "Ankr",
  "Arkham",
  "Hex Trust",
  "QuickNode",
  "Chainlink",
];

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center h-12 px-8 mx-4 text-flare-dim hover:text-flare-muted transition-colors duration-300">
      <span className="font-[family-name:var(--font-display)] text-lg md:text-xl font-semibold tracking-wide whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function Partners() {
  const doubled = [...partners, ...partners];

  return (
    <section className="py-16 md:py-24 border-t border-b border-white/[0.04] bg-flare-darker/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-sm text-flare-muted uppercase tracking-[0.2em] font-medium">
          Building with the best
        </p>
      </motion.div>

      <div className="relative marquee-track overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-flare-darker/50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-flare-darker/50 to-transparent pointer-events-none" />

        <div className="flex animate-scroll-left">
          {doubled.map((name, i) => (
            <PartnerLogo key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
