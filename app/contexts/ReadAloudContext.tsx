"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ReadAloudLang = "en" | "es";
export type ReadAloudGender = "male" | "female";

export type VoiceOption = {
  id: string;
  name: string;
  lang: string;
  gender: ReadAloudGender;
  voice: SpeechSynthesisVoice;
};

export type ReadAloudStatus = "idle" | "speaking" | "paused";

const EN_LANGS = ["en-US", "en-GB", "en"];

function isEnLang(lang: string): boolean {
  const code = lang.toLowerCase();
  return code.startsWith("en");
}

// Spanish Latino only: es-US, es-MX, es-419, etc. Exclude es-ES (Spain).
function isSpanishLatino(lang: string): boolean {
  const code = lang.toLowerCase();
  if (!code.startsWith("es")) return false;
  if (code.startsWith("es-es")) return false; // Spain
  return true; // es-US, es-MX, es-419, etc.
}

function guessGender(name: string, voice: SpeechSynthesisVoice): ReadAloudGender {
  const n = (name + (voice.name || "")).toLowerCase();
  if (n.includes("female") || n.includes("woman") || n.includes("sabina") || n.includes("paulina") || n.includes("monica")) return "female";
  if (n.includes("male") || n.includes("man") || n.includes("diego") || n.includes("jorge") || n.includes("raul")) return "male";
  return "female";
}

function getVoices(): VoiceOption[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const list = window.speechSynthesis.getVoices();
  const out: VoiceOption[] = [];
  list.forEach((v, i) => {
    if (!v.lang) return;
    const lang = v.lang;
    if (isEnLang(lang) || isSpanishLatino(lang)) {
      const gender = guessGender(v.name, v);
      out.push({
        id: `voice-${i}-${v.name}-${v.lang}`,
        name: v.name,
        lang,
        gender,
        voice: v,
      });
    }
  });
  return out;
}

function pickDefaultVoice(voices: VoiceOption[], lang: ReadAloudLang, gender: ReadAloudGender): VoiceOption | undefined {
  const langMatch = lang === "es" ? (v: VoiceOption) => isSpanishLatino(v.lang) : (v: VoiceOption) => isEnLang(v.lang);
  const sameGender = voices.filter((v) => langMatch(v) && v.gender === gender);
  return sameGender[0] ?? voices.filter(langMatch)[0];
}

type ReadAloudContextValue = {
  status: ReadAloudStatus;
  contentLang: ReadAloudLang;
  voiceLang: ReadAloudLang;
  voiceGender: ReadAloudGender;
  voices: VoiceOption[];
  setContentLang: (lang: ReadAloudLang) => void;
  setVoiceLang: (lang: ReadAloudLang) => void;
  setVoiceGender: (gender: ReadAloudGender) => void;
  setVoiceById: (id: string) => void;
  currentVoice: VoiceOption | undefined;
  speakPage: () => void;
  speakSelection: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  hasSelection: boolean;
};

const ReadAloudContext = createContext<ReadAloudContextValue | null>(null);

const CONTENT_SELECTOR = "[data-readaloud-content]";

/**
 * Split long text into smaller chunks at sentence boundaries.
 * Works around a Chrome bug where SpeechSynthesis stops after ~15 seconds
 * on long utterances.
 */
function splitTextIntoChunks(text: string, maxLength = 180): string[] {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    let splitIndex = -1;
    for (let i = Math.min(maxLength, remaining.length - 1); i >= Math.floor(maxLength * 0.5); i--) {
      const char = remaining[i];
      if (char === "." || char === "!" || char === "?" || char === "\n") {
        splitIndex = i + 1;
        break;
      }
    }

    if (splitIndex === -1) {
      splitIndex = remaining.lastIndexOf(" ", maxLength);
    }

    if (splitIndex <= 0) {
      splitIndex = maxLength;
    }

    const chunk = remaining.slice(0, splitIndex).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.slice(splitIndex).trim();
  }

  return chunks;
}

export function ReadAloudProvider({ children }: { children: React.ReactNode }) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [status, setStatus] = useState<ReadAloudStatus>("idle");
  const [contentLang, setContentLangState] = useState<ReadAloudLang>("en");
  const [voiceLang, setVoiceLangState] = useState<ReadAloudLang>("en");
  const [voiceGender, setVoiceGenderState] = useState<ReadAloudGender>("female");
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const loadVoices = useCallback(() => {
    const list = getVoices();
    if (list.length) setVoices(list);
  }, []);

  useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    synthRef.current = synth;
    if (!synth) return;
    loadVoices();
    synth.onvoiceschanged = loadVoices;
    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, [loadVoices]);

  const currentVoice = (() => {
    if (selectedVoiceId) {
      const v = voices.find((x) => x.id === selectedVoiceId);
      if (v) return v;
    }
    return pickDefaultVoice(voices, voiceLang, voiceGender);
  })();

  useEffect(() => {
    if (!currentVoice) return;
    setSelectedVoiceId(currentVoice.id);
  }, [voiceLang, voiceGender, currentVoice?.id]);

  // When user switches voice while speaking or paused, stop so next play uses new voice
  const prevVoiceIdRef = useRef<string | null>(null);
  useEffect(() => {
    const synth = synthRef.current;
    const active = synth?.speaking || synth?.paused;
    if (currentVoice && active) {
      if (prevVoiceIdRef.current != null && prevVoiceIdRef.current !== currentVoice.id) {
        synth?.cancel();
        setStatus("idle");
      }
    }
    prevVoiceIdRef.current = currentVoice?.id ?? null;
  }, [currentVoice?.id]);

  const setContentLang = useCallback((lang: ReadAloudLang) => {
    setContentLangState(lang);
  }, []);

  const setVoiceLang = useCallback((lang: ReadAloudLang) => {
    setVoiceLangState(lang);
    setSelectedVoiceId(null);
  }, []);

  const setVoiceGender = useCallback((gender: ReadAloudGender) => {
    setVoiceGenderState(gender);
    setSelectedVoiceId(null);
  }, []);

  const setVoiceById = useCallback((id: string) => {
    setSelectedVoiceId(id);
  }, []);

  const stop = useCallback(() => {
    const synth = synthRef.current;
    if (synth) {
      synth.cancel();
      utteranceRef.current = null;
    }
    setStatus("idle");
  }, []);

  const pause = useCallback(() => {
    const synth = synthRef.current;
    if (synth && synth.speaking) {
      synth.pause();
      setStatus("paused");
    }
  }, []);

  const resume = useCallback(() => {
    const synth = synthRef.current;
    if (synth && synth.paused) {
      synth.resume();
      setStatus("speaking");
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      const synth = synthRef.current;
      const voice = currentVoice;
      if (!synth || !voice || !text.trim()) return;

      synth.cancel();
      utteranceRef.current = null;

      // Split into smaller chunks for browser compatibility
      const chunks = splitTextIntoChunks(text.trim());
      if (chunks.length === 0) return;

      chunks.forEach((chunk, i) => {
        const u = new SpeechSynthesisUtterance(chunk);
        u.voice = voice.voice;
        u.rate = 0.95;
        u.pitch = 1;
        u.volume = 1;
        u.lang = voice.lang;

        if (i === 0) {
          u.onstart = () => setStatus("speaking");
          utteranceRef.current = u;
        }
        if (i === chunks.length - 1) {
          u.onend = () => {
            utteranceRef.current = null;
            setStatus("idle");
          };
          u.onerror = () => {
            utteranceRef.current = null;
            setStatus("idle");
          };
        }

        synth.speak(u);
      });
    },
    [currentVoice]
  );

  const speakPage = useCallback(() => {
    const el = document.querySelector(CONTENT_SELECTOR);
    const text = el ? (el as HTMLElement).innerText : "";
    if (text.trim()) speak(text);
  }, [speak]);

  const speakSelection = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString?.()?.trim();
    if (text) {
      speak(text);
    } else {
      speakPage();
    }
  }, [speak, speakPage]);

  const [hasSelection, setHasSelection] = useState(false);
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = typeof window !== "undefined" ? window.getSelection() : null;
      setHasSelection(!!sel?.toString?.()?.trim());
    };
    if (typeof document !== "undefined") {
      document.addEventListener("selectionchange", onSelectionChange);
      onSelectionChange();
      return () => document.removeEventListener("selectionchange", onSelectionChange);
    }
  }, []);

  const value: ReadAloudContextValue = {
    status,
    contentLang,
    voiceLang,
    voiceGender,
    voices,
    setContentLang,
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
  };

  return (
    <ReadAloudContext.Provider value={value}>
      {children}
    </ReadAloudContext.Provider>
  );
}

export function useReadAloud() {
  const ctx = useContext(ReadAloudContext);
  if (!ctx) throw new Error("useReadAloud must be used within ReadAloudProvider");
  return ctx;
}
