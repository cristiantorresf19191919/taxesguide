"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

function getDailyIndex(total: number): number {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % total;
}

export function DailyChallenge({ lang }: { lang: Lang }) {
  const { state, recordDailyChallenge } = useProgress();
  const [revealed, setRevealed] = useState(false);
  const isEn = lang === "en";

  const today = new Date().toISOString().slice(0, 10);
  const alreadyDone = state.dailyLastDate === today;

  const term = useMemo(() => {
    const idx = getDailyIndex(TERMS.length);
    return TERMS[idx];
  }, []);

  const label = isEn ? term.labelEn : term.labelEs;
  const definition = isEn ? (term.longEn || term.shortEn) : (term.longEs || term.shortEs);

  const handleKnew = () => {
    recordDailyChallenge();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/15 to-orange-500/15 text-xl dark:from-red-500/20 dark:to-orange-500/20">
            🎯
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Daily Challenge" : "Reto diario"}
            </h3>
            <span className="text-[10px] font-semibold text-red-500/80">
              +25 XP
            </span>
          </div>
        </div>
        {alreadyDone && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            {isEn ? "Done" : "Hecho"}
          </span>
        )}
      </div>

      <p className="mb-1 text-xs font-medium text-slate-400 dark:text-neutral-500">
        {isEn ? "Do you know what this means?" : "¿Sabes qué significa esto?"}
      </p>

      <p className="mb-4 text-base font-bold text-slate-900 dark:text-white">
        {label}
        {term.isAbbreviation && (
          <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-neutral-500">
            ({isEn ? "abbreviation" : "abreviatura"})
          </span>
        )}
      </p>

      <AnimatePresence mode="wait">
        {!revealed && !alreadyDone ? (
          <motion.button
            key="reveal"
            type="button"
            onClick={() => setRevealed(true)}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-violet-50 py-2.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
          >
            {isEn ? "Reveal Answer" : "Revelar respuesta"}
          </motion.button>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs leading-relaxed text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-neutral-300">
              {definition}
            </div>
            {!alreadyDone && (
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={handleKnew}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                >
                  {isEn ? "I knew it! +25 XP" : "¡Lo sabía! +25 XP"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleKnew}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-gray-200 dark:bg-white/[0.06] dark:text-neutral-400 dark:hover:bg-white/[0.1]"
                >
                  {isEn ? "Still learning" : "Aún aprendiendo"}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 dark:border-white/[0.06]">
        <span className="text-xs text-slate-400 dark:text-neutral-500">
          {isEn ? "Challenges completed:" : "Retos completados:"}
        </span>
        <span className="text-xs font-bold text-slate-700 dark:text-white">
          {state.dailyChallengesCompleted}
        </span>
      </div>
    </motion.div>
  );
}
