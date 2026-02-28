"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChatGPTLogo, GeminiLogo, ClaudeLogo } from "./components/ModelLogos";
import { LangSwitchWrapper } from "./components/LangSwitchWrapper";
import { ThemeToggle } from "./components/ThemeToggle";
import { XPBar } from "./components/XPBar";
import { DailyChallenge } from "./components/DailyChallenge";
import { AchievementShowcase } from "./components/AchievementShowcase";
import { StudyHeatmap } from "./components/StudyHeatmap";
import { SpeedRound } from "./components/SpeedRound";
import { LearningPath } from "./components/LearningPath";
import { WeakAreas } from "./components/WeakAreas";
import { ProgressCard } from "./components/ProgressCard";
import { ReviewQueue } from "./components/ReviewQueue";
import { StudyInsights } from "./components/StudyInsights";
import { CategoryMastery } from "./components/CategoryMastery";
import { ExamSimulator } from "./components/ExamSimulator";
import { StudyRecommendations } from "./components/StudyRecommendations";
import { OnboardingWelcome } from "./components/OnboardingWelcome";
import { StudyTimer } from "./components/StudyTimer";
import { useProgress } from "./contexts/ProgressContext";
import { TERMS } from "./data/terms";

type Lang = "en" | "es";
type DashboardTab = "learn" | "practice" | "progress";

/* ─── i18n ─────────────────────────────────────────────────────────── */

const QUOTES = {
  en: [
    "The secret of getting ahead is getting started.",
    "Every expert was once a beginner.",
    "Knowledge is power — especially in tax law.",
    "Small daily improvements lead to stunning results.",
    "Invest in your knowledge, it pays the best interest.",
    "Success is the sum of small efforts repeated daily.",
  ],
  es: [
    "El secreto para avanzar es comenzar.",
    "Todo experto fue una vez principiante.",
    "El conocimiento es poder — especialmente en leyes fiscales.",
    "Pequeñas mejoras diarias llevan a resultados impresionantes.",
    "Invierte en tu conocimiento, paga los mejores intereses.",
    "El éxito es la suma de pequeños esfuerzos repetidos diariamente.",
  ],
};

const copy = {
  en: {
    navTitle: "Tax Preparer",
    navSub: "Study Dashboard",
    cmdK: "Search",
    analysesTitle: "AI Analyses",
    totalAnalyses: "total analyses",
    entries: [
      { title: "ChatGPT Analysis", sub: "+comprehensive overview" },
      { title: "Gemini Analysis", sub: "+detailed requirements" },
      { title: "Claude Analysis", sub: "+step-by-step guide" },
    ],
    libraryTitle: "Terms Library",
    fullStats: "Full Stats",
    termsLabel: "terms available",
    progressLabel: "of terms bookmarked",
    legendLow: "Beginner",
    legendHigh: "Advanced",
    quickTitle: "Quick Access",
    links: [
      { title: "Glossary & Terms", sub: "Browse all tax terms", badge: "Reference", href: "/glossary" },
      { title: "Study Notes", sub: "Your learning notes", badge: "Active", href: "/notes" },
      { title: "Georgia Guide", sub: "State prep roadmap", badge: "Featured", href: "/analisis-claude" },
    ],
    quizTitle: "Flashcard Quiz",
    quizSub: "Test your knowledge with interactive flashcards and multiple choice",
    quizBtn: "Start Quiz",
    quizScore: "Accuracy",
    quizMastered: "Mastered",
    streakDays: "days",
    streakBest: "best",
    tabLearn: "Learn",
    tabPractice: "Practice",
    tabProgress: "Progress",
  },
  es: {
    navTitle: "Preparador de Impuestos",
    navSub: "Panel de Estudio",
    cmdK: "Buscar",
    analysesTitle: "Análisis de IA",
    totalAnalyses: "análisis totales",
    entries: [
      { title: "Análisis de ChatGPT", sub: "+vista general completa" },
      { title: "Análisis de Gemini", sub: "+requisitos detallados" },
      { title: "Análisis de Claude", sub: "+guía paso a paso" },
    ],
    libraryTitle: "Biblioteca de Términos",
    fullStats: "Estadísticas",
    termsLabel: "términos disponibles",
    progressLabel: "de términos guardados",
    legendLow: "Principiante",
    legendHigh: "Avanzado",
    quickTitle: "Acceso Rápido",
    links: [
      { title: "Glosario y Términos", sub: "Explora términos fiscales", badge: "Referencia", href: "/glossary" },
      { title: "Apuntes de Estudio", sub: "Tus notas de aprendizaje", badge: "Activo", href: "/notes" },
      { title: "Guía de Georgia", sub: "Ruta de preparación estatal", badge: "Destacado", href: "/analisis-claude" },
    ],
    quizTitle: "Quiz de Tarjetas",
    quizSub: "Pon a prueba tu conocimiento con tarjetas interactivas y opción múltiple",
    quizBtn: "Iniciar Quiz",
    quizScore: "Precisión",
    quizMastered: "Dominados",
    streakDays: "días",
    streakBest: "mejor",
    tabLearn: "Aprender",
    tabPractice: "Practicar",
    tabProgress: "Progreso",
  },
};

const analysisConfig = [
  { href: "/analisis-chatgpt", Logo: ChatGPTLogo, color: "bg-emerald-500", accent: "#34d399" },
  { href: "/analisis-gemini", Logo: GeminiLogo, color: "bg-blue-500", accent: "#60a5fa" },
  { href: "/analisis-claude", Logo: ClaudeLogo, color: "bg-amber-500", accent: "#fbbf24" },
];

const STREAK_KEY = "tax-guide-study-streak";
const ONBOARDING_KEY = "tax-guide-onboarding-done";

type StreakData = {
  current: number;
  best: number;
  lastDate: string;
};

function loadStreak(): StreakData {
  if (typeof window === "undefined") return { current: 0, best: 0, lastDate: "" };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, best: 0, lastDate: "" };
    return JSON.parse(raw);
  } catch { return { current: 0, best: 0, lastDate: "" }; }
}

function updateStreak(): StreakData {
  const data = loadStreak();
  const today = new Date().toISOString().slice(0, 10);

  if (data.lastDate === today) return data;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (data.lastDate === yesterday) {
    data.current += 1;
  } else if (data.lastDate !== today) {
    data.current = 1;
  }

  if (data.current > data.best) data.best = data.current;
  data.lastDate = today;

  try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch {}
  return data;
}

/* ─── Animated Counter ─────────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

/* ─── Small components ─────────────────────────────────────────────── */

function ProgressRing({ value, size = 28, color = "#8b5cf6" }: { value: number; size?: number; color?: string }) {
  const sw = 2.5;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" className="dark:stroke-white/[0.06]" strokeWidth={sw} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

/* ─── Tab definitions ─────────────────────────────────────────────── */

const TABS: { id: DashboardTab; icon: string }[] = [
  { id: "learn", icon: "📖" },
  { id: "practice", icon: "⚡" },
  { id: "progress", icon: "📊" },
];

/* ─── Card wrapper ─────────────────────────────────────────────────── */

const CARD = "glow-card rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900 sm:p-7";

/* ─── Main ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [notesCount, setNotesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, lastDate: "" });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizMastered, setQuizMastered] = useState(0);
  const [activeTab, setActiveTab] = useState<DashboardTab>("learn");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const t = copy[lang];
  const totalTerms = TERMS.length;
  const { state, recordStudyStreak, recordBookmark: recordBookmarkXP, recordNoteCreated: recordNoteXP } = useProgress();

  useEffect(() => {
    let nc = 0;
    let bc = 0;
    try {
      const n = JSON.parse(localStorage.getItem("tax-guide-notes") || "[]");
      nc = Array.isArray(n) ? n.length : 0;
      setNotesCount(nc);
    } catch { setNotesCount(0); }
    try {
      const b = JSON.parse(localStorage.getItem("tax-guide-glossary-bookmarks") || "[]");
      bc = Array.isArray(b) ? b.length : 0;
      setBookmarksCount(bc);
    } catch { setBookmarksCount(0); }

    // Streak
    const s = updateStreak();
    setStreak(s);
    recordStudyStreak(s.current);

    // Sync bookmarks & notes counts to progress
    if (bc > 0) recordBookmarkXP(bc);
    if (nc > 0) recordNoteXP(nc);

    // Quote
    setQuoteIndex(Math.floor(Math.random() * QUOTES.en.length));

    // Quiz stats
    try {
      const qh = JSON.parse(localStorage.getItem("tax-guide-quiz-history") || "{}");
      if (qh.totalAttempted > 0) {
        setQuizScore(Math.round((qh.totalCorrect / qh.totalAttempted) * 100));
      }
      setQuizMastered(qh.mastered?.length ?? 0);
    } catch {}

    // Onboarding check
    try {
      const done = localStorage.getItem(ONBOARDING_KEY);
      const progress = localStorage.getItem("tax-guide-progress");
      if (!done && (!progress || JSON.parse(progress).xp === 0)) {
        setShowOnboarding(true);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch {}
  };

  const bookmarkPct = totalTerms > 0 ? Math.round((bookmarksCount / totalTerms) * 100) : 0;

  const tabLabel = (tab: DashboardTab) => {
    if (tab === "learn") return t.tabLearn;
    if (tab === "practice") return t.tabPractice;
    return t.tabProgress;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-neutral-100">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[-200px] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]"
          animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-100px] top-[30%] h-[340px] w-[340px] rounded-full bg-emerald-500/10 blur-[100px]"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[-80px] bottom-[20%] h-[280px] w-[280px] rounded-full bg-amber-500/8 blur-[100px]"
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-white/[0.06] dark:bg-neutral-950/80"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-emerald-500/20 text-sm ring-1 ring-black/5 dark:ring-white/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-900 dark:text-white">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </motion.div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.navTitle}</div>
              <div className="hidden text-[11px] text-slate-500 dark:text-neutral-500 sm:block">{t.navSub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
              }}
              className="hidden items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-gray-200 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white sm:inline-flex"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {t.cmdK}
              <kbd className="ml-1 rounded border border-gray-300 bg-gray-50 px-1 py-0.5 text-[9px] font-semibold dark:border-white/10 dark:bg-white/[0.06]">⌘K</kbd>
            </button>
            <Link
              href="/glossary"
              className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {lang === "en" ? "Glossary" : "Glosario"}
            </Link>
            <Link
              href="/notes"
              className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {lang === "en" ? "Notes" : "Apuntes"}
            </Link>
            <button
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
              className="relative overflow-hidden rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <motion.span
                key={lang}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                {lang === "en" ? "ES" : "EN"}
              </motion.span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Dashboard */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8" data-readaloud-content>
        <LangSwitchWrapper lang={lang}>

        {/* Onboarding Overlay */}
        <AnimatePresence>
          {showOnboarding && (
            <div className="mb-6">
              <OnboardingWelcome lang={lang} onDismiss={dismissOnboarding} />
            </div>
          )}
        </AnimatePresence>

        {/* Motivational Quote + Streak Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <motion.div
            key={`quote-${quoteIndex}-${lang}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <p className="text-sm italic text-slate-500 dark:text-neutral-400">
              &ldquo;{QUOTES[lang][quoteIndex]}&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 20 }}
            className="flex items-center gap-3 self-start rounded-2xl border border-amber-400/20 bg-amber-50 px-4 py-2.5 dark:border-amber-500/20 dark:bg-amber-500/10"
          >
            <span className={`text-2xl ${streak.current > 0 ? "animate-streak-fire" : ""}`}>
              🔥
            </span>
            <div className="leading-tight">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{streak.current}</span>
                <span className="text-xs text-amber-600/60 dark:text-amber-400/60">{t.streakDays}</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-neutral-500">
                {t.streakBest}: {streak.best} {t.streakDays}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* XP & Level Bar */}
        <div className="mb-6">
          <XPBar lang={lang} />
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex rounded-2xl bg-white/80 p-1.5 shadow-sm border border-gray-200 backdrop-blur-sm dark:bg-zinc-900/80 dark:border-white/[0.08]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20"
                    : "text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tabLabel(tab.id)}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEARN TAB                                                      */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 sm:gap-6 md:grid-cols-2"
            >
              {/* AI Analyses Card */}
              <motion.div
                className={CARD}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.analysesTitle}</h2>
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    {state.pagesVisited.length}/3 {lang === "en" ? "read" : "leídos"}
                  </span>
                </div>

                <div className="space-y-1">
                  {analysisConfig.map((item, i) => {
                    const pageIds = ["chatgpt", "gemini", "claude"];
                    const visited = state.pagesVisited.includes(pageIds[i]);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-all duration-200 hover:translate-x-0.5 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}/15`}>
                          <item.Logo size={28} className="scale-[0.35] origin-center" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{t.entries[i].title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-neutral-500">{t.entries[i].sub}</div>
                        </div>
                        {visited ? (
                          <span className="text-xs text-emerald-500">✓</span>
                        ) : (
                          <span className="text-[10px] text-violet-500 dark:text-violet-400">+15 XP</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Terms Library Card */}
              <motion.div
                className={CARD}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-neutral-400">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.libraryTitle}</h2>
                  </div>
                  <Link
                    href="/glossary"
                    className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/10"
                  >
                    {t.fullStats}
                  </Link>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                      <AnimatedNumber value={totalTerms} />
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-neutral-500">{t.termsLabel}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400"><AnimatedNumber value={bookmarkPct} />%</span>
                    <span className="ml-1.5 text-xs text-slate-500 dark:text-neutral-500">{t.progressLabel}</span>
                  </div>
                </div>

                {/* Gradient bar */}
                <div className="relative mt-4 h-8 overflow-hidden rounded-lg">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #06b6d4)",
                    }}
                  />
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 bg-gray-200/80 dark:bg-neutral-800/80"
                    initial={{ width: "100%" }}
                    animate={{ width: `${100 - Math.min(bookmarkPct * 2, 100)}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow">
                    {bookmarksCount}
                  </span>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow">
                    {totalTerms}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-4 text-[10px] text-slate-500 dark:text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-neutral-500" />
                    {t.legendLow}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    {t.legendHigh}
                  </span>
                </div>
              </motion.div>

              {/* Quick Access Card */}
              <motion.div
                className={CARD}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="mb-5 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 dark:text-amber-400">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                  </svg>
                  <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.quickTitle}</h2>
                </div>

                <div className="space-y-1">
                  {t.links.map((link, i) => {
                    const avatarColors = ["bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400", "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400", "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"];
                    const icons = ["📖", "📝", "📋"];
                    const ringColors = ["#34d399", "#60a5fa", "#a78bfa"];
                    const ringValues = [
                      totalTerms > 0 ? Math.round((bookmarksCount / totalTerms) * 100) : 0,
                      notesCount > 0 ? Math.min(notesCount * 10, 100) : 0,
                      state.pagesVisited.length > 0 ? Math.round((state.pagesVisited.length / 3) * 100) : 0,
                    ];

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-all duration-200 hover:translate-x-0.5 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${avatarColors[i]}`}>
                          {icons[i]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{link.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-neutral-500">{link.sub}</div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <ProgressRing value={ringValues[i]} color={ringColors[i]} />
                          <span className="text-[11px] font-medium tabular-nums text-slate-500 dark:text-neutral-400">{ringValues[i]}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Study Recommendations */}
              <StudyRecommendations lang={lang} />

              {/* Learning Path (Full width) */}
              <div className="md:col-span-2">
                <LearningPath lang={lang} />
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PRACTICE TAB                                                   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 sm:gap-6 md:grid-cols-2"
            >
              {/* Daily Challenge */}
              <DailyChallenge lang={lang} />

              {/* Speed Round */}
              <SpeedRound lang={lang} />

              {/* Focus Timer */}
              <StudyTimer lang={lang} />

              {/* Review Queue */}
              <ReviewQueue lang={lang} />

              {/* Exam Simulator */}
              <ExamSimulator lang={lang} />

              {/* Weak Areas */}
              <WeakAreas lang={lang} />

              {/* Flashcard Quiz (Full width) */}
              <motion.div
                className={`${CARD} md:col-span-2`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-violet-500/20 text-2xl"
                    >
                      ⚡
                    </motion.div>
                    <div>
                      <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.quizTitle}</h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-500">{t.quizSub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{quizScore}%</div>
                        <div className="text-[9px] text-slate-500 dark:text-neutral-500">{t.quizScore}</div>
                      </div>
                      <div className="h-8 w-px bg-gray-200 dark:bg-white/[0.06]" />
                      <div className="text-center">
                        <div className="text-lg font-bold text-violet-600 dark:text-violet-400">{quizMastered}</div>
                        <div className="text-[9px] text-slate-500 dark:text-neutral-500">{t.quizMastered}</div>
                      </div>
                    </div>
                    <Link
                      href="/quiz"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-violet-500/20 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:from-amber-500/30 hover:to-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] dark:text-white"
                    >
                      {t.quizBtn}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PROGRESS TAB                                                   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid gap-5 sm:gap-6 md:grid-cols-2"
            >
              {/* Progress Card */}
              <ProgressCard lang={lang} />

              {/* Achievements */}
              <AchievementShowcase lang={lang} />

              {/* Study Heatmap (Full width) */}
              <div className="md:col-span-2">
                <StudyHeatmap lang={lang} />
              </div>

              {/* Study Insights */}
              <StudyInsights lang={lang} />

              {/* Category Mastery */}
              <CategoryMastery lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>

        </LangSwitchWrapper>
      </main>
    </div>
  );
}
