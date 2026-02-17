"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  lang: string;
  children: React.ReactNode;
};

/**
 * Wraps content that changes when language is toggled.
 * Provides a subtle crossfade + slide animation on switch.
 */
export function LangSwitchWrapper({ lang, children }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={lang}
        initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
