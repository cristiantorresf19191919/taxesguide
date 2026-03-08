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

function scrambleWord(word: string): string {
  if (word.length <= 2) return word.split("").reverse().join("");
  const letters = word.split("");
  let scrambled = shuffle(letters).join("");
  let attempts = 0;
  while (scrambled === word && attempts < 20) { scrambled = shuffle(letters).join(""); attempts++; }
  if (scrambled === word && word.length >= 2) {
    const arr = word.split(""); [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]]; scrambled = arr.join("");
  }
  return scrambled;
}

const ROUND_SIZE = 8;
const TIME_LIMIT = 60;
const BASE_XP = 6;
const TIME_BONUS_PER_CORRECT = 3;

function getComboMultiplier(combo: number): number {
  if (combo >= 6) return 3; if (combo >= 3) return 2; return 1;
}

type RoundTerm = { term: (typeof TERMS)[0]; scrambled: string; options: string[]; correctIdx: number };

function createScrambleScene(Phaser: typeof import("phaser")) {
  return class ScrambleScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private rounds: RoundTerm[] = [];
    private currentIdx = 0;
    private correct = 0;
    private combo = 0;
    private bestCombo = 0;
    private totalXP = 0;
    private timeLeft = TIME_LIMIT;
    private selected: number | null = null;
    private bestScore = 0;
    private timerEvent: Phaser.Time.TimerEvent | null = null;
    private timerText!: Phaser.GameObjects.Text;

    constructor() { super({ key: "ScrambleScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      try { const raw = localStorage.getItem("tax-guide-scramble-best"); if (raw) this.bestScore = Number(raw); } catch {}
      this.showIdle();
    }

    private get isEn() { return this.lang === "en"; }
    private get W() { return Number(this.scale.width); }
    private clearAll() { this.children.removeAll(true); if (this.timerEvent) { this.timerEvent.destroy(); this.timerEvent = null; } }

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
      return c;
    }

    private showIdle() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(cx, 35, "\uD83D\uDD24", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "Word Scramble" : "Letras revueltas", {
        fontSize: "17px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
      }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Puzzle" : "Rompecabezas", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn
        ? `Unscramble ${ROUND_SIZE} tax terms!\nCorrect answers add +${TIME_BONUS_PER_CORRECT}s. Combos multiply XP!`
        : `\u00A1Descifra ${ROUND_SIZE} t\u00E9rminos!\nAciertos dan +${TIME_BONUS_PER_CORRECT}s. \u00A1Combos multiplican XP!`, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
        align: "center", wordWrap: { width: this.W - 50 },
      }).setOrigin(0.5);

      if (this.bestScore > 0) {
        this.add.text(cx, 158, `\uD83C\uDFC6 ${this.bestScore}/${ROUND_SIZE}`, {
          fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        }).setOrigin(0.5);
      }

      this.createBtn(cx, 210, this.isEn ? "Start Scramble" : "Comenzar a descifrar", GAME_COLORS.amber, () => this.startGame());
    }

    private startGame() {
      const selected = shuffle(TERMS).slice(0, ROUND_SIZE);
      this.rounds = selected.map(term => {
        const label = this.isEn ? term.labelEn : term.labelEs;
        const scrambled = scrambleWord(label.toUpperCase());
        const wrongTerms = shuffle(TERMS.filter(t => t.id !== term.id)).slice(0, 3);
        const allOptions = shuffle([term, ...wrongTerms]);
        const correctIdx = allOptions.findIndex(t => t.id === term.id);
        return { term, scrambled, options: allOptions.map(t => this.isEn ? t.labelEn : t.labelEs), correctIdx };
      });
      this.currentIdx = 0; this.correct = 0; this.combo = 0; this.bestCombo = 0;
      this.totalXP = 0; this.timeLeft = TIME_LIMIT; this.selected = null;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll();
      const cx = this.W / 2;
      const round = this.rounds[this.currentIdx];
      if (!round) return;

      // Header
      this.add.text(12, 8, "\uD83D\uDD24", { fontSize: "16px" });
      this.add.text(32, 10, `${this.currentIdx + 1}/${ROUND_SIZE}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });

      // Combo
      if (this.combo >= 3) {
        const mult = getComboMultiplier(this.combo);
        this.add.text(this.W - 70, 10, `x${mult}`, {
          fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        });
      }

      // Timer
      this.timerText = this.add.text(this.W - 12, 10, `${this.timeLeft}s`, {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(this.timeLeft < 15 ? GAME_COLORS.red : GAME_COLORS.slate700),
      }).setOrigin(1, 0);

      this.timerEvent = this.time.addEvent({ delay: 1000, loop: true, callback: () => {
        this.timeLeft--;
        this.timerText.setText(`${this.timeLeft}s`);
        this.timerText.setColor(hexColor(this.timeLeft < 15 ? GAME_COLORS.red : GAME_COLORS.slate700));
        if (this.timeLeft <= 0) { this.timerEvent?.destroy(); this.showResults(); }
      }});

      // Progress bar
      const barW = this.W - 24;
      const barBg = this.add.graphics(); barBg.fillStyle(GAME_COLORS.slate200, 0.4); barBg.fillRoundedRect(12, 30, barW, 4, 2);
      const barFill = this.add.graphics(); barFill.fillStyle(GAME_COLORS.amber, 1);
      barFill.fillRoundedRect(12, 30, barW * ((this.currentIdx + 1) / ROUND_SIZE), 4, 2);

      // Scrambled word display
      const scrambleBg = this.add.graphics(); scrambleBg.fillStyle(GAME_COLORS.amber, 0.08);
      scrambleBg.fillRoundedRect(16, 42, this.W - 32, 55, 10);

      this.add.text(cx, 52, this.isEn ? "Unscramble this:" : "Descifra esto:", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.amber),
      }).setOrigin(0.5);

      // Animated scrambled letters
      const letters = round.scrambled.split("");
      const totalW = letters.length * 16;
      const startX = cx - totalW / 2;
      letters.forEach((letter, i) => {
        const ltr = this.add.text(startX + i * 16, 75, letter, {
          fontSize: "18px", fontFamily: "monospace", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        }).setOrigin(0.5);
        // Wiggle animation
        this.tweens.add({
          targets: ltr, y: ltr.y - 3, duration: 300 + i * 50,
          yoyo: true, repeat: -1, ease: "Sine.easeInOut",
        });
      });

      // Hint
      this.add.text(cx, 108, `${this.isEn ? "Hint: " : "Pista: "}${this.isEn ? round.term.shortEn : round.term.shortEs}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "italic",
        color: hexColor(GAME_COLORS.slate500), wordWrap: { width: this.W - 40 }, align: "center",
      }).setOrigin(0.5);

      // Option buttons
      this.selected = null;
      round.options.forEach((opt, i) => {
        const y = 135 + i * 35;
        const w = this.W - 32; const h = 30;
        const bg = this.add.graphics();
        bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xffffff, 0.6);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        const txt = this.add.text(0, 0, opt, {
          fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
          color: hexColor(GAME_COLORS.slate700), wordWrap: { width: w - 16 },
        }).setOrigin(0.5);
        const c = this.add.container(cx, y, [bg, txt]); c.setSize(w, h); c.setInteractive({ useHandCursor: true });
        c.on("pointerdown", () => {
          if (this.selected !== null) return;
          this.selected = i;
          const isCorrect = i === round.correctIdx;
          bg.clear();
          if (isCorrect) { bg.fillStyle(GAME_COLORS.emerald, 0.15); bg.lineStyle(1.5, GAME_COLORS.emerald, 0.6); }
          else { bg.fillStyle(GAME_COLORS.red, 0.15); bg.lineStyle(1.5, GAME_COLORS.red, 0.6); }
          bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);

          if (isCorrect) {
            const newCombo = this.combo + 1;
            const mult = getComboMultiplier(newCombo);
            const earned = BASE_XP * mult;
            this.correct++; this.combo = newCombo; this.totalXP += earned;
            if (newCombo > this.bestCombo) this.bestCombo = newCombo;
            this.timeLeft += TIME_BONUS_PER_CORRECT;
            this.emitParticles(cx, y, GAME_COLORS.emerald);
            // Time bonus flash
            const bonus = this.add.text(this.W - 30, 10, `+${TIME_BONUS_PER_CORRECT}s`, {
              fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
            }).setOrigin(0.5);
            this.tweens.add({ targets: bonus, y: bonus.y - 15, alpha: 0, duration: 600, onComplete: () => bonus.destroy() });
          } else {
            this.combo = 0;
            this.cameras.main.shake(150, 0.003);
          }

          this.time.delayedCall(700, () => {
            if (this.currentIdx + 1 >= ROUND_SIZE) { this.timerEvent?.destroy(); this.showResults(); }
            else { this.currentIdx++; this.showPlaying(); }
          });
        });
      });
    }

    private showResults() {
      this.clearAll();
      const cx = this.W / 2;
      const perfectBonus = this.correct === ROUND_SIZE ? 25 : 0;
      const finalXP = this.totalXP + perfectBonus;
      if (finalXP > 0) this.callbacks.onXP(finalXP);
      this.callbacks.onGamePlayed();
      if (this.correct > this.bestScore) {
        this.bestScore = this.correct;
        try { localStorage.setItem("tax-guide-scramble-best", String(this.correct)); } catch {}
      }

      const emoji = this.correct >= ROUND_SIZE ? "\uD83E\uDDE0" : this.correct >= ROUND_SIZE / 2 ? "\uD83D\uDCAA" : "\uD83D\uDCD6";
      const icon = this.add.text(cx, 40, emoji, { fontSize: "40px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 400, ease: "Back.easeOut" });
      if (this.correct >= ROUND_SIZE / 2) this.emitParticles(cx, 60, GAME_COLORS.amber);

      this.add.text(cx, 85, `${this.correct}/${ROUND_SIZE}`, {
        fontSize: "28px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(this.correct >= ROUND_SIZE / 2 ? GAME_COLORS.amber : GAME_COLORS.slate500),
      }).setOrigin(0.5);
      this.add.text(cx, 110, this.isEn ? "unscrambled" : "descifrados", {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      }).setOrigin(0.5);

      // Stats
      this.add.text(cx - 40, 140, `${this.bestCombo}x`, {
        fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
      }).setOrigin(0.5);
      this.add.text(cx - 40, 155, this.isEn ? "best combo" : "mejor combo", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx + 40, 140, `+${finalXP}`, {
        fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet),
      }).setOrigin(0.5);
      this.add.text(cx + 40, 155, "XP", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);

      this.createBtn(cx, 210, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.amber, () => this.startGame());
    }
  };
}

export const WordScramble = memo(function WordScramble({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed });
  refs.current = { addXP, recordGamePlayed };

  const factory = useCallback((Phaser: typeof import("phaser")) => createScrambleScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (xp: number) => refs.current.addXP(xp),
      onGamePlayed: () => refs.current.recordGamePlayed("word_scramble"),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 280 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={280} className="w-full" />
    </div>
  );
});
