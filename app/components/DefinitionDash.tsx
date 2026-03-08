"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { PhaserGame, GAME_COLORS, hexColor } from "./PhaserGame";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const MAX_WRONG = 3;
const BASE_XP = 4;
const SPEED_BONUS_THRESHOLD = 3;

type Round = { term: (typeof TERMS)[0]; options: string[]; correctIdx: number };

function getComboMultiplier(combo: number): number {
  if (combo >= 10) return 4;
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

function createDashScene(Phaser: typeof import("phaser")) {
  return class DashScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private rounds: Round[] = [];
    private currentIdx = 0;
    private correct = 0;
    private wrong = 0;
    private combo = 0;
    private bestCombo = 0;
    private totalXP = 0;
    private speedAnswers = 0;
    private highScore = 0;
    private questionStart = 0;

    constructor() { super({ key: "DashScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      try {
        const raw = localStorage.getItem("tax-guide-defdash-best");
        if (raw) this.highScore = Number(raw);
      } catch {}
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

    private createBtn(x: number, y: number, label: string, color: number, onClick: () => void, w?: number) {
      const bw = w ?? this.W - 48; const h = 44;
      const bg = this.add.graphics(); bg.fillStyle(color, 1); bg.fillRoundedRect(-bw / 2, -h / 2, bw, h, 12);
      const txt = this.add.text(0, 0, label, { fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: "#ffffff" }).setOrigin(0.5);
      const c = this.add.container(x, y, [bg, txt]); c.setSize(bw, h); c.setInteractive({ useHandCursor: true });
      c.on("pointerdown", onClick);
      c.on("pointerover", () => this.tweens.add({ targets: c, scaleX: 1.02, scaleY: 1.02, duration: 100 }));
      c.on("pointerout", () => this.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 100 }));
      return c;
    }

    private generateRounds(): Round[] {
      const shuffled = shuffle(TERMS);
      return shuffled.map(term => {
        const correctLabel = this.isEn ? term.labelEn : term.labelEs;
        const wrongTerms = shuffle(TERMS.filter(t => t.id !== term.id)).slice(0, 3);
        const allOptions = shuffle([correctLabel, ...wrongTerms.map(t => this.isEn ? t.labelEn : t.labelEs)]);
        const correctIdx = allOptions.indexOf(correctLabel);
        return { term, options: allOptions, correctIdx };
      });
    }

    private showIdle() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(cx, 35, "\u{1F3C3}", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "Definition Dash" : "Carrera de definiciones", {
        fontSize: "16px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.rose),
      }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Survival" : "Supervivencia", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn
        ? `Pick the correct term! ${MAX_WRONG} strikes\nand you're out. Answer fast for speed bonuses!`
        : `\u00A1Elige el t\u00E9rmino correcto! ${MAX_WRONG} errores\ny terminas. \u00A1Responde r\u00E1pido para bonos!`, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
        align: "center", wordWrap: { width: this.W - 50 },
      }).setOrigin(0.5);
      if (this.highScore > 0) {
        this.add.text(cx, 158, `\u{1F3C6} ${this.highScore}`, {
          fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.rose),
        }).setOrigin(0.5);
      }
      this.createBtn(cx, 210, this.isEn ? "Start Dash" : "Comenzar carrera", GAME_COLORS.rose, () => this.startGame());
    }

    private startGame() {
      this.rounds = this.generateRounds();
      this.currentIdx = 0; this.correct = 0; this.wrong = 0;
      this.combo = 0; this.bestCombo = 0; this.totalXP = 0; this.speedAnswers = 0;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll();
      const cx = this.W / 2;
      const round = this.rounds[this.currentIdx];
      if (!round) { this.rounds = [...this.rounds, ...this.generateRounds()]; }
      const r = this.rounds[this.currentIdx];
      if (!r) return;
      this.questionStart = Date.now();
      const mult = getComboMultiplier(this.combo);

      // Header
      this.add.text(12, 8, "\u{1F3C3}", { fontSize: "16px" });
      this.add.text(32, 10, `#${this.currentIdx + 1}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });
      if (this.combo >= 3) {
        this.add.text(this.W - 90, 10, `x${mult}`, {
          fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        });
      }
      this.add.text(this.W - 55, 10, `${this.correct}\u2713`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
      });
      this.add.text(this.W - 12, 10, Array.from({ length: MAX_WRONG }, (_, i) => i < MAX_WRONG - this.wrong ? "\u2764\uFE0F" : "\u{1F5A4}").join(""), {
        fontSize: "11px",
      }).setOrigin(1, 0);

      // Score bar
      this.add.text(12, 30, `Combo: ${this.combo}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });
      this.add.text(this.W - 12, 30, `+${this.totalXP} XP`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet),
      }).setOrigin(1, 0);

      // Definition card
      const defBg = this.add.graphics(); defBg.lineStyle(2, GAME_COLORS.slate200); defBg.fillStyle(0xf8fafc, 1);
      defBg.fillRoundedRect(12, 48, this.W - 24, 70, 12); defBg.strokeRoundedRect(12, 48, this.W - 24, 70, 12);
      this.add.text(cx, 55, this.isEn ? "Which term matches?" : "\u00BFQu\u00E9 t\u00E9rmino corresponde?", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.rose),
      }).setOrigin(0.5);
      this.add.text(cx, 83, this.isEn ? r.term.shortEn : r.term.shortEs, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(GAME_COLORS.slate700), wordWrap: { width: this.W - 50 }, align: "center",
      }).setOrigin(0.5);

      // 2x2 grid of options
      let answered = false;
      const gridW = (this.W - 36) / 2;
      const gridH = 38;
      r.options.forEach((opt, i) => {
        const col = i % 2; const row = Math.floor(i / 2);
        const x = 16 + gridW / 2 + col * (gridW + 4);
        const y = 138 + row * (gridH + 4) + gridH / 2;

        const bg = this.add.graphics(); bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xffffff, 0.6);
        bg.fillRoundedRect(-gridW / 2, -gridH / 2, gridW, gridH, 8); bg.strokeRoundedRect(-gridW / 2, -gridH / 2, gridW, gridH, 8);
        const txt = this.add.text(0, 0, opt, {
          fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
          color: hexColor(GAME_COLORS.slate700), wordWrap: { width: gridW - 12 }, align: "center",
        }).setOrigin(0.5);
        const c = this.add.container(x, y, [bg, txt]); c.setSize(gridW, gridH); c.setInteractive({ useHandCursor: true });

        c.on("pointerdown", () => {
          if (answered) return; answered = true;
          const isCorrect = i === r.correctIdx;
          const responseTime = (Date.now() - this.questionStart) / 1000;
          const isFast = responseTime <= SPEED_BONUS_THRESHOLD;

          bg.clear();
          if (isCorrect) {
            bg.fillStyle(GAME_COLORS.emerald, 0.15); bg.lineStyle(1.5, GAME_COLORS.emerald, 0.6);
            const newCombo = this.combo + 1;
            const mult2 = getComboMultiplier(newCombo);
            const speedBonus = isFast ? 3 : 0;
            const earned = (BASE_XP + speedBonus) * mult2;
            this.correct++; this.combo = newCombo; this.totalXP += earned;
            if (newCombo > this.bestCombo) this.bestCombo = newCombo;
            if (isFast) this.speedAnswers++;
            this.emitParticles(x, y, GAME_COLORS.emerald);
          } else {
            bg.fillStyle(GAME_COLORS.red, 0.15); bg.lineStyle(1.5, GAME_COLORS.red, 0.6);
            this.combo = 0; this.wrong++;
            this.cameras.main.shake(150, 0.003);
            if (this.wrong >= MAX_WRONG) {
              bg.fillRoundedRect(-gridW / 2, -gridH / 2, gridW, gridH, 8);
              bg.strokeRoundedRect(-gridW / 2, -gridH / 2, gridW, gridH, 8);
              this.time.delayedCall(800, () => this.showResults());
              return;
            }
          }
          bg.fillRoundedRect(-gridW / 2, -gridH / 2, gridW, gridH, 8);
          bg.strokeRoundedRect(-gridW / 2, -gridH / 2, gridW, gridH, 8);

          this.time.delayedCall(600, () => {
            if (this.currentIdx + 1 >= this.rounds.length) {
              this.rounds = [...this.rounds, ...this.generateRounds()];
            }
            this.currentIdx++;
            this.showPlaying();
          });
        });
      });
    }

    private showResults() {
      this.clearAll();
      const cx = this.W / 2;
      if (this.totalXP > 0) this.callbacks.onXP(this.totalXP);
      this.callbacks.onGamePlayed();
      this.callbacks.onDashScore(this.correct);
      if (this.bestCombo >= 3) this.callbacks.onCombo(this.bestCombo);
      if (this.correct > this.highScore) {
        this.highScore = this.correct;
        try { localStorage.setItem("tax-guide-defdash-best", String(this.correct)); } catch {}
      }

      const emoji = this.correct >= 20 ? "\u{1F525}" : this.correct >= 10 ? "\u{1F3C3}" : "\u{1F4AA}";
      const icon = this.add.text(cx, 35, emoji, { fontSize: "40px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 400, ease: "Back.easeOut" });
      if (this.correct >= 10) this.emitParticles(cx, 50, GAME_COLORS.rose);

      this.add.text(cx, 80, `${this.correct}`, {
        fontSize: "30px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.rose),
      }).setOrigin(0.5);
      this.add.text(cx, 103, this.isEn ? "definitions matched" : "definiciones emparejadas", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      }).setOrigin(0.5);

      // Stats row
      const statsY = 130;
      this.add.text(cx - 55, statsY, `${this.bestCombo}x`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber) }).setOrigin(0.5);
      this.add.text(cx - 55, statsY + 14, this.isEn ? "combo" : "combo", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx, statsY, `${this.speedAnswers}`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.cyan) }).setOrigin(0.5);
      this.add.text(cx, statsY + 14, this.isEn ? "speed" : "r\u00E1pidas", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx + 55, statsY, `+${this.totalXP}`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5);
      this.add.text(cx + 55, statsY + 14, "XP", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);

      this.createBtn(cx, 210, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.rose, () => this.startGame());
    }
  };
}

export const DefinitionDash = memo(function DefinitionDash({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed, recordCombo, recordDashScore } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed, recordCombo, recordDashScore });
  refs.current = { addXP, recordGamePlayed, recordCombo, recordDashScore };

  const factory = useCallback((Phaser: typeof import("phaser")) => createDashScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (n: number) => refs.current.addXP(n),
      onGamePlayed: () => refs.current.recordGamePlayed("definition_dash"),
      onCombo: (n: number) => refs.current.recordCombo(n),
      onDashScore: (n: number) => refs.current.recordDashScore(n),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 260 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={260} className="w-full" />
    </div>
  );
});
