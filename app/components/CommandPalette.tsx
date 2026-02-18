"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";

type Result = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  type: "page" | "term" | "action";
};

const PAGES: Result[] = [
  { id: "home", title: "Home Dashboard", subtitle: "Main study dashboard", icon: "home", href: "/", type: "page" },
  { id: "glossary", title: "Glossary & Terms", subtitle: "Browse all tax terminology", icon: "book", href: "/glossary", type: "page" },
  { id: "notes", title: "Study Notes", subtitle: "Your learning notes", icon: "edit", href: "/notes", type: "page" },
  { id: "quiz", title: "Flashcard Quiz", subtitle: "Test your knowledge", icon: "zap", href: "/quiz", type: "page" },
  { id: "chatgpt", title: "ChatGPT Analysis", subtitle: "Comprehensive overview", icon: "cpu", href: "/analisis-chatgpt", type: "page" },
  { id: "gemini", title: "Gemini Analysis", subtitle: "Detailed requirements", icon: "cpu", href: "/analisis-gemini", type: "page" },
  { id: "claude", title: "Claude Analysis", subtitle: "Step-by-step guide", icon: "cpu", href: "/analisis-claude", type: "page" },
];

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  book: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  zap: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  cpu: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  hash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Build results
  const results: Result[] = (() => {
    const q = query.toLowerCase().trim();
    if (!q) return PAGES;

    const matched: Result[] = [];

    // Match pages
    PAGES.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)) {
        matched.push(p);
      }
    });

    // Match terms (up to 8)
    let termCount = 0;
    for (const term of TERMS) {
      if (termCount >= 8) break;
      if (
        term.labelEn.toLowerCase().includes(q) ||
        term.labelEs.toLowerCase().includes(q) ||
        term.id.includes(q)
      ) {
        matched.push({
          id: `term-${term.id}`,
          title: term.labelEn,
          subtitle: term.shortEn.slice(0, 80),
          icon: "hash",
          href: `/glossary?search=${encodeURIComponent(term.labelEn)}`,
          type: "term",
        });
        termCount++;
      }
    }

    return matched;
  })();

  // Keep selection in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (result: Result) => {
      setOpen(false);
      setQuery("");
      router.push(result.href);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex]);
      }
    },
    [results, selectedIndex, navigate]
  );

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed left-1/2 top-[15%] z-[9999] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-neutral-900/95 shadow-2xl backdrop-blur-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-500">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, terms, or actions..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
                />
                <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 sm:inline-block">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-neutral-500">
                    No results found
                  </div>
                )}
                {results.map((result, i) => (
                  <button
                    key={result.id}
                    onClick={() => navigate(result)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      i === selectedIndex
                        ? "bg-emerald-500/15 text-white"
                        : "text-neutral-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className={`shrink-0 ${i === selectedIndex ? "text-emerald-400" : "text-neutral-500"}`}>
                      {ICONS[result.icon]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{result.title}</div>
                      <div className="truncate text-xs text-neutral-500">{result.subtitle}</div>
                    </div>
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      result.type === "page"
                        ? "bg-violet-500/15 text-violet-400"
                        : result.type === "term"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-blue-500/15 text-blue-400"
                    }`}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-[10px] text-neutral-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.5 font-mono">&#8593;&#8595;</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-white/10 bg-white/[0.06] px-1 py-0.5 font-mono">&#9166;</kbd>
                    select
                  </span>
                </div>
                <span>{results.length} results</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
