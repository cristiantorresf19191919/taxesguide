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
    <motion.section variants={fadeUp} className="mt-12 first:mt-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={expanded}
      >
        <span
          className="h-6 w-1 shrink-0 rounded-full transition-all duration-300"
          style={{ backgroundColor: "rgba(255,255,255,0.2)", opacity: expanded ? 1 : 0.4 }}
        />
        <h2 className="flex-1 text-lg font-bold tracking-tight text-white md:text-xl">
          {title}
        </h2>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-neutral-500 transition-colors group-hover:bg-white/[0.08] group-hover:text-neutral-300"
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
            <div className="mt-4 space-y-4 border-l-2 border-white/[0.05] pl-5 text-[15px] leading-[1.75] text-neutral-300">
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
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
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
    <motion.div variants={fadeUp} className="overflow-x-auto rounded-2xl border border-white/[0.08]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.04]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400"
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
              className={`border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.04] ${
                i % 2 === 1 ? "bg-white/[0.02]" : ""
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${j === 0 ? "font-medium text-white/90" : "text-neutral-300"}`}
                >
                  <AutoGlossary text={cell} lang={lang} />
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
