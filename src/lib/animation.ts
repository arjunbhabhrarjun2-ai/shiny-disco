import { Variants } from "framer-motion";

// ─── Custom easing ────────────────────────────────────────────────────
const expo = [0.22, 1, 0.36, 1] as const;

// ─── Page transition ──────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: expo },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const pageIn = pageVariants;

// ─── Fade up (primary entry) ──────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: expo },
  },
};

// ─── Slide up (alias for fadeUp — backward compat) ───────────────────
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: expo },
  },
};

// ─── Fade in ──────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25 },
  },
};

// ─── Scale in ─────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: expo },
  },
};

// ─── Slide in left ────────────────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: expo },
  },
};

// ─── Slide in right ───────────────────────────────────────────────────
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: expo },
  },
};

// ─── Stagger containers ───────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const stagger = staggerContainer;

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

// ─── Ambient (hero only) ──────────────────────────────────────────────
export const floating: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const glowPulse: Variants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 4,
      repeat: Infinity,
    },
  },
};

// ─── Interactions ─────────────────────────────────────────────────────
export const cardHover = {
  whileHover: { y: -3, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
};

export const buttonPress = buttonMotion;

// ─── Modal ────────────────────────────────────────────────────────────
export const modalScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: expo },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.15 },
  },
};

// ─── Notification dropdown ────────────────────────────────────────────
export const dropdownIn: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

// ─── Legacy ───────────────────────────────────────────────────────────
export const spinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};
