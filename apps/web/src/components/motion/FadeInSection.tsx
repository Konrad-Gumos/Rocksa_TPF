import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { defaultTransition, fadeUp } from "../../lib/motion.ts";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  reveal?: "mount" | "inView";
}

export const FadeInSection = ({ children, className, delay = 0, reveal = "inView" }: Props) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <section className={className}>{children}</section>;
  }

  if (reveal === "mount") {
    return (
      <motion.section
        className={className}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ ...defaultTransition, delay }}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      variants={fadeUp}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </motion.section>
  );
};
