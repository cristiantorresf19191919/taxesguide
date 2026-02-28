"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

/* ---------- Acronym highlighter ---------- */
const ACRONYMS = [
  "PTIN", "EFIN", "AFSP", "AFTR", "LLC", "WISP", "EIN", "CPA", "EA",
  "EITC", "CTC", "AOTC", "MFA", "VPN", "E&O", "DBA", "SSN", "IRS",
  "AGI", "VITA", "TCE", "ITIN", "MFJ", "SEE", "CE", "GTC", "DOR",
  "NASBA", "CTEC", "ERO", "FTC", "FTP", "CTP", "BNI", "NATP", "NSA",
  "W-2", "W-12", "1099", "1040", "1120S", "1065",
];

// Sort longest-first so "E&O" matches before "E" would
const ACRONYM_PATTERN = new RegExp(
  `\\b(${ACRONYMS.sort((a, b) => b.length - a.length)
    .map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g"
);

function highlightAcronyms(text: string, accentClass: string): React.ReactNode {
  const parts = text.split(ACRONYM_PATTERN);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    ACRONYMS.includes(part) ? (
      <span key={i} className={`font-bold ${accentClass}`}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export type QuizQuestion = {
  en: {
    question: string;
    options: string[];
    correct: number; // index of correct option
    explanation: string;
  };
  es: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
};

type QuizState = "idle" | "answering" | "correct" | "wrong" | "complete";

const ui = {
  en: {
    title: "Knowledge Check",
    subtitle: "Test your understanding of the key concepts",
    start: "Start Quiz",
    restart: "Restart Quiz",
    next: "Next Question",
    finish: "See Results",
    question: "Question",
    of: "of",
    correct: "Correct!",
    incorrect: "Not quite right",
    explanation: "Explanation",
    score: "Your Score",
    perfect: "Perfect score! You have mastered this material.",
    great: "Great job! You have a strong understanding.",
    good: "Good effort! Review the explanations above to strengthen your knowledge.",
    tryAgain: "Keep studying! Review the material and try again.",
    questionsRight: "questions correct",
    reviewMistakes: "Review Mistakes",
    backToQuiz: "Back to Results",
  },
  es: {
    title: "Verificación de Conocimientos",
    subtitle: "Pon a prueba tu comprensión de los conceptos clave",
    start: "Iniciar Quiz",
    restart: "Reiniciar Quiz",
    next: "Siguiente Pregunta",
    finish: "Ver Resultados",
    question: "Pregunta",
    of: "de",
    correct: "¡Correcto!",
    incorrect: "No del todo correcto",
    explanation: "Explicación",
    score: "Tu Puntaje",
    perfect: "¡Puntaje perfecto! Has dominado este material.",
    great: "¡Excelente! Tienes una comprensión sólida.",
    good: "¡Buen esfuerzo! Revisa las explicaciones para reforzar tu conocimiento.",
    tryAgain: "¡Sigue estudiando! Revisa el material e inténtalo de nuevo.",
    questionsRight: "preguntas correctas",
    reviewMistakes: "Revisar Errores",
    backToQuiz: "Volver a Resultados",
  },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function AnalysisQuiz({
  questions,
  lang,
  accentColor = "emerald",
}: {
  questions: QuizQuestion[];
  lang: Lang;
  accentColor?: "emerald" | "amber" | "blue";
}) {
  const t = ui[lang];
  const { recordQuizCorrect, recordQuizPerfect } = useProgress();
  const [state, setState] = useState<QuizState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showReview, setShowReview] = useState(false);
  const perfectRecordedRef = useRef(false);

  const shuffledQuestions = useMemo(() => shuffle(questions), [questions]);

  const totalQuestions = shuffledQuestions.length;
  const current = shuffledQuestions[currentIndex];
  const q = current?.[lang];

  const correctCount = answers.filter(
    (a, i) => a === shuffledQuestions[i]?.[lang].correct
  ).length;

  const accentMap = {
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-500/20",
      bgHover: "hover:bg-emerald-100 dark:hover:bg-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-300 dark:border-emerald-500/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      ring: "ring-emerald-300/40 dark:ring-emerald-400/40",
      gradient: "from-emerald-50 to-teal-50 dark:from-emerald-500/20 dark:to-teal-600/10",
      progressBg: "bg-emerald-500",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-500/20",
      bgHover: "hover:bg-amber-100 dark:hover:bg-amber-500/30",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-300 dark:border-amber-500/30",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)] dark:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
      ring: "ring-amber-300/40 dark:ring-amber-400/40",
      gradient: "from-amber-50 to-orange-50 dark:from-amber-500/20 dark:to-orange-600/10",
      progressBg: "bg-amber-500",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-500/20",
      bgHover: "hover:bg-blue-100 dark:hover:bg-blue-500/30",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-300 dark:border-blue-500/30",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
      ring: "ring-blue-300/40 dark:ring-blue-400/40",
      gradient: "from-blue-50 to-violet-50 dark:from-blue-500/20 dark:to-violet-600/10",
      progressBg: "bg-blue-500",
    },
  };

  const accent = accentMap[accentColor];
  const hl = (text: string) => highlightAcronyms(text, accent.text);

  // Record perfect quiz when quiz completes with 100%
  useEffect(() => {
    if (state === "complete" && !perfectRecordedRef.current) {
      const finalCorrect = answers.filter(
        (a, i) => a === shuffledQuestions[i]?.[lang].correct
      ).length;
      if (finalCorrect === totalQuestions && totalQuestions > 0) {
        recordQuizPerfect();
      }
      perfectRecordedRef.current = true;
    }
  }, [state, answers, shuffledQuestions, lang, totalQuestions, recordQuizPerfect]);

  const startQuiz = useCallback(() => {
    setState("answering");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowReview(false);
    perfectRecordedRef.current = false;
  }, []);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (state !== "answering" || selected !== null) return;
      setSelected(optionIndex);
      const isCorrect = optionIndex === q?.correct;
      setAnswers((prev) => [...prev, optionIndex]);
      setState(isCorrect ? "correct" : "wrong");
      if (isCorrect) recordQuizCorrect();
    },
    [state, selected, q?.correct, recordQuizCorrect]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setState("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setState("answering");
    }
  }, [currentIndex, totalQuestions]);

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const getResultMessage = () => {
    if (percentage === 100) return t.perfect;
    if (percentage >= 70) return t.great;
    if (percentage >= 50) return t.good;
    return t.tryAgain;
  };

  // Idle state — show start button
  if (state === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12"
      >
        <div className={`rounded-3xl border border-gray-200 bg-gradient-to-br dark:border-white/[0.08] ${accent.gradient} p-8 text-center backdrop-blur-sm sm:p-12`}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/[0.04] dark:bg-white/[0.08]">
              <QuizIcon className={`h-8 w-8 ${accent.text}`} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t.title}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">{t.subtitle}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
              {totalQuestions} {lang === "en" ? "questions" : "preguntas"}
            </p>
            <motion.button
              onClick={startQuiz}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`mt-6 inline-flex items-center gap-2 rounded-2xl ${accent.bg} ${accent.bgHover} px-8 py-3.5 text-sm font-semibold ${accent.text} transition-all duration-200 ${accent.glow}`}
            >
              <PlayIcon className="h-4 w-4" />
              {t.start}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Complete state — show results
  if (state === "complete" && !showReview) {
    const wrongOnes = shuffledQuestions
      .map((sq, i) => ({ q: sq, userAnswer: answers[i], index: i }))
      .filter((item) => item.userAnswer !== item.q[lang].correct);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12"
      >
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-12">
          {/* Score circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mx-auto mb-6"
          >
            <div className={`relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 ${percentage >= 70 ? "border-emerald-400/50" : percentage >= 50 ? "border-amber-400/50" : "border-red-400/50"}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${percentage >= 70 ? "text-emerald-400" : percentage >= 50 ? "text-amber-400" : "text-red-400"}`}>
                  {percentage}%
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t.score}</h2>
            <p className="mt-2 text-slate-500 dark:text-neutral-400">
              {correctCount}/{totalQuestions} {t.questionsRight}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-neutral-300">{getResultMessage()}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <motion.button
                onClick={startQuiz}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 rounded-2xl ${accent.bg} ${accent.bgHover} px-6 py-3 text-sm font-semibold ${accent.text} transition-all duration-200`}
              >
                <RestartIcon className="h-4 w-4" />
                {t.restart}
              </motion.button>
              {wrongOnes.length > 0 && (
                <motion.button
                  onClick={() => setShowReview(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 dark:bg-white/[0.06] px-6 py-3 text-sm font-semibold text-slate-600 dark:text-neutral-300 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-white/[0.1]"
                >
                  <ReviewIcon className="h-4 w-4" />
                  {t.reviewMistakes} ({wrongOnes.length})
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Review mistakes
  if (state === "complete" && showReview) {
    const wrongOnes = shuffledQuestions
      .map((sq, i) => ({ q: sq, userAnswer: answers[i], index: i }))
      .filter((item) => item.userAnswer !== item.q[lang].correct);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.reviewMistakes}</h2>
          <motion.button
            onClick={() => setShowReview(false)}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-gray-100 dark:bg-white/[0.06] px-4 py-2 text-xs font-medium text-slate-600 dark:text-neutral-300 transition-colors hover:bg-gray-200 dark:hover:bg-white/[0.1]"
          >
            {t.backToQuiz}
          </motion.button>
        </div>

        {wrongOnes.map((item, idx) => {
          const questionData = item.q[lang];
          return (
            <motion.div
              key={item.index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/[0.08] dark:bg-white/[0.03]"
            >
              <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{hl(questionData.question)}</p>
              <div className="space-y-2">
                {questionData.options.map((opt, oi) => {
                  const isCorrectOpt = oi === questionData.correct;
                  const isUserAnswer = oi === item.userAnswer;
                  return (
                    <div
                      key={oi}
                      className={`rounded-xl px-4 py-2.5 text-sm ${
                        isCorrectOpt
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : isUserAnswer
                          ? "border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
                          : "border border-gray-200 text-slate-400 dark:border-white/[0.06] dark:text-neutral-500"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isCorrectOpt && <CheckIcon className="h-4 w-4 shrink-0 text-emerald-400" />}
                        {isUserAnswer && !isCorrectOpt && <XIcon className="h-4 w-4 shrink-0 text-red-400" />}
                        {hl(opt)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">{t.explanation}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-neutral-300">{hl(questionData.explanation)}</p>
              </div>
            </motion.div>
          );
        })}

        <div className="flex justify-center pt-2">
          <motion.button
            onClick={startQuiz}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2 rounded-2xl ${accent.bg} ${accent.bgHover} px-6 py-3 text-sm font-semibold ${accent.text} transition-all duration-200`}
          >
            <RestartIcon className="h-4 w-4" />
            {t.restart}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Answering / Correct / Wrong state — show current question
  if (!q) return null;

  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const answered = state === "correct" || state === "wrong";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12"
    >
      <div className="rounded-3xl border border-gray-200 bg-white p-6 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.03] sm:p-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 dark:text-neutral-500">
              {t.question} {currentIndex + 1} {t.of} {totalQuestions}
            </span>
            <span className={`text-xs font-semibold ${accent.text}`}>
              {correctCount}/{currentIndex + (answered ? 1 : 0)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
            <motion.div
              className={`h-full rounded-full ${accent.progressBg}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="mb-6 text-base font-semibold leading-relaxed text-slate-900 dark:text-white sm:text-lg">
              {hl(q.question)}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((option, i) => {
                const isSelected = selected === i;
                const isCorrectOption = i === q.correct;
                const showCorrect = answered && isCorrectOption;
                const showWrong = answered && isSelected && !isCorrectOption;

                let optionClasses =
                  "relative w-full rounded-2xl border px-5 py-4 text-left text-sm transition-all duration-200";

                if (showCorrect) {
                  optionClasses += " border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                } else if (showWrong) {
                  optionClasses += " border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300";
                } else if (answered) {
                  optionClasses += " border-gray-200 text-slate-400 opacity-50 dark:border-white/[0.06] dark:text-neutral-500";
                } else {
                  optionClasses +=
                    " border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50 cursor-pointer dark:border-white/[0.08] dark:text-neutral-300 dark:hover:border-white/[0.15] dark:hover:bg-white/[0.06]";
                }

                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.01 } : undefined}
                    whileTap={!answered ? { scale: 0.99 } : undefined}
                    className={optionClasses}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          showCorrect
                            ? "bg-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : showWrong
                            ? "bg-red-500/30 text-red-700 dark:text-red-300"
                            : "bg-gray-100 text-slate-400 dark:bg-white/[0.08] dark:text-neutral-400"
                        }`}
                      >
                        {showCorrect ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : showWrong ? (
                          <XIcon className="h-4 w-4" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span className="flex-1">{hl(option)}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback & explanation */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 12, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 overflow-hidden"
                >
                  <div
                    className={`rounded-2xl p-5 ${
                      state === "correct"
                        ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/[0.07]"
                        : "border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {state === "correct" ? (
                        <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          state === "correct" ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"
                        }`}
                      >
                        {state === "correct" ? t.correct : t.incorrect}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
                      {hl(q.explanation)}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`inline-flex items-center gap-2 rounded-2xl ${accent.bg} ${accent.bgHover} px-6 py-3 text-sm font-semibold ${accent.text} transition-all duration-200`}
                    >
                      {currentIndex + 1 >= totalQuestions ? t.finish : t.next}
                      <ArrowRightIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ---------- Icons ---------- */

function QuizIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function RestartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  );
}

function ReviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
