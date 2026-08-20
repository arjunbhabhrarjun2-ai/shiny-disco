"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn, slideUp } from "@/lib/animation";

type AccordionItem = {
  id: string | number;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  multiple?: boolean;
  className?: string;
};

export default function Accordion({ items, multiple = false, className = "" }: AccordionProps) {
  const [openIds, setOpenIds] = useState<(string | number)[]>([]);
  const headersRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    headersRef.current = headersRef.current.slice(0, items.length);
  }, [items.length]);

  const isOpen = (id: string | number): boolean => openIds.includes(id);

  const toggle = (id: string | number) => {
    setOpenIds((prev) =>
      multiple
        ? prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        : prev[0] === id ? [] : [id]
    );
  };

  const onHeaderKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number, id: string | number) => {
    const key = e.key;
    const lastIndex = items.length - 1;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) e.preventDefault();
    switch (key) {
      case "ArrowDown": headersRef.current[(index + 1) % items.length]?.focus(); break;
      case "ArrowUp": headersRef.current[(index - 1 + items.length) % items.length]?.focus(); break;
      case "Home": headersRef.current[0]?.focus(); break;
      case "End": headersRef.current[lastIndex]?.focus(); break;
      case "Enter": case " ": toggle(id); break;
    }
  };

  const stepLabels = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(23,34,58,0.35) 0%, rgba(13,19,32,0.65) 100%)',
          border: '1px solid rgba(212,175,127,0.14)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {items.map((item, idx) => {
          const safeId = String(item.id);
          const expanded = isOpen(item.id);

          return (
            <motion.div
              key={safeId}
              variants={fadeIn}
              style={{ borderBottom: idx < items.length - 1 ? '1px solid rgba(212,175,127,0.12)' : 'none' }}
            >
              <h3>
                <motion.button
                  variants={slideUp}
                  type="button"
                  ref={(el: HTMLButtonElement | null) => { headersRef.current[idx] = el; }}
                  id={`head-${safeId}`}
                  onKeyDown={(e) => onHeaderKeyDown(e, idx, item.id)}
                  onClick={() => toggle(item.id)}
                  className="w-full text-left px-6 sm:px-10 py-6 sm:py-8 flex items-center gap-6 justify-between transition-all duration-300 focus:outline-none"
                  style={{
                    background: expanded ? 'rgba(212,175,127,0.04)' : 'transparent',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.outline = '2px solid rgba(212,175,127,0.5)'; e.currentTarget.style.outlineOffset = '-2px'; }}
                  onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
                  onMouseEnter={(e) => { if (!expanded) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { if (!expanded) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span
                      className="font-serif-display flex-shrink-0 text-3xl sm:text-4xl tabular-nums transition-all duration-300"
                      style={{
                        color: expanded ? '#D4AF7F' : 'rgba(212,175,127,0.45)',
                        lineHeight: 1,
                        fontWeight: 400,
                      }}
                    >
                      {stepLabels[idx] ?? String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="w-px h-10 transition-all duration-300"
                      style={{ background: expanded ? 'rgba(212,175,127,0.5)' : 'rgba(212,175,127,0.2)' }}
                    />
                    <span
                      className="font-serif-display text-lg sm:text-xl md:text-2xl leading-snug transition-colors duration-300"
                      style={{ color: expanded ? '#F5F1EA' : 'rgba(245,241,234,0.8)' }}
                    >
                      {item.title}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: expanded ? 'rgba(212,175,127,0.15)' : 'rgba(255,255,255,0.04)',
                      border: expanded ? '1px solid rgba(212,175,127,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: expanded ? '#D4AF7F' : '#A9B1C0',
                    }}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.div>
                </motion.button>
              </h3>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-6 sm:px-10 pl-[5.25rem] sm:pl-[7.5rem] pb-8 pt-1 text-sm sm:text-base leading-relaxed"
                      style={{ color: '#A9B1C0' }}
                    >
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
