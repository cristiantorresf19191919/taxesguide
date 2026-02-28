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

const MAX_WRONG = 3;
const BASE_XP = 4;
const SPEED_BONUS_THRESHOLD = 3; // seconds — answer within 3s for speed bonus

type Round = {
  term: (typeof TERMS)[0];
  options: string[];
  correctIdx: number;
};

function getComboMultiplier(combo: number): number {
  if (combo >= 10) return 4;
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

export function DefinitionDash({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed, recordCombo, recordDashScore } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [speedAnswers, setSpeedAnswers] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const [beatingRecord, setBeatingRecord] = useState(false);
  const xpAwarded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-defdash-best");
      if (raw) setHighScore(Number(raw));
    } catch {}
  }, []);

  const generateRounds = useCallback(() => {
    const shuffled = shuffle(TERMS);
    return shuffled.map((term): Round => {
      const correctLabel = isEn ? term.labelEn : term.labelEs;
      const wrongTerms = shuffle(TERMS.filter((t) => t.id !== term.id)).slice(
        0,
        3
      );
      const allOptions = shuffle([
        correctLabel,
        ...wrongTerms.map((t) => (isEn ? t.labelEn : t.labelEs)),
      ]);
      const correctIdx = allOptions.indexOf(correctLabel);
      return { term, options: allOptions, correctIdx };
    });
  }, [isEn]);

  const startGame = useCallback(() => {
    setRounds(generateRounds());
    setCurrentIdx(0);
    setCorrect(0);
    setWrong(0);
    setCombo(0);
    setBestCombo(0);
    setTotalXP(0);
    setSelected(null);
    setSpeedAnswers(0);
    setBeatingRecord(false);
    setQuestionStart(Date.now());
    xpAwarded.current = false;
    setPhase("playing");
  }, [generateRounds]);

  // Track question start time
  useEffect(() => {
    if (phase === "playing") {
      setQuestionStart(Date.now());
    }
  }, [currentIdx, phase]);

  // Award XP on results
  useEffect(() => {
    if (phase === "results" && !xpAwarded.current) {
      xpAwarded.current = true;
      if (totalXP > 0) addXP(totalXP);
      recordGamePlayed("definition_dash");
      recordDashScore(correct);
      if (bestCombo >= 3) recordCombo(bestCombo);
      if (correct > highScore) {
        setHighScore(correct);
        try {
          localStorage.setItem("tax-guide-defdash-best", String(correct));
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (selected !== null) return;
      setSelected(optIdx);

      const round = rounds[currentIdx];
      const isCorrect = optIdx === round.correctIdx;
      const responseTime = (Date.now() - questionStart) / 1000;
      const isFast = responseTime <= SPEED_BONUS_THRESHOLD;

      if (isCorrect) {
        const newCombo = combo + 1;
        const mult = getComboMultiplier(newCombo);
        const speedBonus = isFast ? 3 : 0;
        const earned = (BASE_XP + speedBonus) * mult;

        setCorrect((c) => {
          const newCorrect = c + 1;
          if (newCorrect > highScore) setBeatingRecord(true);
          return newCorrect;
        });
        setCombo(newCombo);
        setTotalXP((x) => x + earned);
        if (newCombo > bestCombo) setBestCombo(newCombo);
        if (isFast) setSpeedAnswers((s) => s + 1);
      } else {
        setCombo(0);
        const newWrong = wrong + 1;
        setWrong(newWrong);
        if (newWrong >= MAX_WRONG) {
          setTimeout(() => {
            setSelected(null);
            setPhase("results");
          }, 800);
          return;
        }
      }

      setTimeout(() => {
        setSelected(null);
        if (currentIdx + 1 >= rounds.length) {
          // Generate more rounds if we run out
          setRounds((prev) => [...prev, ...generateRounds()]);
        }
        setCurrentIdx((i) => i + 1);
      }, 600);
    },
    [
      selected,
      rounds,
      currentIdx,
      combo,
      bestCombo,
      wrong,
      questionStart,
      highScore,
      generateRounds,
    ]
  );

  const round = rounds[currentIdx];
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
          <span className="text-lg">🏃</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Definition Dash" : "Carrera de definiciones"}
          </h3>
        </div>
        <p className="mb-2 text-[11px] text-slate-500 dark:text-neutral-400">
          {isEn
            ? `Read the definition, pick the correct term! ${MAX_WRONG} strikes and you're out. Answer fast for speed bonuses!`
            : `¡Lee la definición, elige el término correcto! ${MAX_WRONG} errores y terminas. ¡Responde rápido para bonos!`}
        </p>
        {highScore > 0 && (
          <p className="mb-3 text-[10px] text-rose-500">
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
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/20"
        >
          {isEn ? "Start Dash" : "Comenzar carrera"}
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
          {correct >= 20 ? "🔥" : correct >= 10 ? "🏃" : "💪"}
        </motion.div>
        <p className="text-3xl font-black text-rose-500">{correct}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn ? "definitions matched" : "definiciones emparejadas"}
        </p>
        <div className="mt-3 flex gap-4 text-center">
          <div>
            <p className="text-sm font-bold text-amber-500">{bestCombo}x</p>
            <p className="text-[9px] text-slate-400">
              {isEn ? "best combo" : "mejor combo"}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-cyan-500">{speedAnswers}</p>
            <p className="text-[9px] text-slate-400">
              {isEn ? "speed answers" : "respuestas rápidas"}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-violet-500">+{totalXP}</p>
            <p className="text-[9px] text-slate-400">XP</p>
          </div>
        </div>
        {correct > highScore && correct > 0 && (
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
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/20"
        >
          {isEn ? "Play Again" : "Jugar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Playing
  if (!round) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏃</span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
            #{currentIdx + 1}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Combo indicator */}
          {combo >= 3 && (
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
          {/* Record indicator */}
          {beatingRecord && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[9px] font-bold text-amber-500"
            >
              {isEn ? "NEW BEST!" : "¡RÉCORD!"}
            </motion.span>
          )}
          <span className="text-emerald-500 text-[10px] font-bold">
            {correct}✓
          </span>
          {/* Lives */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: MAX_WRONG }).map((_, i) => (
              <span
                key={i}
                className={`text-xs ${i < MAX_WRONG - wrong ? "" : "opacity-20"}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4 flex items-center gap-3 text-[10px]">
        <span className="text-slate-400">
          {isEn ? `Combo: ${combo}` : `Combo: ${combo}`}
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-violet-500 font-bold">+{totalXP} XP</span>
      </div>

      {/* Definition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`mb-4 rounded-xl border-2 p-4 transition-colors ${
              selected !== null && selected === round.correctIdx
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                : selected !== null
                  ? "border-red-400 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
                  : "border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-white/[0.04]"
            }`}
          >
            <p className="text-[10px] font-medium text-rose-500/60 mb-1">
              {isEn ? "Which term matches this definition?" : "¿Qué término corresponde a esta definición?"}
            </p>
            <p className="text-[13px] font-medium leading-relaxed text-slate-900 dark:text-white">
              {isEn ? round.term.shortEn : round.term.shortEs}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2">
            {round.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === round.correctIdx;
              const showResult = selected !== null;

              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-xl border px-3 py-3 text-center text-xs font-bold transition-all ${
                    showResult && isCorrect
                      ? "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : showResult && isSelected && !isCorrect
                        ? "border-red-400/40 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                        : showResult
                          ? "border-gray-200 text-slate-400 dark:border-white/[0.04] dark:text-neutral-600"
                          : "border-gray-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50/50 dark:border-white/[0.08] dark:text-neutral-200 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
