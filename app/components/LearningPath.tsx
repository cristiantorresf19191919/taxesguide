"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

type MilestoneTask = {
  id: string;
  en: string;
  es: string;
  check: (s: ReturnType<typeof useProgress>["state"]) => boolean;
};

type Milestone = {
  id: string;
  icon: string;
  en: string;
  es: string;
  tasks: MilestoneTask[];
};

const MILESTONES: Milestone[] = [
  {
    id: "m1",
    icon: "🚀",
    en: "Getting Started",
    es: "Primeros pasos",
    tasks: [
      {
        id: "t1_daily",
        en: "Complete a daily challenge",
        es: "Completa un reto diario",
        check: (s) => s.dailyChallengesCompleted >= 1,
      },
      {
        id: "t1_quiz",
        en: "Answer your first quiz question",
        es: "Responde tu primera pregunta",
        check: (s) => s.quizCorrectTotal >= 1,
      },
      {
        id: "t1_bookmark",
        en: "Bookmark 3 terms",
        es: "Guarda 3 términos",
        check: (s) => s.termsBookmarked >= 3,
      },
    ],
  },
  {
    id: "m2",
    icon: "📚",
    en: "Know Your Terms",
    es: "Conoce los términos",
    tasks: [
      {
        id: "t2_bookmark10",
        en: "Bookmark 10 terms",
        es: "Guarda 10 términos",
        check: (s) => s.termsBookmarked >= 10,
      },
      {
        id: "t2_quiz10",
        en: "Get 10 quiz answers correct",
        es: "Acierta 10 preguntas",
        check: (s) => s.quizCorrectTotal >= 10,
      },
      {
        id: "t2_note",
        en: "Create your first study note",
        es: "Crea tu primera nota de estudio",
        check: (s) => s.notesCreated >= 1,
      },
    ],
  },
  {
    id: "m3",
    icon: "🔍",
    en: "Understand the Requirements",
    es: "Entiende los requisitos",
    tasks: [
      {
        id: "t3_claude",
        en: "Read the Claude analysis",
        es: "Lee el análisis de Claude",
        check: (s) => s.pagesVisited.includes("claude"),
      },
      {
        id: "t3_chatgpt",
        en: "Read the ChatGPT analysis",
        es: "Lee el análisis de ChatGPT",
        check: (s) => s.pagesVisited.includes("chatgpt"),
      },
      {
        id: "t3_gemini",
        en: "Read the Gemini analysis",
        es: "Lee el análisis de Gemini",
        check: (s) => s.pagesVisited.includes("gemini"),
      },
    ],
  },
  {
    id: "m4",
    icon: "🎯",
    en: "Test Your Knowledge",
    es: "Pon a prueba tu conocimiento",
    tasks: [
      {
        id: "t4_streak5",
        en: "Get a 5-answer streak",
        es: "Consigue racha de 5 respuestas",
        check: (s) => s.quizBestStreak >= 5,
      },
      {
        id: "t4_speed",
        en: "Complete a speed round",
        es: "Completa una ronda rápida",
        check: (s) => s.speedRoundsPlayed >= 1,
      },
      {
        id: "t4_correct25",
        en: "Answer 25 questions correctly",
        es: "Acierta 25 preguntas",
        check: (s) => s.quizCorrectTotal >= 25,
      },
    ],
  },
  {
    id: "m5",
    icon: "📝",
    en: "Build Your Practice",
    es: "Construye tu práctica",
    tasks: [
      {
        id: "t5_notes5",
        en: "Create 5 study notes",
        es: "Crea 5 notas de estudio",
        check: (s) => s.notesCreated >= 5,
      },
      {
        id: "t5_streak3",
        en: "Maintain a 3-day study streak",
        es: "Mantén racha de 3 días",
        check: (s) => s.studyStreak >= 3,
      },
      {
        id: "t5_level5",
        en: "Reach Level 5",
        es: "Alcanza Nivel 5",
        check: (s) => s.xp >= 1000,
      },
    ],
  },
  {
    id: "m6",
    icon: "👑",
    en: "Tax Authority",
    es: "Autoridad fiscal",
    tasks: [
      {
        id: "t6_perfect",
        en: "Get a perfect quiz score",
        es: "Obtén puntaje perfecto en un quiz",
        check: (s) => s.perfectQuizzes >= 1,
      },
      {
        id: "t6_daily5",
        en: "Complete 5 daily challenges",
        es: "Completa 5 retos diarios",
        check: (s) => s.dailyChallengesCompleted >= 5,
      },
      {
        id: "t6_xp3000",
        en: "Earn 3,000 XP",
        es: "Gana 3,000 XP",
        check: (s) => s.xp >= 3000,
      },
    ],
  },
];

export function LearningPath({ lang }: { lang: Lang }) {
  const { state } = useProgress();
  const isEn = lang === "en";

  const milestoneData = useMemo(() => {
    return MILESTONES.map((m) => {
      const taskResults = m.tasks.map((t) => ({
        ...t,
        done: t.check(state),
      }));
      const doneCount = taskResults.filter((t) => t.done).length;
      const total = taskResults.length;
      const percent = Math.round((doneCount / total) * 100);
      return { ...m, taskResults, doneCount, total, percent };
    });
  }, [state]);

  const totalTasks = milestoneData.reduce((acc, m) => acc + m.total, 0);
  const totalDone = milestoneData.reduce((acc, m) => acc + m.doneCount, 0);
  const overallPercent = Math.round((totalDone / totalTasks) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Learning Path" : "Ruta de aprendizaje"}
          </h3>
        </div>
        <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          {overallPercent}%
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${overallPercent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Milestones */}
      <div className="relative space-y-0">
        {milestoneData.map((m, idx) => {
          const isComplete = m.percent === 100;
          const isLast = idx === milestoneData.length - 1;
          return (
            <div key={m.id} className="relative flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    isComplete
                      ? "bg-emerald-100 dark:bg-emerald-500/20"
                      : "bg-gray-100 dark:bg-white/[0.06]"
                  }`}
                >
                  {isComplete ? "✓" : m.icon}
                </div>
                {!isLast && (
                  <div
                    className={`w-px flex-1 ${
                      isComplete
                        ? "bg-emerald-300 dark:bg-emerald-500/30"
                        : "bg-gray-200 dark:bg-white/[0.06]"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-xs font-bold ${
                      isComplete
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {isEn ? m.en : m.es}
                  </p>
                  <span className="text-[9px] text-slate-400 dark:text-neutral-500">
                    {m.doneCount}/{m.total}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  {m.taskResults.map((t) => (
                    <div key={t.id} className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] ${
                          t.done
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-slate-300 dark:text-neutral-600"
                        }`}
                      >
                        {t.done ? "●" : "○"}
                      </span>
                      <span
                        className={`text-[10px] ${
                          t.done
                            ? "text-slate-500 line-through dark:text-neutral-400"
                            : "text-slate-500 dark:text-neutral-400"
                        }`}
                      >
                        {isEn ? t.en : t.es}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
