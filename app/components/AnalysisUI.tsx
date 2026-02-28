"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AutoGlossary } from "./AutoGlossary";

type Lang = "en" | "es";

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function Section({
  title,
  children,
  defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/40 dark:border-white/[0.06] dark:bg-white/[0.02]"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-100/60 dark:hover:bg-white/[0.04] sm:px-5"
        aria-expanded={expanded}
      >
        <span
          className="h-6 w-1 shrink-0 rounded-full transition-all duration-300"
          style={{ backgroundColor: expanded ? "rgba(var(--accent), 0.5)" : "rgba(var(--muted), 0.3)", opacity: expanded ? 1 : 0.4 }}
        />
        <h2 className="flex-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white md:text-xl">
          {title}
        </h2>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-slate-400 transition-colors group-hover:bg-gray-200 group-hover:text-slate-600 dark:bg-white/[0.06] dark:text-neutral-500 dark:group-hover:bg-white/[0.1] dark:group-hover:text-neutral-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-l-2 border-gray-200 px-5 pb-5 text-[15px] leading-[1.75] text-slate-700 dark:border-white/[0.08] dark:text-neutral-300 sm:px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/[0.14] dark:hover:bg-white/[0.05]"
    >
      {children}
    </motion.div>
  );
}

export function Table({
  headers,
  rows,
  lang = "en",
}: {
  headers: string[];
  rows: string[][];
  lang?: Lang;
}) {
  return (
    <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.08]">
      <div className="-mb-px overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04]">
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 sm:px-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={i}
                className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50 dark:border-white/[0.04] dark:hover:bg-white/[0.04] ${
                  i % 2 === 1 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-3 sm:px-4 ${j === 0 ? "font-medium text-slate-900 dark:text-white/90" : "text-slate-600 dark:text-neutral-300"}`}
                  >
                    <AutoGlossary text={cell} lang={lang} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile scroll hint */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-6 bg-gradient-to-l from-white/60 to-transparent dark:from-neutral-950/60 sm:hidden" />
    </motion.div>
  );
}
