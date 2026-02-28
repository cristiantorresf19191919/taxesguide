"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatGPTLogo, GeminiLogo, ClaudeLogo } from "./components/ModelLogos";
import { LangSwitchWrapper } from "./components/LangSwitchWrapper";
import { ThemeToggle } from "./components/ThemeToggle";
import { XPBar } from "./components/XPBar";
import { DailyChallenge } from "./components/DailyChallenge";
import { AchievementShowcase } from "./components/AchievementShowcase";
import { useProgress } from "./contexts/ProgressContext";
import { TERMS } from "./data/terms";

type Lang = "en" | "es";

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
    /* Card 1 – Analyses */
    analysesTitle: "AI Analyses",
    totalAnalyses: "total analyses",
    entries: [
      { title: "ChatGPT Analysis", sub: "+comprehensive overview" },
      { title: "Gemini Analysis", sub: "+detailed requirements" },
      { title: "Claude Analysis", sub: "+step-by-step guide" },
    ],
    /* Card 2 – Library */
    libraryTitle: "Terms In The Library",
    fullStats: "Full Stats",
    termsLabel: "terms available",
    progressLabel: "of terms bookmarked",
    legendLow: "Beginner",
    legendHigh: "Advanced",
    months: ["Oct", "Nov", "Dec", "Jan", "Feb"],
    dailyActivity: "Daily study\nactivity",
    /* Card 3 – Knowledge */
    knowledgeTitle: "Study Focus Areas",
    insights: "Insights",
    areas: ["Filing", "Tax Forms", "Credits", "Compliance", "Due diligence", "State rules"],
    /* Card 4 – Quick access */
    quickTitle: "Quick Access",
    week: "Week",
    month: "Month",
    links: [
      { title: "Glossary & Terms", sub: "Browse all tax terms", badge: "Reference", href: "/glossary" },
      { title: "Study Notes", sub: "Your learning notes", badge: "Active", href: "/notes" },
      { title: "Georgia Guide", sub: "State prep roadmap", badge: "Featured", href: "/analisis-claude" },
    ],
    /* Card 5 – Quiz */
    quizTitle: "Flashcard Quiz",
    quizSub: "Test your knowledge with interactive flashcards and multiple choice",
    quizBtn: "Start Quiz",
    quizScore: "Accuracy",
    quizMastered: "Mastered",
    /* Streak */
    streakTitle: "Study Streak",
    streakDays: "days",
    streakBest: "best",
    streakToday: "Come back tomorrow to keep your streak!",
    streakStart: "Start your study streak today!",
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
    libraryTitle: "Términos En La Biblioteca",
    fullStats: "Estadísticas",
    termsLabel: "términos disponibles",
    progressLabel: "de términos guardados",
    legendLow: "Principiante",
    legendHigh: "Avanzado",
    months: ["Oct", "Nov", "Dic", "Ene", "Feb"],
    dailyActivity: "Actividad\ndiaria",
    knowledgeTitle: "Áreas de Estudio",
    insights: "Estadísticas",
    areas: ["Declaración", "Formularios", "Créditos", "Cumplimiento", "Diligencia", "Reglas estatales"],
    quickTitle: "Acceso Rápido",
    week: "Semana",
    month: "Mes",
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
    streakTitle: "Racha de Estudio",
    streakDays: "días",
    streakBest: "mejor",
    streakToday: "¡Vuelve mañana para mantener tu racha!",
    streakStart: "¡Comienza tu racha de estudio hoy!",
  },
};

const analysisConfig = [
  { href: "/analisis-chatgpt", Logo: ChatGPTLogo, color: "bg-emerald-500", accent: "#34d399" },
  { href: "/analisis-gemini", Logo: GeminiLogo, color: "bg-blue-500", accent: "#60a5fa" },
  { href: "/analisis-claude", Logo: ClaudeLogo, color: "bg-amber-500", accent: "#fbbf24" },
];

const AREA_VALUES = [87, 90, 89, 39, 38, 21];
const AREA_COLORS = ["#6ee7b7", "#818cf8", "#22d3ee", "#f472b6", "#fbbf24", "#a78bfa"];

const STREAK_KEY = "tax-guide-study-streak";

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

/* ─── Deterministic pseudo-random for activity dots ───────────────── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
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
      // Ease out cubic
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

function PetalChart({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const petals = t.areas.map((label, i) => ({
    label,
    value: AREA_VALUES[i],
    color: AREA_COLORS[i],
  }));

  return (
    <div className="relative mx-auto h-[260px] w-[260px] sm:h-[280px] sm:w-[280px]">
      {/* Petal shapes */}
      {petals.map((p, i) => {
        const angle = i * 60;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-1/2 h-[90px] w-[46px] rounded-full sm:h-[100px] sm:w-[50px]"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, ${p.color}45 0%, ${p.color}18 50%, transparent 75%)`,
              transformOrigin: "center bottom",
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            }}
          />
        );
      })}

      {/* Center glow */}
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-400/25 via-cyan-400/15 to-violet-500/20 blur-md" />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/[0.06] text-sm text-violet-500 dark:bg-white/[0.06] dark:text-violet-300"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>

      {/* Labels at petal tips */}
      {petals.map((p, i) => {
        const angleRad = ((i * 60 - 90) * Math.PI) / 180;
        const radius = 118;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="absolute text-center"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">{p.value}%</div>
            <div className="text-[9px] leading-tight text-slate-500 dark:text-neutral-400 sm:text-[10px]">{p.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ActivityDots({ months }: { months: string[] }) {
  const rows = 5;
  const cols = 15;
  return (
    <div>
      <div className="mb-2 flex justify-between text-[10px] text-slate-400 dark:text-neutral-500">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {Array.from({ length: cols }).map((_, col) => (
          <div key={col} className="flex flex-col gap-[3px]">
            {Array.from({ length: rows }).map((_, row) => {
              const seed = col * rows + row + 42;
              const r = seededRandom(seed);
              const level = r < 0.3 ? 0 : r < 0.5 ? 1 : r < 0.7 ? 2 : r < 0.85 ? 3 : 4;
              return (
                <motion.div
                  key={row}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + (col * rows + row) * 0.008 }}
                  className={`h-[7px] w-[7px] rounded-full sm:h-2 sm:w-2 ${
                    level === 0
                      ? "bg-black/[0.06] dark:bg-white/[0.06]"
                      : level === 1
                        ? "bg-blue-500/25"
                        : level === 2
                          ? "bg-blue-500/45"
                          : level === 3
                            ? "bg-blue-500/65"
                            : "bg-blue-400/90"
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card wrapper ─────────────────────────────────────────────────── */

const CARD = "glow-card rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900 sm:p-7";

/* ─── Main ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [notesCount, setNotesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [quickTab, setQuickTab] = useState<"week" | "month">("week");
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, lastDate: "" });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizMastered, setQuizMastered] = useState(0);

  const t = copy[lang];
  const totalTerms = TERMS.length;
  const { recordStudyStreak, recordBookmark: recordBookmarkXP, recordNoteCreated: recordNoteXP } = useProgress();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookmarkPct = totalTerms > 0 ? Math.round((bookmarksCount / totalTerms) * 100) : 0;

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
            {/* Theme toggle */}
            <ThemeToggle />
            {/* Cmd+K button */}
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

      {/* Dashboard grid */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8" data-readaloud-content>
        <LangSwitchWrapper lang={lang}>

        {/* Motivational Quote + Streak Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Quote */}
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

          {/* Streak pill */}
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-5 sm:gap-6 md:grid-cols-2"
        >
          {/* ═══════ Card 1 — AI Analyses (Top Left) ═══════ */}
          <motion.div
            className={CARD}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.analysesTitle}</h2>
              <button className="text-slate-400 transition-colors hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            </div>

            <div className="mb-5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">3</span>
              <span className="text-sm text-slate-500 dark:text-neutral-500">{t.totalAnalyses}</span>
            </div>

            <div className="space-y-1">
              {analysisConfig.map((item, i) => (
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
                  <span className="text-sm font-semibold tabular-nums text-slate-600 dark:text-neutral-300">
                    {i === 0 ? "4,120" : i === 1 ? "3,780" : "2,980"}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* ═══════ Card 2 — Terms Library (Top Right) ═══════ */}
          <motion.div
            className={CARD}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Header */}
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 dark:text-neutral-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

            {/* Big number with animation */}
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

            {/* Legend */}
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

            {/* Divider */}
            <div className="my-4 h-px bg-gray-200 dark:bg-white/[0.06]" />

            {/* Activity heatmap */}
            <div className="flex items-end gap-4">
              <p className="shrink-0 text-sm font-semibold leading-tight text-slate-900 whitespace-pre-line dark:text-white">
                {t.dailyActivity}
              </p>
              <div className="min-w-0 flex-1">
                <ActivityDots months={t.months} />
              </div>
            </div>
          </motion.div>

          {/* ═══════ Card 3 — Study Focus Areas (Bottom Left) ═══════ */}
          <motion.div
            className={CARD}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 dark:text-amber-400">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.knowledgeTitle}</h2>
            </div>

            {/* Petal chart */}
            <PetalChart lang={lang} />

            {/* Bottom controls */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">{t.insights}</span>
                <div className="relative h-5 w-9 rounded-full bg-gray-200 transition-colors dark:bg-white/10">
                  <div className="absolute left-[18px] top-0.5 h-4 w-4 rounded-full bg-emerald-500 transition-all dark:bg-emerald-400" />
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-violet-600 dark:text-violet-400">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* ═══════ Card 4 — Quick Access (Bottom Right) ═══════ */}
          <motion.div
            className={CARD}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header with toggle */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 dark:text-amber-400">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">{t.quickTitle}</h2>
              </div>
              <div className="flex rounded-xl bg-gray-100 p-0.5 dark:bg-white/[0.06]">
                <button
                  onClick={() => setQuickTab("week")}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    quickTab === "week" ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                  }`}
                >
                  {t.week}
                </button>
                <button
                  onClick={() => setQuickTab("month")}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    quickTab === "month" ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                  }`}
                >
                  {t.month}
                </button>
              </div>
            </div>

            {/* Quick-access rows */}
            <div className="space-y-1">
              {t.links.map((link, i) => {
                const avatarColors = ["bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400", "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400", "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"];
                const icons = ["📖", "📝", "📋"];
                const ringColors = ["#34d399", "#60a5fa", "#a78bfa"];
                const ringValues = [
                  totalTerms > 0 ? Math.round((bookmarksCount / totalTerms) * 100) : 12,
                  notesCount > 0 ? Math.min(notesCount * 10, 100) : 8,
                  28,
                ];
                const dates = [
                  lang === "en" ? "Feb 15" : "15 Feb",
                  lang === "en" ? "Feb 12" : "12 Feb",
                  lang === "en" ? "Feb 5" : "5 Feb",
                ];

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-all duration-200 hover:translate-x-0.5 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                  >
                    {/* Avatar */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${avatarColors[i]}`}>
                      {icons[i]}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{link.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-500">
                        {link.sub}
                      </div>
                    </div>

                    {/* Badge */}
                    <span className="hidden shrink-0 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-white/[0.06] dark:text-neutral-400 sm:inline-flex sm:items-center sm:gap-1">
                      <span className="inline-block h-1 w-1 rounded-full bg-violet-500 dark:bg-violet-400" />
                      {link.badge}
                    </span>

                    {/* Date */}
                    <span className="hidden shrink-0 text-[10px] text-slate-400 dark:text-neutral-500 md:inline-flex md:items-center md:gap-1">
                      <span className="inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-neutral-600" />
                      {dates[i]}
                    </span>

                    {/* Progress ring */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      <ProgressRing value={ringValues[i]} color={ringColors[i]} />
                      <span className="text-[11px] font-medium tabular-nums text-slate-500 dark:text-neutral-400">{ringValues[i]}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* ═══════ Daily Challenge ═══════ */}
          <DailyChallenge lang={lang} />

          {/* ═══════ Achievements ═══════ */}
          <AchievementShowcase lang={lang} />

          {/* ═══════ Card 5 — Flashcard Quiz (Full width) ═══════ */}
          <motion.div
            className={`${CARD} md:col-span-2`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
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
                {/* Quick stats */}
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
        </LangSwitchWrapper>
      </main>
    </div>
  );
}
