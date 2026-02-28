"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";
import { ACHIEVEMENTS } from "@/app/data/achievements";

type Lang = "en" | "es";

export function AchievementShowcase({ lang }: { lang: Lang }) {
  const { state } = useProgress();
  const isEn = lang === "en";
  const unlockedCount = state.unlockedAchievements.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isEn ? "Achievements" : "Logros"}
        </h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/[0.06] dark:text-neutral-300">
          {unlockedCount} / {ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = state.unlockedAchievements.includes(ach.id);
          const title = isEn ? ach.titleEn : ach.titleEs;
          const desc = isEn ? ach.descEn : ach.descEs;
          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.1 }}
              title={`${title}: ${desc}`}
              className={`group relative flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all ${
                unlocked
                  ? "bg-gray-50 dark:bg-white/[0.04]"
                  : "opacity-30 grayscale"
              }`}
            >
              <span className="text-xl">{ach.icon}</span>
              <span className="text-[9px] font-medium leading-tight text-slate-500 dark:text-neutral-400">
                {title}
              </span>
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900">
                {desc}
              </div>
            </motion.div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-neutral-500">
          {isEn
            ? "Start studying to unlock badges!"
            : "¡Empieza a estudiar para desbloquear insignias!"}
        </p>
      )}
    </motion.div>
  );
}
