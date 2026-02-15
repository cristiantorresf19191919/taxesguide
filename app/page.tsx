"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatGPTLogo, GeminiLogo, ClaudeLogo } from "./components/ModelLogos";

type Lang = "en" | "es";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
};

const copy = {
  en: {
    navTitle: "Tax preparer",
    navSubtitle: "Analysis by AI model",
    heroTitle: "Analysis to become a tax preparer",
    heroSubtitle: "Choose an analysis from each model to compare paths and requirements.",
    viewAnalysis: "View analysis",
    menu: "Menu",
    entries: [
      { title: "ChatGPT analysis", description: "Path and requirements to become a tax preparer according to ChatGPT." },
      { title: "Gemini analysis", description: "Path and requirements to become a tax preparer according to Gemini." },
      { title: "Claude Code analysis", description: "Path and requirements to become a tax preparer according to Claude." },
    ],
  },
  es: {
    navTitle: "Preparador de impuestos",
    navSubtitle: "Análisis por modelo de IA",
    heroTitle: "Análisis para ser preparador de impuestos",
    heroSubtitle: "Elige un análisis generado por cada modelo para comparar rutas y requisitos.",
    viewAnalysis: "Ver análisis",
    menu: "Menú",
    entries: [
      { title: "Análisis de ChatGPT", description: "Ruta y requisitos para ser preparador de impuestos según ChatGPT." },
      { title: "Análisis de Gemini", description: "Ruta y requisitos para ser preparador de impuestos según Gemini." },
      { title: "Análisis de Claude Code", description: "Ruta y requisitos para ser preparador de impuestos según Claude." },
    ],
  },
};

const entryConfig = [
  { href: "/analisis-chatgpt", Logo: ChatGPTLogo, gradient: "from-emerald-500/25 to-teal-600/20", border: "border-emerald-400/25", dot: "bg-emerald-400" },
  { href: "/analisis-gemini", Logo: GeminiLogo, gradient: "from-blue-500/25 to-violet-600/20", border: "border-blue-400/25", dot: "bg-blue-400" },
  { href: "/analisis-claude", Logo: ClaudeLogo, gradient: "from-amber-500/25 to-orange-600/20", border: "border-amber-400/25", dot: "bg-amber-400" },
];

function HomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/12 blur-[120px]"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-120px] top-[15%] h-[380px] w-[380px] rounded-full bg-emerald-500/10 blur-[100px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-180px] left-[-100px] h-[480px] w-[480px] rounded-full bg-amber-500/8 blur-[100px]"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(52,211,153,0.06),transparent)]" />
    </div>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <HomeBackground />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-white">{t.navTitle}</div>
              <div className="hidden text-xs text-neutral-500 sm:block">{t.navSubtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/glossary"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                {lang === "en" ? "Glossary" : "Glosario"}
              </Link>
            </motion.div>
            <motion.button
              onClick={() => setLang((p) => (p === "en" ? "es" : "en"))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
              aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
            >
              {lang === "en" ? "ES" : "EN"}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-4xl px-4 pb-32 pt-20" data-readaloud-content>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          <motion.div variants={fadeUp} className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                {t.heroTitle}
              </span>
            </h1>
            <motion.p
              className="mt-4 max-w-xl mx-auto text-base text-neutral-400 leading-relaxed"
              variants={fadeUp}
            >
              {t.heroSubtitle}
            </motion.p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entryConfig.map((item, i) => (
              <motion.div
                key={item.href}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={item.href}
                    className={`group relative block overflow-hidden rounded-3xl border ${item.border} bg-white/[0.03] p-6 shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <motion.div
                      className={`relative mb-5 flex justify-center rounded-2xl bg-gradient-to-br ${item.gradient} p-5`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <item.Logo className="transition-transform duration-300 group-hover:scale-105" />
                    </motion.div>
                    <div className="relative flex items-start gap-3">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.dot} ring-2 ring-white/10`} />
                      <div>
                        <h2 className="font-semibold text-white transition-colors group-hover:text-white">
                          {t.entries[i].title}
                        </h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                          {t.entries[i].description}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      className="relative mt-5 flex items-center text-sm font-medium text-neutral-300 transition-colors group-hover:text-white"
                      whileHover={{ x: 4 }}
                    >
                      {t.viewAnalysis}
                      <span className="ml-2 text-neutral-500 transition-transform group-hover:translate-x-1">→</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
