import { motion, Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function MotionFadeUp({ children, delay = 0.1, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}

export function MotionFadeScale({ children, delay = 0.4, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeScale}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}
