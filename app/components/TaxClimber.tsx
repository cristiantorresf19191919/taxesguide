"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { PhaserGame, GAME_COLORS, hexColor } from "./PhaserGame";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";
import { claudeQuestions } from "@/app/data/quiz-claude";
import { chatgptQuestions } from "@/app/data/quiz-chatgpt";
import { geminiQuestions } from "@/app/data/quiz-gemini";
import type { QuizQuestion } from "@/app/components/AnalysisQuiz";

type Lang = "en" | "es";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const LEVELS = 10;
const XP_PER_LEVEL = 8;
const SUMMIT_BONUS = 40;
const LEVEL_EMOJIS = ["🏕️", "🌲", "🌿", "⛰️", "🪨", "🏔️", "☁️", "✨", "🌟", "🏆"];

function generateQuestions(): QuizQuestion[] {
  const fromAnalyses = [...claudeQuestions, ...chatgptQuestions, ...geminiQuestions];
  const fromTerms: QuizQuestion[] = TERMS.slice(0, 20).map((term) => {
    const wrong = shuffle(TERMS.filter((t) => t.id !== term.id)).slice(0, 3);
    const options = shuffle([term, ...wrong]);
    const correctIdx = options.findIndex((o) => o.id === term.id);
    return {
      en: { question: `What is "${term.labelEn}"?`, options: options.map((o) => o.shortEn), correct: correctIdx, explanation: term.shortEn },
      es: { question: `¿Qué es "${term.labelEs}"?`, options: options.map((o) => o.shortEs), correct: correctIdx, explanation: term.shortEs },
    };
  });
  return shuffle([...fromAnalyses, ...fromTerms]);
}

function createClimberScene(Phaser: typeof import("phaser")) {
  return class ClimberScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private questions: QuizQuestion[] = [];
    private qIdx = 0;
    private level = 0;
    private lives = 3;
    private selected: number | null = null;
    private optionButtons: any[] = [];
    private questionText: any;
    private levelText: any;

    constructor() { super({ key: "ClimberScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      this.showIdle();
    }

    private get isEn() { return this.lang === "en"; }
    private get W() { return Number(this.scale.width); }
    private clearAll() { this.children.removeAll(true); }

    private emitParticles(x: number, y: number, color: number) {
      const key = `p_${color}`;
      if (!this.textures.exists(key)) {
        const g = (this.make as any).graphics({ add: false });
        g.fillStyle(color); g.fillCircle(4, 4, 4);
        g.generateTexture(key, 8, 8); g.destroy();
      }
      const e = this.add.particles(x, y, key, {
        speed: { min: 80, max: 200 }, angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 },
        lifespan: 600, quantity: 12, emitting: false,
      });
      e.explode();
      this.time.delayedCall(1000, () => e.destroy());
    }

    private createBtn(x: number, y: number, label: string, color: number, onClick: () => void) {
      const w = this.W - 48; const h = 44;
      const bg = this.add.graphics(); bg.fillStyle(color); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
      const txt = this.add.text(0, 0, label, { fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: "#fff" }).setOrigin(0.5);
      const c = this.add.container(x, y, [bg, txt]); c.setSize(w, h); c.setInteractive({ useHandCursor: true });
      c.on("pointerdown", onClick);
      c.on("pointerover", () => this.tweens.add({ targets: c, scaleX: 1.02, scaleY: 1.02, duration: 100 }));
      c.on("pointerout", () => this.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 100 }));
    }

    private showIdle() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(cx, 40, "🧗", { fontSize: "32px" }).setOrigin(0.5);
      this.add.text(cx, 80, this.isEn ? "Tax Climber" : "Escalador fiscal", {
        fontSize: "18px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
      }).setOrigin(0.5);
      this.add.text(cx, 100, this.isEn ? "Adventure" : "Aventura", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 130, this.isEn
        ? `Climb ${LEVELS} levels! 3 lives.\nReach the summit for bonus XP.`
        : `¡Escala ${LEVELS} niveles! 3 vidas.\nLlega a la cima para XP extra.`, {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500), align: "center", wordWrap: { width: this.W - 60 },
      }).setOrigin(0.5);
      const startX = cx - (LEVEL_EMOJIS.length * 20) / 2;
      LEVEL_EMOJIS.forEach((e, i) => this.add.text(startX + i * 20, 170, e, { fontSize: "14px" }).setOrigin(0.5).setAlpha(0.4));
      this.createBtn(cx, 220, this.isEn ? "Start Climbing" : "Comenzar a escalar", GAME_COLORS.emerald, () => this.startGame());
    }

    private startGame() {
      this.questions = generateQuestions().slice(0, 30);
      this.qIdx = 0; this.level = 0; this.lives = 3; this.selected = null;
      this.showClimbing();
    }

    private showClimbing() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(12, 12, "🧗", { fontSize: "18px" });
      this.add.text(34, 14, this.isEn ? "Tax Climber" : "Escalador fiscal", {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700),
      });
      this.add.text(this.W - 16, 14, Array.from({ length: 3 }, (_, i) => i < this.lives ? "❤️" : "🖤").join(""), { fontSize: "12px" }).setOrigin(1, 0);

      const startX = cx - (LEVEL_EMOJIS.length * 22) / 2;
      LEVEL_EMOJIS.forEach((e, i) => {
        const t = this.add.text(startX + i * 22, 48, e, { fontSize: "13px" }).setOrigin(0.5).setAlpha(i <= this.level ? 1 : 0.3);
        if (i === this.level) this.tweens.add({ targets: t, scaleX: 1.3, scaleY: 1.3, yoyo: true, repeat: -1, duration: 600 });
      });
      this.add.circle(startX + this.level * 22, 60, 3, GAME_COLORS.emerald);
      this.showQuestion();
    }

    private showQuestion() {
      const q = this.questions[this.qIdx]?.[this.lang]; if (!q) return;
      const cx = this.W / 2; this.selected = null;
      this.add.text(cx, 76, `Level ${this.level + 1}/${LEVELS}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.emerald),
      }).setOrigin(0.5);
      const qText = this.add.text(cx, 100, q.question, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700),
        wordWrap: { width: this.W - 40 }, align: "center",
      }).setOrigin(0.5, 0);
      const optStartY = qText.y + qText.height + 12;
      this.optionButtons = [];
      q.options.forEach((opt, i) => {
        const y = optStartY + i * 42;
        const w = this.W - 40; const h = 36;
        const bg = this.add.graphics();
        bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xffffff, 0.6);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        const letters = ["A", "B", "C", "D"];
        const ltr = this.add.text(-w / 2 + 12, 0, letters[i], { fontSize: "9px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0, 0.5);
        const txt = this.add.text(-w / 2 + 28, 0, opt, { fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate700), wordWrap: { width: w - 40 } }).setOrigin(0, 0.5);
        const c = this.add.container(cx, y, [bg, ltr, txt]); c.setSize(w, h); c.setInteractive({ useHandCursor: true });
        c.on("pointerdown", () => {
          if (this.selected !== null) return; this.selected = i;
          this.optionButtons.forEach((btn, j) => {
            const b = btn.first as any; b.clear();
            if (j === q.correct) { b.fillStyle(GAME_COLORS.emerald, 0.15); b.lineStyle(1.5, GAME_COLORS.emerald, 0.6); }
            else if (j === i) { b.fillStyle(GAME_COLORS.red, 0.15); b.lineStyle(1.5, GAME_COLORS.red, 0.6); }
            else { b.fillStyle(0xffffff, 0.3); b.lineStyle(1, GAME_COLORS.slate200, 0.4); }
            b.fillRoundedRect(-w / 2, -h / 2, w, h, 8); b.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
            btn.disableInteractive();
          });
          const isCorrect = i === q.correct;
          if (isCorrect) this.emitParticles(cx, y, GAME_COLORS.emerald);
          else this.cameras.main.shake(200, 0.005);
          this.time.delayedCall(1000, () => {
            if (isCorrect) { this.level++; if (this.level >= LEVELS) { this.callbacks.onXP(LEVELS * XP_PER_LEVEL + SUMMIT_BONUS); this.callbacks.onGamePlayed(); this.callbacks.onSummit(); this.showSummit(); return; } }
            else { this.lives--; if (this.lives <= 0) { this.callbacks.onXP(this.level * XP_PER_LEVEL); this.callbacks.onGamePlayed(); this.showFallen(); return; } }
            this.qIdx++; this.showClimbing();
          });
        });
        this.optionButtons.push(c);
      });
    }

    private showSummit() {
      this.clearAll(); const cx = this.W / 2; const totalXP = LEVELS * XP_PER_LEVEL + SUMMIT_BONUS;
      const t = this.add.text(cx, 50, "🏆", { fontSize: "48px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: t, scaleX: 1, scaleY: 1, duration: 500, ease: "Back.easeOut" });
      this.emitParticles(cx - 40, 80, GAME_COLORS.emerald); this.emitParticles(cx + 40, 80, GAME_COLORS.amber);
      this.add.text(cx, 110, this.isEn ? "Summit Reached!" : "¡Llegaste a la cima!", { fontSize: "18px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald) }).setOrigin(0.5);
      this.add.text(cx, 135, this.isEn ? `All ${LEVELS} levels conquered` : `Los ${LEVELS} niveles conquistados`, { fontSize: "12px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500) }).setOrigin(0.5);
      this.add.text(cx, 165, `+${totalXP} XP`, { fontSize: "22px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5);
      this.createBtn(cx, 220, this.isEn ? "Climb Again" : "Escalar de nuevo", GAME_COLORS.emerald, () => this.startGame());
    }

    private showFallen() {
      this.clearAll(); const cx = this.W / 2; const totalXP = this.level * XP_PER_LEVEL;
      this.add.text(cx, 50, "😤", { fontSize: "40px" }).setOrigin(0.5);
      this.add.text(cx, 100, this.isEn ? "Keep Practicing!" : "¡Sigue practicando!", { fontSize: "18px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber) }).setOrigin(0.5);
      this.add.text(cx, 125, this.isEn ? `Reached level ${this.level}/${LEVELS}` : `Llegaste al nivel ${this.level}/${LEVELS}`, { fontSize: "12px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500) }).setOrigin(0.5);
      if (totalXP > 0) this.add.text(cx, 155, `+${totalXP} XP`, { fontSize: "16px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5);
      this.createBtn(cx, 220, this.isEn ? "Try Again" : "Intentar de nuevo", GAME_COLORS.emerald, () => this.startGame());
    }
  };
}

export const TaxClimber = memo(function TaxClimber({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed, recordClimberSummit } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed, recordClimberSummit });
  refs.current = { addXP, recordGamePlayed, recordClimberSummit };

  const factory = useCallback((Phaser: typeof import("phaser")) => createClimberScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (xp: number) => refs.current.addXP(xp),
      onGamePlayed: () => refs.current.recordGamePlayed("tax_climber"),
      onSummit: () => refs.current.recordClimberSummit(),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 280 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={280} className="w-full" />
    </div>
  );
});
