"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import Link from "next/link";

type Lang = "en" | "es";

type TermStat = {
  id: string;
  label: string;
  correct: number;
  wrong: number;
  accuracy: number;
};

const QUIZ_HISTORY_KEY = "tax-guide-quiz-history";

export function WeakAreas({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const [history, setHistory] = useState<Record<string, { c: number; w: number }>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const termScores = parsed.termScores as Record<string, { correct: number; wrong: number }> | undefined;
        if (termScores) {
          const normalized: Record<string, { c: number; w: number }> = {};
          for (const [key, val] of Object.entries(termScores)) {
            normalized[key] = { c: val.correct || 0, w: val.wrong || 0 };
          }
          setHistory(normalized);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const weakTerms: TermStat[] = useMemo(() => {
    const stats: TermStat[] = [];
    for (const [termId, data] of Object.entries(history)) {
      const total = data.c + data.w;
      if (total < 1) continue;
      const accuracy = Math.round((data.c / total) * 100);
      const term = TERMS.find((t) => t.id === termId);
      if (!term) continue;
      stats.push({
        id: termId,
        label: isEn ? term.labelEn : term.labelEs,
        correct: data.c,
        wrong: data.w,
        accuracy,
      });
    }
    // Sort by accuracy ascending (weakest first), then by total attempts descending
    stats.sort((a, b) => a.accuracy - b.accuracy || (b.correct + b.wrong) - (a.correct + a.wrong));
    return stats.slice(0, 6);
  }, [history, isEn]);

  const totalAttempted = Object.keys(history).length;
  const totalTerms = TERMS.length;

  if (totalAttempted === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Focus Areas" : "Áreas de enfoque"}
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-neutral-500">
          {isEn
            ? "Take the flashcard quiz to see your weak areas here!"
            : "¡Toma el quiz de tarjetas para ver tus áreas débiles aquí!"}
        </p>
        <Link
          href="/quiz"
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-violet-50 py-2.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
        >
          {isEn ? "Go to Quiz" : "Ir al Quiz"}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Focus Areas" : "Áreas de enfoque"}
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-neutral-500">
          {totalAttempted}/{totalTerms} {isEn ? "terms practiced" : "términos practicados"}
        </span>
      </div>
      <p className="mb-3 text-[10px] text-slate-400 dark:text-neutral-500">
        {isEn
          ? "Terms you need to review the most"
          : "Términos que más necesitas repasar"}
      </p>

      <div className="space-y-2">
        {weakTerms.map((t) => (
          <div key={t.id} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-200">
                  {t.label}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    t.accuracy >= 80
                      ? "text-emerald-500"
                      : t.accuracy >= 50
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {t.accuracy}%
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all ${
                    t.accuracy >= 80
                      ? "bg-emerald-400"
                      : t.accuracy >= 50
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/quiz"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-violet-50 py-2.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
      >
        {isEn ? "Practice Weak Terms" : "Practicar términos débiles"}
      </Link>
    </motion.div>
  );
}
