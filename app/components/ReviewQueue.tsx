"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

const QUIZ_HISTORY_KEY = "tax-guide-quiz-history";
const REVIEW_KEY = "tax-guide-review-schedule";

type ReviewEntry = { termId: string; nextReview: string; box: number };
type ReviewState = Record<string, ReviewEntry>;

// Leitner intervals in days: box 0 = now, 1 = 1d, 2 = 3d, 3 = 7d, 4 = mastered
const INTERVALS = [0, 1, 3, 7, 14];

function loadReview(): ReviewState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveReview(s: ReviewState) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(REVIEW_KEY, JSON.stringify(s)); } catch {}
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function ReviewQueue({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { recordReview } = useProgress();
  const [reviewState, setReviewState] = useState<ReviewState>({});
  const [phase, setPhase] = useState<"overview" | "reviewing">("overview");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Initialize review state from quiz history
  useEffect(() => {
    const existing = loadReview();
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const termScores = parsed.termScores as Record<string, { correct: number; wrong: number }> | undefined;
        if (termScores) {
          const today = new Date().toISOString().slice(0, 10);
          const updated = { ...existing };
          for (const termId of Object.keys(termScores)) {
            if (!updated[termId]) {
              updated[termId] = { termId, nextReview: today, box: 0 };
            }
          }
          setReviewState(updated);
          saveReview(updated);
          return;
        }
      }
    } catch {}
    setReviewState(existing);
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const dueTerms = useMemo(() => {
    return Object.values(reviewState)
      .filter((e) => e.nextReview <= today && e.box < 4)
      .sort((a, b) => a.box - b.box);
  }, [reviewState, today]);

  const boxCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    Object.values(reviewState).forEach((e) => {
      if (e.box >= 0 && e.box <= 4) counts[e.box]++;
    });
    return counts;
  }, [reviewState]);

  const currentEntry = dueTerms[currentIdx];
  const currentTerm = currentEntry ? TERMS.find((t) => t.id === currentEntry.termId) : null;

  const handleAnswer = useCallback(
    (remembered: boolean) => {
      if (!currentEntry) return;
      const updated = { ...reviewState };
      const entry = { ...updated[currentEntry.termId]! };

      if (remembered) {
        entry.box = Math.min(entry.box + 1, 4);
      } else {
        entry.box = Math.max(entry.box - 1, 0);
      }
      entry.nextReview = addDays(today, INTERVALS[entry.box] || 14);
      updated[currentEntry.termId] = entry;

      setReviewState(updated);
      saveReview(updated);
      recordReview();
      setRevealed(false);

      if (currentIdx + 1 >= dueTerms.length) {
        setPhase("overview");
        setCurrentIdx(0);
      } else {
        setCurrentIdx((i) => i + 1);
      }
    },
    [currentEntry, reviewState, today, currentIdx, dueTerms.length, recordReview],
  );

  const boxLabels = isEn
    ? ["New", "Learning", "Reviewing", "Familiar", "Mastered"]
    : ["Nuevo", "Aprendiendo", "Repasando", "Familiar", "Dominado"];
  const boxColors = ["bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-400", "bg-violet-400"];

  // Overview
  if (phase === "overview") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEn ? "Review Queue" : "Cola de repaso"}
            </h3>
          </div>
          {dueTerms.length > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {dueTerms.length} {isEn ? "due" : "pendientes"}
            </span>
          )}
        </div>

        {/* Leitner boxes */}
        <div className="mb-4 flex gap-1">
          {boxCounts.map((count, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`mx-auto mb-1 h-1.5 rounded-full ${boxColors[i]}`} style={{ opacity: count > 0 ? 1 : 0.2 }} />
              <p className="text-[10px] font-bold text-slate-700 dark:text-neutral-200">{count}</p>
              <p className="text-[8px] text-slate-400 dark:text-neutral-500">{boxLabels[i]}</p>
            </div>
          ))}
        </div>

        {dueTerms.length > 0 ? (
          <motion.button
            type="button"
            onClick={() => { setPhase("reviewing"); setCurrentIdx(0); setRevealed(false); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
          >
            {isEn ? `Review ${dueTerms.length} Terms` : `Repasar ${dueTerms.length} términos`}
          </motion.button>
        ) : Object.keys(reviewState).length === 0 ? (
          <p className="text-center text-[11px] text-slate-400 dark:text-neutral-500">
            {isEn ? "Take quizzes to build your review queue!" : "¡Toma quizzes para construir tu cola de repaso!"}
          </p>
        ) : (
          <p className="text-center text-[11px] text-emerald-500 dark:text-emerald-400">
            {isEn ? "All caught up! Nothing due for review." : "¡Al día! Nada pendiente por repasar."}
          </p>
        )}
      </motion.div>
    );
  }

  // Reviewing
  if (!currentTerm || !currentEntry) {
    setPhase("overview");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
          {currentIdx + 1}/{dueTerms.length}
        </span>
        <button
          type="button"
          onClick={() => { setPhase("overview"); setCurrentIdx(0); }}
          className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          {isEn ? "Exit" : "Salir"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-1 text-[9px] font-medium uppercase text-slate-400 dark:text-neutral-500">
            {boxLabels[currentEntry.box]} — Box {currentEntry.box + 1}
          </p>
          <p className="mb-4 text-base font-bold text-slate-900 dark:text-white">
            {isEn ? currentTerm.labelEn : currentTerm.labelEs}
          </p>

          {!revealed ? (
            <motion.button
              type="button"
              onClick={() => setRevealed(true)}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
            >
              {isEn ? "Show Definition" : "Mostrar definición"}
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-[11px] leading-relaxed text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-neutral-300">
                {isEn ? currentTerm.shortEn : currentTerm.shortEs}
              </div>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {isEn ? "Remembered ✓" : "Recordé ✓"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-xl bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                >
                  {isEn ? "Forgot ✗" : "Olvidé ✗"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
