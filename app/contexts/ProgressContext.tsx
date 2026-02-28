"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ACHIEVEMENTS,
  getLevel,
  getNextLevel,
  getLevelProgress,
  type LevelDef,
} from "@/app/data/achievements";
import { useToast } from "@/app/contexts/ToastContext";

/* ── Types ───────────────────────────────────────────────────────── */
export type ProgressState = {
  xp: number;
  unlockedAchievements: string[];
  dailyChallengesCompleted: number;
  dailyLastDate: string | null;
  pagesVisited: string[];
  quizCorrectTotal: number;
  quizMasteredCount: number;
  notesCreated: number;
  termsBookmarked: number;
  quizBestStreak: number;
  perfectQuizzes: number;
  studyStreak: number;
};

type ProgressContextValue = {
  state: ProgressState;
  addXP: (amount: number) => void;
  recordQuizCorrect: () => void;
  recordQuizStreak: (streak: number) => void;
  recordQuizPerfect: () => void;
  recordQuizMastered: (count: number) => void;
  recordBookmark: (total: number) => void;
  recordNoteCreated: (total: number) => void;
  recordPageVisited: (page: string) => void;
  recordDailyChallenge: () => void;
  recordStudyStreak: (streak: number) => void;
  level: LevelDef;
  nextLevel: LevelDef | null;
  levelProgress: number;
};

/* ── Constants ───────────────────────────────────────────────────── */
const STORAGE_KEY = "tax-guide-progress";

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  unlockedAchievements: [],
  dailyChallengesCompleted: 0,
  dailyLastDate: null,
  pagesVisited: [],
  quizCorrectTotal: 0,
  quizMasteredCount: 0,
  notesCreated: 0,
  termsBookmarked: 0,
  quizBestStreak: 0,
  perfectQuizzes: 0,
  studyStreak: 0,
};

/* ── Helpers ─────────────────────────────────────────────────────── */
function load(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

function save(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function findNewAchievements(s: ProgressState): string[] {
  const has = (id: string) => s.unlockedAchievements.includes(id);
  const newly: string[] = [];
  if (!has("first_answer") && s.quizCorrectTotal >= 1) newly.push("first_answer");
  if (!has("bookworm_10") && s.termsBookmarked >= 10) newly.push("bookworm_10");
  if (!has("scholar_25") && s.quizMasteredCount >= 25) newly.push("scholar_25");
  if (!has("note_taker_5") && s.notesCreated >= 5) newly.push("note_taker_5");
  if (!has("streak_3") && s.studyStreak >= 3) newly.push("streak_3");
  if (!has("streak_7") && s.studyStreak >= 7) newly.push("streak_7");
  if (!has("explorer") && s.pagesVisited.length >= 3) newly.push("explorer");
  if (!has("quiz_ace") && s.quizBestStreak >= 10) newly.push("quiz_ace");
  if (!has("xp_1000") && s.xp >= 1000) newly.push("xp_1000");
  if (!has("daily_5") && s.dailyChallengesCompleted >= 5) newly.push("daily_5");
  if (!has("xp_5000") && s.xp >= 5000) newly.push("xp_5000");
  if (!has("quiz_perfect") && s.perfectQuizzes >= 1) newly.push("quiz_perfect");
  return newly;
}

/* ── Context ─────────────────────────────────────────────────────── */
const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const { addToast } = useToast();
  const stateRef = useRef<ProgressState>(DEFAULT_STATE);
  const mountedRef = useRef(false);

  // Load persisted state
  useEffect(() => {
    const loaded = load();
    stateRef.current = loaded;
    setState(loaded);
    mountedRef.current = true;
  }, []);

  // Commit a state update, check achievements & level-ups, fire toasts
  const commit = useCallback(
    (next: ProgressState) => {
      const prev = stateRef.current;

      // Achievement check
      const newAchs = findNewAchievements(next);
      if (newAchs.length > 0) {
        next = {
          ...next,
          unlockedAchievements: [...next.unlockedAchievements, ...newAchs],
        };
        newAchs.forEach((id) => {
          const a = ACHIEVEMENTS.find((x) => x.id === id);
          if (a) addToast(`${a.icon} ${a.titleEn}`, "success");
        });
      }

      // Level-up check
      const oldLvl = getLevel(prev.xp).level;
      const newLvl = getLevel(next.xp).level;
      if (newLvl > oldLvl) {
        const lvl = getLevel(next.xp);
        addToast(`Level ${lvl.level}: ${lvl.titleEn}!`, "success");
      }

      stateRef.current = next;
      save(next);
      setState(next);
    },
    [addToast],
  );

  /* ── Action methods ──────────────────────────────────────────── */
  const addXP = useCallback(
    (amount: number) => {
      const s = stateRef.current;
      commit({ ...s, xp: s.xp + amount });
    },
    [commit],
  );

  const recordQuizCorrect = useCallback(() => {
    const s = stateRef.current;
    commit({
      ...s,
      quizCorrectTotal: s.quizCorrectTotal + 1,
      xp: s.xp + 10,
    });
  }, [commit]);

  const recordQuizStreak = useCallback(
    (streak: number) => {
      const s = stateRef.current;
      if (streak > s.quizBestStreak) {
        commit({ ...s, quizBestStreak: streak });
      }
    },
    [commit],
  );

  const recordQuizPerfect = useCallback(() => {
    const s = stateRef.current;
    commit({
      ...s,
      perfectQuizzes: s.perfectQuizzes + 1,
      xp: s.xp + 50,
    });
  }, [commit]);

  const recordQuizMastered = useCallback(
    (count: number) => {
      const s = stateRef.current;
      if (count !== s.quizMasteredCount) {
        commit({ ...s, quizMasteredCount: count });
      }
    },
    [commit],
  );

  const recordBookmark = useCallback(
    (total: number) => {
      const s = stateRef.current;
      const gained = total > s.termsBookmarked;
      commit({
        ...s,
        termsBookmarked: total,
        xp: gained ? s.xp + 5 : s.xp,
      });
    },
    [commit],
  );

  const recordNoteCreated = useCallback(
    (total: number) => {
      const s = stateRef.current;
      const gained = total > s.notesCreated;
      commit({
        ...s,
        notesCreated: total,
        xp: gained ? s.xp + 5 : s.xp,
      });
    },
    [commit],
  );

  const recordPageVisited = useCallback(
    (page: string) => {
      const s = stateRef.current;
      if (s.pagesVisited.includes(page)) return;
      commit({
        ...s,
        pagesVisited: [...s.pagesVisited, page],
        xp: s.xp + 15,
      });
    },
    [commit],
  );

  const recordDailyChallenge = useCallback(() => {
    const s = stateRef.current;
    const today = new Date().toISOString().slice(0, 10);
    if (s.dailyLastDate === today) return; // already completed today
    commit({
      ...s,
      dailyChallengesCompleted: s.dailyChallengesCompleted + 1,
      dailyLastDate: today,
      xp: s.xp + 25,
    });
  }, [commit]);

  const recordStudyStreak = useCallback(
    (streak: number) => {
      const s = stateRef.current;
      if (streak !== s.studyStreak) {
        commit({ ...s, studyStreak: streak, xp: streak > s.studyStreak ? s.xp + 10 : s.xp });
      }
    },
    [commit],
  );

  const level = getLevel(state.xp);
  const nextLevel = getNextLevel(state.xp);
  const levelProgress = getLevelProgress(state.xp);

  return (
    <ProgressContext.Provider
      value={{
        state,
        addXP,
        recordQuizCorrect,
        recordQuizStreak,
        recordQuizPerfect,
        recordQuizMastered,
        recordBookmark,
        recordNoteCreated,
        recordPageVisited,
        recordDailyChallenge,
        recordStudyStreak,
        level,
        nextLevel,
        levelProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be inside ProgressProvider");
  return ctx;
}
