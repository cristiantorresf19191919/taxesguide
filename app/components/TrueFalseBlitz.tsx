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
const BASE_XP = 3;

function getComboMultiplier(combo: number): number {
  if (combo >= 10) return 4;
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

function getComboColor(combo: number): string {
  if (combo >= 10) return "text-red-500";
  if (combo >= 6) return "text-orange-500";
  if (combo >= 3) return "text-amber-500";
  return "text-slate-400";
}

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
      // False statement — swap with a random different term (not just idx+3)
      const otherPool = shuffled.filter((_, i) => i !== idx);
      const other = otherPool[Math.floor(Math.random() * otherPool.length)];
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
  const { addXP, recordGamePlayed, recordCombo } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [statements, setStatements] = useState<Statement[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [beatingRecord, setBeatingRecord] = useState(false);
  const [showComboFlash, setShowComboFlash] = useState(false);
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
    setCombo(0);
    setBestCombo(0);
    setTotalXP(0);
    setFeedback(null);
    setBeatingRecord(false);
    setShowComboFlash(false);
    xpAwarded.current = false;
    setPhase("playing");
  }, [lang]);

  // Award XP on results
  useEffect(() => {
    if (phase === "results" && !xpAwarded.current) {
      xpAwarded.current = true;
      if (totalXP > 0) addXP(totalXP);
      recordGamePlayed("true_false_blitz");
      if (bestCombo >= 3) recordCombo(bestCombo);

      if (correct > highScore) {
        setHighScore(correct);
        try {
          localStorage.setItem("tax-guide-tfblitz-best", String(correct));
        } catch {}
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
        const newCombo = combo + 1;
        const mult = getComboMultiplier(newCombo);
        const earned = BASE_XP * mult;

        setCorrect((c) => {
          const newCorrect = c + 1;
          if (newCorrect > highScore && highScore > 0) setBeatingRecord(true);
          return newCorrect;
        });
        setCombo(newCombo);
        setTotalXP((x) => x + earned);
        if (newCombo > bestCombo) setBestCombo(newCombo);

        // Flash combo indicator on multiplier thresholds
        if (newCombo === 3 || newCombo === 6 || newCombo === 10) {
          setShowComboFlash(true);
          setTimeout(() => setShowComboFlash(false), 800);
        }
      } else {
        setCombo(0);
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
    [feedback, statements, currentIdx, combo, bestCombo, lives, highScore]
  );

  const stmt = statements[currentIdx];
  const mult = getComboMultiplier(combo);

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
            ? `Read each statement and decide: True or False? You have ${MAX_LIVES} lives. Build combos for x2, x3, x4 XP!`
            : `Lee cada afirmación y decide: ¿Verdadero o Falso? Tienes ${MAX_LIVES} vidas. ¡Haz combos para x2, x3, x4 XP!`}
        </p>
        {highScore > 0 && (
          <p className="mb-3 text-[10px] text-indigo-500">
            {isEn
              ? `Best: ${highScore} correct`
              : `Mejor: ${highScore} correctas`}
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
            <p className="text-sm font-bold text-amber-500">{bestCombo}x</p>
            <p className="text-[9px] text-slate-400">
              {isEn ? "best combo" : "mejor combo"}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-violet-500">+{totalXP}</p>
            <p className="text-[9px] text-slate-400">XP</p>
          </div>
        </div>
        {correct > 0 && correct >= highScore && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-[10px] font-bold text-amber-500"
          >
            {isEn ? "New personal best!" : "¡Nuevo récord personal!"}
          </motion.p>
        )}
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
          {combo >= 3 && (
            <motion.div
              key={combo}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${
                mult >= 4
                  ? "bg-red-100 dark:bg-red-500/20"
                  : mult >= 3
                    ? "bg-orange-100 dark:bg-orange-500/20"
                    : "bg-amber-100 dark:bg-amber-500/20"
              }`}
            >
              <span className={`text-[10px] font-black ${getComboColor(combo)}`}>
                x{mult}
              </span>
            </motion.div>
          )}
          {beatingRecord && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[9px] font-bold text-amber-500"
            >
              {isEn ? "BEST!" : "¡RÉCORD!"}
            </motion.span>
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span
                key={i}
                className={`text-xs ${i < lives ? "" : "opacity-20"}`}
              >
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
          {isEn ? `Combo: ${combo}` : `Combo: ${combo}`}
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-violet-500 font-bold">+{totalXP} XP</span>
      </div>

      {/* Combo flash */}
      <AnimatePresence>
        {showComboFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <span className={`text-4xl font-black ${getComboColor(combo)} opacity-40`}>
              x{mult}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
                ? isEn
                  ? `Correct! +${BASE_XP * mult} XP`
                  : `¡Correcto! +${BASE_XP * mult} XP`
                : isEn
                  ? `Wrong! The answer was ${stmt.isTrue ? "TRUE" : "FALSE"}`
                  : `¡Incorrecto! La respuesta era ${stmt.isTrue ? "VERDADERO" : "FALSO"}`}
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
