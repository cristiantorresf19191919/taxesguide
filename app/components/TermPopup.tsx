"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGlossary } from "@/app/contexts/GlossaryContext";
import { getTerm } from "@/app/data/terms";
import type { TermId } from "@/app/data/terms";

const BOOKMARK_LABEL = { en: "Add to glossary", es: "Añadir al glosario" };
const BOOKMARKED_LABEL = { en: "In glossary", es: "En el glosario" };
const VIEW_GLOSSARY = { en: "View glossary", es: "Ver glosario" };

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modal = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: 0.2 },
  },
};

const contentStagger = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const contentItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function TermPopup() {
  const { selectedTermId, closeTerm, toggleBookmark, isBookmarked, lang } =
    useGlossary();
  const [isExiting, setIsExiting] = useState(false);
  const term = selectedTermId ? getTerm(selectedTermId) : null;

  const handleClose = () => {
    setIsExiting(true);
  };

  useEffect(() => {
    if (!selectedTermId) return;
    setIsExiting(false);
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [selectedTermId]);

  if (!selectedTermId && !isExiting) return null;
  if (!term) return null;

  const isEs = lang === "es";
  const definition = isEs ? term.longEs : term.longEn;
  const definitionAlt = isEs ? term.longEn : term.longEs;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal
      aria-labelledby="term-popup-title"
      role="dialog"
      initial="hidden"
      animate={isExiting ? "exit" : "visible"}
      variants={backdrop}
      onAnimationComplete={() => {
        if (isExiting) {
          closeTerm();
          setIsExiting(false);
        }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={!isExiting ? handleClose : undefined}
        variants={backdrop}
      />
      <motion.div
        className="relative z-10 w-full max-w-[calc(100vw-2rem)] sm:max-w-lg"
        variants={modal}
        animate={isExiting ? "exit" : "visible"}
        initial="hidden"
        onClick={(e) => e.stopPropagation()}
      >
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-900/95 shadow-2xl ring-1 ring-white/[0.06] backdrop-blur-xl">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-emerald-500/15 via-transparent to-violet-500/10 opacity-90" />
            <motion.div
              className="relative rounded-3xl p-6"
              variants={contentStagger}
              initial="hidden"
              animate="visible"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <motion.div variants={contentItem}>
                  <h2
                    id="term-popup-title"
                    className="text-xl font-bold tracking-tight text-white"
                  >
                    {isEs ? term.labelEs : term.labelEn}
                    {term.labelEn !== term.labelEs && (isEs ? term.labelEn : term.labelEs)
                      ? ` / ${isEs ? term.labelEn : term.labelEs}`
                      : ""}
                  </h2>
                  {term.isAbbreviation && (
                    <p className="mt-1.5 text-xs text-neutral-400">
                      {isEs ? term.shortEs : term.shortEn}
                    </p>
                  )}
                </motion.div>
                <motion.button
                  variants={contentItem}
                  onClick={handleClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg leading-none">×</span>
                </motion.button>
              </div>

              <motion.div
                variants={contentItem}
                className="space-y-3 text-sm leading-relaxed text-neutral-300"
              >
                <p>{definition}</p>
                {definitionAlt && definitionAlt !== definition && (
                  <p className="border-t border-white/10 pt-3 text-neutral-400">
                    <span className="mr-1.5 text-xs font-medium uppercase text-neutral-500">{isEs ? "EN" : "ES"}</span>
                    {definitionAlt}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={contentItem}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <motion.button
                  onClick={() => toggleBookmark(term.id)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isBookmarked(term.id)
                      ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isBookmarked(term.id) ? BOOKMARKED_LABEL[lang] : BOOKMARK_LABEL[lang]}
                </motion.button>
                <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/glossary"
                    onClick={closeTerm}
                    className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {VIEW_GLOSSARY[lang]}
                  </Link>
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
    </motion.div>
  );
}
