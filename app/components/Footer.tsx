"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative bg-neutral-950 pb-28 pt-4">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 pt-10">
        <motion.a
          href="https://agencypartner2.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-3 text-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-neutral-500">Made By</span>
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text font-bold tracking-tight text-transparent">
            cristianscript
          </span>
          <svg
            className="h-3.5 w-3.5 text-neutral-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </motion.a>
      </div>
    </footer>
  );
}
