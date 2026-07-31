"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE_OUT = [0.22, 1, 0.36, 1];

export function RouteTransition({ children }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const enter = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };
  const leave = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -7 };
  const initial = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 9 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="route-transition-shell"
        key={pathname}
        initial={initial}
        animate={enter}
        exit={leave}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.44,
          ease: EASE_OUT,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
