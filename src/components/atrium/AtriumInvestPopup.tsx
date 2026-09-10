'use client';

/**
 * ATRIUM — "Invest now" popup ad.
 * ────────────────────────────────────────────────────────────────────────────
 * The designer's drop-in file (atrium-invest-popup.html) ships three blocks.
 * They are split here into the shape React wants:
 *
 *   ./atrium-invest-popup.css  ← block 1, verbatim (both woff2 fonts stay
 *                                inlined as data URIs — no remote request)
 *   this file                  ← blocks 2 and 3: the `.atr-overlay` markup is a
 *                                JSX tree and the vanilla <script> is a set of
 *                                effects/closures
 *
 * The markup is deliberately JSX rather than an HTML string injected with
 * `dangerouslySetInnerHTML`: React re-applies injected HTML on every re-render
 * of the host page, and the dashboard re-renders constantly (live ticker, SWR
 * polls, progress bars), which would detach the overlay and drop the `is-open`
 * class set on it. As JSX, the class is derived from state and survives.
 *
 * Behavioural differences from the drop-in:
 *   · the shipped script waited 900 ms on every page load and remembered a
 *     dismissal for 24 h; here the ad waits OPEN_DELAY_MS after the dashboard
 *     becomes usable and runs once per browser session per user
 *     (sessionStorage), so a new session — or a new tab — shows it again.
 *   · `.atr-stats`, the footer bar and the wallet row are empty in the supplied
 *     file; they are kept exactly as supplied.
 *
 * Mounted by src/app/dashboard/page.tsx, so it only ever runs for a signed-in
 * user who has reached the dashboard.
 *
 * Manual control (browser console):
 *   window.atriumInvestPopup.open()   // show it now
 *   window.atriumInvestPopup.close()  // hide it
 *   window.atriumInvestPopup.reset()  // clear the session flag + re-arm the 10 s timer
 *
 * Events dispatched on `window`: `atrium:popup-open`, `atrium:popup-close`,
 * `atrium:invest` (detail: { source: 'popup' }).
 */

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './atrium-invest-popup.css';

/* ── Tunables ────────────────────────────────────────────────────────────── */

/** How long the dashboard stays on screen before the ad slides in. */
const OPEN_DELAY_MS = 10_000;

/**
 * Where "Invest now" sends the visitor.
 *
 * The supplied design ships `href="#how-to-buy"`, a placeholder. While this is
 * `null` the click is intercepted (no dead hash jump), the `atrium:invest`
 * event still fires, and nothing navigates. Paste the external ATRIUM buy/swap
 * URL here when it is available — it then opens in a new tab.
 */
const INVEST_URL: string | null = null;

/** Set once the ad has run, so it appears once per browser session. */
const SESSION_KEY = 'atrium.investPopup.shown';

const sessionKeyFor = (userKey?: string) => (userKey ? `${SESSION_KEY}:${userKey}` : SESSION_KEY);

function alreadyShown(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false; // storage blocked (private mode / disabled cookies)
  }
}

function markShown(key: string): void {
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    /* ignore */
  }
}

/** Imperative handle published on `window.atriumInvestPopup`. */
interface AtriumInvestPopupHandle {
  /** Reveal the card now (marks the session, exactly as the delay would). */
  open: () => void;
  /** Hide the card without touching the session flag. */
  close: () => void;
  /** Forget that the ad ran, then re-arm the delay timer. */
  reset: () => void;
}

declare global {
  interface Window {
    atriumInvestPopup?: AtriumInvestPopupHandle;
  }
}

/* ── Component ───────────────────────────────────────────────────────────── */

function AtriumInvestPopup({ userKey }: { userKey?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const openRef = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const sessionKey = sessionKeyFor(userKey);

  const openPopup = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    markShown(sessionKey);
    setIsOpen(true);
  }, [sessionKey]);

  const closePopup = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setIsOpen(false);
  }, []);

  /* ── Auto-open, once per session, OPEN_DELAY_MS after the dashboard ── */
  useEffect(() => {
    if (alreadyShown(sessionKey)) return;
    timerRef.current = window.setTimeout(openPopup, OPEN_DELAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [sessionKey, openPopup]);

  /* ── Scroll lock, focus in / focus back, open + close events ── */
  useEffect(() => {
    if (!isOpen) return;

    document.documentElement.classList.add('atr-locked');
    window.dispatchEvent(new CustomEvent('atrium:popup-open'));

    // The overlay's `visibility` is transitioned, so a single focus() call can
    // land before the browser computes the card as visible — and is then
    // silently ignored. Retry briefly until focus really is inside the dialog.
    let attempts = 0;
    let focusTimer: number | undefined;
    const focusCard = () => {
      const card = cardRef.current;
      if (card && !card.contains(document.activeElement)) {
        card.focus({ preventScroll: true });
        attempts += 1;
        if (attempts < 4) focusTimer = window.setTimeout(focusCard, 70);
      }
    };
    focusTimer = window.setTimeout(focusCard, 40);

    return () => {
      if (focusTimer) window.clearTimeout(focusTimer);
      document.documentElement.classList.remove('atr-locked');
      const previous = lastFocusRef.current;
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
      window.dispatchEvent(new CustomEvent('atrium:popup-close'));
    };
  }, [isOpen]);

  /* ── Keyboard: Escape closes, Tab stays inside the dialog ── */
  useEffect(() => {
    if (!isOpen) return;

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePopup();
        return;
      }
      if (e.key !== 'Tab') return;

      const card = cardRef.current;
      if (!card) return;
      const items = Array.prototype.filter.call(
        card.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
        (el: HTMLElement) => el.offsetWidth > 0 || el.offsetHeight > 0
      ) as HTMLElement[];
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === card)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [isOpen, closePopup]);

  /* ── Public hook ── */
  useEffect(() => {
    window.atriumInvestPopup = {
      open: openPopup,
      close: closePopup,
      reset() {
        try {
          window.sessionStorage.removeItem(sessionKey);
        } catch {
          /* ignore */
        }
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(openPopup, OPEN_DELAY_MS);
      },
    };
    return () => {
      delete window.atriumInvestPopup;
    };
  }, [sessionKey, openPopup, closePopup]);

  /* ── Primary action ── */
  const onInvest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // the shipped "#how-to-buy" href is a placeholder
    window.dispatchEvent(new CustomEvent('atrium:invest', { detail: { source: 'popup' } }));
    if (INVEST_URL) window.open(INVEST_URL, '_blank', 'noopener,noreferrer');
    closePopup();
  };

  return (
    <div
      className={`atr-overlay${isOpen ? ' is-open' : ''}`}
      data-od-id="invest-popup"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closePopup();
      }}
    >
      <div
        ref={cardRef}
        className="atr-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="atr-popup-title"
        aria-describedby="atr-popup-sub"
        tabIndex={-1}
        data-od-id="invest-popup-card"
      >
        <button
          className="atr-close"
          type="button"
          aria-label="Close this offer"
          data-od-id="popup-close"
          onClick={closePopup}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="atr-body">
          {/* Coin */}
          <div className="atr-stage" data-od-id="popup-coin">
            <div className="atr-coin-stack">
              <div className="atr-coin-persp">
                <span className="atr-halo" aria-hidden="true" />
                <div className="atr-coin-float">
                  <div className="atr-coin-tilt">
                    <svg className="atr-coin" viewBox="0 0 240 240" role="img" aria-label="ATRIUM coin">
                      <defs>
                        <radialGradient id="atrFace" cx="33%" cy="23%" r="86%">
                          <stop offset="0" stopColor="oklch(0.991 0.009 205.9)" />
                          <stop offset="0.22" stopColor="oklch(0.944 0.032 219.1)" />
                          <stop offset="0.5" stopColor="oklch(0.911 0.048 218.1)" />
                          <stop offset="0.74" stopColor="oklch(0.84 0.077 214.8)" />
                          <stop offset="0.9" stopColor="oklch(0.535 0.085 226.3)" />
                          <stop offset="1" stopColor="oklch(0.22 0.04 247.5)" />
                        </radialGradient>
                        <linearGradient id="atrRim" x1="0.1" y1="0" x2="0.9" y2="1">
                          <stop offset="0" stopColor="oklch(0.865 0.115 207.1)" />
                          <stop offset="0.45" stopColor="oklch(0.797 0.134 211.5)" />
                          <stop offset="1" stopColor="oklch(0.623 0.188 259.8)" />
                        </linearGradient>
                        <linearGradient id="atrEdge" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="oklch(0.332 0.063 237.4)" />
                          <stop offset="1" stopColor="oklch(0.22 0.04 247.5)" />
                        </linearGradient>
                        <linearGradient id="atrSheenGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="oklch(0.991 0.009 205.9)" stopOpacity=".72" />
                          <stop offset="0.45" stopColor="oklch(0.991 0.009 205.9)" stopOpacity="0" />
                        </linearGradient>
                        <filter id="atrGlow" x="-45%" y="-45%" width="190%" height="190%">
                          <feGaussianBlur stdDeviation="3.2" result="b" />
                          <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="atrHalo" x="-70%" y="-70%" width="240%" height="240%">
                          <feGaussianBlur stdDeviation="5.5" />
                        </filter>
                        <clipPath id="atrFaceClip">
                          <circle cx="118" cy="118" r="100" />
                        </clipPath>
                        <path id="atrTopArc" d="M 40 118 A 78 78 0 0 1 196 118" />
                        <path id="atrBottomArc" d="M 34 118 A 84 84 0 0 0 202 118" />
                      </defs>

                      {/* coin body + thickness */}
                      <circle cx="123" cy="123" r="100" fill="url(#atrEdge)" />
                      <circle cx="118" cy="118" r="100" fill="url(#atrFace)" />

                      {/* glowing cyan rim (the brand's emissive edge) */}
                      <circle
                        cx="118"
                        cy="118"
                        r="97.5"
                        fill="none"
                        stroke="oklch(0.797 0.134 211.5)"
                        strokeWidth="7"
                        opacity=".45"
                        filter="url(#atrHalo)"
                      />
                      <circle cx="118" cy="118" r="97.5" fill="none" stroke="url(#atrRim)" strokeWidth="2.6" />

                      {/* knurled edge */}
                      <circle
                        cx="118"
                        cy="118"
                        r="92.5"
                        fill="none"
                        stroke="oklch(0.865 0.115 207.1 / .34)"
                        strokeWidth="2.2"
                        strokeDasharray="1.6 6"
                        strokeLinecap="round"
                      />

                      {/* coin legends */}
                      <g
                        fontFamily="Space Grotesk, ui-sans-serif, sans-serif"
                        fontSize="15"
                        fontWeight="700"
                        letterSpacing="4"
                        fill="oklch(0.177 0.032 258.7)"
                      >
                        <text>
                          <textPath href="#atrTopArc" xlinkHref="#atrTopArc" startOffset="50%" textAnchor="middle">
                            ATRIUM
                          </textPath>
                        </text>
                        <text>
                          <textPath
                            href="#atrBottomArc"
                            xlinkHref="#atrBottomArc"
                            startOffset="50%"
                            textAnchor="middle"
                          >
                            WEB3 NATIVE
                          </textPath>
                        </text>
                      </g>

                      {/* inner ring + emblem: navy octahedron inside the cyan torus */}
                      <circle
                        cx="118"
                        cy="118"
                        r="63"
                        fill="none"
                        stroke="oklch(0.623 0.188 259.8)"
                        strokeWidth="1.3"
                        opacity=".5"
                      />
                      <circle
                        cx="118"
                        cy="118"
                        r="41"
                        fill="none"
                        stroke="oklch(0.865 0.115 207.1)"
                        strokeWidth="2.2"
                        opacity=".95"
                        filter="url(#atrGlow)"
                      />
                      <g>
                        <path d="M118 88 L91 118 L118 118 Z" fill="oklch(0.311 0.057 239.3)" />
                        <path d="M118 88 L145 118 L118 118 Z" fill="oklch(0.177 0.032 258.7)" />
                        <path d="M91 118 L118 148 L118 118 Z" fill="oklch(0.177 0.032 258.7)" />
                        <path d="M145 118 L118 148 L118 118 Z" fill="oklch(0.366 0.061 231.7)" />
                        <path
                          d="M118 88 L145 118 L118 148 L91 118 Z"
                          fill="none"
                          stroke="oklch(0.797 0.134 211.5)"
                          strokeWidth="1.2"
                          opacity=".9"
                        />
                      </g>

                      {/* metal sweep */}
                      <g clipPath="url(#atrFaceClip)">
                        <rect className="atr-sheen" x="-100" y="14" width="118" height="208" fill="url(#atrSheenGrad)" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <span className="atr-coin-shadow" aria-hidden="true" />
            </div>
          </div>

          {/* Message */}
          <div className="atr-content">
            <span className="atr-badge">
              <span className="atr-dot" aria-hidden="true" /> Live on-chain
            </span>

            <h2 className="atr-title" id="atr-popup-title" data-od-id="popup-title">
              ATRIUM{' '}
            </h2>
            <p className="atr-sub" id="atr-popup-sub">
              The coin engineered to rise.
            </p>
            <p className="atr-copy" data-od-id="popup-copy">
              Decentralized, community-owned and built to last. Hold the way you believe in the future.
            </p>

            <ul className="atr-stats" data-od-id="popup-stats">
              <li />
              <li />
              <li />
            </ul>

            <div className="atr-actions">
              <a className="atr-btn-primary" href="#how-to-buy" data-od-id="popup-cta-invest" onClick={onInvest}>
                Invest now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="atr-footer" data-od-id="popup-footer">
          <div className="atr-wallets" />
        </div>
      </div>
    </div>
  );
}

/* The dashboard re-renders constantly (live ticker, SWR polls); memo keeps the
   ad's subtree out of that churn — only its own state changes re-render it. */
export default memo(AtriumInvestPopup);
