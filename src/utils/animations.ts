import type { Variants, Transition } from 'framer-motion';

// Shared easing curve for consistent animations
export const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;

const baseTransition: Transition = {
  duration: 0.6,
  ease: EASE_SMOOTH,
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.4, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.5, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_SMOOTH,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.5, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: EASE_SMOOTH,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.5, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: EASE_SMOOTH,
    },
  },
};

export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.4, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_SMOOTH,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    transition: { duration: 0.4, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_SMOOTH,
    },
  },
};

export const cardFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
    transition: { duration: 0.5, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE_SMOOTH,
    },
  },
};

export const imageFadeIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 30,
    transition: { duration: 0.5, ease: EASE_SMOOTH },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_SMOOTH,
    },
  },
};

export const imageHover = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASE_SMOOTH,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: EASE_SMOOTH,
    },
  },
} as const;

export const overlayHover = {
  rest: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
} as const;

export const navSlide: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: EASE_SMOOTH,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: EASE_SMOOTH,
    },
  },
};
