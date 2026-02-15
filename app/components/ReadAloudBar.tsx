"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const supported = mounted && typeof window !== "undefined" && !!window.speechSynthesis;
  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const esVoices = voices.filter(
    (v) => v.lang.toLowerCase().startsWith("es") && !v.lang.toLowerCase().startsWith("es-es")
  );
  const currentList = voiceLang === "es" ? esVoices : enVoices;
  const canPause = status === "speaking";
  const canResume = status === "paused";
  const canPlay = status === "idle";
  const canStop = status === "speaking" || status === "paused";

  const t = labels[uiLang];

  if (!supported) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-max -translate-x-1/2 sm:bottom-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/95 shadow-2xl ring-1 ring-white/[0.06] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5 p-2 sm:gap-2 sm:p-2.5">
          <span className="hidden px-2 text-xs font-medium text-neutral-500 sm:inline">{t.readAloud}</span>

          <div className="flex rounded-xl bg-white/5 p-0.5">
            <motion.button
              type="button"
              onClick={() => setVoiceLang("en")}
              whileTap={{ scale: 0.97 }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                voiceLang === "en" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.english}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setVoiceLang("es")}
              whileTap={{ scale: 0.97 }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                voiceLang === "es" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.spanishLatino}
            </motion.button>
          </div>

          <div className="flex rounded-xl bg-white/5 p-0.5">
            <motion.button
              type="button"
              onClick={() => setVoiceGender("female")}
              whileTap={{ scale: 0.97 }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                voiceGender === "female" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.female}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setVoiceGender("male")}
              whileTap={{ scale: 0.97 }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                voiceGender === "male" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t.male}
            </motion.button>
          </div>

          <div className="h-5 w-px bg-white/10" />

          {canPlay && (
            <>
              <motion.button
                type="button"
                onClick={speakSelection}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
                title={hasSelection ? t.readSelection : t.readPage}
              >
                <PlayIcon className="h-4 w-4" />
                {hasSelection ? t.readSelection : t.readPage}
              </motion.button>
              {hasSelection && (
                <motion.button
                  type="button"
                  onClick={speakPage}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg px-2 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
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
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/30"
              title={t.pause}
            >
              <PauseIcon className="h-4 w-4" />
              {t.pause}
            </motion.button>
          )}
          {canResume && (
            <motion.button
              type="button"
              onClick={resume}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
              title={t.play}
            >
              <PlayIcon className="h-4 w-4" />
              {t.play}
            </motion.button>
          )}
          {canStop && (
            <motion.button
              type="button"
              onClick={stop}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-red-500/20 p-2 text-red-400 transition-colors hover:bg-red-500/30"
              title={t.stop}
              aria-label={t.stop}
            >
              <StopIcon className="h-4 w-4" />
            </motion.button>
          )}

          <motion.button
            type="button"
            onClick={() => setUiLang((l) => (l === "en" ? "es" : "en"))}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg px-2 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            {uiLang === "en" ? "ES" : "EN"}
          </motion.button>
        </div>

        {currentList.length > 1 && (
          <div className="border-t border-white/10 px-2 pb-2 pt-1.5">
            <motion.button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-xs text-neutral-400 transition-colors hover:text-white"
              whileTap={{ scale: 0.98 }}
            >
              {t.voice}: {currentVoice?.name ?? "—"}
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-1.5 overflow-hidden"
                >
                  <div className="max-h-24 overflow-y-auto rounded-xl bg-white/5 py-1 sm:max-h-32">
                    {currentList.map((v) => (
                      <li key={v.id}>
                        <motion.button
                          type="button"
                          onClick={() => {
                            setVoiceById(v.id);
                            setOpen(false);
                          }}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${
                            currentVoice?.id === v.id ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {v.name} ({v.lang})
                        </motion.button>
                      </li>
                    ))}
                  </div>
                </motion.ul>
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
