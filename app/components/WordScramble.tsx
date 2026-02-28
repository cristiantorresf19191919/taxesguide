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

function scrambleWord(word: string): string {
  if (word.length <= 2) {
    // For very short words, just reverse
    return word.split("").reverse().join("");
  }
  const letters = word.split("");
  let scrambled = shuffle(letters).join("");
  let attempts = 0;
  while (scrambled === word && attempts < 20) {
    scrambled = shuffle(letters).join("");
    attempts++;
  }
  // Final fallback: swap first and last characters
  if (scrambled === word && word.length >= 2) {
    const arr = word.split("");
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
    scrambled = arr.join("");
  }
  return scrambled;
}

const ROUND_SIZE = 8;
const TIME_LIMIT = 60;
const BASE_XP = 6;
const TIME_BONUS_PER_CORRECT = 3; // +3s per correct answer

function getComboMultiplier(combo: number): number {
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

type RoundTerm = {
  term: (typeof TERMS)[0];
  scrambled: string;
  options: string[];
  correctIdx: number;
};

export function WordScramble({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<RoundTerm[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [bestScore, setBestScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [timeBonusFlash, setTimeBonusFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const xpAwarded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-scramble-best");
      if (raw) setBestScore(Number(raw));
    } catch {}
  }, []);

  const startGame = useCallback(() => {
    const selected = shuffle(TERMS).slice(0, ROUND_SIZE);
    const newRounds: RoundTerm[] = selected.map((term) => {
      const label = isEn ? term.labelEn : term.labelEs;
      const scrambled = scrambleWord(label.toUpperCase());
      const wrongTerms = shuffle(TERMS.filter((t) => t.id !== term.id)).slice(
        0,
        3
      );
      const allOptions = shuffle([term, ...wrongTerms]);
      const correctIdx = allOptions.findIndex((t) => t.id === term.id);
      return {
        term,
        scrambled,
        options: allOptions.map((t) => (isEn ? t.labelEn : t.labelEs)),
        correctIdx,
      };
    });
    setRounds(newRounds);
    setCurrentIdx(0);
    setCorrect(0);
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
    setCombo(0);
    setBestCombo(0);
    setTotalXP(0);
    setTimeBonusFlash(false);
    xpAwarded.current = false;
    setPhase("playing");
  }, [isEn]);

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
      const perfectBonus = correct === ROUND_SIZE ? 25 : 0;
      const finalXP = totalXP + perfectBonus;
      if (finalXP > 0) addXP(finalXP);
      recordGamePlayed("word_scramble");
      if (correct > bestScore) {
        setBestScore(correct);
        try {
          localStorage.setItem("tax-guide-scramble-best", String(correct));
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

      if (isCorrect) {
        const newCombo = combo + 1;
        const mult = getComboMultiplier(newCombo);
        const earned = BASE_XP * mult;

        setCorrect((c) => c + 1);
        setCombo(newCombo);
        setTotalXP((x) => x + earned);
        if (newCombo > bestCombo) setBestCombo(newCombo);

        // Time bonus: add seconds for correct answers
        setTimeLeft((t) => t + TIME_BONUS_PER_CORRECT);
        setTimeBonusFlash(true);
        setTimeout(() => setTimeBonusFlash(false), 600);
      } else {
        setCombo(0);
      }

      setTimeout(() => {
        setSelected(null);
        if (currentIdx + 1 >= ROUND_SIZE) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("results");
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }, 800);
    },
    [selected, rounds, currentIdx, combo, bestCombo]
  );

  const round = rounds[currentIdx];
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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/15 text-xl dark:from-amber-500/20 dark:to-yellow-500/20">
            🔤
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Word Scramble" : "Letras revueltas"}
            </h3>
            <span className="text-[10px] font-semibold text-amber-500/80">
              {isEn ? "Puzzle" : "Rompecabezas"}
            </span>
          </div>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
          {isEn
            ? `Unscramble ${ROUND_SIZE} tax terms! Correct answers add +${TIME_BONUS_PER_CORRECT}s. Combos multiply XP!`
            : `¡Descifra ${ROUND_SIZE} términos! Aciertos dan +${TIME_BONUS_PER_CORRECT}s. ¡Combos multiplican XP!`}
        </p>
        {bestScore > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50/80 px-3 py-2 dark:bg-amber-500/10">
            <span className="text-xs">🏆</span>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {bestScore}/{ROUND_SIZE}
            </span>
            <span className="text-[10px] text-amber-500/60">
              {isEn ? "personal best" : "récord personal"}
            </span>
          </div>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-shadow hover:shadow-amber-500/35"
        >
          {isEn ? "Start Scramble" : "Comenzar a descifrar"}
        </motion.button>
      </motion.div>
    );
  }

  // Results
  if (phase === "results") {
    const perfectBonus = correct === ROUND_SIZE ? 25 : 0;
    const finalXP = totalXP + perfectBonus;

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
          {correct >= ROUND_SIZE ? "🧠" : correct >= ROUND_SIZE / 2 ? "💪" : "📖"}
        </motion.div>
        <p
          className={`text-3xl font-black ${
            correct >= ROUND_SIZE / 2 ? "text-amber-500" : "text-slate-500"
          }`}
        >
          {correct}/{ROUND_SIZE}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn ? "unscrambled" : "descifrados"}
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
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/20"
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
      className="flex flex-col p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔤</span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
            {currentIdx + 1}/{ROUND_SIZE}
          </span>
        </div>
        <div className="flex items-center gap-3">
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
          <span
            className={`text-xs font-bold tabular-nums ${
              timeLeft < 15
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
                className="absolute ml-1 text-[10px] text-emerald-500 font-bold"
              >
                +{TIME_BONUS_PER_CORRECT}s
              </motion.span>
            )}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-amber-500"
          animate={{ width: `${((currentIdx + 1) / ROUND_SIZE) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Scrambled word */}
          <div className="mb-3 rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-500/10">
            <p className="text-[10px] font-medium text-amber-600/60 dark:text-amber-400/60 mb-1">
              {isEn ? "Unscramble this:" : "Descifra esto:"}
            </p>
            <p className="text-xl font-black tracking-[0.2em] text-amber-700 dark:text-amber-300">
              {round.scrambled}
            </p>
          </div>

          {/* Definition hint */}
          <p className="mb-4 text-[11px] italic text-slate-500 dark:text-neutral-400">
            {isEn ? "Hint: " : "Pista: "}
            {isEn ? round.term.shortEn : round.term.shortEs}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {round.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === round.correctIdx;
              const showResult = selected !== null;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-xs font-semibold transition-all ${
                    showResult && isCorrect
                      ? "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : showResult && isSelected && !isCorrect
                        ? "border-red-400/40 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                        : showResult
                          ? "border-gray-200 text-slate-400 dark:border-white/[0.04] dark:text-neutral-600"
                          : "border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.08] dark:text-neutral-200 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
