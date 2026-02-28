export type LevelDef = {
  level: number;
  titleEn: string;
  titleEs: string;
  minXP: number;
};

export type AchievementDef = {
  id: string;
  icon: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
};

export const LEVELS: LevelDef[] = [
  { level: 1, titleEn: "Tax Rookie", titleEs: "Novato fiscal", minXP: 0 },
  { level: 2, titleEn: "Tax Student", titleEs: "Estudiante fiscal", minXP: 100 },
  { level: 3, titleEn: "Tax Apprentice", titleEs: "Aprendiz fiscal", minXP: 250 },
  { level: 4, titleEn: "Tax Trainee", titleEs: "Practicante fiscal", minXP: 500 },
  { level: 5, titleEn: "Tax Associate", titleEs: "Asociado fiscal", minXP: 1000 },
  { level: 6, titleEn: "Tax Specialist", titleEs: "Especialista fiscal", minXP: 1750 },
  { level: 7, titleEn: "Tax Expert", titleEs: "Experto fiscal", minXP: 2750 },
  { level: 8, titleEn: "Tax Professional", titleEs: "Profesional fiscal", minXP: 4000 },
  { level: 9, titleEn: "Tax Master", titleEs: "Maestro fiscal", minXP: 5500 },
  { level: 10, titleEn: "Tax Authority", titleEs: "Autoridad fiscal", minXP: 7500 },
];

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_answer", icon: "🎯", titleEn: "First Steps", titleEs: "Primeros pasos", descEn: "Answer your first quiz question", descEs: "Responde tu primera pregunta" },
  { id: "bookworm_10", icon: "📚", titleEn: "Bookworm", titleEs: "Ratón de biblioteca", descEn: "Bookmark 10 terms", descEs: "Guarda 10 términos" },
  { id: "scholar_25", icon: "🎓", titleEn: "Scholar", titleEs: "Erudito", descEn: "Master 25 quiz terms", descEs: "Domina 25 términos del quiz" },
  { id: "note_taker_5", icon: "📝", titleEn: "Note Taker", titleEs: "Tomador de notas", descEn: "Create 5 study notes", descEs: "Crea 5 notas de estudio" },
  { id: "streak_3", icon: "🔥", titleEn: "On Fire", titleEs: "En racha", descEn: "3-day study streak", descEs: "Racha de 3 días" },
  { id: "streak_7", icon: "⚡", titleEn: "Unstoppable", titleEs: "Imparable", descEn: "7-day study streak", descEs: "Racha de 7 días" },
  { id: "explorer", icon: "🗺️", titleEn: "Explorer", titleEs: "Explorador", descEn: "Visit all 3 AI analyses", descEs: "Visita los 3 análisis de IA" },
  { id: "quiz_ace", icon: "🏆", titleEn: "Quiz Ace", titleEs: "As del quiz", descEn: "10 correct answers in a row", descEs: "10 respuestas correctas seguidas" },
  { id: "xp_1000", icon: "💎", titleEn: "Dedicated", titleEs: "Dedicado", descEn: "Earn 1,000 XP", descEs: "Gana 1,000 XP" },
  { id: "daily_5", icon: "📅", titleEn: "Daily Warrior", titleEs: "Guerrero diario", descEn: "Complete 5 daily challenges", descEs: "Completa 5 retos diarios" },
  { id: "xp_5000", icon: "👑", titleEn: "Legendary", titleEs: "Legendario", descEn: "Earn 5,000 XP", descEs: "Gana 5,000 XP" },
  { id: "quiz_perfect", icon: "💯", titleEn: "Perfect Score", titleEs: "Puntaje perfecto", descEn: "100% on an analysis quiz", descEs: "100% en un quiz de análisis" },
  { id: "speed_demon", icon: "⏱️", titleEn: "Speed Demon", titleEs: "Demonio veloz", descEn: "Score 15+ in a speed round", descEs: "Obtén 15+ en ronda rápida" },
  { id: "pathfinder", icon: "🧭", titleEn: "Pathfinder", titleEs: "Pionero", descEn: "Complete the learning path", descEs: "Completa la ruta de aprendizaje" },
  { id: "exam_pass", icon: "📜", titleEn: "Certified", titleEs: "Certificado", descEn: "Pass a mock exam", descEs: "Aprueba un examen simulado" },
  { id: "reviewer", icon: "🔄", titleEn: "Retention Pro", titleEs: "Experto en retención", descEn: "Complete 20 review sessions", descEs: "Completa 20 sesiones de repaso" },
  { id: "game_explorer", icon: "🎮", titleEn: "Game Explorer", titleEs: "Explorador de juegos", descEn: "Play 5 different games", descEs: "Juega 5 juegos diferentes" },
  { id: "climber_summit", icon: "🏔️", titleEn: "Summit Conqueror", titleEs: "Conquistador de cimas", descEn: "Reach the summit in Tax Climber", descEs: "Llega a la cima en Escalador fiscal" },
  { id: "matcher_perfect", icon: "🃏", titleEn: "Memory Master", titleEs: "Maestro de memoria", descEn: "Complete Term Matcher in under 60s", descEs: "Completa Emparejar en menos de 60s" },
  { id: "combo_master", icon: "💥", titleEn: "Combo Master", titleEs: "Maestro del combo", descEn: "Reach a 10x combo in any game", descEs: "Logra un combo x10 en cualquier juego" },
  { id: "bingo_winner", icon: "🎱", titleEn: "Bingo!", titleEs: "¡Bingo!", descEn: "Get a BINGO in Tax Bingo", descEs: "Haz un BINGO en Bingo fiscal" },
  { id: "dash_20", icon: "🏃", titleEn: "Speed Runner", titleEs: "Corredor veloz", descEn: "Score 20+ in Definition Dash", descEs: "Obtén 20+ en Carrera de definiciones" },
];

export function getLevel(xp: number): LevelDef {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): LevelDef | null {
  const current = getLevel(xp);
  const idx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  return idx < LEVELS.length ? LEVELS[idx] : null;
}

export function getLevelProgress(xp: number): number {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  return Math.min(100, Math.round((progress / range) * 100));
}
