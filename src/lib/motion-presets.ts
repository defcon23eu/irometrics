/**
 * Motion Presets - Shared animation variants for irometrics.app
 * Theme: Fluid Dynamics / Reynolds Flow
 * 
 * Easing: [0.25, 0.4, 0.25, 1] - smooth, natural deceleration
 * Spring: stiffness 400, damping 20 - responsive but not bouncy
 */

import type { Variants, Transition } from 'framer-motion';

// Standard easing for smooth entries
export const FLUID_EASE = [0.25, 0.4, 0.25, 1] as const;

// Spring config for interactive elements
export const SPRING_BUTTON: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
};

export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

export const SPRING_GAUGE: Transition = {
  type: 'spring',
  stiffness: 50,
  damping: 12,
  delay: 0.5,
};

// ============================================
// FADE IN VARIANTS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay, 
      duration: 0.6, 
      ease: FLUID_EASE 
    },
  }),
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.5, 
      ease: FLUID_EASE 
    },
  }),
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { 
      delay, 
      duration: 0.5, 
      ease: FLUID_EASE 
    },
  }),
};

// ============================================
// SCALE IN VARIANTS
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { 
      delay, 
      duration: 0.5, 
      ease: FLUID_EASE 
    },
  }),
};

// ============================================
// STAGGER CONTAINERS
// ============================================

export const staggerContainer: Variants = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.1 
    } 
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.08 
    } 
  },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.12 
    } 
  },
};

// ============================================
// CARD HOVER
// ============================================

export const cardHover: Variants = {
  rest: { y: 0 },
  hover: { 
    y: -4, 
    transition: { 
      duration: 0.2, 
      ease: FLUID_EASE 
    } 
  },
};

// ============================================
// SLIDE TRANSITIONS (for questions)
// ============================================

export const slideLeft: Variants = {
  enter: { x: 50, opacity: 0 },
  center: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: FLUID_EASE 
    } 
  },
  exit: { 
    x: -50, 
    opacity: 0, 
    transition: { 
      duration: 0.3, 
      ease: FLUID_EASE 
    } 
  },
};

export const slideUp: Variants = {
  enter: { y: 40, opacity: 0, scale: 0.98 },
  center: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: FLUID_EASE 
    } 
  },
  exit: { 
    y: -30, 
    opacity: 0, 
    scale: 0.98,
    transition: { 
      duration: 0.3, 
      ease: FLUID_EASE 
    } 
  },
};

// ============================================
// REGIME COLORS
// ============================================

export const REGIME_COLORS = {
  laminar: '#22C55E',
  transicion: '#EAB308',
  incipiente: '#F97316',
  severo: '#EF4444',
} as const;

export const ACCENT_COLOR = '#6366F1';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get regime color based on Re_org value
 */
export function getRegimeColor(reOrg: number): string {
  if (reOrg < 100) return REGIME_COLORS.laminar;
  if (reOrg < 800) return REGIME_COLORS.transicion;
  if (reOrg < 1200) return REGIME_COLORS.incipiente;
  return REGIME_COLORS.severo;
}

/**
 * Calculate flow intensity for particle effects (0-1)
 */
export function getFlowIntensity(reOrg: number): number {
  return Math.min(Math.max(reOrg / 5000, 0), 1);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is small (<=375px)
 */
export function isSmallDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 375;
}
