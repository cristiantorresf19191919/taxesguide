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

const ABBREVIATION_TERMS = TERMS.filter(t => t.isAbbreviation);
const ROUND_SIZE = Math.min(12, ABBREVIATION_TERMS.length);
const TIME_LIMIT = 60;
const BASE_XP = 5;

type Round = { term: (typeof TERMS)[0]; options: string[]; correctIdx: number };

function getComboMultiplier(combo: number): number {
  if (combo >= 10) return 4; if (combo >= 6) return 3; if (combo >= 3) return 2; return 1;
}
function getComboLabel(combo: number): string {
  const m = getComboMultiplier(combo);
  if (m >= 4) return "UNSTOPPABLE"; if (m >= 3) return "ON FIRE"; if (m >= 2) return "COMBO"; return "";
}

function createAcronymScene(Phaser: typeof import("phaser")) {
  return class AcronymScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private rounds: Round[] = [];
    private currentIdx = 0;
    private correct = 0;
    private combo = 0;
    private bestCombo = 0;
    private totalXP = 0;
    private timeLeft = TIME_LIMIT;
    private bestScore = 0;
    private timerEvent: Phaser.Time.TimerEvent | null = null;
    private timerText: any;

    constructor() { super({ key: "AcronymScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      try { const raw = localStorage.getItem("tax-guide-acronym-best"); if (raw) this.bestScore = Number(raw); } catch {}
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
    }

    private showIdle() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(cx, 35, "\uD83D\uDD20", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "Acronym Challenge" : "Reto de siglas", {
        fontSize: "16px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.teal),
      }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Decode" : "Descifrar", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn
        ? `Do you know what ${ROUND_SIZE} tax acronyms\nstand for? Build combos for multiplied XP!`
        : `\u00BFSabes qu\u00E9 significan ${ROUND_SIZE} siglas\nfiscales? \u00A1Haz combos para multiplicar XP!`, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
        align: "center", wordWrap: { width: this.W - 50 },
      }).setOrigin(0.5);
      if (this.bestScore > 0) {
        this.add.text(cx, 158, `\uD83C\uDFC6 ${this.bestScore}/${ROUND_SIZE}`, {
          fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.teal),
        }).setOrigin(0.5);
      }
      this.createBtn(cx, 210, this.isEn ? "Start Challenge" : "Comenzar reto", GAME_COLORS.teal, () => this.startGame());
    }

    private startGame() {
      const selectedTerms = shuffle(ABBREVIATION_TERMS).slice(0, ROUND_SIZE);
      this.rounds = selectedTerms.map(term => {
        const correctDef = this.isEn ? term.shortEn : term.shortEs;
        const expansion = correctDef.split("\u2014")[0]?.trim() || correctDef;
        const wrongTerms = shuffle(ABBREVIATION_TERMS.filter(t => t.id !== term.id)).slice(0, 3);
        const wrongExpansions = wrongTerms.map(t => { const d = this.isEn ? t.shortEn : t.shortEs; return d.split("\u2014")[0]?.trim() || d; });
        const allOptions = shuffle([expansion, ...wrongExpansions]);
        const correctIdx = allOptions.indexOf(expansion);
        return { term, options: allOptions, correctIdx };
      });
      this.currentIdx = 0; this.correct = 0; this.combo = 0; this.bestCombo = 0;
      this.totalXP = 0; this.timeLeft = TIME_LIMIT;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll();
      const cx = this.W / 2;
      const round = this.rounds[this.currentIdx];
      if (!round) return;

      // Header
      this.add.text(12, 8, "\uD83D\uDD20", { fontSize: "16px" });
      this.add.text(32, 10, `${this.currentIdx + 1}/${ROUND_SIZE}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });
      if (this.combo >= 3) {
        const label = getComboLabel(this.combo);
        const mult = getComboMultiplier(this.combo);
        this.add.text(this.W - 80, 10, `${label} x${mult}`, {
          fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        });
      }
      this.add.text(this.W - 40, 10, `${this.correct}\u2713`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
      });
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
      const barFill = this.add.graphics(); barFill.fillStyle(GAME_COLORS.teal, 1);
      barFill.fillRoundedRect(12, 30, barW * ((this.currentIdx + 1) / ROUND_SIZE), 4, 2);

      // Acronym display
      const acBg = this.add.graphics(); acBg.fillStyle(GAME_COLORS.teal, 0.08);
      acBg.fillRoundedRect(16, 42, this.W - 32, 55, 10);
      this.add.text(cx, 52, this.isEn ? "What does this stand for?" : "\u00BFQu\u00E9 significa esta sigla?", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.teal),
      }).setOrigin(0.5);

      // Big acronym with pulsing animation
      const acronym = this.isEn ? round.term.labelEn : round.term.labelEs;
      const acText = this.add.text(cx, 76, acronym, {
        fontSize: "26px", fontFamily: "monospace", fontStyle: "bold", color: hexColor(GAME_COLORS.teal),
        letterSpacing: 6,
      }).setOrigin(0.5);
      this.tweens.add({ targets: acText, scaleX: 1.05, scaleY: 1.05, yoyo: true, repeat: -1, duration: 800 });

      // Options
      let answered = false;
      round.options.forEach((opt, i) => {
        const y = 115 + i * 35;
        const w = this.W - 32; const h = 30;
        const bg = this.add.graphics(); bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xffffff, 0.6);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        const txt = this.add.text(0, 0, opt, {
          fontSize: "10px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
          color: hexColor(GAME_COLORS.slate700), wordWrap: { width: w - 16 },
        }).setOrigin(0.5);
        const c = this.add.container(cx, y, [bg, txt]); c.setSize(w, h); c.setInteractive({ useHandCursor: true });

        c.on("pointerdown", () => {
          if (answered) return; answered = true;
          const isCorrect = i === round.correctIdx;
          bg.clear();
          if (isCorrect) {
            bg.fillStyle(GAME_COLORS.emerald, 0.15); bg.lineStyle(1.5, GAME_COLORS.emerald, 0.6);
            const newCombo = this.combo + 1;
            const mult = getComboMultiplier(newCombo);
            const earned = BASE_XP * mult;
            this.correct++; this.combo = newCombo; this.totalXP += earned;
            if (newCombo > this.bestCombo) this.bestCombo = newCombo;
            this.emitParticles(cx, y, GAME_COLORS.teal);
          } else {
            bg.fillStyle(GAME_COLORS.red, 0.15); bg.lineStyle(1.5, GAME_COLORS.red, 0.6);
            this.combo = 0;
            this.cameras.main.shake(150, 0.003);
          }
          bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);

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
      const perfectBonus = this.correct === ROUND_SIZE ? 30 : 0;
      const finalXP = this.totalXP + perfectBonus;
      if (finalXP > 0) this.callbacks.onXP(finalXP);
      this.callbacks.onGamePlayed();
      if (this.bestCombo >= 3) this.callbacks.onCombo(this.bestCombo);
      if (this.correct > this.bestScore) {
        this.bestScore = this.correct;
        try { localStorage.setItem("tax-guide-acronym-best", String(this.correct)); } catch {}
      }

      const emoji = this.correct >= ROUND_SIZE ? "\uD83C\uDFC5" : this.correct >= ROUND_SIZE / 2 ? "\uD83D\uDD20" : "\uD83D\uDCD6";
      const icon = this.add.text(cx, 40, emoji, { fontSize: "40px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 400, ease: "Back.easeOut" });
      if (this.correct >= ROUND_SIZE / 2) this.emitParticles(cx, 60, GAME_COLORS.teal);

      this.add.text(cx, 85, `${this.correct}/${ROUND_SIZE}`, {
        fontSize: "28px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(this.correct >= ROUND_SIZE / 2 ? GAME_COLORS.teal : GAME_COLORS.slate500),
      }).setOrigin(0.5);
      this.add.text(cx, 110, this.isEn ? "acronyms decoded" : "siglas decodificadas", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      }).setOrigin(0.5);

      this.add.text(cx - 40, 138, `${this.bestCombo}x`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber) }).setOrigin(0.5);
      this.add.text(cx - 40, 152, this.isEn ? "best combo" : "mejor combo", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx + 40, 138, `+${finalXP}`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5);
      this.add.text(cx + 40, 152, "XP", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);

      if (this.correct > 0 && this.correct >= this.bestScore) {
        this.add.text(cx, 175, this.isEn ? "New personal best!" : "\u00A1Nuevo r\u00E9cord personal!", {
          fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        }).setOrigin(0.5);
      }

      this.createBtn(cx, 210, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.teal, () => this.startGame());
    }
  };
}

export const AcronymChallenge = memo(function AcronymChallenge({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed, recordCombo } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed, recordCombo });
  refs.current = { addXP, recordGamePlayed, recordCombo };

  const factory = useCallback((Phaser: typeof import("phaser")) => createAcronymScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (xp: number) => refs.current.addXP(xp),
      onGamePlayed: () => refs.current.recordGamePlayed("acronym_challenge"),
      onCombo: (n: number) => refs.current.recordCombo(n),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 280 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={280} className="w-full" />
    </div>
  );
});
