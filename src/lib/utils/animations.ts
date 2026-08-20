import type { Variants, Transition } from "framer-motion";

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: 4 },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const dropdownTransition: Transition = {
  duration: 0.15,
  ease: "easeOut",
};

export const modalTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
};
