/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  Kandella — DESIGN BRIEF 2026
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  EMOTIONAL TONE
 *  ─────────────
 *  Precision · Trust · Velocity · Quiet wealth
 *  The platform should feel like a Bloomberg Terminal crossed with a
 *  premium fintech product: dense with information, yet effortlessly legible.
 *  Every interaction should feel fast, deliberate, and trustworthy.
 *  Nothing decorative that doesn't serve data communication.
 *
 *  REFERENCE AESTHETICS
 *  ─────────────────────
 *  1. Linear.app — tight spacing, monochrome base, electric accent, purposeful motion
 *  2. Vercel Dashboard — dark surface hierarchy, hairline borders, zero visual noise
 *  3. Binance Pro / Coinbase Advanced — financial data density, semantic color system
 *
 *  UNIFYING DESIGN PRINCIPLE
 *  ──────────────────────────
 *  "Dark signal, bright intent."
 *  Every element on screen either communicates financial data or guides the user
 *  to an action. Decoration is forbidden unless it reinforces trust or hierarchy.
 *  Color is never cosmetic — it is always semantic (profit = emerald, loss = rose,
 *  action = electric blue, premium = gold).
 *
 *  COLOR SYSTEM
 *  ────────────
 *  Background:       #070B14  (deep navy-black)
 *  Surface 1:        #0D1421  (card backgrounds)
 *  Surface 2:        #111827  (elevated panels)
 *  Border:           rgba(255,255,255,0.06)
 *  Primary accent:   #3B82F6 → #60A5FA  (electric blue gradient)
 *  Secondary accent: #06B6D4  (cyan, data highlights)
 *  Success/Profit:   #10B981  (emerald)
 *  Warning/Loss:     #F43F5E  (rose)
 *  Gold tier:        #F59E0B  (premium investment tier)
 *  Text primary:     #F9FAFB
 *  Text secondary:   #9CA3AF
 *  Text muted:       #6B7280
 *
 *  TYPOGRAPHY
 *  ──────────
 *  Display/Headlines/Numbers: Space Grotesk — geometric, modern, financial
 *  UI body/labels/forms:      Inter — the gold standard for UI readability
 *  Prices/Addresses/Hashes:   JetBrains Mono — monospaced precision
 *
 *  MOTION PHILOSOPHY
 *  ─────────────────
 *  Purposeful · Precise · Fast
 *  Entry: 300ms max, expo easing [0.22, 1, 0.36, 1]
 *  Interactions: 200ms hover, 150ms press
 *  Ambient: only in hero section and preloader
 *  Data panels: entry animation only, then completely still
 *  Stagger: 60ms between children, never more
 *  prefers-reduced-motion: all animations collapse to 0.01ms
 *
 *  LAYOUT PRINCIPLES
 *  ─────────────────
 *  Base unit: 4px
 *  Card radius: 12px
 *  Input radius: 8px
 *  Button radius: 8px (pill only for primary CTA)
 *  Sidebar: 240px fixed desktop, bottom tab mobile
 *  Dashboard: 3-col bento xl, 2-col lg, 1-col mobile
 *  Max content width: max-w-screen-2xl (1536px)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// This file exports nothing. It is a living design document.
export {};
