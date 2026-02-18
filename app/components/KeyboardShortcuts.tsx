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
            className="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-1/2 top-[20%] z-[9998] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-neutral-900/95 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-sm font-bold text-white">Keyboard Shortcuts</h2>
                <p className="mt-0.5 text-xs text-neutral-500">Navigate quickly with your keyboard</p>
              </div>
              <div className="divide-y divide-white/[0.04] px-5 py-2">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-sm text-neutral-300">{s.description}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, j) => (
                        <span key={j}>
                          <kbd className="inline-flex min-w-[24px] items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-1 text-[11px] font-semibold text-neutral-300">
                            {k}
                          </kbd>
                          {j < s.keys.length - 1 && (
                            <span className="mx-0.5 text-[10px] text-neutral-600">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] px-5 py-3 text-center">
                <span className="text-[10px] text-neutral-500">
                  Press <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.5 text-[9px] font-semibold text-neutral-400">?</kbd> or <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.5 text-[9px] font-semibold text-neutral-400">Esc</kbd> to close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
