"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

type Recommendation = {
  icon: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  href: string;
  priority: number;
};

export function StudyRecommendations({ lang }: { lang: Lang }) {
  const { state } = useProgress();
  const isEn = lang === "en";

  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    // Check what the user hasn't done yet
    if (!state.pagesVisited.includes("claude")) {
      recs.push({
        icon: "📖",
        titleEn: "Read the Claude Analysis",
        titleEs: "Lee el análisis de Claude",
        descEn: "Comprehensive step-by-step roadmap (+15 XP)",
        descEs: "Ruta completa paso a paso (+15 XP)",
        href: "/analisis-claude",
        priority: 10,
      });
    }
    if (!state.pagesVisited.includes("chatgpt")) {
      recs.push({
        icon: "📖",
        titleEn: "Read the ChatGPT Analysis",
        titleEs: "Lee el análisis de ChatGPT",
        descEn: "Comprehensive overview perspective (+15 XP)",
        descEs: "Perspectiva general completa (+15 XP)",
        href: "/analisis-chatgpt",
        priority: 9,
      });
    }
    if (!state.pagesVisited.includes("gemini")) {
      recs.push({
        icon: "📖",
        titleEn: "Read the Gemini Analysis",
        titleEs: "Lee el análisis de Gemini",
        descEn: "Strategic framework approach (+15 XP)",
        descEs: "Marco estratégico profesional (+15 XP)",
        href: "/analisis-gemini",
        priority: 8,
      });
    }

    if (state.quizCorrectTotal === 0) {
      recs.push({
        icon: "⚡",
        titleEn: "Take Your First Quiz",
        titleEs: "Toma tu primer quiz",
        descEn: "Start earning XP with flashcards",
        descEs: "Empieza a ganar XP con tarjetas",
        href: "/quiz",
        priority: 12,
      });
    } else if (state.quizCorrectTotal < 25) {
      recs.push({
        icon: "🎯",
        titleEn: "Practice More Flashcards",
        titleEs: "Practica más tarjetas",
        descEn: `${25 - state.quizCorrectTotal} more to unlock milestone`,
        descEs: `${25 - state.quizCorrectTotal} más para desbloquear hito`,
        href: "/quiz",
        priority: 6,
      });
    }

    if (state.termsBookmarked < 10) {
      recs.push({
        icon: "📚",
        titleEn: "Bookmark Key Terms",
        titleEs: "Guarda términos clave",
        descEn: `${10 - state.termsBookmarked} more for Bookworm badge`,
        descEs: `${10 - state.termsBookmarked} más para insignia Ratón de biblioteca`,
        href: "/glossary",
        priority: 5,
      });
    }

    if (state.notesCreated < 5) {
      recs.push({
        icon: "📝",
        titleEn: "Create Study Notes",
        titleEs: "Crea notas de estudio",
        descEn: `${5 - state.notesCreated} more for Note Taker badge`,
        descEs: `${5 - state.notesCreated} más para insignia Tomador de notas`,
        href: "/notes",
        priority: 4,
      });
    }

    if (state.speedRoundsPlayed === 0) {
      recs.push({
        icon: "⏱️",
        titleEn: "Try a Speed Round",
        titleEs: "Prueba una ronda rápida",
        descEn: "60 seconds to test your speed!",
        descEs: "¡60 segundos para probar tu velocidad!",
        href: "#speed",
        priority: 7,
      });
    }

    if (state.examsTaken === 0 && state.quizCorrectTotal >= 10) {
      recs.push({
        icon: "📝",
        titleEn: "Take the Mock Exam",
        titleEs: "Toma el examen simulado",
        descEn: "Test if you can pass with 70%+",
        descEs: "Comprueba si apruebas con 70%+",
        href: "#exam",
        priority: 11,
      });
    }

    if (state.dailyChallengesCompleted === 0) {
      recs.push({
        icon: "🎯",
        titleEn: "Complete Today's Challenge",
        titleEs: "Completa el reto de hoy",
        descEn: "Quick daily term review (+25 XP)",
        descEs: "Repaso diario rápido (+25 XP)",
        href: "#daily",
        priority: 8,
      });
    }

    // Sort by priority (highest first)
    recs.sort((a, b) => b.priority - a.priority);
    return recs.slice(0, 3);
  }, [state]);

  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "All Caught Up!" : "¡Al día!"}
          </h3>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-neutral-400">
          {isEn
            ? "You've explored all the main features. Keep practicing to level up!"
            : "¡Has explorado todas las funciones principales. Sigue practicando para subir de nivel!"}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">🧭</span>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isEn ? "What to Study Next" : "Qué estudiar ahora"}
        </h3>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
          >
            <Link
              href={rec.href}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-all hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            >
              <span className="text-base">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-700 dark:text-neutral-200">
                  {isEn ? rec.titleEn : rec.titleEs}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-neutral-500">
                  {isEn ? rec.descEn : rec.descEs}
                </p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-slate-300 dark:text-neutral-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
