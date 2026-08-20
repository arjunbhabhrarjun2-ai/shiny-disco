"use client";

import React from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import image1 from "@/app/assets/home/card/cardmg.png";
import image2 from "@/app/assets/home/card/cardimg2.png";
import { staggerContainer, slideInLeft, slideInRight, fadeIn, scaleIn, floating } from "@/lib/animation";

interface HomeCardProps {
  id: number;
  title: string;
  description: string;
  image: any;
  list: { label: string; desc?: string; icon?: React.ReactNode }[];
  button?: { label: string; icon: React.ReactNode };
}

const cardData: HomeCardProps[] = [
  {
    id: 1,
    title: "The Future of Finance",
    description: "User-friendly solutions to help investors of all levels achieve financial success.",
    image: image1,
    list: [
      { label: "Lowest fees in the market", icon: <FaCheck /> },
      { label: "Fast and secure transactions", icon: <FaCheck /> },
      { label: "256-bit secure encryption", icon: <FaCheck /> },
    ],
    button: { label: "Get Started", icon: <FaCheck /> },
  },
  {
    id: 2,
    title: "Expertise You Can Trust",
    description: "User-friendly solutions to help investors of all levels achieve financial success.",
    image: image2,
    list: [
      { label: "15+", desc: "Countries" },
      { label: "$1B+", desc: "Transactions" },
      { label: "650k+", desc: "Active Users" },
      { label: "65+", desc: "Cryptos Supported" },
    ],
  },
];

function HomeCard() {
  const router = useRouter();
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-16 px-6 md:px-16 lg:px-24 space-y-10 max-w-[1400px] mx-auto"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Section header */}
      <motion.div variants={fadeIn} className="text-center space-y-4 mb-6">
        <div className="flex items-center justify-center gap-3">
          <span className="accent-rule" />
          <span className="text-editorial-kicker">Features</span>
          <span className="accent-rule" />
        </div>
        <h2 className="font-serif-display text-gradient-editorial leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Built for serious <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>wealth</span>
        </h2>
      </motion.div>

      {cardData.map((card, index) => (
        <motion.div
          key={card.id}
          variants={fadeIn}
          className={`flex flex-col ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-stretch gap-0 rounded-3xl overflow-hidden card-editorial`}
        >
          {/* Image Panel */}
          <motion.div
            variants={index % 2 === 0 ? slideInLeft : slideInRight}
            className="lg:w-[48%] relative flex items-center justify-center p-10 sm:p-14 min-h-[300px] overflow-hidden"
            style={{
              background: index % 2 === 0
                ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(34,211,238,0.05) 100%)'
                : 'linear-gradient(135deg, rgba(212,175,127,0.10) 0%, rgba(176,138,85,0.04) 100%)',
            }}
          >
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
              style={{ border: '1px dashed rgba(212,175,127,0.18)' }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full"
              style={{ border: '1px solid rgba(212,175,127,0.12)' }}
            />

            {/* Corner editorial marker */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.2em' }}>0{card.id}</span>
              <span className="w-6 h-px" style={{ background: '#D4AF7F' }} />
            </div>

            <motion.div variants={floating} animate="animate" className="relative z-10">
              <Image
                src={card.image}
                alt={card.title}
                className="rounded-2xl object-contain drop-shadow-2xl"
                width={400}
                height={300}
              />
            </motion.div>
          </motion.div>

          {/* Text Panel */}
          <motion.div
            variants={fadeIn}
            className="lg:w-[52%] flex flex-col justify-center px-8 sm:px-12 py-12 space-y-6"
          >
            <motion.span
              variants={fadeIn}
              className="inline-flex w-fit items-center gap-2 text-[11px] font-medium px-3.5 py-1.5 rounded-full uppercase"
              style={{
                background: card.id === 1 ? 'rgba(59,130,246,0.08)' : 'rgba(212,175,127,0.08)',
                border: card.id === 1 ? '1px solid rgba(59,130,246,0.22)' : '1px solid rgba(212,175,127,0.22)',
                color: card.id === 1 ? '#60A5FA' : '#D4AF7F',
                letterSpacing: '0.15em',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: card.id === 1 ? '#3B82F6' : '#D4AF7F' }} />
              {card.id === 1 ? "Platform" : "Our Reach"}
            </motion.span>

            <h2 className="leading-[1.1] font-serif-display text-gradient-editorial" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              {card.title}
            </h2>

            <p className="text-base lg:text-lg leading-relaxed" style={{ color: '#A9B1C0' }}>
              {card.description}
            </p>

            {card.id === 2 ? (
              <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3 pt-2">
                {card.list.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="rounded-2xl px-5 py-5 transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(212,175,127,0.14)',
                    }}
                  >
                    <p className="font-serif-display text-2xl sm:text-3xl text-gradient-champagne tabular-nums">
                      {item.label}
                    </p>
                    <p className="text-[10px] mt-1.5 uppercase" style={{ color: '#6B7280', letterSpacing: '0.18em' }}>{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.ul variants={staggerContainer} className="space-y-3.5">
                {card.list.map((item, i) => (
                  <motion.li key={i} variants={slideInLeft} className="flex items-center gap-3.5">
                    {item.icon && (
                      <span
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[10px]"
                        style={{
                          background: 'rgba(212,175,127,0.10)',
                          border: '1px solid rgba(212,175,127,0.3)',
                          color: '#D4AF7F',
                        }}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="text-sm sm:text-base" style={{ color: '#A9B1C0' }}>
                      {item.label}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {card.button && (
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/screens/auth/Signup")}
                  className="btn-gold inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm"
                >
                  {card.button.label} {card.button.icon}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default HomeCard;
