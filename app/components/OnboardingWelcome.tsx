"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Lang = "en" | "es";

const STEPS = [
  {
    icon: "📖",
    titleEn: "Read an AI Analysis",
    titleEs: "Lee un análisis de IA",
    descEn: "Three AI models break down Georgia tax prep requirements into clear, actionable steps.",
    descEs: "Tres modelos de IA desglosan los requisitos de preparación fiscal de Georgia en pasos claros.",
    href: "/analisis-claude",
    ctaEn: "Start Reading",
    ctaEs: "Comenzar a leer",
    color: "from-violet-500 to-indigo-500",
    shadow: "shadow-violet-500/20",
  },
  {
    icon: "📚",
    titleEn: "Explore Key Terms",
    titleEs: "Explora términos clave",
    descEn: "57 essential tax terms with bilingual definitions, bookmarks, and search.",
    descEs: "57 términos fiscales esenciales con definiciones bilingües, marcadores y búsqueda.",
    href: "/glossary",
    ctaEn: "Browse Glossary",
    ctaEs: "Ver glosario",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: "⚡",
    titleEn: "Test Your Knowledge",
    titleEs: "Pon a prueba tu conocimiento",
    descEn: "Interactive flashcards, speed rounds, and a mock exam to track your mastery.",
    descEs: "Tarjetas interactivas, rondas rápidas y un examen simulado para medir tu dominio.",
    href: "/quiz",
    ctaEn: "Take a Quiz",
    ctaEs: "Hacer un quiz",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
];

export function OnboardingWelcome({
  lang,
  onDismiss,
}: {
  lang: Lang;
  onDismiss: () => void;
}) {
  const isEn = lang === "en";
  const [step, setStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 dark:border-white/[0.08] dark:bg-zinc-900"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-3 inline-block text-4xl"
          >
            🎓
          </motion.div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            {isEn
              ? "Welcome to Your Tax Prep Journey"
              : "Bienvenido a tu camino fiscal"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            {isEn
              ? "Everything you need to become a Georgia tax preparer, in one place."
              : "Todo lo que necesitas para ser preparador de impuestos en Georgia, en un solo lugar."}
          </p>
        </motion.div>

        {/* Steps indicator */}
        <div className="mb-6 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-violet-500"
                  : "w-1.5 bg-gray-200 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-3xl dark:from-white/[0.06] dark:to-white/[0.03]">
              {STEPS[step].icon}
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
              {isEn ? STEPS[step].titleEn : STEPS[step].titleEs}
            </h3>
            <p className="mb-5 max-w-sm text-sm text-slate-500 dark:text-neutral-400">
              {isEn ? STEPS[step].descEn : STEPS[step].descEs}
            </p>
            <Link
              href={STEPS[step].href}
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${STEPS[step].color} px-6 py-3 text-sm font-bold text-white shadow-lg ${STEPS[step].shadow} transition-transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              {isEn ? STEPS[step].ctaEn : STEPS[step].ctaEs}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 disabled:invisible dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            {isEn ? "Back" : "Atrás"}
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            {isEn ? "Skip tour" : "Saltar tour"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (step < STEPS.length - 1) setStep((s) => s + 1);
              else onDismiss();
            }}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {step < STEPS.length - 1
              ? isEn
                ? "Next"
                : "Siguiente"
              : isEn
                ? "Start Learning"
                : "Comenzar"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
