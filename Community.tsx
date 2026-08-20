"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, AtSign, MessageCircle } from "lucide-react";

const communityEvents = [
  { title: "ETHGlobal Brussels", gradient: "from-flare-pink/30 to-flare-dark" },
  { title: "Flare [Dev] Meetup: Bangalore", gradient: "from-flare-coral/30 to-flare-dark" },
  { title: "Flare x Google Hackathon Berkeley", gradient: "from-flare-salmon/30 to-flare-dark" },
  { title: "ETH London Hackathon", gradient: "from-flare-pink/20 to-flare-dark" },
  { title: "Korean Blockchain Week", gradient: "from-flare-coral/20 to-flare-dark" },
  { title: "Token2049 Singapore", gradient: "from-flare-salmon/20 to-flare-dark" },
];

const socialStats = [
  { icon: <AtSign size={18} />, label: "Twitter followers", value: "300k+", href: "#" },
  { icon: <MessageCircle size={18} />, label: "Telegram members", value: "40k+", href: "#" },
];

export default function Community() {
  return (
    <section id="community" className="py-24 md:py-36 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-flare-pink/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-flare-pink font-semibold mb-4">
            Events & Community
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold mb-4">
            Community
          </h2>
          <p className="text-flare-muted text-lg max-w-xl mx-auto">
            Join us at events across the globe and become part of the growing
            Flare ecosystem.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-12">
          {communityEvents.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                i === 0 || i === 5 ? "md:col-span-2 aspect-[2/1]" : "aspect-square"
              }`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${event.gradient}`} />
              <div className="absolute inset-0 bg-[#111] opacity-60" />

              {/* Decorative dots */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex gap-2">
                  {Array.from({ length: 3 + (i % 3) }).map((_, j) => (
                    <div
                      key={j}
                      className="w-2 h-2 rounded-full bg-flare-pink/40"
                      style={{ animationDelay: `${j * 0.2}s` }}
                    />
                  ))}
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-sm md:text-base font-bold text-white/90 group-hover:text-white transition-colors">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-flare-pink/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Social Stats & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          {socialStats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="group flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-flare-pink/10 flex items-center justify-center text-flare-pink group-hover:bg-flare-pink/20 transition-colors">
                {stat.icon}
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-flare-pink">
                  {stat.value}
                </div>
                <div className="text-xs text-flare-muted">{stat.label}</div>
              </div>
            </a>
          ))}

          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-flare-pink text-white rounded-full hover:bg-flare-coral transition-all hover:shadow-[0_0_24px_rgba(230,50,90,0.4)]"
          >
            View All Upcoming Events
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
