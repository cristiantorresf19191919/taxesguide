"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGlossary } from "../contexts/GlossaryContext";
import { TERMS } from "../data/terms";
import type { TermId } from "../data/terms";

type Lang = "en" | "es";

const ui = {
  en: {
    title: "Glossary & bookmarks",
    subtitle: "Terms you saved and full terminology list.",
    bookmarks: "Your saved terms",
    allTerms: "All terms",
    emptyBookmarks: "No terms saved yet. Click any green-underlined or abbreviated term in the analyses to open its definition, then add it here.",
    back: "Back to menu",
  },
  es: {
    title: "Glosario y marcadores",
    subtitle: "Términos que guardaste y lista completa de terminología.",
    bookmarks: "Tus términos guardados",
    allTerms: "Todos los términos",
    emptyBookmarks: "Aún no has guardado términos. Haz clic en cualquier término subrayado en verde o abreviado en los análisis para ver su definición y añadirlo aquí.",
    back: "Volver al menú",
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
  const { bookmarks, openTerm, toggleBookmark, isBookmarked } = useGlossary();
  const t = ui[lang];

  const bookmarkedTerms = TERMS.filter((t) => bookmarks.includes(t.id));

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
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
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

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10" data-readaloud-content>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{t.title}</h1>
          <p className="mt-2 text-neutral-400">{t.subtitle}</p>
        </motion.div>

        {bookmarkedTerms.length > 0 && (
          <motion.section
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="mb-5 text-lg font-bold tracking-tight text-white">{t.bookmarks}</h2>
            <div className="space-y-4">
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

        {bookmarkedTerms.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-neutral-400"
          >
            {t.emptyBookmarks}
          </motion.p>
        )}

        <section>
          <motion.h2
            className="mb-5 text-lg font-bold tracking-tight text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {t.allTerms}
          </motion.h2>
          <div className="space-y-4">
            {TERMS.map((term, i) => (
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
        </section>
      </main>
    </div>
  );
}
