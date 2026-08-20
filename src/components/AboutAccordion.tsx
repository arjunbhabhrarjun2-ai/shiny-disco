import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AboutAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Kandella?",
      answer: "Kandella is a high-yield cryptocurrency investment platform that allows users to trade, invest, and grow their digital assets. Our platform provides easy-to-use tools to manage crypto portfolios and earn substantial returns on investments.",
    },
    {
      question: "How do I create an account?",
      answer: "Click the Sign Up button at the top right corner of the website. Fill in your details, complete the verification process, and you're ready to start investing.",
    },
    {
      question: "What cryptocurrencies can I use for deposits and withdrawals?",
      answer: "We support Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and more. Check the deposit section of your account for the full list of supported assets.",
    },
    {
      question: "Is there a minimum deposit required?",
      answer: "Yes, the minimum deposit is $1,000. Please refer to the deposit page for plan-specific details and investment tiers.",
    },
  ];

  return (
    <section className="px-6 md:px-20 py-24 text-center" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="accent-rule" />
          <span className="text-editorial-kicker">FAQ</span>
          <span className="accent-rule" />
        </div>
        <h2 className="mb-4 leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          <span className="font-serif-display text-gradient-editorial">Have a </span>
          <span className="font-serif-italic" style={{ color: '#D4AF7F' }}>question?</span>
        </h2>
        <p className="mb-14 text-sm sm:text-base" style={{ color: '#A9B1C0' }}>
          Everything you need to know about Kandella.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl text-left overflow-hidden transition-all duration-300"
              style={{
                background: open === index
                  ? 'linear-gradient(180deg, rgba(23,34,58,0.5) 0%, rgba(13,19,32,0.7) 100%)'
                  : 'rgba(13,19,32,0.4)',
                border: open === index
                  ? '1px solid rgba(212,175,127,0.35)'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full flex justify-between items-center p-7 text-left transition-colors duration-200 gap-6"
                style={{ background: 'transparent' }}
              >
                <div className="flex items-center gap-5 min-w-0">
                  <span className="font-serif-display text-lg tabular-nums flex-shrink-0" style={{ color: open === index ? '#D4AF7F' : 'rgba(212,175,127,0.5)' }}>
                    0{index + 1}
                  </span>
                  <span className="font-serif-display text-base sm:text-lg" style={{ color: open === index ? '#F5F1EA' : 'rgba(245,241,234,0.85)' }}>
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: open === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: open === index ? 'rgba(212,175,127,0.14)' : 'rgba(255,255,255,0.04)',
                    border: open === index ? '1px solid rgba(212,175,127,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: open === index ? '#D4AF7F' : '#A9B1C0',
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-7 pl-[4.25rem]">
                      <p className="text-sm leading-relaxed" style={{ color: '#A9B1C0' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutAccordion;
