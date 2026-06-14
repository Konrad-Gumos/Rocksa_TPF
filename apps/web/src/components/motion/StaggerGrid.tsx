import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../lib/motion.ts";

interface GridProps {
  children: ReactNode;
  className?: string;
  /** `mount` animates when rendered; `inView` waits for scroll (homepage sections). */
  reveal?: "mount" | "inView";
}

export const StaggerGrid = ({ children, className, reveal = "inView" }: GridProps) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  if (reveal === "mount") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: GridProps) => (
  <motion.div className={className} variants={staggerItem}>
    {children}
  </motion.div>
);
