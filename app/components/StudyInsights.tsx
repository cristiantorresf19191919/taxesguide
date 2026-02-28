"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function StudyInsights({ lang }: { lang: Lang }) {
  const { state } = useProgress();
  const isEn = lang === "en";

  const insights = useMemo(() => {
    const log = state.dailyXPLog;
    const entries = Object.entries(log);

    // Best study day of week
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    entries.forEach(([date, xp]) => {
      const day = new Date(date).getDay();
      dayTotals[day] += xp;
      dayCounts[day]++;
    });
    const dayAvg = dayTotals.map((total, i) => dayCounts[i] > 0 ? total / dayCounts[i] : 0);
    const bestDayIdx = dayAvg.indexOf(Math.max(...dayAvg));
    const bestDay = (isEn ? DAYS_EN : DAYS_ES)[bestDayIdx];

    // This week's XP vs last week
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    let thisWeekXP = 0;
    let lastWeekXP = 0;
    entries.forEach(([date, xp]) => {
      const d = new Date(date);
      if (d >= thisWeekStart) thisWeekXP += xp;
      else if (d >= lastWeekStart && d < thisWeekStart) lastWeekXP += xp;
    });
    const weeklyChange = lastWeekXP > 0
      ? Math.round(((thisWeekXP - lastWeekXP) / lastWeekXP) * 100)
      : thisWeekXP > 0 ? 100 : 0;

    // Active days
    const activeDays = entries.length;

    // Average XP per active day
    const avgXP = activeDays > 0
      ? Math.round(entries.reduce((acc, [, xp]) => acc + xp, 0) / activeDays)
      : 0;

    return { bestDay, thisWeekXP, weeklyChange, activeDays, avgXP };
  }, [state.dailyXPLog, isEn]);

  const cards = [
    {
      icon: "📅",
      value: insights.bestDay,
      label: isEn ? "Best study day" : "Mejor día de estudio",
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: "📈",
      value: `${insights.weeklyChange >= 0 ? "+" : ""}${insights.weeklyChange}%`,
      label: isEn ? "Weekly change" : "Cambio semanal",
      color: insights.weeklyChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400",
    },
    {
      icon: "⚡",
      value: `${insights.avgXP}`,
      label: isEn ? "Avg XP / day" : "XP prom. / día",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: "🗓️",
      value: `${insights.activeDays}`,
      label: isEn ? "Active days" : "Días activos",
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">💡</span>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isEn ? "Study Insights" : "Datos de estudio"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-white/[0.04] dark:bg-white/[0.02]"
          >
            <span className="text-sm">{card.icon}</span>
            <p className={`mt-1 text-lg font-black ${card.color}`}>
              {card.value}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-neutral-500">
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>

      {insights.thisWeekXP > 0 && (
        <div className="mt-3 rounded-xl bg-violet-50/50 px-3 py-2 dark:bg-violet-500/5">
          <p className="text-[10px] text-slate-500 dark:text-neutral-400">
            {isEn
              ? `This week: ${insights.thisWeekXP} XP earned so far`
              : `Esta semana: ${insights.thisWeekXP} XP ganados hasta ahora`}
          </p>
        </div>
      )}
    </motion.div>
  );
}
