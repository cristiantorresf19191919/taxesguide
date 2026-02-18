"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import type { TermRecord } from "@/app/data/terms";

type Lang = "en" | "es";
type Mode = "flashcard" | "quiz";

const QUIZ_HISTORY_KEY = "tax-guide-quiz-history";

type QuizHistory = {
  totalAttempted: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  lastDate: string;
  mastered: string[]; // term IDs answered correctly 3+ times
  termScores: Record<string, { correct: number; wrong: number }>;
};

function loadHistory(): QuizHistory {
  if (typeof window === "undefined") return defaultHistory();
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return defaultHistory();
    return { ...defaultHistory(), ...JSON.parse(raw) };
  } catch { return defaultHistory(); }
}

function defaultHistory(): QuizHistory {
  return { totalAttempted: 0, totalCorrect: 0, streak: 0, bestStreak: 0, lastDate: "", mastered: [], termScores: {} };
}

function saveHistory(h: QuizHistory) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(h)); } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const ui = {
  en: {
    title: "Flashcard Quiz",
    subtitle: "Test and reinforce your tax terminology knowledge",
    back: "Back to menu",
    flashcard: "Flashcards",
    quiz: "Multiple Choice",
    flip: "Tap to flip",
    next: "Next Card",
    prev: "Previous",
    of: "of",
    mastered: "Mastered",
    score: "Score",
    streak: "Streak",
    best: "Best",
    correct: "Correct!",
    wrong: "Incorrect",
    tryAgain: "Try again",
    checkAnswer: "Which term matches this definition?",
    showAnswer: "Show Answer",
    stats: "Your Stats",
    totalAnswered: "Total answered",
    accuracy: "Accuracy",
    termsMastered: "Terms mastered",
    restart: "Restart",
    shuffleCards: "Shuffle",
  },
  es: {
    title: "Quiz de Tarjetas",
    subtitle: "Prueba y refuerza tu conocimiento de terminología fiscal",
    back: "Volver al menú",
    flashcard: "Tarjetas",
    quiz: "Opción Múltiple",
    flip: "Toca para voltear",
    next: "Siguiente",
    prev: "Anterior",
    of: "de",
    mastered: "Dominados",
    score: "Puntaje",
    streak: "Racha",
    best: "Mejor",
    correct: "¡Correcto!",
    wrong: "Incorrecto",
    tryAgain: "Intentar de nuevo",
    checkAnswer: "¿Qué término coincide con esta definición?",
    showAnswer: "Mostrar Respuesta",
    stats: "Tus Estadísticas",
    totalAnswered: "Total respondidas",
    accuracy: "Precisión",
    termsMastered: "Términos dominados",
    restart: "Reiniciar",
    shuffleCards: "Mezclar",
  },
};

function ConfettiPiece({ delay }: { delay: number }) {
  const colors = ["#34d399", "#818cf8", "#fbbf24", "#f472b6", "#22d3ee", "#a78bfa"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.random() * 200 - 100;
  const rotation = Math.random() * 720 - 360;

  return (
    <motion.div
      initial={{ y: 0, x: 0, rotate: 0, opacity: 1, scale: 1 }}
      animate={{ y: -120 - Math.random() * 80, x, rotate: rotation, opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8 + Math.random() * 0.5, delay, ease: "easeOut" }}
      className="absolute bottom-0 h-2 w-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export default function QuizPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("flashcard");
  const [cards, setCards] = useState<TermRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [history, setHistory] = useState<QuizHistory>(defaultHistory());
  const [quizOptions, setQuizOptions] = useState<TermRecord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const t = ui[lang];

  useEffect(() => {
    setCards(shuffle(TERMS));
    setHistory(loadHistory());
  }, []);

  const currentCard = cards[currentIndex];

  // Generate quiz options when card changes
  useEffect(() => {
    if (!currentCard || mode !== "quiz") return;
    const wrong = shuffle(TERMS.filter((t) => t.id !== currentCard.id)).slice(0, 3);
    setQuizOptions(shuffle([currentCard, ...wrong]));
    setSelectedAnswer(null);
    setAnswerRevealed(false);
  }, [currentIndex, currentCard, mode]);

  const goNext = useCallback(() => {
    setFlipped(false);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleQuizAnswer = useCallback((termId: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(termId);

    const isCorrect = termId === currentCard?.id;

    setHistory((prev) => {
      const next = { ...prev };
      next.totalAttempted++;
      if (isCorrect) {
        next.totalCorrect++;
        next.streak++;
        if (next.streak > next.bestStreak) next.bestStreak = next.streak;
      } else {
        next.streak = 0;
      }

      // Track per-term scores
      const termKey = currentCard?.id ?? "";
      if (!next.termScores[termKey]) next.termScores[termKey] = { correct: 0, wrong: 0 };
      if (isCorrect) {
        next.termScores[termKey].correct++;
        if (next.termScores[termKey].correct >= 3 && !next.mastered.includes(termKey)) {
          next.mastered.push(termKey);
        }
      } else {
        next.termScores[termKey].wrong++;
      }

      next.lastDate = new Date().toISOString().slice(0, 10);
      saveHistory(next);
      return next;
    });

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }
  }, [selectedAnswer, currentCard]);

  const reshuffleCards = useCallback(() => {
    setCards(shuffle(TERMS));
    setCurrentIndex(0);
    setFlipped(false);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
  }, []);

  const accuracy = history.totalAttempted > 0
    ? Math.round((history.totalCorrect / history.totalAttempted) * 100)
    : 0;

  const progressPct = cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0;

  if (!currentCard) return null;

  const termLabel = lang === "es" ? currentCard.labelEs : currentCard.labelEn;
  const termDef = lang === "es" ? currentCard.longEs : currentCard.longEn;
  const termShort = lang === "es" ? currentCard.shortEs : currentCard.shortEn;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-[-100px] top-[20%] h-[400px] w-[400px] rounded-full bg-amber-500/8 blur-[120px]"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-80px] top-[60%] h-[350px] w-[350px] rounded-full bg-violet-500/8 blur-[100px]"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <motion.span whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="text-sm font-medium text-neutral-400 transition-colors hover:text-white">
              ← {t.back}
            </Link>
          </motion.span>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-white/[0.06] p-0.5">
              <button
                onClick={() => setMode("flashcard")}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${mode === "flashcard" ? "bg-white/15 text-white" : "text-neutral-500 hover:text-neutral-300"}`}
              >
                {t.flashcard}
              </button>
              <button
                onClick={() => setMode("quiz")}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${mode === "quiz" ? "bg-white/15 text-white" : "text-neutral-500 hover:text-neutral-300"}`}
              >
                {t.quiz}
              </button>
            </div>
            <button
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t.subtitle}</p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 grid grid-cols-4 gap-3"
        >
          {[
            { label: t.score, value: `${accuracy}%`, color: "text-emerald-400" },
            { label: t.streak, value: history.streak.toString(), color: "text-amber-400" },
            { label: t.best, value: history.bestStreak.toString(), color: "text-violet-400" },
            { label: t.mastered, value: `${history.mastered.length}/${TERMS.length}`, color: "text-blue-400" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-[#141417] p-3 text-center">
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between text-[10px] text-neutral-500">
            <span>{currentIndex + 1} {t.of} {cards.length}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card area */}
        <AnimatePresence mode="wait">
          {mode === "flashcard" ? (
            <motion.div
              key={`flash-${currentIndex}`}
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto max-w-xl"
            >
              <div
                onClick={() => setFlipped((f) => !f)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141417] transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_0_40px_rgba(139,92,246,0.08)]"
                style={{ minHeight: 280, perspective: 1000 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
                </div>

                <AnimatePresence mode="wait">
                  {!flipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-8 text-center"
                      style={{ minHeight: 280 }}
                    >
                      <div className="mb-2 rounded-lg bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {currentCard.isAbbreviation ? "Abbreviation" : "Term"}
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight text-white">{termLabel}</h2>
                      <p className="mt-4 text-sm leading-relaxed text-neutral-400">{termShort}</p>
                      <p className="mt-6 text-xs text-neutral-600">{t.flip}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col justify-center p-8"
                      style={{ minHeight: 280 }}
                    >
                      <div className="mb-3 rounded-lg bg-violet-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-400 inline-flex self-start">
                        Full Definition
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-white">{termLabel}</h3>
                      <p className="text-sm leading-relaxed text-neutral-300">{termDef}</p>
                      <p className="mt-6 text-xs text-neutral-600">{t.flip}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Quiz mode */
            <motion.div
              key={`quiz-${currentIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="relative mx-auto max-w-xl"
            >
              {/* Confetti burst */}
              {showConfetti && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <ConfettiPiece key={i} delay={i * 0.03} />
                  ))}
                </div>
              )}

              <div className="rounded-2xl border border-white/[0.08] bg-[#141417] p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">{t.checkAnswer}</p>
                <p className="mb-6 text-sm leading-relaxed text-neutral-300">
                  {answerRevealed ? termDef : termShort}
                </p>

                {!answerRevealed && (
                  <button
                    onClick={() => setAnswerRevealed(true)}
                    className="mb-4 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    {t.showAnswer}
                  </button>
                )}

                <div className="space-y-2">
                  {quizOptions.map((option) => {
                    const label = lang === "es" ? option.labelEs : option.labelEn;
                    const isCorrectOption = option.id === currentCard.id;
                    const isSelected = selectedAnswer === option.id;
                    let cls = "border-white/[0.08] bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06] hover:border-white/[0.15]";

                    if (selectedAnswer) {
                      if (isCorrectOption) {
                        cls = "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
                      } else if (isSelected && !isCorrectOption) {
                        cls = "border-red-500/40 bg-red-500/15 text-red-300";
                      } else {
                        cls = "border-white/[0.05] bg-white/[0.02] text-neutral-500";
                      }
                    }

                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleQuizAnswer(option.id)}
                        whileHover={selectedAnswer ? {} : { scale: 1.01 }}
                        whileTap={selectedAnswer ? {} : { scale: 0.99 }}
                        disabled={!!selectedAnswer}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${cls}`}
                      >
                        <span className="flex items-center justify-between">
                          <span>{label}</span>
                          {selectedAnswer && isCorrectOption && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                          )}
                          {selectedAnswer && isSelected && !isCorrectOption && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          )}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    <p className={`text-sm font-bold ${selectedAnswer === currentCard.id ? "text-emerald-400" : "text-red-400"}`}>
                      {selectedAnswer === currentCard.id ? t.correct : t.wrong}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <motion.button
            onClick={goPrev}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10"
          >
            ← {t.prev}
          </motion.button>
          <motion.button
            onClick={reshuffleCards}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10"
          >
            {t.shuffleCards}
          </motion.button>
          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
          >
            {t.next} →
          </motion.button>
        </div>

        {/* Stats section */}
        {history.totalAttempted > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/[0.07] bg-[#141417] p-5"
          >
            <h3 className="mb-4 text-sm font-bold text-white">{t.stats}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{history.totalAttempted}</div>
                <div className="text-[10px] text-neutral-500">{t.totalAnswered}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">{accuracy}%</div>
                <div className="text-[10px] text-neutral-500">{t.accuracy}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-400">{history.mastered.length}</div>
                <div className="text-[10px] text-neutral-500">{t.termsMastered}</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
