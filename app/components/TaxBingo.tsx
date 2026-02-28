"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type Phase = "idle" | "playing" | "won";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const GRID_SIZE = 3;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const XP_PER_CELL = 4;
const BINGO_BONUS = 35;

type BingoCell = {
  term: (typeof TERMS)[0];
  claimed: boolean;
  failed: boolean;
};

type QuestionState = {
  cellIdx: number;
  term: (typeof TERMS)[0];
  options: string[];
  correctIdx: number;
} | null;

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function checkBingo(cells: BingoCell[]): number[] | null {
  for (const line of WIN_LINES) {
    if (line.every((i) => cells[i].claimed)) return line;
  }
  return null;
}

export function TaxBingo({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP, recordGamePlayed, recordBingoWin } = useProgress();

  const [phase, setPhase] = useState<Phase>("idle");
  const [cells, setCells] = useState<BingoCell[]>([]);
  const [question, setQuestion] = useState<QuestionState>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [claimedCount, setClaimedCount] = useState(0);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [bestClaimed, setBestClaimed] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const xpAwarded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-bingo-best");
      if (raw) setBestClaimed(Number(raw));
    } catch {}
  }, []);

  const startGame = useCallback(() => {
    const selectedTerms = shuffle(TERMS).slice(0, TOTAL_CELLS);
    const newCells: BingoCell[] = selectedTerms.map((term) => ({
      term,
      claimed: false,
      failed: false,
    }));
    setCells(newCells);
    setQuestion(null);
    setSelected(null);
    setClaimedCount(0);
    setWinLine(null);
    setTotalXP(0);
    xpAwarded.current = false;
    setPhase("playing");
  }, []);

  // Award XP on win
  useEffect(() => {
    if (phase === "won" && !xpAwarded.current) {
      xpAwarded.current = true;
      const finalXP = totalXP + BINGO_BONUS;
      if (finalXP > 0) addXP(finalXP);
      recordGamePlayed("tax_bingo");
      if (winLine) recordBingoWin();
      if (claimedCount > bestClaimed) {
        setBestClaimed(claimedCount);
        try {
          localStorage.setItem("tax-guide-bingo-best", String(claimedCount));
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const openQuestion = useCallback(
    (cellIdx: number) => {
      if (question || cells[cellIdx].claimed || cells[cellIdx].failed) return;
      const term = cells[cellIdx].term;

      const wrongTerms = shuffle(TERMS.filter((t) => t.id !== term.id)).slice(
        0,
        3
      );
      const correctDef = isEn ? term.shortEn : term.shortEs;
      const allOptions = shuffle([
        correctDef,
        ...wrongTerms.map((t) => (isEn ? t.shortEn : t.shortEs)),
      ]);
      const correctIdx = allOptions.indexOf(correctDef);

      setQuestion({ cellIdx, term, options: allOptions, correctIdx });
      setSelected(null);
    },
    [question, cells, isEn]
  );

  const handleAnswer = useCallback(
    (optIdx: number) => {
      if (selected !== null || !question) return;
      setSelected(optIdx);

      const isCorrect = optIdx === question.correctIdx;
      const cellIdx = question.cellIdx;

      setTimeout(() => {
        const newCells = [...cells];
        if (isCorrect) {
          newCells[cellIdx] = { ...newCells[cellIdx], claimed: true };
          const newClaimed = claimedCount + 1;
          setClaimedCount(newClaimed);
          setTotalXP((x) => x + XP_PER_CELL);

          const bingo = checkBingo(newCells);
          if (bingo) {
            setWinLine(bingo);
            setCells(newCells);
            setQuestion(null);
            setSelected(null);
            setPhase("won");
            return;
          }
        } else {
          newCells[cellIdx] = { ...newCells[cellIdx], failed: true };
        }
        setCells(newCells);
        setQuestion(null);
        setSelected(null);

        // Check if all cells are used (no more moves)
        const remaining = newCells.filter((c) => !c.claimed && !c.failed);
        if (remaining.length === 0 && !checkBingo(newCells)) {
          setPhase("won"); // end game even without bingo
        }
      }, 800);
    },
    [selected, question, cells, claimedCount]
  );

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">🎱</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Tax Bingo" : "Bingo fiscal"}
          </h3>
        </div>
        <p className="mb-2 text-[11px] text-slate-500 dark:text-neutral-400">
          {isEn
            ? "Pick cells, answer correctly to claim them. Get 3 in a row for BINGO and bonus XP!"
            : "Elige celdas, responde bien para reclamarlas. ¡Haz 3 en línea para BINGO y XP extra!"}
        </p>
        {bestClaimed > 0 && (
          <p className="mb-3 text-[10px] text-orange-500">
            {isEn
              ? `Best: ${bestClaimed} claimed`
              : `Mejor: ${bestClaimed} reclamadas`}
          </p>
        )}
        <motion.button
          type="button"
          onClick={startGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
        >
          {isEn ? "Start Bingo" : "Comenzar Bingo"}
        </motion.button>
      </motion.div>
    );
  }

  // Won
  if (phase === "won") {
    const hasBingo = winLine !== null;
    const finalXP = totalXP + (hasBingo ? BINGO_BONUS : 0);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mb-2 text-5xl"
        >
          {hasBingo ? "🎉" : "👏"}
        </motion.div>
        <p className="text-lg font-black text-orange-500">
          {hasBingo
            ? isEn
              ? "BINGO!"
              : "¡BINGO!"
            : isEn
              ? "Game Over"
              : "Fin del juego"}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
          {isEn
            ? `${claimedCount}/${TOTAL_CELLS} cells claimed`
            : `${claimedCount}/${TOTAL_CELLS} celdas reclamadas`}
        </p>
        <p className="mt-2 text-xl font-bold text-violet-500">+{finalXP} XP</p>
        <motion.button
          type="button"
          onClick={startGame}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
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
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎱</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Tax Bingo" : "Bingo fiscal"}
          </h3>
        </div>
        <span className="text-emerald-500 text-[10px] font-bold">
          {claimedCount}✓
        </span>
      </div>

      {/* Bingo Grid */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {cells.map((cell, idx) => (
          <motion.button
            key={cell.term.id}
            type="button"
            onClick={() => openQuestion(idx)}
            disabled={cell.claimed || cell.failed || question !== null}
            whileTap={
              !cell.claimed && !cell.failed && !question
                ? { scale: 0.95 }
                : undefined
            }
            className={`relative flex min-h-[64px] items-center justify-center rounded-xl border p-2 text-center transition-all ${
              cell.claimed
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                : cell.failed
                  ? "border-red-300/40 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/5"
                  : question?.cellIdx === idx
                    ? "border-orange-400 bg-orange-50 ring-2 ring-orange-400/30 dark:border-orange-500/40 dark:bg-orange-500/10"
                    : "cursor-pointer border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
            }`}
          >
            {cell.claimed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center text-2xl"
              >
                ✅
              </motion.div>
            )}
            {cell.failed && (
              <span className="absolute inset-0 flex items-center justify-center text-lg opacity-40">
                ❌
              </span>
            )}
            <span
              className={`text-[10px] font-bold leading-tight ${
                cell.claimed
                  ? "text-emerald-600/40 dark:text-emerald-400/40"
                  : cell.failed
                    ? "text-slate-400/50 line-through dark:text-neutral-500/50"
                    : "text-slate-700 dark:text-neutral-200"
              }`}
            >
              {isEn ? cell.term.labelEn : cell.term.labelEs}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Question Modal */}
      <AnimatePresence>
        {question && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border-2 border-orange-300 bg-orange-50 p-4 dark:border-orange-500/30 dark:bg-orange-500/10"
          >
            <p className="mb-1 text-[10px] font-medium text-orange-600/60 dark:text-orange-400/60">
              {isEn ? "Define this term:" : "Define este término:"}
            </p>
            <p className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
              {isEn ? question.term.labelEn : question.term.labelEs}
            </p>

            <div className="space-y-2">
              {question.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === question.correctIdx;
                const showResult = selected !== null;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-[10px] leading-snug transition-all ${
                      showResult && isCorrect
                        ? "border-emerald-400/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : showResult && isSelected && !isCorrect
                          ? "border-red-400/40 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                          : showResult
                            ? "border-gray-200 text-slate-400 dark:border-white/[0.04] dark:text-neutral-600"
                            : "border-gray-200 bg-white text-slate-600 hover:border-gray-300 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!question && (
        <p className="text-center text-[10px] text-slate-400 dark:text-neutral-500">
          {isEn
            ? "Tap a cell to answer its question"
            : "Toca una celda para responder su pregunta"}
        </p>
      )}
    </motion.div>
  );
}
