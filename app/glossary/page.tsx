"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGlossary } from "../contexts/GlossaryContext";
import { TERMS } from "../data/terms";
import type { TermId } from "../data/terms";
import { LangSwitchWrapper } from "../components/LangSwitchWrapper";

type Lang = "en" | "es";

const ui = {
  en: {
    title: "Glossary & bookmarks",
    subtitle: "Terms you saved and full terminology list.",
    bookmarks: "Your saved terms",
    allTerms: "All terms",
    emptyBookmarks: "No terms saved yet. Click any green-underlined or abbreviated term in the analyses to open its definition, then add it here.",
    back: "Back to menu",
    search: "Search terms...",
    showing: "Showing",
    of: "of",
    terms: "terms",
  },
  es: {
    title: "Glosario y marcadores",
    subtitle: "Términos que guardaste y lista completa de terminología.",
    bookmarks: "Tus términos guardados",
    allTerms: "Todos los términos",
    emptyBookmarks: "Aún no has guardado términos. Haz clic en cualquier término subrayado en verde o abreviado en los análisis para ver su definición y añadirlo aquí.",
    back: "Volver al menú",
    search: "Buscar términos...",
    showing: "Mostrando",
    of: "de",
    terms: "términos",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

function TermCard({
  id,
  lang,
  onOpen,
  isBookmarked,
  onToggleBookmark,
  index = 0,
}: {
  id: TermId;
  lang: Lang;
  onOpen: (id: TermId) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: TermId) => void;
  index?: number;
}) {
  const term = TERMS.find((t) => t.id === id);
  if (!term) return null;
  const label = lang === "es" ? term.labelEs : term.labelEn;
  const def = lang === "es" ? term.longEs : term.longEn;

  return (
    <motion.article
      layout
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold tracking-tight text-white">{label}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">{def}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <motion.button
            onClick={() => onOpen(id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/15"
          >
            {lang === "es" ? "Ver" : "View"}
          </motion.button>
          <motion.button
            onClick={() => onToggleBookmark(id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
              isBookmarked
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {isBookmarked ? "✓" : "+"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function GlossaryPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [search, setSearch] = useState("");
  const { bookmarks, openTerm, toggleBookmark, isBookmarked } = useGlossary();
  const t = ui[lang];

  const bookmarkedTerms = TERMS.filter((t) => bookmarks.includes(t.id));

  const filteredTerms = TERMS.filter((term) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      term.labelEn.toLowerCase().includes(q) ||
      term.labelEs.toLowerCase().includes(q) ||
      term.longEn.toLowerCase().includes(q) ||
      term.longEs.toLowerCase().includes(q) ||
      term.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-200px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(52,211,153,0.08),transparent)]" />
      </div>

      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-10 border-b border-white/[0.06] bg-neutral-950/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <motion.span whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              ← {t.back}
            </Link>
          </motion.span>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setLang("en")}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                lang === "en" ? "bg-white/15 text-white" : "text-neutral-500 hover:text-white"
              }`}
            >
              EN
            </motion.button>
            <motion.button
              onClick={() => setLang("es")}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                lang === "es" ? "bg-white/15 text-white" : "text-neutral-500 hover:text-white"
              }`}
            >
              ES
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-10" data-readaloud-content>
        <LangSwitchWrapper lang={lang}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{t.title}</h1>
          <p className="mt-2 text-neutral-400">{t.subtitle}</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative mb-8"
        >
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30"
          />
        </motion.div>

        {bookmarkedTerms.length > 0 && !search.trim() && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="mb-5 text-lg font-bold tracking-tight text-white">{t.bookmarks}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {bookmarkedTerms.map((term, i) => (
                <TermCard
                  key={term.id}
                  id={term.id}
                  lang={lang}
                  onOpen={openTerm}
                  isBookmarked={isBookmarked(term.id)}
                  onToggleBookmark={toggleBookmark}
                  index={i}
                />
              ))}
            </div>
          </motion.section>
        )}

        {bookmarkedTerms.length === 0 && !search.trim() && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-neutral-400"
          >
            {t.emptyBookmarks}
          </motion.p>
        )}

        <section>
          <motion.div
            className="mb-5 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-lg font-bold tracking-tight text-white">
              {t.allTerms}
            </h2>
            {search.trim() && (
              <span className="text-xs text-neutral-500">
                {t.showing} {filteredTerms.length} {t.of} {TERMS.length} {t.terms}
              </span>
            )}
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredTerms.map((term, i) => (
              <TermCard
                key={term.id}
                id={term.id}
                lang={lang}
                onOpen={openTerm}
                isBookmarked={isBookmarked(term.id)}
                onToggleBookmark={toggleBookmark}
                index={bookmarkedTerms.length + i}
              />
            ))}
          </div>
          {filteredTerms.length === 0 && search.trim() && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center text-sm text-neutral-500"
            >
              {lang === "en" ? "No terms match your search." : "Ningún término coincide con tu búsqueda."}
            </motion.p>
          )}
        </section>
        </LangSwitchWrapper>
      </main>
    </div>
  );
}
