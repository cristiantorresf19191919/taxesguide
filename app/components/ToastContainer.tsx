"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/contexts/ToastContext";
import type { ToastType } from "@/app/contexts/ToastContext";

const STYLES: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", icon: "check-circle" },
  info:    { bg: "bg-blue-500/15",    border: "border-blue-500/30",    icon: "info" },
  warning: { bg: "bg-amber-500/15",   border: "border-amber-500/30",   icon: "alert" },
  error:   { bg: "bg-red-500/15",     border: "border-red-500/30",     icon: "x-circle" },
};

const ICONS: Record<string, React.ReactNode> = {
  "check-circle": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  alert: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  "x-circle": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const s = STYLES[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={() => removeToast(toast.id)}
              className={`pointer-events-auto flex cursor-pointer items-center gap-2.5 rounded-xl border ${s.border} ${s.bg} px-4 py-3 shadow-2xl backdrop-blur-xl`}
            >
              {ICONS[s.icon]}
              <span className="text-sm font-medium text-white">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
