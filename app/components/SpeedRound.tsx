"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type Phase = "idle" | "playing" | "finished";

const ROUND_SECONDS = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function pickOptions(correctIdx: number): number[] {
  const others: number[] = [];
  while (others.length < 3) {
    const r = Math.floor(Math.random() * TERMS.length);
    if (r !== correctIdx && !others.includes(r)) others.push(r);
  }
  return shuffle([correctIdx, ...others]);
}

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

export function SpeedRound({ lang }: { lang: Lang }) {
  const { state, recordSpeedRound } = useProgress();
  const isEn = lang === "en";

  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [answered, setAnswered] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [beatingRecord, setBeatingRecord] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const order = useMemo(
    () => shuffle(Array.from({ length: TERMS.length }, (_, i) => i)),
    // Re-shuffle each time phase goes to idle
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase === "idle"]
  );

  const currentTermIdx = order[currentIdx % order.length]!;
  const term = TERMS[currentTermIdx]!;

  // Setup options when question changes
  useEffect(() => {
    if (phase === "playing") {
      setOptions(pickOptions(currentTermIdx));
      setFeedback(null);
    }
  }, [currentIdx, phase, currentTermIdx]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Record score when finished
  useEffect(() => {
    if (phase === "finished" && score > 0) {
      recordSpeedRound(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startRound = useCallback(() => {
    setPhase("playing");
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setAnswered(0);
    setCurrentIdx(0);
    setFeedback(null);
    setCombo(0);
    setBestCombo(0);
    setTotalXP(0);
    setBeatingRecord(false);
  }, []);

  const handleAnswer = useCallback(
    (optionTermIdx: number) => {
      if (feedback !== null) return;
      const correct = optionTermIdx === currentTermIdx;
      setFeedback(correct ? "correct" : "wrong");
      setAnswered((a) => a + 1);

      if (correct) {
        const newCombo = combo + 1;
        const mult = getComboMultiplier(newCombo);
        const earned = 2 * mult;
        setScore((s) => {
          const newScore = s + 1;
          if (newScore > state.speedRoundBest && state.speedRoundBest > 0) {
            setBeatingRecord(true);
          }
          return newScore;
        });
        setCombo(newCombo);
        setTotalXP((x) => x + earned);
        if (newCombo > bestCombo) setBestCombo(newCombo);
      } else {
        setCombo(0);
      }

      setTimeout(() => {
        setCurrentIdx((i) => i + 1);
      }, 400);
    },
    [feedback, currentTermIdx, combo, bestCombo, state.speedRoundBest]
  );

  const timerPercent = (timeLeft / ROUND_SECONDS) * 100;
  const timerColor =
    timeLeft > 30
      ? "bg-emerald-500"
      : timeLeft > 10
        ? "bg-amber-500"
        : "bg-red-500";

  const mult = getComboMultiplier(combo);

  // Idle state
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Speed Round" : "Ronda rápida"}
          </h3>
        </div>
        <p className="mb-4 text-[11px] text-slate-500 dark:text-neutral-400">
          {isEn
            ? `${ROUND_SECONDS}s to answer as many as you can. Build combos for x2, x3, x4 XP! Best: ${state.speedRoundBest}`
            : `${ROUND_SECONDS}s para responder todos los que puedas. ¡Combos para x2, x3, x4 XP! Mejor: ${state.speedRoundBest}`}
        </p>
        <motion.button
          type="button"
          onClick={startRound}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition-shadow hover:shadow-violet-500/30"
        >
          {isEn ? "Start Speed Round" : "Iniciar ronda rápida"}
        </motion.button>
      </motion.div>
    );
  }

  // Finished state
  if (phase === "finished") {
    const isBest = score >= state.speedRoundBest && score > 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="mb-2 text-4xl"
          >
            {isBest ? "🏆" : score >= 10 ? "🎉" : "💪"}
          </motion.div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {score}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            {isEn
              ? `${score}/${answered} correct in ${ROUND_SECONDS}s`
              : `${score}/${answered} correctas en ${ROUND_SECONDS}s`}
          </p>
          <div className="mt-2 flex justify-center gap-4 text-center">
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
          {isBest && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-[10px] font-bold text-amber-500"
            >
              {isEn ? "New personal best!" : "¡Nuevo récord personal!"}
            </motion.p>
          )}
        </div>
        <motion.button
          type="button"
          onClick={() => setPhase("idle")}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-violet-50 py-2.5 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
        >
          {isEn ? "Play Again" : "Jugar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Playing state
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Timer bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tabular-nums text-slate-900 dark:text-white">
            {timeLeft}s
          </span>
          <span className="text-[10px] text-slate-400 dark:text-neutral-500">
            {isEn ? "Score:" : "Puntos:"} {score}
          </span>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
        <motion.div
          className={`h-full rounded-full ${timerColor}`}
          animate={{ width: `${timerPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Term */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-1 text-[10px] font-medium text-slate-400 dark:text-neutral-500">
            {isEn ? "What does this mean?" : "¿Qué significa?"}
          </p>
          <p className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? term.labelEn : term.labelEs}
          </p>

          <div className="space-y-1.5">
            {options.map((optIdx) => {
              const opt = TERMS[optIdx]!;
              const isCorrectOpt = optIdx === currentTermIdx;
              const showCorrect = feedback !== null && isCorrectOpt;
              const showWrong =
                feedback === "wrong" && optIdx !== currentTermIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleAnswer(optIdx)}
                  disabled={feedback !== null}
                  className={`w-full rounded-lg px-3 py-2 text-left text-[11px] leading-snug transition-all ${
                    showCorrect
                      ? "border border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : showWrong
                        ? "border border-gray-200 text-slate-300 dark:border-white/[0.04] dark:text-neutral-600"
                        : "border border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.08] dark:text-neutral-300 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {isEn ? opt.shortEn : opt.shortEs}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
