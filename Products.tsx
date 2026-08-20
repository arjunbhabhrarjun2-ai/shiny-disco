"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const products = [
  {
    tag: "FAssets",
    title: "FAssets",
    description: "Securely explore XRPfi, BTCfi and DOGEfi with trustless cross-chain asset bridging.",
    color: "#e6325a",
    href: "#",
  },
  {
    tag: "FDC",
    title: "Flare Data Connector",
    description:
      "Reliably access external blockchain events and real-world APIs with cryptographic proofs.",
    color: "#ff4d6a",
    href: "#",
  },
  {
    tag: "FTSO",
    title: "Time Series Oracle",
    description:
      "Easily integrate fast, secure, and decentralized price feeds into your dApps.",
    color: "#ff6b7a",
    href: "#",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-24 md:py-36 relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-flare-pink/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left column - header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-flare-pink font-semibold mb-4">
              Enshrined data protocols
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold leading-tight mb-6">
              New Use Cases
            </h2>
            <p className="text-flare-muted text-lg leading-relaxed max-w-md">
              Flare&apos;s enshrined data protocols open up entirely new
              categories of decentralized applications.
            </p>
          </motion.div>

          {/* Right column - product cards */}
          <div className="space-y-5">
            {products.map((product, i) => (
              <motion.a
                key={product.tag}
                href={product.href}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                viewport={{ once: true }}
                className="group block gradient-border"
              >
                <div className="relative p-8 md:p-10">
                  {/* Hover accent line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: product.color }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `${product.color}15`,
                            color: product.color,
                          }}
                        >
                          {product.tag.slice(0, 2).toUpperCase()}
                        </div>
                        <span
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: product.color }}
                        >
                          {product.tag}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-flare-muted text-sm leading-relaxed max-w-md">
                        {product.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="flex-shrink-0 text-flare-dim group-hover:text-flare-pink transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
