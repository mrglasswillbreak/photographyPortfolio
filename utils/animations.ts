import type { Variants, Transition } from 'framer-motion';

export const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
// Elegant deceleration — starts fast, ends gracefully (luxury-grade ease-out)
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const baseTransition: Transition = {
  duration: 0.7,
  ease: EASE_OUT,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 48, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -56, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 56, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const cardFadeIn: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.92, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

export const imageFadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 32, transition: { duration: 0.5, ease: EASE_OUT } },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const imageHover = {
  rest: { scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
  hover: { scale: 1.06, transition: { duration: 0.6, ease: EASE_OUT } },
} as const;

export const overlayHover = {
  rest: { opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } },
  hover: { opacity: 1, transition: { duration: 0.35, ease: 'easeInOut' } },
} as const;

export const navSlide: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};
