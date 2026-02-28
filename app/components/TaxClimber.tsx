"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";
import { claudeQuestions } from "@/app/data/quiz-claude";
import { chatgptQuestions } from "@/app/data/quiz-chatgpt";
import { geminiQuestions } from "@/app/data/quiz-gemini";
import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

type Lang = "en" | "es";
type Phase = "idle" | "climbing" | "summit" | "fallen";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const LEVELS = 10;
const XP_PER_LEVEL = 8;
const SUMMIT_BONUS = 40;

function generateQuestions(): QuizQuestion[] {
  const fromAnalyses = [...claudeQuestions, ...chatgptQuestions, ...geminiQuestions];
  const fromTerms: QuizQuestion[] = TERMS.slice(0, 20).map((term) => {
    const wrong = shuffle(TERMS.filter((t) => t.id !== term.id)).slice(0, 3);
    const options = shuffle([term, ...wrong]);
    const correctIdx = options.findIndex((o) => o.id === term.id);
    return {
      en: {
        question: `What is "${term.labelEn}"?`,
        options: options.map((o) => o.shortEn),
        correct: correctIdx,
        explanation: term.shortEn,
      },
      es: {
        question: `¿Qué es "${term.labelEs}"?`,
        options: options.map((o) => o.shortEs),
        correct: correctIdx,
        explanation: term.shortEs,
      },
    };
  });
  return shuffle([...fromAnalyses, ...fromTerms]);
}

const LEVEL_EMOJIS = ["🏕️", "🌲", "🌿", "⛰️", "🪨", "🏔️", "☁️", "✨", "🌟", "🏆"];

export function TaxClimber({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed, recordClimberSummit } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [lives, setLives] = useState(3);

  const q = questions[qIdx]?.[lang];

  const startGame = useCallback(() => {
    setQuestions(generateQuestions().slice(0, 30));
    setQIdx(0);
    setLevel(0);
    setSelected(null);
    setLives(3);
    setPhase("climbing");
  }, []);

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (selected !== null || !q) return;
      setSelected(optIdx);

      const isCorrect = optIdx === q.correct;

      setTimeout(() => {
        if (isCorrect) {
          const newLevel = level + 1;
          setLevel(newLevel);
          if (newLevel >= LEVELS) {
            setPhase("summit");
            addXP(LEVELS * XP_PER_LEVEL + SUMMIT_BONUS);
            recordGamePlayed("tax_climber");
            recordClimberSummit();
            return;
          }
        } else {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) {
            setPhase("fallen");
            addXP(level * XP_PER_LEVEL);
            recordGamePlayed("tax_climber");
            return;
          }
        }
        setSelected(null);
        setQIdx((i) => i + 1);
      }, 1000);
    },
    [selected, q, level, lives, addXP]
  );

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-xl dark:from-emerald-500/20 dark:to-teal-500/20">
            🧗
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Tax Climber" : "Escalador fiscal"}
            </h3>
            <span className="text-[10px] font-semibold text-emerald-500/80">
              {isEn ? "Adventure" : "Aventura"}
            </span>
          </div>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
          {isEn
            ? `Climb ${LEVELS} levels! 3 lives. Reach the summit for bonus XP.`
            : `¡Escala ${LEVELS} niveles! 3 vidas. Llega a la cima para XP extra.`}
        </p>
        <div className="mb-4 flex justify-center gap-1">
          {LEVEL_EMOJIS.map((e, i) => (
            <span key={i} className="text-sm opacity-40">{e}</span>
          ))}
        </div>
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/35"
        >
          {isEn ? "Start Climbing" : "Comenzar a escalar"}
        </motion.button>
      </motion.div>
    );
  }

  // Summit
  if (phase === "summit") {
    const totalXP = LEVELS * XP_PER_LEVEL + SUMMIT_BONUS;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center p-5 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mb-2 text-5xl"
        >
          🏆
        </motion.div>
        <p className="text-lg font-black text-emerald-500">
          {isEn ? "Summit Reached!" : "¡Llegaste a la cima!"}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn ? `All ${LEVELS} levels conquered` : `Los ${LEVELS} niveles conquistados`}
        </p>
        <p className="mt-2 text-xl font-bold text-violet-500">+{totalXP} XP</p>
        <motion.button
          type="button"
          onClick={startGame}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
        >
          {isEn ? "Climb Again" : "Escalar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Fallen
  if (phase === "fallen") {
    const totalXP = level * XP_PER_LEVEL;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center p-5 sm:p-6"
      >
        <div className="mb-2 text-4xl">😤</div>
        <p className="text-lg font-black text-amber-500">
          {isEn ? "Keep Practicing!" : "¡Sigue practicando!"}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn ? `Reached level ${level}/${LEVELS}` : `Llegaste al nivel ${level}/${LEVELS}`}
        </p>
        {totalXP > 0 && (
          <p className="mt-2 text-xs font-bold text-violet-500">+{totalXP} XP</p>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
        >
          {isEn ? "Try Again" : "Intentar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Climbing
  if (!q) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧗</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Tax Climber" : "Escalador fiscal"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < lives ? "" : "opacity-20"}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Mountain progress */}
      <div className="mb-4 flex items-end justify-center gap-1">
        {LEVEL_EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === level ? 1.3 : 1,
              opacity: i <= level ? 1 : 0.3,
            }}
            className="flex flex-col items-center"
          >
            <span className="text-sm">{emoji}</span>
            {i === level && (
              <motion.div
                layoutId="climber"
                className="mt-0.5 h-1 w-1 rounded-full bg-emerald-500"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIdx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-4 text-[13px] font-semibold leading-relaxed text-slate-900 dark:text-white">
            {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct;
              const showResult = selected !== null;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-[11px] leading-snug transition-all ${
                    showResult && isCorrect
                      ? "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : showResult && isSelected && !isCorrect
                        ? "border-red-400/40 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                        : showResult
                          ? "border-gray-200 text-slate-400 dark:border-white/[0.04] dark:text-neutral-600"
                          : "border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.08] dark:text-neutral-300 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold ${
                      showResult && isCorrect
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : showResult && isSelected
                          ? "bg-red-500/20 text-red-700 dark:text-red-300"
                          : "bg-gray-100 text-slate-400 dark:bg-white/[0.06] dark:text-neutral-500"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
