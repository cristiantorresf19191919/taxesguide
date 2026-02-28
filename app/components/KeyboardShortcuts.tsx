"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHORTCUTS = [
  { keys: ["Cmd", "K"], description: "Open command palette" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["G", "H"], description: "Go to Home" },
  { keys: ["G", "G"], description: "Go to Glossary" },
  { keys: ["G", "N"], description: "Go to Notes" },
  { keys: ["G", "Q"], description: "Go to Quiz" },
  { keys: ["Esc"], description: "Close modals & overlays" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let gPressed = false;
    let gTimeout: ReturnType<typeof setTimeout>;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // ? key to toggle shortcuts
      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      // G + key sequences for navigation
      if (isInput) return;

      if (e.key === "g" || e.key === "G") {
        if (!gPressed) {
          gPressed = true;
          gTimeout = setTimeout(() => { gPressed = false; }, 1000);
          return;
        }
      }

      if (gPressed) {
        gPressed = false;
        clearTimeout(gTimeout);
        switch (e.key.toLowerCase()) {
          case "h": window.location.href = "/"; break;
          case "g": window.location.href = "/glossary"; break;
          case "n": window.location.href = "/notes"; break;
          case "q": window.location.href = "/quiz"; break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9997] bg-black/30 backdrop-blur-sm dark:bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-1/2 top-[20%] z-[9998] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.1] dark:bg-neutral-900/95 dark:backdrop-blur-2xl">
              <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.06]">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-neutral-500">Navigate quickly with your keyboard</p>
              </div>
              <div className="divide-y divide-gray-100 px-5 py-2 dark:divide-white/[0.04]">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-600 dark:text-neutral-300">{s.description}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, j) => (
                        <span key={j}>
                          <kbd className="inline-flex min-w-[24px] items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-300">
                            {k}
                          </kbd>
                          {j < s.keys.length - 1 && (
                            <span className="mx-0.5 text-[10px] text-slate-300 dark:text-neutral-600">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                  Press <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 text-[9px] font-semibold text-slate-400 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400">?</kbd> or <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 text-[9px] font-semibold text-slate-400 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-400">Esc</kbd> to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
