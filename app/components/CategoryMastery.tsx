"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/app/data/categories";

type Lang = "en" | "es";

const QUIZ_HISTORY_KEY = "tax-guide-quiz-history";

function MasteryRing({ percent, color, size = 48 }: { percent: number; color: string; size?: number }) {
  const sw = 4;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(0,0,0,0.06)" className="dark:stroke-white/[0.06]"
        strokeWidth={sw}
      />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CategoryMastery({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const [termScores, setTermScores] = useState<Record<string, { correct: number; wrong: number }>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.termScores) setTermScores(parsed.termScores);
      }
    } catch {}
  }, []);

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      let totalCorrect = 0;
      let totalAttempts = 0;
      let practiced = 0;

      cat.terms.forEach((termId) => {
        const score = termScores[termId];
        if (score) {
          totalCorrect += score.correct;
          totalAttempts += score.correct + score.wrong;
          practiced++;
        }
      });

      const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
      const coverage = Math.round((practiced / cat.terms.length) * 100);
      const mastered = accuracy >= 80 && coverage >= 60;

      return { ...cat, accuracy, coverage, practiced, mastered };
    });
  }, [termScores]);

  const totalPracticed = categoryData.reduce((acc, c) => acc + c.practiced, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏅</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Category Mastery" : "Dominio por categoría"}
          </h3>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/[0.06] dark:text-neutral-300">
          {categoryData.filter((c) => c.mastered).length}/{CATEGORIES.length}
        </span>
      </div>

      {totalPracticed === 0 ? (
        <p className="text-center text-[11px] text-slate-400 dark:text-neutral-500">
          {isEn
            ? "Take the flashcard quiz to see category mastery!"
            : "¡Toma el quiz de tarjetas para ver tu dominio por categoría!"}
        </p>
      ) : (
        <div className="space-y-3">
          {categoryData.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <MasteryRing percent={cat.accuracy} color={cat.color} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px]">
                  {cat.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-200 truncate">
                    {isEn ? cat.labelEn : cat.labelEs}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {cat.mastered && (
                      <span className="text-[8px] font-bold text-emerald-500">
                        {isEn ? "MASTER" : "MAESTRO"}
                      </span>
                    )}
                    <span className="text-[10px] font-bold" style={{ color: cat.color }}>
                      {cat.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${cat.accuracy}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 dark:text-neutral-500">
                    {cat.practiced}/{cat.terms.length}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
