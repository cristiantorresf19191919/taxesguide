"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { TermId } from "@/app/data/terms";

const BOOKMARKS_KEY = "tax-guide-glossary-bookmarks";

type Lang = "en" | "es";

type GlossaryContextValue = {
  selectedTermId: TermId | null;
  openTerm: (id: TermId, lang?: Lang) => void;
  closeTerm: () => void;
  bookmarks: TermId[];
  toggleBookmark: (id: TermId) => void;
  isBookmarked: (id: TermId) => boolean;
  lang: Lang;
};

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

function loadBookmarks(): TermId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookmarks(ids: TermId[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [selectedTermId, setSelectedTermId] = useState<TermId | null>(null);
  const [bookmarks, setBookmarks] = useState<TermId[]>([]);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, []);

  const openTerm = useCallback((id: TermId, termLang?: Lang) => {
    if (termLang) setLang(termLang);
    setSelectedTermId(id);
  }, []);
  const closeTerm = useCallback(() => setSelectedTermId(null), []);

  const toggleBookmark = useCallback((id: TermId) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: TermId) => bookmarks.includes(id),
    [bookmarks]
  );

  return (
    <GlossaryContext.Provider
      value={{
        selectedTermId,
        openTerm,
        closeTerm,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        lang,
      }}
    >
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const ctx = useContext(GlossaryContext);
  if (!ctx) throw new Error("useGlossary must be used within GlossaryProvider");
  return ctx;
}
