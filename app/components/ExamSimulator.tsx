"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS } from "@/app/data/terms";
import { CATEGORIES } from "@/app/data/categories";
import { useProgress } from "@/app/contexts/ProgressContext";
import type { QuizQuestion } from "@/app/components/AnalysisQuiz";
import { claudeQuestions } from "@/app/data/quiz-claude";
import { chatgptQuestions } from "@/app/data/quiz-chatgpt";
import { geminiQuestions } from "@/app/data/quiz-gemini";

type Lang = "en" | "es";
type Phase = "intro" | "exam" | "results";

const EXAM_QUESTIONS = 20;
const EXAM_MINUTES = 15;
const PASS_PERCENT = 70;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// Generate term-based questions from glossary
function generateTermQuestions(): QuizQuestion[] {
  return TERMS.slice(0, 30).map((term) => {
    const wrong = shuffle(TERMS.filter((t) => t.id !== term.id)).slice(0, 3);
    const options = shuffle([term, ...wrong]);
    const correctIdx = options.findIndex((o) => o.id === term.id);
    return {
      en: {
        question: `What is the correct definition of "${term.labelEn}"?`,
        options: options.map((o) => o.shortEn),
        correct: correctIdx,
        explanation: term.longEn || term.shortEn,
      },
      es: {
        question: `¿Cuál es la definición correcta de "${term.labelEs}"?`,
        options: options.map((o) => o.shortEs),
        correct: correctIdx,
        explanation: term.longEs || term.shortEs,
      },
    };
  });
}

export function ExamSimulator({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { state, recordExam } = useProgress();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordedRef = useRef(false);

  const examQuestions = useMemo(() => {
    const allQ = [
      ...claudeQuestions,
      ...chatgptQuestions,
      ...geminiQuestions,
      ...generateTermQuestions(),
    ];
    return shuffle(allQ).slice(0, EXAM_QUESTIONS);
  }, [phase === "intro"]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = examQuestions[currentIdx]?.[lang];

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Record result when finished
  useEffect(() => {
    if (phase === "results" && !recordedRef.current) {
      const correct = answers.filter(
        (a, i) => a === examQuestions[i]?.[lang].correct
      ).length;
      recordExam(correct, EXAM_QUESTIONS);
      recordedRef.current = true;
    }
  }, [phase, answers, examQuestions, lang, recordExam]);

  const startExam = useCallback(() => {
    setPhase("exam");
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setTimeLeft(EXAM_MINUTES * 60);
    recordedRef.current = false;
  }, []);

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers((prev) => [...prev, idx]);
  }, [selected]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= EXAM_QUESTIONS) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("results");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  }, [currentIdx]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  // Intro
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Mock Exam" : "Examen simulado"}
          </h3>
        </div>
        <div className="mb-4 space-y-1.5">
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            {isEn
              ? `${EXAM_QUESTIONS} questions · ${EXAM_MINUTES} minutes · ${PASS_PERCENT}% to pass`
              : `${EXAM_QUESTIONS} preguntas · ${EXAM_MINUTES} minutos · ${PASS_PERCENT}% para aprobar`}
          </p>
          {state.examsTaken > 0 && (
            <div className="flex gap-3 text-[10px]">
              <span className="text-slate-400 dark:text-neutral-500">
                {isEn ? "Taken:" : "Intentos:"} {state.examsTaken}
              </span>
              <span className="text-emerald-500">
                {isEn ? "Passed:" : "Aprobados:"} {state.examsPassed}
              </span>
              <span className="text-violet-500 dark:text-violet-400">
                {isEn ? "Best:" : "Mejor:"} {state.examBestScore}%
              </span>
            </div>
          )}
        </div>
        <motion.button
          type="button"
          onClick={startExam}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/20"
        >
          {isEn ? "Start Exam" : "Iniciar examen"}
        </motion.button>
      </motion.div>
    );
  }

  // Results
  if (phase === "results") {
    const correct = answers.filter(
      (a, i) => a === examQuestions[i]?.[lang].correct
    ).length;
    const pct = Math.round((correct / EXAM_QUESTIONS) * 100);
    const passed = pct >= PASS_PERCENT;

    // Category breakdown
    const catBreakdown = CATEGORIES.map((cat) => {
      let catCorrect = 0;
      let catTotal = 0;
      examQuestions.forEach((eq, i) => {
        const qText = eq.en.question.toLowerCase();
        const isInCat = cat.terms.some((t) => {
          const term = TERMS.find((x) => x.id === t);
          return term && qText.includes(term.labelEn.toLowerCase());
        });
        if (isInCat) {
          catTotal++;
          if (answers[i] === eq[lang].correct) catCorrect++;
        }
      });
      return { ...cat, catCorrect, catTotal };
    }).filter((c) => c.catTotal > 0);

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
            {passed ? "🎓" : "📖"}
          </motion.div>
          <p className={`text-3xl font-black ${passed ? "text-emerald-500" : "text-amber-500"}`}>
            {pct}%
          </p>
          <p className="text-sm font-semibold text-slate-700 dark:text-neutral-200">
            {correct}/{EXAM_QUESTIONS} {isEn ? "correct" : "correctas"}
          </p>
          <p className={`mt-1 text-xs font-bold ${passed ? "text-emerald-500" : "text-red-500"}`}>
            {passed
              ? (isEn ? "PASSED" : "APROBADO")
              : (isEn ? "NOT PASSED" : "NO APROBADO")}
          </p>
          <p className="mt-1 text-[10px] text-violet-500 dark:text-violet-400">
            +{passed ? 100 : 30} XP
          </p>
        </div>

        {/* Certificate card on passing */}
        {passed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 overflow-hidden rounded-xl border-2 border-amber-300/50 bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center dark:border-amber-500/20 dark:from-amber-500/10 dark:to-orange-500/5"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600/60 dark:text-amber-400/60">
              {isEn ? "Certificate of Completion" : "Certificado de finalización"}
            </p>
            <p className="mt-1 text-sm font-bold text-amber-800 dark:text-amber-300">
              {isEn ? "Georgia Tax Prep Knowledge" : "Conocimiento fiscal de Georgia"}
            </p>
            <p className="mt-0.5 text-[10px] text-amber-600/80 dark:text-amber-400/60">
              {isEn ? `Score: ${pct}% · ${new Date().toLocaleDateString()}` : `Puntaje: ${pct}% · ${new Date().toLocaleDateString()}`}
            </p>
          </motion.div>
        )}

        {/* Category breakdown */}
        {catBreakdown.length > 0 && (
          <div className="mb-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-neutral-500">
              {isEn ? "By Category" : "Por categoría"}
            </p>
            {catBreakdown.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600 dark:text-neutral-300">
                  {c.icon} {isEn ? c.labelEn : c.labelEs}
                </span>
                <span className="text-[10px] font-bold" style={{ color: c.color }}>
                  {c.catCorrect}/{c.catTotal}
                </span>
              </div>
            ))}
          </div>
        )}

        <motion.button
          type="button"
          onClick={() => setPhase("intro")}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-gray-200 dark:bg-white/[0.06] dark:text-neutral-300 dark:hover:bg-white/[0.1]"
        >
          {isEn ? "Back to Overview" : "Volver al inicio"}
        </motion.button>
      </motion.div>
    );
  }

  // Exam in progress
  if (!q) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
          {currentIdx + 1}/{EXAM_QUESTIONS}
        </span>
        <span className={`text-xs font-bold tabular-nums ${timeLeft < 60 ? "text-red-500" : timeLeft < 180 ? "text-amber-500" : "text-slate-700 dark:text-neutral-200"}`}>
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-amber-500"
          animate={{ width: `${((currentIdx + 1) / EXAM_QUESTIONS) * 100}%` }}
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
          <p className="mb-4 text-[13px] font-semibold leading-relaxed text-slate-900 dark:text-white">
            {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-[11px] leading-snug transition-all ${
                    isSelected
                      ? "border-amber-400/40 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      : selected !== null
                      ? "border-gray-200 text-slate-400 dark:border-white/[0.04] dark:text-neutral-600"
                      : "border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.08] dark:text-neutral-300 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold ${
                      isSelected ? "bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-gray-100 text-slate-400 dark:bg-white/[0.06] dark:text-neutral-500"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex justify-end">
              <motion.button
                type="button"
                onClick={handleNext}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl bg-amber-50 px-5 py-2.5 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
              >
                {currentIdx + 1 >= EXAM_QUESTIONS
                  ? (isEn ? "Finish Exam" : "Terminar examen")
                  : (isEn ? "Next →" : "Siguiente →")}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
