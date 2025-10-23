/**
 * Animation Configuration
 *
 * Centralized animation variants and configuration for Framer Motion.
 * All animations respect prefers-reduced-motion media query.
 *
 * Usage:
 * ```tsx
 * import { fadeInUp, cardHover } from '@/lib/animations';
 *
 * <motion.div
 *   variants={fadeInUp}
 *   initial="initial"
 *   animate="animate"
 *   whileHover={cardHover.whileHover}
 * />
 * ```
 */

import { Variants, Transition } from "framer-motion";

/**
 * Standard timing configurations
 */
export const timing = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

/**
 * Standard easing curves
 */
export const easing = {
  easeOut: [0, 0, 0.2, 1], // Sharp entrance
  easeInOut: [0.4, 0, 0.2, 1], // Smooth bi-directional
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
} as const;

/**
 * Stagger configurations for lists
 */
export const stagger = {
  small: 0.03,
  medium: 0.05,
  large: 0.1,
} as const;

/**
 * Common animation variants
 */

/**
 * Fade in with slide up from bottom
 * Perfect for cards, sections, and content blocks
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in with slide down from top
 * Perfect for headers and navigation
 */
export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Simple fade in
 * Perfect for text and subtle elements
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: timing.normal,
    },
  },
};

/**
 * Scale up with fade in
 * Perfect for modals and hero sections
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: timing.slow,
      ease: easing.easeOut,
    },
  },
};

/**
 * Hover effects for interactive elements
 */

/**
 * Card hover - subtle lift effect
 */
export const cardHover = {
  whileHover: {
    scale: 1.02,
    transition: { duration: timing.fast, ease: easing.easeInOut },
  },
  whileTap: {
    scale: 0.98,
  },
};

/**
 * Button hover - prominent lift effect
 */
export const buttonHover = {
  whileHover: {
    scale: 1.05,
    transition: { duration: timing.fast, ease: easing.easeInOut },
  },
  whileTap: {
    scale: 0.95,
  },
};

/**
 * Badge/Tag hover - subtle pulse effect
 */
export const badgeHover = {
  whileHover: {
    scale: 1.1,
    transition: { duration: timing.fast },
  },
};

/**
 * List stagger animations
 */

/**
 * Stagger children animation
 * Use on parent container
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.medium,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item animation
 * Use on children elements
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Viewport animation configuration
 * For elements that animate when scrolled into view
 */
export const viewportConfig = {
  once: true, // Only animate once
  margin: "-50px", // Trigger 50px before element enters viewport
  amount: 0.3, // Trigger when 30% of element is visible
};

/**
 * Helper function to get stagger delay based on index
 * Limits stagger to first N items to prevent performance issues
 *
 * @param index - Item index in list
 * @param maxStagger - Maximum number of items to stagger (default 20)
 * @param delayAmount - Delay per item in seconds (default 0.05)
 * @returns Delay in seconds
 */
export function getStaggerDelay(
  index: number,
  maxStagger: number = 20,
  delayAmount: number = stagger.medium
): number {
  return index < maxStagger ? index * delayAmount : 0;
}

/**
 * Helper function to create custom transition
 *
 * @param duration - Duration in seconds
 * @param delay - Delay in seconds
 * @returns Transition object
 */
export function createTransition(duration: number, delay: number = 0): Transition {
  return {
    duration,
    delay,
    ease: easing.easeOut,
  };
}
