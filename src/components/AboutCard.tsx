import React from 'react';
import { FaLightbulb, FaLock, FaHandshake, FaCog, FaTrophy, FaHeadset } from "react-icons/fa";

const VALUE_ICONS: [React.ReactNode, string][] = [
  [<FaLightbulb />, '#D4AF7F'],
  [<FaLock />, '#10B981'],
  [<FaHandshake />, '#60A5FA'],
  [<FaCog />, '#22D3EE'],
  [<FaTrophy />, '#D4AF7F'],
  [<FaHeadset />, '#A78BFA'],
];

function AboutCard() {
  const values = [
    {
      title: "Innovative Solutions",
      description: "We stand out by offering unique, high-return investment plans designed for both short-term and long-term growth.",
    },
    {
      title: "Commitment to Security",
      description: "We go above and beyond to protect your funds through advanced encryption and security practices.",
    },
    {
      title: "Integrity",
      description: "We believe in transparency and honesty with our clients. Trust is the foundation of our business.",
    },
    {
      title: "Innovation",
      description: "We continually develop new tools and strategies to help our clients stay ahead of the curve.",
    },
    {
      title: "Excellence",
      description: "We're committed to delivering exceptional service and exceeding expectations every time.",
    },
    {
      title: "Customer Support",
      description: "We're always here to help with setting up accounts, managing investments, and resolving inquiries.",
    },
  ];

  return (
    <section className="px-6 md:px-20 py-24 text-center" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="accent-rule" />
          <span className="text-editorial-kicker">Our Principles</span>
          <span className="accent-rule" />
        </div>
        <h2 className="mb-5 leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          <span className="font-serif-display text-gradient-editorial">Our </span>
          <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>values</span>
        </h2>
        <p className="mb-14 max-w-2xl mx-auto text-sm sm:text-base" style={{ color: '#A9B1C0' }}>
          We are a community of like-minded individuals striving for financial freedom through the power of cryptocurrency.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {values.map((value, i) => {
            const [icon, color] = VALUE_ICONS[i];
            return (
              <div
                key={i}
                className="relative p-8 rounded-3xl text-left card-editorial overflow-hidden"
              >
                {/* Numeric kicker */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300"
                    style={{
                      background: `${color}14`,
                      border: `1px solid ${color}40`,
                      color,
                    }}
                  >
                    {icon}
                  </div>
                  <span className="text-[10px] uppercase" style={{ color, letterSpacing: '0.22em', opacity: 0.7 }}>
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-serif-display text-xl mb-3" style={{ color: '#F5F1EA' }}>
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#A9B1C0' }}>
                  {value.description}
                </p>

                {/* Bottom hairline accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutCard;
