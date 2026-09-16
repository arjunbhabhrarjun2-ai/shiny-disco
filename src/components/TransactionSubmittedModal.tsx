'use client';

/**
 * TransactionSubmittedModal
 * ─────────────────────────────────────────────────────────────────────────
 * The acknowledgement shown after a deposit or withdrawal has been submitted.
 * A submission is asynchronous from the user's point of view (the money does
 * not move until review/confirmations), so the flow ends with an explicit
 * confirmation instead of a toast that auto-dismisses: the user reads what was
 * submitted, then presses Okay, which hands control back to the caller (both
 * flows send the user to the dashboard).
 *
 * Rendered through a portal so it is never clipped or repositioned by page
 * scroll containers, and above the shell chrome (sidebar z-40, header z-30).
 * Escape and a backdrop click acknowledge too — neither can lose data because
 * the request has already been accepted by the API.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export interface SubmittedDetail {
  label: string;
  value: string;
  /** Render the value in the app's tabular mono face (amounts, hashes). */
  mono?: boolean;
}

interface Props {
  open: boolean;
  title: string;
  message: string;
  /** Optional label/value rows summarising what was submitted. */
  details?: SubmittedDetail[];
  footnote?: string;
  actionLabel?: string;
  /** Fired by the Okay button, the backdrop or Escape. */
  onClose: () => void;
}

export default function TransactionSubmittedModal({
  open,
  title,
  message,
  details,
  footnote,
  actionLabel = 'Okay',
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const okRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  /* Lock page scroll + close on Escape while open. */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  /* Move focus into the dialog once it is on screen. */
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => okRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-3xl relative overflow-hidden"
            style={{
              background: 'rgba(20,22,27,0.96)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(212,175,127,0.28)',
              boxShadow: '0 30px 80px -24px rgba(0,0,0,0.9)',
              maxHeight: '92vh',
            }}
          >
            <div
              aria-hidden
              className="absolute -top-20 -right-16 w-52 h-52 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,200,83,0.20) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />

            <div className="relative px-6 py-7 sm:px-8 sm:py-8 overflow-y-auto" style={{ maxHeight: '92vh' }}>
              <div className="flex flex-col items-center text-center">
                <span
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.35)', color: '#00C853' }}
                >
                  <FaCheckCircle size={24} />
                </span>
                <h2 id={titleId} className="mt-5 text-xl font-black tracking-tight" style={{ color: '#F5F1EA' }}>
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#8F9BB3' }}>
                  {message}
                </p>
              </div>

              {!!details?.length && (
                <div
                  className="mt-6 rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(0,0,0,0.30)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {details.map((d, i) => (
                    <div
                      key={d.label}
                      className="flex items-start justify-between gap-4 px-4 py-3"
                      style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : undefined}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: '#5A6578' }}>
                        {d.label}
                      </span>
                      <span
                        className={`text-xs font-bold text-right min-w-0 ${d.mono ? 'font-mono' : ''}`}
                        style={{ color: '#F5F1EA', overflowWrap: 'anywhere' }}
                      >
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {footnote && (
                <p className="mt-4 text-[11px] text-center leading-relaxed" style={{ color: '#5A6578' }}>
                  {footnote}
                </p>
              )}

              <button
                ref={okRef}
                type="button"
                onClick={onClose}
                className="mt-6 w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.25em] text-white active:scale-[0.98] transition-all luxe-grad-purple-pink luxe-neumorphic focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7F]"
              >
                {actionLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
