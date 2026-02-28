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
  dailyXPLog: Record<string, number>;
  speedRoundBest: number;
  speedRoundsPlayed: number;
  learningPathComplete: string[];
  examsPassed: number;
  examsTaken: number;
  examBestScore: number;
  reviewsDone: number;
  gamesPlayed: string[];
  climberSummits: number;
  matcherBestTime: number;
  bestCombo: number;
  bingoWins: number;
  dashBest: number;
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
  recordSpeedRound: (score: number) => void;
  completeLearningTask: (taskId: string) => void;
  recordExam: (score: number, total: number) => void;
  recordReview: () => void;
  recordGamePlayed: (gameId: string) => void;
  recordClimberSummit: () => void;
  recordMatcherTime: (seconds: number) => void;
  recordCombo: (combo: number) => void;
  recordBingoWin: () => void;
  recordDashScore: (score: number) => void;
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
  dailyXPLog: {},
  speedRoundBest: 0,
  speedRoundsPlayed: 0,
  learningPathComplete: [],
  examsPassed: 0,
  examsTaken: 0,
  examBestScore: 0,
  reviewsDone: 0,
  gamesPlayed: [],
  climberSummits: 0,
  matcherBestTime: 0,
  bestCombo: 0,
  bingoWins: 0,
  dashBest: 0,
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
  if (!has("speed_demon") && s.speedRoundBest >= 15) newly.push("speed_demon");
  if (!has("pathfinder") && s.learningPathComplete.length >= 6) newly.push("pathfinder");
  if (!has("exam_pass") && s.examsPassed >= 1) newly.push("exam_pass");
  if (!has("reviewer") && s.reviewsDone >= 20) newly.push("reviewer");
  if (!has("game_explorer") && s.gamesPlayed.length >= 5) newly.push("game_explorer");
  if (!has("climber_summit") && s.climberSummits >= 1) newly.push("climber_summit");
  if (!has("matcher_perfect") && s.matcherBestTime > 0 && s.matcherBestTime <= 60) newly.push("matcher_perfect");
  if (!has("combo_master") && s.bestCombo >= 10) newly.push("combo_master");
  if (!has("bingo_winner") && s.bingoWins >= 1) newly.push("bingo_winner");
  if (!has("dash_20") && s.dashBest >= 20) newly.push("dash_20");
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

      // Track daily XP
      const xpGained = next.xp - prev.xp;
      if (xpGained > 0) {
        const today = new Date().toISOString().slice(0, 10);
        next = {
          ...next,
          dailyXPLog: { ...next.dailyXPLog, [today]: (next.dailyXPLog[today] || 0) + xpGained },
        };
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

  const recordSpeedRound = useCallback(
    (score: number) => {
      const s = stateRef.current;
      const isBest = score > s.speedRoundBest;
      commit({
        ...s,
        speedRoundsPlayed: s.speedRoundsPlayed + 1,
        speedRoundBest: isBest ? score : s.speedRoundBest,
        xp: s.xp + Math.max(score * 2, 5),
      });
    },
    [commit],
  );

  const completeLearningTask = useCallback(
    (taskId: string) => {
      const s = stateRef.current;
      if (s.learningPathComplete.includes(taskId)) return;
      commit({
        ...s,
        learningPathComplete: [...s.learningPathComplete, taskId],
        xp: s.xp + 20,
      });
    },
    [commit],
  );

  const recordExam = useCallback(
    (score: number, total: number) => {
      const s = stateRef.current;
      const pct = Math.round((score / total) * 100);
      const passed = pct >= 70;
      commit({
        ...s,
        examsTaken: s.examsTaken + 1,
        examsPassed: passed ? s.examsPassed + 1 : s.examsPassed,
        examBestScore: pct > s.examBestScore ? pct : s.examBestScore,
        xp: s.xp + (passed ? 100 : 30),
      });
    },
    [commit],
  );

  const recordReview = useCallback(() => {
    const s = stateRef.current;
    commit({
      ...s,
      reviewsDone: s.reviewsDone + 1,
      xp: s.xp + 8,
    });
  }, [commit]);

  const recordGamePlayed = useCallback(
    (gameId: string) => {
      const s = stateRef.current;
      if (s.gamesPlayed.includes(gameId)) return;
      commit({
        ...s,
        gamesPlayed: [...s.gamesPlayed, gameId],
      });
    },
    [commit],
  );

  const recordClimberSummit = useCallback(() => {
    const s = stateRef.current;
    commit({
      ...s,
      climberSummits: s.climberSummits + 1,
    });
  }, [commit]);

  const recordMatcherTime = useCallback(
    (seconds: number) => {
      const s = stateRef.current;
      if (s.matcherBestTime === 0 || seconds < s.matcherBestTime) {
        commit({ ...s, matcherBestTime: seconds });
      }
    },
    [commit],
  );

  const recordCombo = useCallback(
    (combo: number) => {
      const s = stateRef.current;
      if (combo > s.bestCombo) {
        commit({ ...s, bestCombo: combo });
      }
    },
    [commit],
  );

  const recordBingoWin = useCallback(() => {
    const s = stateRef.current;
    commit({ ...s, bingoWins: s.bingoWins + 1 });
  }, [commit]);

  const recordDashScore = useCallback(
    (score: number) => {
      const s = stateRef.current;
      if (score > s.dashBest) {
        commit({ ...s, dashBest: score });
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
        recordSpeedRound,
        completeLearningTask,
        recordExam,
        recordReview,
        recordGamePlayed,
        recordClimberSummit,
        recordMatcherTime,
        recordCombo,
        recordBingoWin,
        recordDashScore,
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
