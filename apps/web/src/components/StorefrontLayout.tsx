import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TopNav } from "./TopNav.tsx";
import { StorefrontSidebar } from "./CategorySidebar.tsx";
import { defaultTransition, fadeUp } from "../lib/motion.ts";

interface Props {
  children: ReactNode;
  banner?: ReactNode;
  /** Skip entrance animations (e.g. modal backdrop). */
  static?: boolean;
}

export const StorefrontLayout = ({ children, banner, static: isStatic = false }: Props) => {
  const reduce = useReducedMotion();
  const animate = !isStatic && !reduce;

  return (
    <div className="min-h-screen bg-surface-muted">
      <TopNav />

      <div className="flex">
        <StorefrontSidebar animated={!isStatic} />

        {animate ? (
          <motion.div
            className="min-w-0 flex-1"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ ...defaultTransition, delay: 0.06 }}
          >
            {banner}
            {children}
          </motion.div>
        ) : (
          <div className="min-w-0 flex-1">
            {banner}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
