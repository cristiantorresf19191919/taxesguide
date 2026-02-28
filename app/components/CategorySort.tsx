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
const BASE_XP = 5;
const TIME_BONUS_PER_CORRECT = 2; // +2s per correct

function getComboMultiplier(combo: number): number {
  if (combo >= 8) return 3;
  if (combo >= 4) return 2;
  return 1;
}

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
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeBonusFlash, setTimeBonusFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const xpAwarded = useRef(false);

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
    setCombo(0);
    setBestCombo(0);
    setTotalXP(0);
    setTimeBonusFlash(false);
    xpAwarded.current = false;
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Award XP on results
  useEffect(() => {
    if (phase === "results" && !xpAwarded.current) {
      xpAwarded.current = true;
      const perfectBonus = correct === ROUND_SIZE ? 20 : 0;
      const finalXP = totalXP + perfectBonus;
      if (finalXP > 0) addXP(finalXP);
      recordGamePlayed("category_sort");
      if (correct > bestScore) {
        setBestScore(correct);
        try {
          localStorage.setItem("tax-guide-catsort-best", String(correct));
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSelect = useCallback(
    (catId: string) => {
      if (feedback) return;
      const term = terms[currentIdx];
      const correctCat = getCategoryForTerm(term.id);
      const isCorrect = correctCat?.id === catId;

      if (isCorrect) {
        const newCombo = combo + 1;
        const mult = getComboMultiplier(newCombo);
        const earned = BASE_XP * mult;

        setCorrect((c) => c + 1);
        setCombo(newCombo);
        setTotalXP((x) => x + earned);
        if (newCombo > bestCombo) setBestCombo(newCombo);
        setFeedback("correct");

        // Time bonus
        setTimeLeft((t) => t + TIME_BONUS_PER_CORRECT);
        setTimeBonusFlash(true);
        setTimeout(() => setTimeBonusFlash(false), 600);
      } else {
        setWrong((w) => w + 1);
        setCombo(0);
        setFeedback("wrong");
      }

      setTimeout(() => {
        setFeedback(null);
        if (currentIdx + 1 >= ROUND_SIZE) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("results");
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }, 600);
    },
    [feedback, terms, currentIdx, combo, bestCombo]
  );

  const currentTerm = terms[currentIdx];
  const mult = getComboMultiplier(combo);

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-xl dark:from-cyan-500/20 dark:to-blue-500/20">
            🗂️
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Category Sort" : "Clasificar categorías"}
            </h3>
            <span className="text-[10px] font-semibold text-cyan-500/80">
              {isEn ? "Classification" : "Clasificación"}
            </span>
          </div>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
          {isEn
            ? `Sort ${ROUND_SIZE} terms in ${TIME_LIMIT}s! Correct answers add +${TIME_BONUS_PER_CORRECT}s. Combos multiply XP!`
            : `¡Clasifica ${ROUND_SIZE} términos en ${TIME_LIMIT}s! Aciertos dan +${TIME_BONUS_PER_CORRECT}s. ¡Combos multiplican XP!`}
        </p>
        {bestScore > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 dark:bg-emerald-500/10">
            <span className="text-xs">🏆</span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {bestScore}/{ROUND_SIZE}
            </span>
            <span className="text-[10px] text-emerald-500/60">
              {isEn ? "personal best" : "récord personal"}
            </span>
          </div>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-shadow hover:shadow-cyan-500/35"
        >
          {isEn ? "Start Sorting" : "Comenzar a clasificar"}
        </motion.button>
      </motion.div>
    );
  }

  // Results
  if (phase === "results") {
    const perfectBonus = correct === ROUND_SIZE ? 20 : 0;
    const finalXP = totalXP + perfectBonus;
    const pct = Math.round((correct / ROUND_SIZE) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center p-5 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mb-2 text-4xl"
        >
          {pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📖"}
        </motion.div>
        <p
          className={`text-3xl font-black ${
            pct >= 70 ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {correct}/{ROUND_SIZE}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn ? "correctly sorted" : "clasificados correctamente"}
        </p>
        <div className="mt-2 flex gap-4 text-center">
          <div>
            <p className="text-sm font-bold text-amber-500">{bestCombo}x</p>
            <p className="text-[9px] text-slate-400">
              {isEn ? "best combo" : "mejor combo"}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-violet-500">+{finalXP}</p>
            <p className="text-[9px] text-slate-400">XP</p>
          </div>
        </div>
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
      className="flex flex-col p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
          {currentIdx + 1}/{ROUND_SIZE}
        </span>
        <div className="flex items-center gap-3">
          {combo >= 4 && (
            <motion.div
              key={combo}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 dark:bg-amber-500/20"
            >
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">
                x{mult}
              </span>
            </motion.div>
          )}
          <span className="text-[10px] text-emerald-500">{correct}✓</span>
          <span className="text-[10px] text-red-400">{wrong}✗</span>
          <span
            className={`relative text-xs font-bold tabular-nums ${
              timeLeft < 10
                ? "text-red-500"
                : "text-slate-700 dark:text-neutral-200"
            }`}
          >
            {timeLeft}s
            {timeBonusFlash && (
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
                className="absolute -right-1 -top-3 text-[10px] text-emerald-500 font-bold"
              >
                +{TIME_BONUS_PER_CORRECT}s
              </motion.span>
            )}
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
