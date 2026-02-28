"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";
import { LEVELS } from "@/app/data/achievements";

type Lang = "en" | "es";

export function XPBar({ lang }: { lang: Lang }) {
  const { state, level, nextLevel, levelProgress } = useProgress();
  const isEn = lang === "en";
  const title = isEn ? level.titleEn : level.titleEs;
  const isMaxLevel = level.level === LEVELS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-violet-50/80 to-indigo-50/60 p-5 dark:border-white/[0.08] dark:from-violet-500/[0.06] dark:to-indigo-500/[0.04]"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Level badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-black text-white shadow-lg shadow-violet-500/20">
            {level.level}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              {state.xp.toLocaleString()} XP {isEn ? "total" : "total"}
            </p>
          </div>
        </div>

        {/* Next level info */}
        {nextLevel && (
          <div className="text-right">
            <p className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
              {isEn ? "Next level" : "Siguiente nivel"}
            </p>
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
              {nextLevel.minXP - state.xp} XP
            </p>
          </div>
        )}
        {isMaxLevel && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            MAX
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3.5">
        <div className="h-2.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/[0.08]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 dark:text-neutral-500">
          <span>
            {isEn ? `Level ${level.level}` : `Nivel ${level.level}`}
          </span>
          <span>{levelProgress}%</span>
          {nextLevel && (
            <span>
              {isEn ? `Level ${nextLevel.level}` : `Nivel ${nextLevel.level}`}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
