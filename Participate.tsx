"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Gift, Layers3, Vote, Users } from "lucide-react";

const participateCards = [
  {
    icon: <Gift size={22} />,
    title: "Get FlareDrops",
    description: "Wrap FLR to earn rewards",
    color: "#e6325a",
    href: "#",
  },
  {
    icon: <Layers3 size={22} />,
    title: "Delegate & Stake",
    description: "Boost rewards while contributing to Flare's security",
    color: "#ff4d6a",
    href: "#",
  },
  {
    icon: <Vote size={22} />,
    title: "Vote",
    description: "Participate in transparent, onchain governance",
    color: "#ff6b7a",
    href: "#",
  },
  {
    icon: <Users size={22} />,
    title: "Community",
    description: "Come together, share ideas, and build",
    color: "#ff8a95",
    href: "#",
  },
];

export default function Participate() {
  return (
    <section id="participate" className="py-24 md:py-36 relative">
      <div className="divider-glow mb-24" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-flare-pink font-semibold mb-4">
            Get Involved
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold">
            Participate in Flare
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {participateCards.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group gradient-border"
            >
              <div className="relative p-7 h-full flex flex-col">
                {/* Glow on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
                  style={{
                    background: `radial-gradient(ellipse at center top, ${card.color}10, transparent)`,
                  }}
                />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                    style={{
                      background: `${card.color}12`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold mb-2 group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-flare-muted text-sm leading-relaxed mb-4 flex-1">
                    {card.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: card.color }}>
                    Learn more
                    <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
