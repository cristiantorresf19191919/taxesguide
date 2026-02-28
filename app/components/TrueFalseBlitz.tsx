"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
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

type Statement = {
  text: string;
  isTrue: boolean;
  termLabel: string;
};

const MAX_LIVES = 3;
const XP_PER_CORRECT = 3;
const STREAK_BONUS_THRESHOLD = 5;
const STREAK_BONUS_XP = 15;

function generateStatements(lang: "en" | "es"): Statement[] {
  const isEn = lang === "en";
  const shuffled = shuffle(TERMS);
  const statements: Statement[] = [];

  shuffled.forEach((term, idx) => {
    const label = isEn ? term.labelEn : term.labelEs;
    const correctDef = isEn ? term.shortEn : term.shortEs;

    // True statement
    if (idx % 2 === 0) {
      statements.push({
        text: isEn
          ? `"${label}" means: ${correctDef}`
          : `"${label}" significa: ${correctDef}`,
        isTrue: true,
        termLabel: label,
      });
    } else {
      // False statement — swap definition with another term
      const other = shuffled[(idx + 3) % shuffled.length];
      const wrongDef = isEn ? other.shortEn : other.shortEs;
      statements.push({
        text: isEn
          ? `"${label}" means: ${wrongDef}`
          : `"${label}" significa: ${wrongDef}`,
        isTrue: false,
        termLabel: label,
      });
    }
  });

  return shuffle(statements);
}

export function TrueFalseBlitz({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [statements, setStatements] = useState<Statement[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [highScore, setHighScore] = useState(0);
  const xpAwarded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-tfblitz-best");
      if (raw) setHighScore(Number(raw));
    } catch {}
  }, []);

  const startGame = useCallback(() => {
    setStatements(generateStatements(lang));
    setCurrentIdx(0);
    setCorrect(0);
    setLives(MAX_LIVES);
    setStreak(0);
    setBestStreak(0);
    setFeedback(null);
    xpAwarded.current = false;
    setPhase("playing");
  }, [lang]);

  // Award XP on results
  useEffect(() => {
    if (phase === "results" && !xpAwarded.current) {
      xpAwarded.current = true;
      const streakBonuses = Math.floor(bestStreak / STREAK_BONUS_THRESHOLD) * STREAK_BONUS_XP;
      const xp = correct * XP_PER_CORRECT + streakBonuses;
      if (xp > 0) addXP(xp);
      recordGamePlayed("true_false_blitz");

      if (correct > highScore) {
        setHighScore(correct);
        try { localStorage.setItem("tax-guide-tfblitz-best", String(correct)); } catch {}
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleAnswer = useCallback(
    (answeredTrue: boolean) => {
      if (feedback) return;
      const stmt = statements[currentIdx];
      const isCorrect = answeredTrue === stmt.isTrue;

      setFeedback(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setCorrect((c) => c + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
      } else {
        setStreak(0);
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setTimeout(() => {
            setFeedback(null);
            setPhase("results");
          }, 800);
          return;
        }
      }

      setTimeout(() => {
        setFeedback(null);
        if (currentIdx + 1 >= statements.length) {
          setPhase("results");
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }, 800);
    },
    [feedback, statements, currentIdx, streak, bestStreak, lives]
  );

  const stmt = statements[currentIdx];

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">⚖️</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "True or False Blitz" : "Verdadero o Falso"}
          </h3>
        </div>
        <p className="mb-2 text-[11px] text-slate-500 dark:text-neutral-400">
          {isEn
            ? `Read each statement and decide: True or False? You have ${MAX_LIVES} lives. Build streaks for bonus XP!`
            : `Lee cada afirmación y decide: ¿Verdadero o Falso? Tienes ${MAX_LIVES} vidas. ¡Haz rachas para XP extra!`}
        </p>
        {highScore > 0 && (
          <p className="mb-3 text-[10px] text-indigo-500">
            {isEn ? `Best: ${highScore} correct` : `Mejor: ${highScore} correctas`}
          </p>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
        >
          {isEn ? "Start Blitz" : "Comenzar Blitz"}
        </motion.button>
      </motion.div>
    );
  }

  // Results
  if (phase === "results") {
    const streakBonuses = Math.floor(bestStreak / STREAK_BONUS_THRESHOLD) * STREAK_BONUS_XP;
    const totalXP = correct * XP_PER_CORRECT + streakBonuses;

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
          {correct >= 15 ? "🔥" : correct >= 8 ? "⚡" : "📚"}
        </motion.div>
        <p className="text-2xl font-black text-indigo-500">
          {correct} {isEn ? "correct" : "correctas"}
        </p>
        <div className="mt-2 flex gap-4 text-center">
          <div>
            <p className="text-sm font-bold text-amber-500">{bestStreak}</p>
            <p className="text-[9px] text-slate-400">{isEn ? "best streak" : "mejor racha"}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-violet-500">+{totalXP}</p>
            <p className="text-[9px] text-slate-400">XP</p>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={startGame}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
        >
          {isEn ? "Play Again" : "Jugar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Playing
  if (!stmt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚖️</span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
            #{currentIdx + 1}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {streak >= STREAK_BONUS_THRESHOLD && (
            <span className="text-[10px] font-bold text-amber-500">
              🔥 {streak}
            </span>
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`text-xs ${i < lives ? "" : "opacity-20"}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4 flex items-center gap-3 text-[10px]">
        <span className="text-emerald-500 font-bold">{correct}✓</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-400">
          {isEn ? `Streak: ${streak}` : `Racha: ${streak}`}
        </span>
      </div>

      {/* Statement */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`mb-5 rounded-xl border-2 p-4 transition-colors ${
            feedback === "correct"
              ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
              : feedback === "wrong"
                ? "border-red-400 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
                : "border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04]"
          }`}
        >
          <p className="text-[13px] font-medium leading-relaxed text-slate-900 dark:text-white">
            {stmt.text}
          </p>
          {feedback && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-2 text-[10px] font-bold ${
                feedback === "correct" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {feedback === "correct"
                ? isEn ? "Correct!" : "¡Correcto!"
                : isEn ? `Wrong! The answer was ${stmt.isTrue ? "TRUE" : "FALSE"}` : `¡Incorrecto! La respuesta era ${stmt.isTrue ? "VERDADERO" : "FALSO"}`}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* True/False buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl border-2 border-emerald-200 bg-emerald-50 py-4 text-sm font-bold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          {isEn ? "TRUE" : "VERDADERO"}
        </motion.button>
        <motion.button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl border-2 border-red-200 bg-red-50 py-4 text-sm font-bold text-red-700 transition-all hover:border-red-300 hover:bg-red-100 disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
        >
          {isEn ? "FALSE" : "FALSO"}
        </motion.button>
      </div>
    </motion.div>
  );
}
