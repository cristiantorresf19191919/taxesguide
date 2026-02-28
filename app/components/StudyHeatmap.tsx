"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

const WEEKS = 12;
const DAYS = 7;
const DAY_LABELS_EN = ["", "Mon", "", "Wed", "", "Fri", ""];
const DAY_LABELS_ES = ["", "Lun", "", "Mié", "", "Vie", ""];

function getColor(xp: number): string {
  if (xp === 0) return "bg-gray-100 dark:bg-white/[0.04]";
  if (xp < 20) return "bg-emerald-200 dark:bg-emerald-500/20";
  if (xp < 50) return "bg-emerald-300 dark:bg-emerald-500/35";
  if (xp < 100) return "bg-emerald-400 dark:bg-emerald-500/55";
  return "bg-emerald-500 dark:bg-emerald-400/80";
}

export function StudyHeatmap({ lang }: { lang: Lang }) {
  const { state } = useProgress();
  const isEn = lang === "en";
  const dayLabels = isEn ? DAY_LABELS_EN : DAY_LABELS_ES;

  const { grid, monthLabels, totalXPPeriod } = useMemo(() => {
    const today = new Date();
    const cells: { date: string; xp: number; col: number; row: number }[] = [];

    // Calculate the start date (WEEKS weeks ago, aligned to Monday)
    const end = new Date(today);
    const startOffset = (WEEKS * 7) - 1;
    const start = new Date(today);
    start.setDate(start.getDate() - startOffset);
    // Align to Monday (0=Sun, 1=Mon)
    const dayOfWeek = start.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + mondayOffset);

    let total = 0;
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let col = 0; col < WEEKS; col++) {
      for (let row = 0; row < DAYS; row++) {
        const d = new Date(start);
        d.setDate(d.getDate() + col * 7 + row);
        if (d > today) continue;
        const dateStr = d.toISOString().slice(0, 10);
        const xp = state.dailyXPLog[dateStr] || 0;
        total += xp;
        cells.push({ date: dateStr, xp, col, row });

        if (row === 0 && d.getMonth() !== lastMonth) {
          lastMonth = d.getMonth();
          const monthName = d.toLocaleString(isEn ? "en" : "es", { month: "short" });
          months.push({ label: monthName, col });
        }
      }
    }

    return { grid: cells, monthLabels: months, totalXPPeriod: total };
  }, [state.dailyXPLog, isEn]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isEn ? "Study Activity" : "Actividad de estudio"}
          </h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          {totalXPPeriod.toLocaleString()} XP
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] pr-1.5 pt-4">
            {dayLabels.map((label, i) => (
              <div key={i} className="flex h-[13px] items-center">
                <span className="text-[9px] text-slate-400 dark:text-neutral-500">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="relative mb-1 h-3">
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-[9px] text-slate-400 dark:text-neutral-500"
                  style={{ left: m.col * 16 }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[3px]">
              {Array.from({ length: WEEKS }).map((_, col) => (
                <div key={col} className="flex flex-col gap-[3px]">
                  {Array.from({ length: DAYS }).map((_, row) => {
                    const cell = grid.find(
                      (c) => c.col === col && c.row === row
                    );
                    if (!cell) {
                      return (
                        <div
                          key={row}
                          className="h-[13px] w-[13px] rounded-[3px] bg-transparent"
                        />
                      );
                    }
                    return (
                      <div
                        key={row}
                        title={`${cell.date}: ${cell.xp} XP`}
                        className={`h-[13px] w-[13px] rounded-[3px] transition-colors ${getColor(cell.xp)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span className="text-[9px] text-slate-400 dark:text-neutral-500">
          {isEn ? "Less" : "Menos"}
        </span>
        {[0, 10, 30, 70, 100].map((xp) => (
          <div
            key={xp}
            className={`h-[10px] w-[10px] rounded-[2px] ${getColor(xp)}`}
          />
        ))}
        <span className="text-[9px] text-slate-400 dark:text-neutral-500">
          {isEn ? "More" : "Más"}
        </span>
      </div>
    </motion.div>
  );
}
