"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatGPTLogo, GeminiLogo, ClaudeLogo } from "./components/ModelLogos";
import { LangSwitchWrapper } from "./components/LangSwitchWrapper";
import { TERMS } from "./data/terms";

type Lang = "en" | "es";

/* ─── i18n ─────────────────────────────────────────────────────────── */

const copy = {
  en: {
    navTitle: "Tax Preparer",
    navSub: "Study Dashboard",
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
  },
  es: {
    navTitle: "Preparador de Impuestos",
    navSub: "Panel de Estudio",
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
  },
};

const analysisConfig = [
  { href: "/analisis-chatgpt", Logo: ChatGPTLogo, color: "bg-emerald-500", accent: "#34d399" },
  { href: "/analisis-gemini", Logo: GeminiLogo, color: "bg-blue-500", accent: "#60a5fa" },
  { href: "/analisis-claude", Logo: ClaudeLogo, color: "bg-amber-500", accent: "#fbbf24" },
];

const AREA_VALUES = [87, 90, 89, 39, 38, 21];
const AREA_COLORS = ["#6ee7b7", "#818cf8", "#22d3ee", "#f472b6", "#fbbf24", "#a78bfa"];

/* ─── Deterministic pseudo-random for activity dots ───────────────── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ─── Small components ─────────────────────────────────────────────── */

function ProgressRing({ value, size = 28, color = "#8b5cf6" }: { value: number; size?: number; color?: string }) {
  const sw = 2.5;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
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
          <div
            key={i}
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
      <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/[0.06] text-sm text-violet-300">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Labels at petal tips */}
      {petals.map((p, i) => {
        const angleRad = ((i * 60 - 90) * Math.PI) / 180;
        const radius = 118;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        return (
          <div
            key={i}
            className="absolute text-center"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="text-xs font-bold text-white sm:text-sm">{p.value}%</div>
            <div className="text-[9px] leading-tight text-neutral-400 sm:text-[10px]">{p.label}</div>
          </div>
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
      <div className="mb-2 flex justify-between text-[10px] text-neutral-500">
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
                <div
                  key={row}
                  className={`h-[7px] w-[7px] rounded-full sm:h-2 sm:w-2 ${
                    level === 0
                      ? "bg-white/[0.06]"
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

const CARD = "rounded-2xl border border-white/[0.07] bg-[#141417] p-5 sm:p-7";

/* ─── Main ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [notesCount, setNotesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [quickTab, setQuickTab] = useState<"week" | "month">("week");

  const t = copy[lang];
  const totalTerms = TERMS.length;

  useEffect(() => {
    try {
      const n = JSON.parse(localStorage.getItem("tax-guide-notes") || "[]");
      setNotesCount(Array.isArray(n) ? n.length : 0);
    } catch { setNotesCount(0); }
    try {
      const b = JSON.parse(localStorage.getItem("tax-guide-glossary-bookmarks") || "[]");
      setBookmarksCount(Array.isArray(b) ? b.length : 0);
    } catch { setBookmarksCount(0); }
  }, []);

  const bookmarkPct = totalTerms > 0 ? Math.round((bookmarksCount / totalTerms) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
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
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-emerald-500/20 text-sm ring-1 ring-white/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">{t.navTitle}</div>
              <div className="hidden text-[11px] text-neutral-500 sm:block">{t.navSub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/glossary"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {lang === "en" ? "Glossary" : "Glosario"}
            </Link>
            <Link
              href="/notes"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {lang === "en" ? "Notes" : "Apuntes"}
            </Link>
            <button
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
              className="relative overflow-hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
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
              <h2 className="text-[15px] font-semibold text-white">{t.analysesTitle}</h2>
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
            </div>

            <div className="mb-5 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">3</span>
              <span className="text-sm text-neutral-500">{t.totalAnalyses}</span>
            </div>

            <div className="space-y-1">
              {analysisConfig.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.04]"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}/15`}>
                    <item.Logo size={28} className="scale-[0.35] origin-center" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white">{t.entries[i].title}</div>
                    <div className="text-[11px] text-neutral-500">{t.entries[i].sub}</div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-300 tabular-nums">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h2 className="text-[15px] font-semibold text-white">{t.libraryTitle}</h2>
              </div>
              <Link
                href="/glossary"
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-neutral-300 transition-colors hover:bg-white/10"
              >
                {t.fullStats}
              </Link>
            </div>

            {/* Big number */}
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold tracking-tight text-white">{totalTerms.toLocaleString()}</div>
                <div className="mt-0.5 text-xs text-neutral-500">{t.termsLabel}</div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-emerald-400">{bookmarkPct}%</span>
                <span className="ml-1.5 text-xs text-neutral-500">{t.progressLabel}</span>
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
              <div
                className="absolute right-0 top-0 bottom-0 bg-neutral-800/80"
                style={{ width: `${100 - Math.min(bookmarkPct * 2, 100)}%` }}
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow">
                {bookmarksCount}
              </span>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white drop-shadow">
                {totalTerms}
              </span>
            </div>

            {/* Legend */}
            <div className="mt-2.5 flex items-center gap-4 text-[10px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
                {t.legendLow}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {t.legendHigh}
              </span>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-white/[0.06]" />

            {/* Activity heatmap */}
            <div className="flex items-end gap-4">
              <p className="shrink-0 text-sm font-semibold leading-tight text-white whitespace-pre-line">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h2 className="text-[15px] font-semibold text-white">{t.knowledgeTitle}</h2>
            </div>

            {/* Petal chart */}
            <PetalChart lang={lang} />

            {/* Bottom controls */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-400">{t.insights}</span>
                <div className="relative h-5 w-9 rounded-full bg-white/10 transition-colors">
                  <div className="absolute left-[18px] top-0.5 h-4 w-4 rounded-full bg-emerald-400 transition-all" />
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
                <h2 className="text-[15px] font-semibold text-white">{t.quickTitle}</h2>
              </div>
              <div className="flex rounded-xl bg-white/[0.06] p-0.5">
                <button
                  onClick={() => setQuickTab("week")}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    quickTab === "week" ? "bg-white/15 text-white" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {t.week}
                </button>
                <button
                  onClick={() => setQuickTab("month")}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    quickTab === "month" ? "bg-white/15 text-white" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {t.month}
                </button>
              </div>
            </div>

            {/* Quick-access rows */}
            <div className="space-y-1">
              {t.links.map((link, i) => {
                const avatarColors = ["bg-emerald-500/20 text-emerald-400", "bg-blue-500/20 text-blue-400", "bg-violet-500/20 text-violet-400"];
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
                    className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-white/[0.04]"
                  >
                    {/* Avatar */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${avatarColors[i]}`}>
                      {icons[i]}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">{link.title}</div>
                      <div className="text-[11px] text-neutral-500">
                        {link.sub}
                      </div>
                    </div>

                    {/* Badge */}
                    <span className="hidden shrink-0 rounded-lg bg-white/[0.06] px-2 py-1 text-[10px] font-semibold text-neutral-400 sm:inline-flex sm:items-center sm:gap-1">
                      <span className="inline-block h-1 w-1 rounded-full bg-violet-400" />
                      {link.badge}
                    </span>

                    {/* Date */}
                    <span className="hidden shrink-0 text-[10px] text-neutral-500 md:inline-flex md:items-center md:gap-1">
                      <span className="inline-block h-1 w-1 rounded-full bg-neutral-600" />
                      {dates[i]}
                    </span>

                    {/* Progress ring */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      <ProgressRing value={ringValues[i]} color={ringColors[i]} />
                      <span className="text-[11px] font-medium text-neutral-400 tabular-nums">{ringValues[i]}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
        </LangSwitchWrapper>
      </main>
    </div>
  );
}
