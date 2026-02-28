"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type Phase = "idle" | "playing" | "won";

type Card = {
  id: string;
  pairId: string;
  content: string;
  type: "term" | "def";
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const PAIRS = 6;
const XP_BASE = 30;

export function TermMatcher({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed, recordMatcherTime } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [matchStreak, setMatchStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastMatchFlash, setLastMatchFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  // Load best time
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-matcher-best");
      if (raw) setBestTime(Number(raw));
    } catch {}
  }, []);

  const startGame = useCallback(() => {
    const selected = shuffle(TERMS).slice(0, PAIRS);
    const newCards: Card[] = [];
    selected.forEach((term) => {
      newCards.push({
        id: `${term.id}-term`,
        pairId: term.id,
        content: isEn ? term.labelEn : term.labelEs,
        type: "term",
      });
      newCards.push({
        id: `${term.id}-def`,
        pairId: term.id,
        content: isEn ? term.shortEn : term.shortEs,
        type: "def",
      });
    });
    setCards(shuffle(newCards));
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setElapsed(0);
    setMatchStreak(0);
    setBestStreak(0);
    setLastMatchFlash(false);
    setPhase("playing");
    lockRef.current = false;
  }, [isEn]);

  // Timer
  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, [phase]);

  const handleFlip = useCallback(
    (idx: number) => {
      if (phase !== "playing" || lockRef.current) return;
      if (flipped.includes(idx)) return;
      if (matched.includes(cards[idx].pairId)) return;

      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        lockRef.current = true;
        setAttempts((a) => a + 1);

        const [first, second] = newFlipped;
        const card1 = cards[first];
        const card2 = cards[second];

        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
          // Match!
          const newMatched = [...matched, card1.pairId];
          setMatched(newMatched);
          setFlipped([]);
          lockRef.current = false;

          const newStreak = matchStreak + 1;
          setMatchStreak(newStreak);
          if (newStreak > bestStreak) setBestStreak(newStreak);

          // Flash effect
          setLastMatchFlash(true);
          setTimeout(() => setLastMatchFlash(false), 400);

          if (newMatched.length === PAIRS) {
            // Won!
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("won");

            // Improved XP calculation: smoother scaling
            const attemptBonus = Math.max(0, 20 - Math.max(0, attempts - PAIRS));
            const speedBonus = Math.max(0, Math.floor((180 - elapsed) / 8));
            const streakBonus = newStreak >= 3 ? 10 : 0;
            const totalXP = XP_BASE + attemptBonus + speedBonus + streakBonus;
            addXP(totalXP);
            recordGamePlayed("term_matcher");
            recordMatcherTime(elapsed);

            // Save best time
            const finalTime = elapsed;
            if (bestTime === null || finalTime < bestTime) {
              setBestTime(finalTime);
              try {
                localStorage.setItem(
                  "tax-guide-matcher-best",
                  String(finalTime)
                );
              } catch {}
            }
          }
        } else {
          // No match — flip back
          setMatchStreak(0);
          setTimeout(() => {
            setFlipped([]);
            lockRef.current = false;
          }, 800);
        }
      }
    },
    [
      phase,
      flipped,
      matched,
      cards,
      attempts,
      elapsed,
      addXP,
      bestTime,
      matchStreak,
      bestStreak,
    ]
  );

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/15 to-rose-500/15 text-xl dark:from-pink-500/20 dark:to-rose-500/20">
            🃏
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white">
              {isEn ? "Term Matcher" : "Emparejar términos"}
            </h3>
            <span className="text-[10px] font-semibold text-pink-500/80">
              {isEn ? "Memory" : "Memoria"}
            </span>
          </div>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
          {isEn
            ? "Flip cards to match tax terms with definitions. Consecutive matches earn streak bonus XP!"
            : "Voltea cartas para emparejar términos con definiciones. ¡Emparejamientos consecutivos = XP de racha!"}
        </p>
        {bestTime !== null && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-violet-50/80 px-3 py-2 dark:bg-violet-500/10">
            <span className="text-xs">🏆</span>
            <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
              {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, "0")}
            </span>
            <span className="text-[10px] text-violet-500/60">
              {isEn ? "best time" : "mejor tiempo"}
            </span>
          </div>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/25 transition-shadow hover:shadow-pink-500/35"
        >
          {isEn ? "Start Game" : "Iniciar juego"}
        </motion.button>
      </motion.div>
    );
  }

  // Won
  if (phase === "won") {
    const attemptBonus = Math.max(0, 20 - Math.max(0, attempts - PAIRS));
    const speedBonus = Math.max(0, Math.floor((180 - elapsed) / 8));
    const streakBonus = bestStreak >= 3 ? 10 : 0;
    const totalXP = XP_BASE + attemptBonus + speedBonus + streakBonus;

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
          🎉
        </motion.div>
        <p className="text-lg font-black text-slate-900 dark:text-white">
          {isEn ? "All Matched!" : "¡Todos emparejados!"}
        </p>
        <div className="mt-3 flex gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-pink-500">{attempts}</p>
            <p className="text-[9px] text-slate-400">
              {isEn ? "attempts" : "intentos"}
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-700 dark:text-neutral-200 tabular-nums">
              {mins}:{secs.toString().padStart(2, "0")}
            </p>
            <p className="text-[9px] text-slate-400">
              {isEn ? "time" : "tiempo"}
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-violet-500">+{totalXP}</p>
            <p className="text-[9px] text-slate-400">XP</p>
          </div>
        </div>
        {bestStreak >= 3 && (
          <p className="mt-2 text-[10px] text-amber-500">
            {isEn
              ? `${bestStreak} consecutive matches! +10 streak bonus`
              : `¡${bestStreak} emparejamientos consecutivos! +10 bonus`}
          </p>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/20"
        >
          {isEn ? "Play Again" : "Jugar de nuevo"}
        </motion.button>
      </motion.div>
    );
  }

  // Playing
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col p-5 sm:p-6"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🃏</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Term Matcher" : "Emparejar términos"}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {matchStreak >= 2 && (
            <motion.span
              key={matchStreak}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold text-amber-500"
            >
              {matchStreak}x
            </motion.span>
          )}
          <span className="text-slate-500 dark:text-neutral-400">
            {matched.length}/{PAIRS}
          </span>
          <span className="font-bold tabular-nums text-slate-700 dark:text-neutral-200">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx);
          const isMatched = matched.includes(card.pairId);
          const showFace = isFlipped || isMatched;

          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => handleFlip(idx)}
              whileTap={!showFace ? { scale: 0.95 } : undefined}
              animate={
                isMatched && lastMatchFlash
                  ? { scale: [1, 1.05, 1] }
                  : undefined
              }
              className={`relative flex min-h-[72px] items-center justify-center rounded-xl border p-2 text-center transition-all duration-200 ${
                isMatched
                  ? "border-emerald-400/40 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                  : isFlipped
                    ? "border-pink-400/40 bg-pink-50 dark:border-pink-500/20 dark:bg-pink-500/10"
                    : "cursor-pointer border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
              }`}
            >
              <AnimatePresence mode="wait">
                {showFace ? (
                  <motion.span
                    key="face"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-[10px] leading-tight ${
                      card.type === "term"
                        ? "font-bold text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-neutral-300"
                    }`}
                  >
                    {card.content}
                  </motion.span>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg text-slate-300 dark:text-neutral-600"
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
