"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { PhaserGame, GAME_COLORS, hexColor } from "./PhaserGame";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type Statement = { text: string; isTrue: boolean; termLabel: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const MAX_LIVES = 3;
const BASE_XP = 3;

function getComboMultiplier(combo: number): number {
  if (combo >= 10) return 4; if (combo >= 6) return 3; if (combo >= 3) return 2; return 1;
}

function generateStatements(lang: "en" | "es"): Statement[] {
  const isEn = lang === "en";
  const shuffled = shuffle(TERMS);
  const statements: Statement[] = [];
  shuffled.forEach((term, idx) => {
    const label = isEn ? term.labelEn : term.labelEs;
    const correctDef = isEn ? term.shortEn : term.shortEs;
    if (idx % 2 === 0) {
      statements.push({ text: isEn ? `"${label}" means: ${correctDef}` : `"${label}" significa: ${correctDef}`, isTrue: true, termLabel: label });
    } else {
      const otherPool = shuffled.filter((_, i) => i !== idx);
      const other = otherPool[Math.floor(Math.random() * otherPool.length)];
      const wrongDef = isEn ? other.shortEn : other.shortEs;
      statements.push({ text: isEn ? `"${label}" means: ${wrongDef}` : `"${label}" significa: ${wrongDef}`, isTrue: false, termLabel: label });
    }
  });
  return shuffle(statements);
}

function createBlitzScene(Phaser: typeof import("phaser")) {
  return class BlitzScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private statements: Statement[] = [];
    private currentIdx = 0;
    private correct = 0;
    private lives = MAX_LIVES;
    private combo = 0;
    private bestCombo = 0;
    private totalXP = 0;
    private highScore = 0;

    constructor() { super({ key: "BlitzScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      try { const raw = localStorage.getItem("tax-guide-tfblitz-best"); if (raw) this.highScore = Number(raw); } catch {}
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
      const bg = this.add.graphics(); bg.fillStyle(color); bg.fillRoundedRect(-bw / 2, -h / 2, bw, h, 12);
      const txt = this.add.text(0, 0, label, { fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: "#fff" }).setOrigin(0.5);
      const c = this.add.container(x, y, [bg, txt]); c.setSize(bw, h); c.setInteractive({ useHandCursor: true });
      c.on("pointerdown", onClick);
      c.on("pointerover", () => this.tweens.add({ targets: c, scaleX: 1.03, scaleY: 1.03, duration: 80 }));
      c.on("pointerout", () => this.tweens.add({ targets: c, scaleX: 1, scaleY: 1, duration: 80 }));
      return c;
    }

    private showIdle() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(cx, 35, "\u2696\uFE0F", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "True or False Blitz" : "Verdadero o Falso", {
        fontSize: "16px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.indigo),
      }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Quick Judgment" : "Juicio r\u00e1pido", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn
        ? `Read each statement \u2014 True or False?\n${MAX_LIVES} lives, combos for x2\u2013x4 XP!`
        : `Lee cada afirmaci\u00f3n \u2014 \u00bfVerdadero o Falso?\n${MAX_LIVES} vidas, combos x2\u2013x4 XP!`, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
        align: "center", wordWrap: { width: this.W - 50 },
      }).setOrigin(0.5);
      if (this.highScore > 0) {
        this.add.text(cx, 158, `\uD83C\uDFC6 ${this.highScore}`, {
          fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.indigo),
        }).setOrigin(0.5);
      }
      this.createBtn(cx, 210, this.isEn ? "Start Blitz" : "Comenzar Blitz", GAME_COLORS.indigo, () => this.startGame());
    }

    private startGame() {
      this.statements = generateStatements(this.lang);
      this.currentIdx = 0; this.correct = 0; this.lives = MAX_LIVES;
      this.combo = 0; this.bestCombo = 0; this.totalXP = 0;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll();
      const cx = this.W / 2;
      const stmt = this.statements[this.currentIdx];
      if (!stmt) { this.showResults(); return; }
      const mult = getComboMultiplier(this.combo);

      // Header
      this.add.text(12, 8, "\u2696\uFE0F", { fontSize: "16px" });
      this.add.text(32, 10, `#${this.currentIdx + 1}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });
      if (this.combo >= 3) {
        this.add.text(this.W - 80, 10, `x${mult}`, {
          fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        });
      }
      // Lives
      this.add.text(this.W - 12, 10, Array.from({ length: MAX_LIVES }, (_, i) => i < this.lives ? "\u2764\uFE0F" : "\uD83D\uDDA4").join(""), {
        fontSize: "12px",
      }).setOrigin(1, 0);

      // Score bar
      this.add.text(12, 32, `${this.correct}\u2713`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
      });
      this.add.text(55, 32, `Combo: ${this.combo}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });
      this.add.text(this.W - 12, 32, `+${this.totalXP} XP`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet),
      }).setOrigin(1, 0);

      // Statement card
      const cardY = 55; const cardH = 100; const cardW = this.W - 24;
      const cardBg = this.add.graphics();
      cardBg.lineStyle(2, GAME_COLORS.slate200); cardBg.fillStyle(0xf8fafc, 1);
      cardBg.fillRoundedRect(12, cardY, cardW, cardH, 12); cardBg.strokeRoundedRect(12, cardY, cardW, cardH, 12);

      this.add.text(cx, cardY + cardH / 2, stmt.text, {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(GAME_COLORS.slate700), wordWrap: { width: cardW - 24 }, align: "center",
      }).setOrigin(0.5);

      // True/False buttons
      let answered = false;
      const btnW = (this.W - 36) / 2;
      this.createBtn(12 + btnW / 2, 185, this.isEn ? "TRUE" : "VERDADERO", GAME_COLORS.emerald, () => {
        if (answered) return; answered = true; this.handleAnswer(true, stmt);
      }, btnW);
      this.createBtn(this.W - 12 - btnW / 2, 185, this.isEn ? "FALSE" : "FALSO", GAME_COLORS.red, () => {
        if (answered) return; answered = true; this.handleAnswer(false, stmt);
      }, btnW);
    }

    private handleAnswer(answeredTrue: boolean, stmt: Statement) {
      const isCorrect = answeredTrue === stmt.isTrue;
      const cx = this.W / 2;

      if (isCorrect) {
        const newCombo = this.combo + 1;
        const mult = getComboMultiplier(newCombo);
        const earned = BASE_XP * mult;
        this.correct++; this.combo = newCombo; this.totalXP += earned;
        if (newCombo > this.bestCombo) this.bestCombo = newCombo;
        this.emitParticles(cx, 185, GAME_COLORS.emerald);

        // Feedback text
        this.add.text(cx, 225, `${this.isEn ? "Correct!" : "\u00a1Correcto!"} +${earned} XP`, {
          fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
        }).setOrigin(0.5);
      } else {
        this.combo = 0;
        this.lives--;
        this.cameras.main.shake(200, 0.005);
        const ans = stmt.isTrue ? (this.isEn ? "TRUE" : "VERDADERO") : (this.isEn ? "FALSE" : "FALSO");
        this.add.text(cx, 225, `${this.isEn ? "Wrong!" : "\u00a1Incorrecto!"} \u2192 ${ans}`, {
          fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.red),
        }).setOrigin(0.5);

        if (this.lives <= 0) {
          this.time.delayedCall(800, () => this.showResults());
          return;
        }
      }

      this.time.delayedCall(800, () => {
        this.currentIdx++;
        if (this.currentIdx >= this.statements.length) this.showResults();
        else this.showPlaying();
      });
    }

    private showResults() {
      this.clearAll();
      const cx = this.W / 2;
      if (this.totalXP > 0) this.callbacks.onXP(this.totalXP);
      this.callbacks.onGamePlayed();
      if (this.bestCombo >= 3) this.callbacks.onCombo(this.bestCombo);
      if (this.correct > this.highScore) {
        this.highScore = this.correct;
        try { localStorage.setItem("tax-guide-tfblitz-best", String(this.correct)); } catch {}
      }

      const emoji = this.correct >= 15 ? "\uD83D\uDD25" : this.correct >= 8 ? "\u26A1" : "\uD83D\uDCDA";
      const icon = this.add.text(cx, 40, emoji, { fontSize: "40px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 400, ease: "Back.easeOut" });
      if (this.correct >= 8) this.emitParticles(cx, 60, GAME_COLORS.indigo);

      this.add.text(cx, 85, `${this.correct} ${this.isEn ? "correct" : "correctas"}`, {
        fontSize: "22px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.indigo),
      }).setOrigin(0.5);

      this.add.text(cx - 40, 120, `${this.bestCombo}x`, {
        fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
      }).setOrigin(0.5);
      this.add.text(cx - 40, 135, this.isEn ? "best combo" : "mejor combo", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx + 40, 120, `+${this.totalXP}`, {
        fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet),
      }).setOrigin(0.5);
      this.add.text(cx + 40, 135, "XP", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);

      if (this.correct > 0 && this.correct >= this.highScore) {
        this.add.text(cx, 160, this.isEn ? "New personal best!" : "\u00a1Nuevo r\u00e9cord personal!", {
          fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        }).setOrigin(0.5);
      }

      this.createBtn(cx, 210, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.indigo, () => this.startGame());
    }
  };
}

export const TrueFalseBlitz = memo(function TrueFalseBlitz({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed, recordCombo } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed, recordCombo });
  refs.current = { addXP, recordGamePlayed, recordCombo };

  const factory = useCallback((Phaser: typeof import("phaser")) => createBlitzScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (xp: number) => refs.current.addXP(xp),
      onGamePlayed: () => refs.current.recordGamePlayed("true_false_blitz"),
      onCombo: (n: number) => refs.current.recordCombo(n),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 260 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={260} className="w-full" />
    </div>
  );
});
