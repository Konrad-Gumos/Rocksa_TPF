import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { defaultTransition, pageVariants } from "../../lib/motion.ts";

interface Props {
  children: ReactNode;
  className?: string;
}

export const AnimatedPage = ({ children, className }: Props) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "initial"}
      animate="animate"
      variants={pageVariants}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  );
};
