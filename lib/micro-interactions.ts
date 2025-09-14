import { Variants } from 'framer-motion';
import { ANIMATION_SYSTEM } from '@/lib/design-system';

// Common animation variants for consistent micro-interactions

// Fade animations
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

// Scale animations
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.bounce
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

export const bounceIn: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION_SYSTEM.duration.slow / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.bounce
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

// Hover animations
export const buttonHover = {
  scale: 1.05,
  transition: {
    duration: ANIMATION_SYSTEM.duration.fast / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  }
};

export const buttonTap = {
  scale: 0.95,
  transition: {
    duration: ANIMATION_SYSTEM.duration.fast / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  }
};

export const cardHover = {
  y: -4,
  scale: 1.02,
  transition: {
    duration: ANIMATION_SYSTEM.duration.fast / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  }
};

export const iconHover = {
  scale: 1.2,
  rotate: 5,
  transition: {
    duration: ANIMATION_SYSTEM.duration.fast / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  }
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  }
};

// Loading animations
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: ANIMATION_SYSTEM.duration.slow / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeInOut,
    repeat: Infinity
  }
};

export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    ease: "linear",
    repeat: Infinity
  }
};

// Notification animations
export const slideInFromRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

export const slideInFromLeft: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    x: '-100%', 
    opacity: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

// Modal animations
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

// Input focus animations
export const inputFocus = {
  scale: 1.02,
  transition: {
    duration: ANIMATION_SYSTEM.duration.fast / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  }
};

// Badge animations
export const badgeBounce = {
  scale: [1, 1.2, 1],
  transition: {
    duration: ANIMATION_SYSTEM.duration.normal / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.bounce
  }
};

// Error shake animation
export const shakeAnimation = {
  x: [-10, 10, -10, 10, 0],
  transition: {
    duration: ANIMATION_SYSTEM.duration.normal / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  }
};

// Success checkmark animation
export const checkmarkAnimation: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.slow / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.bounce
    }
  }
};

// Utility function to create custom easing
export const createCustomEasing = (points: number[]) => points as [number, number, number, number];

// Common transition configurations
export const transitions = {
  fast: {
    duration: ANIMATION_SYSTEM.duration.fast / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  },
  normal: {
    duration: ANIMATION_SYSTEM.duration.normal / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  },
  slow: {
    duration: ANIMATION_SYSTEM.duration.slow / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.easeOut
  },
  bounce: {
    duration: ANIMATION_SYSTEM.duration.normal / 1000,
    ease: ANIMATION_SYSTEM.framerEasing.bounce
  }
};

// Hover effects for different elements
export const hoverEffects = {
  button: {
    scale: 1.05,
    transition: transitions.fast
  },
  card: {
    y: -4,
    scale: 1.02,
    transition: transitions.fast
  },
  icon: {
    scale: 1.2,
    rotate: 5,
    transition: transitions.fast
  },
  image: {
    scale: 1.1,
    transition: transitions.normal
  }
};

// Tap effects
export const tapEffects = {
  button: {
    scale: 0.95,
    transition: transitions.fast
  },
  card: {
    scale: 0.98,
    transition: transitions.fast
  }
};