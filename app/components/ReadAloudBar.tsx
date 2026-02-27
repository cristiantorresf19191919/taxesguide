"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReadAloud } from "@/app/contexts/ReadAloudContext";

const labels = {
  en: {
    readAloud: "Read aloud",
    english: "English",
    spanishLatino: "Spanish (Latino)",
    male: "Male",
    female: "Female",
    readPage: "Read page",
    readSelection: "Read selection",
    play: "Play",
    pause: "Pause",
    stop: "Stop",
    voice: "Voice",
    selectVoice: "Select voice",
  },
  es: {
    readAloud: "Leer en voz alta",
    english: "Inglés",
    spanishLatino: "Español (Latino)",
    male: "Masculino",
    female: "Femenino",
    readPage: "Leer página",
    readSelection: "Leer selección",
    play: "Reproducir",
    pause: "Pausar",
    stop: "Detener",
    voice: "Voz",
    selectVoice: "Seleccionar voz",
  },
};

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
  const [open, setOpen] = useState(false);
  const [uiLang, setUiLang] = useState<"en" | "es">("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const supported = mounted && typeof window !== "undefined" && !!window.speechSynthesis;
  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const esVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("es"));
  const currentList = voiceLang === "es" ? esVoices : enVoices;
  const canPause = status === "speaking";
  const canResume = status === "paused";
  const canPlay = status === "idle";
  const canStop = status === "speaking" || status === "paused";

  const t = labels[uiLang];

  if (!supported) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-fit -translate-x-1/2 sm:bottom-6"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-visible rounded-[1.25rem] border border-white/[0.08] bg-neutral-900/95 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
        {/* Main controls row */}
        <div className="flex items-center gap-1.5 p-2 sm:gap-2 sm:p-2.5">
          <span className="hidden px-2 text-xs font-medium tracking-wide text-neutral-500 uppercase sm:inline">
            {t.readAloud}
          </span>

          {/* Language toggle */}
          <div className="flex rounded-xl bg-white/[0.06] p-0.5">
            <motion.button
              type="button"
              onClick={() => setVoiceLang("en")}
              whileTap={{ scale: 0.95 }}
              className={`relative min-w-[2.25rem] rounded-[0.625rem] px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:min-w-0 sm:px-3 ${
                voiceLang === "en"
                  ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span className="sm:hidden">EN</span>
              <span className="hidden sm:inline">{t.english}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setVoiceLang("es")}
              whileTap={{ scale: 0.95 }}
              className={`relative min-w-[2.25rem] rounded-[0.625rem] px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:min-w-0 sm:px-3 ${
                voiceLang === "es"
                  ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span className="sm:hidden">ES</span>
              <span className="hidden sm:inline">{t.spanishLatino}</span>
            </motion.button>
          </div>

          {/* Gender toggle */}
          <div className="flex rounded-xl bg-white/[0.06] p-0.5">
            <motion.button
              type="button"
              onClick={() => setVoiceGender("female")}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[2.25rem] rounded-[0.625rem] px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:min-w-0 sm:px-3 ${
                voiceGender === "female"
                  ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {t.female}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setVoiceGender("male")}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[2.25rem] rounded-[0.625rem] px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:min-w-0 sm:px-3 ${
                voiceGender === "male"
                  ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {t.male}
            </motion.button>
          </div>

          <div className="hidden h-5 w-px bg-white/[0.08] sm:block" />

          {/* Play / Pause / Resume / Stop controls */}
          {canPlay && (
            <>
              <motion.button
                type="button"
                onClick={speakSelection}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-400 transition-all duration-200 hover:bg-emerald-500/30 hover:shadow-[0_0_16px_rgba(16,185,129,0.15)]"
                title={hasSelection ? t.readSelection : t.readPage}
              >
                <PlayIcon className="h-4 w-4 shrink-0" />
                <span className="hidden xs:inline sm:inline">{hasSelection ? t.readSelection : t.readPage}</span>
              </motion.button>
              {hasSelection && (
                <motion.button
                  type="button"
                  onClick={speakPage}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-[0.625rem] px-2.5 py-1.5 text-xs text-neutral-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                  title={t.readPage}
                >
                  {t.readPage}
                </motion.button>
              )}
            </>
          )}
          {canPause && (
            <motion.button
              type="button"
              onClick={pause}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-semibold text-amber-400 transition-all duration-200 hover:bg-amber-500/30 hover:shadow-[0_0_16px_rgba(245,158,11,0.15)]"
              title={t.pause}
            >
              <PauseIcon className="h-4 w-4 shrink-0" />
              {t.pause}
            </motion.button>
          )}
          {canResume && (
            <motion.button
              type="button"
              onClick={resume}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-400 transition-all duration-200 hover:bg-emerald-500/30 hover:shadow-[0_0_16px_rgba(16,185,129,0.15)]"
              title={t.play}
            >
              <PlayIcon className="h-4 w-4 shrink-0" />
              {t.play}
            </motion.button>
          )}
          {canStop && (
            <motion.button
              type="button"
              onClick={stop}
              whileTap={{ scale: 0.93 }}
              className="rounded-xl bg-red-500/20 p-2 text-red-400 transition-all duration-200 hover:bg-red-500/30 hover:shadow-[0_0_16px_rgba(239,68,68,0.15)]"
              title={t.stop}
              aria-label={t.stop}
            >
              <StopIcon className="h-4 w-4" />
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={() => setUiLang((l) => (l === "en" ? "es" : "en"))}
            whileTap={{ scale: 0.95 }}
            className="rounded-[0.625rem] px-2 py-1.5 text-xs font-medium text-neutral-500 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
          >
            {uiLang === "en" ? "ES" : "EN"}
          </motion.button>
        </div>

        {/* Voice selector — elegant dropdown */}
        {currentList.length > 0 && (
          <div ref={dropdownRef} className="relative border-t border-white/[0.06] px-3 pb-2.5 pt-2">
            <motion.button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="group flex w-full items-center justify-between gap-2 rounded-xl bg-white/[0.04] px-3 py-2 transition-all duration-200 hover:bg-white/[0.08]"
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <VoiceIcon className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                <span className="truncate text-xs font-medium text-neutral-300">
                  {currentVoice?.name ?? t.selectVoice}
                </span>
              </div>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-neutral-500"
              >
                <ChevronIcon className="h-3 w-3" />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-800/98 shadow-[0_12px_48px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
                >
                  <div className="max-h-48 overflow-y-auto overscroll-contain p-1.5">
                    {currentList.map((v) => {
                      const isActive = currentVoice?.id === v.id;
                      return (
                        <motion.button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setVoiceById(v.id);
                            setOpen(false);
                          }}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                          whileTap={{ scale: 0.99 }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150 ${
                            isActive
                              ? "bg-white/[0.1] text-white"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isActive
                                ? "border-emerald-400 bg-emerald-400"
                                : "border-neutral-600 bg-transparent"
                            }`}
                          >
                            {isActive && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="block h-1.5 w-1.5 rounded-full bg-neutral-900"
                              />
                            )}
                          </span>
                          <span className="flex-1 truncate text-xs font-medium">{v.name}</span>
                          <span className="shrink-0 text-[10px] text-neutral-500">{v.lang}</span>
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
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
    </svg>
  );
}

function VoiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 1v14M4 4v8M12 4v8M2 6v4M14 6v4M6 2.5v11M10 2.5v11" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5l3 3 3-3" />
    </svg>
  );
}
