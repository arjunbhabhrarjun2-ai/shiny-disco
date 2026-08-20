"use client";

import { motion } from "framer-motion";
import { Shield, Cpu, Layers } from "lucide-react";

const techFeatures = [
  {
    icon: <Layers size={24} />,
    title: "Enshrined Data Protocols",
    description:
      "Flare's protocols are integrated into the blockchain's core, and inherit the economic security of the entire network.",
    gradient: "from-flare-pink/20 to-transparent",
  },
  {
    icon: <Cpu size={24} />,
    title: "Ethereum Virtual Machine",
    description:
      "Flare is EVM compatible with out-of-the-box support for all your favorite tooling and development frameworks.",
    gradient: "from-flare-coral/20 to-transparent",
  },
  {
    icon: <Shield size={24} />,
    title: "Flare Stake",
    description:
      "Flare uses a proof-of-stake mechanism to ensure a significant and consistent level of economic security.",
    gradient: "from-flare-salmon/20 to-transparent",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Technology() {
  return (
    <section id="technology" className="py-24 md:py-36 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-flare-pink/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-flare-pink font-semibold mb-4">
            Foundational technology
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold leading-tight max-w-xl">
            Built different.
            <br />
            <span className="text-flare-muted">By design.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5"
        >
          {techFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="gradient-border group cursor-default"
            >
              <div className="relative p-8 md:p-10 h-full">
                {/* Hover glow */}
                <div
                  className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-flare-pink/10 flex items-center justify-center text-flare-pink mb-6 group-hover:bg-flare-pink/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-flare-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Protocol tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mt-14"
        >
          {["FTSO", "Enshrined Data Protocols", "FAssets", "FDC", "EVM", "FlareStake"].map(
            (tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 text-xs font-medium text-flare-muted border border-white/[0.06] rounded-full bg-white/[0.02] hover:border-flare-pink/30 hover:text-flare-salmon transition-all cursor-default"
              >
                {tag}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
