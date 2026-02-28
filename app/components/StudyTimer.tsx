"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type TimerPhase = "idle" | "study" | "break" | "done";

const STUDY_MINUTES = 25;
const BREAK_MINUTES = 5;
const XP_PER_SESSION = 40;

export function StudyTimer({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const { addXP } = useProgress();

  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [timeLeft, setTimeLeft] = useState(STUDY_MINUTES * 60);
  const [sessionsToday, setSessionsToday] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const xpAwardedRef = useRef(false);

  // Load today's sessions
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tax-guide-pomodoro");
      if (raw) {
        const data = JSON.parse(raw);
        const today = new Date().toISOString().slice(0, 10);
        if (data.date === today) {
          setSessionsToday(data.count || 0);
        }
      }
    } catch {}
  }, []);

  const saveSession = useCallback(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = localStorage.getItem("tax-guide-pomodoro");
      let count = 1;
      if (raw) {
        const data = JSON.parse(raw);
        if (data.date === today) count = (data.count || 0) + 1;
      }
      localStorage.setItem(
        "tax-guide-pomodoro",
        JSON.stringify({ date: today, count })
      );
      setSessionsToday(count);
    } catch {}
  }, []);

  // Timer logic
  useEffect(() => {
    if (phase !== "study" && phase !== "break") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (phase === "study") {
            // Study session complete
            if (!xpAwardedRef.current) {
              addXP(XP_PER_SESSION);
              saveSession();
              xpAwardedRef.current = true;
            }
            setPhase("break");
            return BREAK_MINUTES * 60;
          } else {
            // Break complete
            setPhase("done");
            return 0;
          }
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, addXP, saveSession]);

  const startStudy = useCallback(() => {
    setPhase("study");
    setTimeLeft(STUDY_MINUTES * 60);
    xpAwardedRef.current = false;
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("idle");
    setTimeLeft(STUDY_MINUTES * 60);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  // Circle progress for timer
  const totalTime =
    phase === "study"
      ? STUDY_MINUTES * 60
      : phase === "break"
        ? BREAK_MINUTES * 60
        : STUDY_MINUTES * 60;
  const progress = phase === "idle" || phase === "done" ? 0 : ((totalTime - timeLeft) / totalTime) * 100;

  const ringSize = 120;
  const sw = 6;
  const r = (ringSize - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  const ringColor =
    phase === "study"
      ? "#8b5cf6"
      : phase === "break"
        ? "#10b981"
        : "#94a3b8";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍅</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Focus Timer" : "Temporizador de enfoque"}
          </h3>
        </div>
        {sessionsToday > 0 && (
          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            {sessionsToday} {isEn ? "today" : "hoy"}
          </span>
        )}
      </div>

      {/* Timer ring */}
      <div className="relative mb-4">
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            className="dark:stroke-white/[0.06]"
            strokeWidth={sw}
          />
          <motion.circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth={sw}
            strokeDasharray={c}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
            {phase === "study"
              ? isEn
                ? "Studying"
                : "Estudiando"
              : phase === "break"
                ? isEn
                  ? "Break"
                  : "Descanso"
                : phase === "done"
                  ? isEn
                    ? "Done!"
                    : "¡Listo!"
                  : isEn
                    ? "Ready"
                    : "Listo"}
          </span>
        </div>
      </div>

      {/* XP reward info */}
      <p className="mb-4 text-[10px] text-slate-400 dark:text-neutral-500">
        {isEn
          ? `${STUDY_MINUTES} min study · ${BREAK_MINUTES} min break · +${XP_PER_SESSION} XP`
          : `${STUDY_MINUTES} min estudio · ${BREAK_MINUTES} min descanso · +${XP_PER_SESSION} XP`}
      </p>

      {/* Controls */}
      {phase === "idle" && (
        <motion.button
          type="button"
          onClick={startStudy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/20"
        >
          {isEn ? "Start Focus Session" : "Iniciar sesión de enfoque"}
        </motion.button>
      )}

      {(phase === "study" || phase === "break") && (
        <motion.button
          type="button"
          onClick={stopTimer}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-gray-200 dark:bg-white/[0.06] dark:text-neutral-300 dark:hover:bg-white/[0.1]"
        >
          {isEn ? "Stop" : "Detener"}
        </motion.button>
      )}

      {phase === "done" && (
        <div className="w-full space-y-2">
          <p className="text-center text-xs font-bold text-emerald-500">
            +{XP_PER_SESSION} XP {isEn ? "earned!" : "ganados!"}
          </p>
          <motion.button
            type="button"
            onClick={startStudy}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/20"
          >
            {isEn ? "Start Another Session" : "Otra sesión"}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
