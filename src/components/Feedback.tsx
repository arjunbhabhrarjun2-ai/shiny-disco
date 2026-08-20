"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";
import image1 from "@/app/assets/feedback/man.png";
import image2 from "@/app/assets/feedback/woman.png";
import image3 from "@/app/assets/feedback/feed.png";
import { FaQuoteRight } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, slideUp, fadeIn, scaleIn, cardHover, buttonMotion } from "@/lib/animation";

interface FeedbackProps {
  id: number;
  image: StaticImport;
  icon: React.ReactNode;
  title: string;
  desc: string;
  name: string;
}

const feedbackData: FeedbackProps[] = [
  {
    id: 1,
    image: image1,
    icon: <FaQuoteRight />,
    title: "The perfect platform",
    desc: "Since joining Kandella, my portfolio has grown significantly. The expert advice and 24/7 support really set them apart. Highly recommended for anyone serious about crypto investing.",
    name: "John Carter",
  },
  {
    id: 2,
    image: image2,
    icon: <FaQuoteRight />,
    title: "Reliable and transparent",
    desc: "I was new to cryptocurrency, but Kandella made everything so simple. Their customer support team was incredibly helpful, and now I'm seeing consistent returns on my investments.",
    name: "Sophie Moore",
  },
  {
    id: 3,
    image: image3,
    icon: <FaQuoteRight />,
    title: "They exceeded my expectations",
    desc: "I started with the Starter Plan just to test the waters, and I was blown away by the returns. The platform is super easy to use, and I love being able to withdraw my earnings anytime without any issues.",
    name: "Mett Cannon",
  },
];

function Feedback() {
  const router = useRouter();

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-24 px-6 sm:px-10 md:px-16 lg:px-24"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
        >
          <div className="space-y-5">
            <motion.div variants={fadeIn} className="flex items-center gap-3">
              <span className="accent-rule-solid" />
              <span className="text-editorial-kicker">Testimonials</span>
            </motion.div>

            <motion.h1
              variants={slideUp}
              className="leading-[1.05] text-left"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
            >
              <span className="font-serif-display text-gradient-editorial">What our </span>
              <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>users</span>
              <span className="font-serif-display text-gradient-editorial"> say</span>
            </motion.h1>
          </div>

          <motion.button
            {...buttonMotion}
            variants={fadeIn}
            className="btn-gold flex-shrink-0 px-7 py-3 rounded-lg text-sm"
            onClick={() => router.push("/screens/auth/Signup")}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Feedback Cards */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {feedbackData.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={scaleIn}
              {...cardHover}
              className="relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden card-editorial"
            >
              {/* Gold quote mark (large, decorative) */}
              <div
                className="absolute top-4 right-5 font-serif-display pointer-events-none select-none"
                style={{
                  fontSize: '6rem',
                  lineHeight: '1',
                  color: 'rgba(212,175,127,0.1)',
                  fontStyle: 'normal',
                }}
              >
                "
              </div>

              {/* Glow accent */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(212,175,127,0.08) 0%, transparent 70%)' }}
              />

              {/* Card number */}
              <div className="flex items-center justify-between mb-6 relative">
                <span className="text-[10px] uppercase" style={{ color: '#D4AF7F', letterSpacing: '0.22em' }}>
                  0{idx + 1} / 03
                </span>
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full text-sm"
                  style={{
                    background: 'rgba(212,175,127,0.08)',
                    border: '1px solid rgba(212,175,127,0.25)',
                    color: '#D4AF7F',
                  }}
                >
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5 relative">
                <h3 className="font-serif-display text-xl leading-snug" style={{ color: '#F5F1EA' }}>
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: '#A9B1C0' }}>
                  {item.desc}
                </p>

                <div className="divider-gold" />

                {/* Author */}
                <div className="flex items-center gap-3 pt-1">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '1px solid rgba(212,175,127,0.3)' }}
                  >
                    <Image
                      className="w-full h-full object-cover"
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F5F1EA' }}>
                      {item.name}
                    </p>
                    <p className="text-[10px] uppercase mt-0.5" style={{ color: '#D4AF7F', letterSpacing: '0.18em' }}>
                      Verified Investor
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Feedback;
