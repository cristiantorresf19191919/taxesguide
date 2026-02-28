"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReadAloud } from "@/app/contexts/ReadAloudContext";

/* ── i18n labels ─────────────────────────────────────────────────── */
const labels = {
  en: {
    readAloud: "Read Aloud",
    male: "Male",
    female: "Female",
    readPage: "Read page",
    readSelection: "Selection",
    play: "Play",
    pause: "Pause",
    stop: "Stop",
    selectVoice: "Select voice",
  },
  es: {
    readAloud: "Leer en voz alta",
    male: "Masc",
    female: "Fem",
    readPage: "Leer página",
    readSelection: "Selección",
    play: "Reproducir",
    pause: "Pausar",
    stop: "Detener",
    selectVoice: "Seleccionar voz",
  },
};

/* ── Component ───────────────────────────────────────────────────── */
export function ReadAloudBar() {
  const {
    status,
    voiceLang,
    voiceGender,
    voices,
    setVoiceLang,
    setVoiceGender,
    setVoiceById,
    currentVoice,
    speakPage,
    speakSelection,
    pause,
    resume,
    stop,
    hasSelection,
  } = useReadAloud();

  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [uiLang, setUiLang] = useState<"en" | "es">("en");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close everything on outside click
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
        setVoiceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const supported =
    mounted && typeof window !== "undefined" && !!window.speechSynthesis;

  const enVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith("en"),
  );
  const esVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith("es"),
  );
  const currentList = voiceLang === "es" ? esVoices : enVoices;

  const isActive = status !== "idle";
  const canPause = status === "speaking";
  const canResume = status === "paused";
  const canPlay = status === "idle";
  const canStop = status !== "idle";

  const t = labels[uiLang];

  if (!supported) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* ── Expanded glassmorphism card ─────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-72 origin-bottom-right overflow-visible rounded-2xl border border-gray-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:border-white/[0.1] dark:bg-neutral-900/70 dark:shadow-[0_8px_40px_rgba(0,0,0,0.55)] dark:backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5 dark:border-white/[0.06]">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 dark:text-neutral-500">
                {t.readAloud}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setUiLang((l) => (l === "en" ? "es" : "en"))
                  }
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-900 dark:text-neutral-500 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  {uiLang === "en" ? "ES" : "EN"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    setVoiceOpen(false);
                  }}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-900 dark:text-neutral-500 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  aria-label="Close"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 p-3">
              {/* Language + Gender toggles */}
              <div className="flex gap-2">
                <div className="flex flex-1 rounded-xl bg-gray-100 p-0.5 dark:bg-white/[0.06]">
                  {(["en", "es"] as const).map((lang) => (
                    <motion.button
                      key={lang}
                      type="button"
                      onClick={() => setVoiceLang(lang)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 rounded-[0.625rem] py-1.5 text-xs font-semibold transition-all duration-200 ${
                        voiceLang === lang
                          ? "bg-white text-slate-900 shadow-sm dark:bg-white/[0.14] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                          : "text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-200"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </motion.button>
                  ))}
                </div>

                <div className="flex flex-1 rounded-xl bg-gray-100 p-0.5 dark:bg-white/[0.06]">
                  {(["female", "male"] as const).map((g) => (
                    <motion.button
                      key={g}
                      type="button"
                      onClick={() => setVoiceGender(g)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 rounded-[0.625rem] py-1.5 text-xs font-semibold transition-all duration-200 ${
                        voiceGender === g
                          ? "bg-white text-slate-900 shadow-sm dark:bg-white/[0.14] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                          : "text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-200"
                      }`}
                    >
                      {t[g]}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Playback controls */}
              <div className="flex gap-2">
                {canPlay && (
                  <motion.button
                    type="button"
                    onClick={hasSelection ? speakSelection : speakPage}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 dark:hover:shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                  >
                    <PlayIcon className="h-4 w-4" />
                    {hasSelection ? t.readSelection : t.readPage}
                  </motion.button>
                )}

                {canPause && (
                  <motion.button
                    type="button"
                    onClick={pause}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-50 py-2.5 text-xs font-semibold text-amber-600 transition-all hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 dark:hover:shadow-[0_0_16px_rgba(245,158,11,0.15)]"
                  >
                    <PauseIcon className="h-4 w-4" />
                    {t.pause}
                  </motion.button>
                )}

                {canResume && (
                  <motion.button
                    type="button"
                    onClick={resume}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-600 transition-all hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 dark:hover:shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                  >
                    <PlayIcon className="h-4 w-4" />
                    {t.play}
                  </motion.button>
                )}

                {canStop && (
                  <motion.button
                    type="button"
                    onClick={stop}
                    whileTap={{ scale: 0.93 }}
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-red-500 transition-all hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 dark:hover:shadow-[0_0_16px_rgba(239,68,68,0.15)]"
                    aria-label={t.stop}
                  >
                    <StopIcon className="h-4 w-4" />
                  </motion.button>
                )}

                {canPlay && hasSelection && (
                  <motion.button
                    type="button"
                    onClick={speakPage}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-all hover:bg-gray-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  >
                    {t.readPage}
                  </motion.button>
                )}
              </div>

              {/* Voice selector + dropdown */}
              {currentList.length > 0 && (
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setVoiceOpen((o) => !o)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2 transition-all hover:bg-gray-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <VoiceIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-neutral-500" />
                      <span className="truncate text-xs font-medium text-slate-600 dark:text-neutral-300">
                        {currentVoice?.name ?? t.selectVoice}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: voiceOpen ? 180 : 0 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-slate-400 dark:text-neutral-500"
                    >
                      <ChevronIcon className="h-3 w-3" />
                    </motion.span>
                  </motion.button>

                  {/* Dropdown — opens upward, SOLID bg to prevent text bleed-through */}
                  <AnimatePresence>
                    {voiceOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="absolute bottom-full left-0 right-0 z-[60] mb-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.15)] dark:border-white/[0.1] dark:bg-gray-900 dark:shadow-[0_12px_48px_rgba(0,0,0,0.8)]"
                      >
                        <div className="max-h-56 overflow-y-auto overscroll-contain p-1.5">
                          {currentList.map((v) => {
                            const active = currentVoice?.id === v.id;
                            return (
                              <motion.button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                  setVoiceById(v.id);
                                  setVoiceOpen(false);
                                }}
                                whileHover={{
                                  backgroundColor: "var(--voice-hover, rgba(0,0,0,0.04))",
                                }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150 [.dark_&]:[--voice-hover:rgba(255,255,255,0.08)] ${
                                  active
                                    ? "bg-emerald-50 text-slate-900 dark:bg-white/[0.12] dark:text-white"
                                    : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                                }`}
                              >
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                    active
                                      ? "border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400"
                                      : "border-gray-300 bg-transparent dark:border-neutral-600"
                                  }`}
                                >
                                  {active && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="block h-1.5 w-1.5 rounded-full bg-white dark:bg-neutral-900"
                                    />
                                  )}
                                </span>
                                <span className="flex-1 truncate text-xs font-medium">
                                  {v.name}
                                </span>
                                <span className="shrink-0 text-[10px] text-slate-300 dark:text-neutral-600">
                                  {v.lang}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB button ─────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => {
          setExpanded((e) => !e);
          setVoiceOpen(false);
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-colors duration-300 dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${
          isActive
            ? "bg-emerald-500 text-white"
            : "border border-gray-200 bg-white text-slate-500 hover:text-slate-900 dark:border-white/[0.1] dark:bg-neutral-900/80 dark:text-neutral-300 dark:backdrop-blur-xl dark:hover:text-white"
        }`}
        aria-label={t.readAloud}
      >
        {/* Pulsing ring when speaking */}
        {isActive && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-emerald-400/40"
            animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
        {expanded ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <SpeakerIcon className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function VoiceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 1v14M4 4v8M12 4v8M2 6v4M14 6v4M6 2.5v11M10 2.5v11"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 12 12"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5l3 3 3-3" />
    </svg>
  );
}

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4l8 8M12 4l-8 8"
      />
    </svg>
  );
}
