"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { CATEGORIES, getCategoryForTerm } from "@/app/data/categories";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type Phase = "idle" | "playing" | "results";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const ROUND_SIZE = 10;
const TIME_LIMIT = 45;

export function CategorySort({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [terms, setTerms] = useState<typeof TERMS>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-catsort-best");
      if (raw) setBestScore(Number(raw));
    } catch {}
  }, []);

  // Get categories for current term's options (correct + 2 random)
  const categoryOptions = useMemo(() => {
    if (phase !== "playing" || currentIdx >= terms.length) return [];
    const term = terms[currentIdx];
    const correctCat = getCategoryForTerm(term.id);
    if (!correctCat) return [];

    const others = shuffle(CATEGORIES.filter((c) => c.id !== correctCat.id)).slice(0, 2);
    return shuffle([correctCat, ...others]);
  }, [phase, currentIdx, terms]);

  const startGame = useCallback(() => {
    // Pick terms that have categories
    const categorized = TERMS.filter((t) => getCategoryForTerm(t.id));
    setTerms(shuffle(categorized).slice(0, ROUND_SIZE));
    setCurrentIdx(0);
    setCorrect(0);
    setWrong(0);
    setTimeLeft(TIME_LIMIT);
    setFeedback(null);
    setPhase("playing");
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const finishGame = useCallback(
    (finalCorrect: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("results");

      const xp = finalCorrect * 5 + (finalCorrect === ROUND_SIZE ? 20 : 0);
      addXP(xp);
      recordGamePlayed("category_sort");

      if (finalCorrect > bestScore) {
        setBestScore(finalCorrect);
        try { localStorage.setItem("tax-guide-catsort-best", String(finalCorrect)); } catch {}
      }
    },
    [addXP, bestScore]
  );

  const handleSelect = useCallback(
    (catId: string) => {
      if (feedback) return;
      const term = terms[currentIdx];
      const correctCat = getCategoryForTerm(term.id);
      const isCorrect = correctCat?.id === catId;

      if (isCorrect) {
        setCorrect((c) => c + 1);
        setFeedback("correct");
      } else {
        setWrong((w) => w + 1);
        setFeedback("wrong");
      }

      setTimeout(() => {
        setFeedback(null);
        if (currentIdx + 1 >= ROUND_SIZE) {
          finishGame(isCorrect ? correct + 1 : correct);
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }, 600);
    },
    [feedback, terms, currentIdx, correct, finishGame]
  );

  const currentTerm = terms[currentIdx];

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">🗂️</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Category Sort" : "Clasificar categorías"}
          </h3>
        </div>
        <p className="mb-2 text-[11px] text-slate-500 dark:text-neutral-400">
          {isEn
            ? `Sort ${ROUND_SIZE} terms into their correct categories in ${TIME_LIMIT} seconds!`
            : `¡Clasifica ${ROUND_SIZE} términos en sus categorías en ${TIME_LIMIT} segundos!`}
        </p>
        {bestScore > 0 && (
          <p className="mb-3 text-[10px] text-emerald-500">
            {isEn ? `Best: ${bestScore}/${ROUND_SIZE}` : `Mejor: ${bestScore}/${ROUND_SIZE}`}
          </p>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20"
        >
          {isEn ? "Start Sorting" : "Comenzar a clasificar"}
        </motion.button>
      </motion.div>
    );
  }

  // Results
  if (phase === "results") {
    const xp = correct * 5 + (correct === ROUND_SIZE ? 20 : 0);
    const pct = Math.round((correct / ROUND_SIZE) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mb-2 text-4xl"
        >
          {pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📖"}
        </motion.div>
        <p className={`text-3xl font-black ${pct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>
          {correct}/{ROUND_SIZE}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn ? "correctly sorted" : "clasificados correctamente"}
        </p>
        <p className="mt-2 text-xs font-bold text-violet-500">+{xp} XP</p>
        <motion.button
          type="button"
          onClick={startGame}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20"
        >
          {isEn ? "Play Again" : "Jugar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Playing
  if (!currentTerm) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
          {currentIdx + 1}/{ROUND_SIZE}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-emerald-500">{correct}✓</span>
          <span className="text-[10px] text-red-400">{wrong}✗</span>
          <span className={`text-xs font-bold tabular-nums ${timeLeft < 10 ? "text-red-500" : "text-slate-700 dark:text-neutral-200"}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-cyan-500"
          animate={{ width: `${((currentIdx + 1) / ROUND_SIZE) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Term display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTerm.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`mb-4 rounded-xl border-2 p-4 text-center transition-colors ${
            feedback === "correct"
              ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
              : feedback === "wrong"
                ? "border-red-400 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
                : "border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04]"
          }`}
        >
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {isEn ? currentTerm.labelEn : currentTerm.labelEs}
          </p>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-neutral-400">
            {isEn
              ? "Which category does this belong to?"
              : "¿A qué categoría pertenece?"}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Category buttons */}
      <div className="space-y-2">
        {categoryOptions.map((cat) => (
          <motion.button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            disabled={feedback !== null}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-all hover:bg-gray-50 disabled:opacity-60 dark:border-white/[0.08] dark:hover:bg-white/[0.04]"
          >
            <span className="text-base">{cat.icon}</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
              {isEn ? cat.labelEn : cat.labelEs}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
