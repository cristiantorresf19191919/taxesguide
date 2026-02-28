"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/app/contexts/ProgressContext";
import { ACHIEVEMENTS } from "@/app/data/achievements";
import { useToast } from "@/app/contexts/ToastContext";

type Lang = "en" | "es";

export function ProgressCard({ lang }: { lang: Lang }) {
  const { state, level } = useProgress();
  const { addToast } = useToast();
  const isEn = lang === "en";
  const cardRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);

  const title = isEn ? level.titleEn : level.titleEs;
  const unlockedCount = state.unlockedAchievements.length;

  const shareText = [
    `🎓 ${title} (Level ${level.level})`,
    `⭐ ${state.xp.toLocaleString()} XP`,
    `🏆 ${unlockedCount}/${ACHIEVEMENTS.length} achievements`,
    `🔥 ${state.studyStreak}-day streak`,
    `📊 ${state.quizCorrectTotal} quiz answers correct`,
    `💯 ${state.perfectQuizzes} perfect scores`,
    "",
    isEn
      ? "Learning to become a tax preparer in Georgia!"
      : "¡Aprendiendo para ser preparador de impuestos en Georgia!",
  ].join("\n");

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: isEn ? "My Tax Prep Progress" : "Mi progreso fiscal",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        addToast(
          isEn ? "Progress copied to clipboard!" : "¡Progreso copiado!",
          "success"
        );
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // User cancelled share dialog
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white transition-colors dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {/* Card visual */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 p-5"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-xl font-black text-white backdrop-blur-sm">
              {level.level}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-[11px] text-white/70">
                {state.xp.toLocaleString()} XP
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/10 px-2.5 py-2 text-center backdrop-blur-sm">
              <p className="text-lg font-black text-white">
                {state.studyStreak}
              </p>
              <p className="text-[9px] text-white/60">
                {isEn ? "Day streak" : "Racha"}
              </p>
            </div>
            <div className="rounded-lg bg-white/10 px-2.5 py-2 text-center backdrop-blur-sm">
              <p className="text-lg font-black text-white">{unlockedCount}</p>
              <p className="text-[9px] text-white/60">
                {isEn ? "Badges" : "Insignias"}
              </p>
            </div>
            <div className="rounded-lg bg-white/10 px-2.5 py-2 text-center backdrop-blur-sm">
              <p className="text-lg font-black text-white">
                {state.quizCorrectTotal}
              </p>
              <p className="text-[9px] text-white/60">
                {isEn ? "Correct" : "Correctas"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share button */}
      <div className="p-4">
        <motion.button
          type="button"
          onClick={handleShare}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-gray-200 dark:bg-white/[0.06] dark:text-neutral-300 dark:hover:bg-white/[0.1]"
        >
          {shared ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
              {isEn ? "Shared!" : "¡Compartido!"}
            </>
          ) : (
            <>
              <ShareIcon className="h-3.5 w-3.5" />
              {isEn ? "Share Progress" : "Compartir progreso"}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
