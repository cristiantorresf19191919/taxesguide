"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { PhaserGame, GAME_COLORS, hexColor } from "./PhaserGame";
import { TERMS } from "@/app/data/terms";
import { CATEGORIES, getCategoryForTerm } from "@/app/data/categories";
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

const ROUND_SIZE = 10;
const TIME_LIMIT = 45;
const BASE_XP = 5;
const TIME_BONUS_PER_CORRECT = 2;

function getComboMultiplier(combo: number): number {
  if (combo >= 8) return 3;
  if (combo >= 4) return 2;
  return 1;
}

function createSortScene(Phaser: typeof import("phaser")) {
  return class SortScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private terms: typeof TERMS = [];
    private currentIdx = 0;
    private correct = 0;
    private wrong = 0;
    private combo = 0;
    private bestCombo = 0;
    private totalXP = 0;
    private timeLeft = TIME_LIMIT;
    private bestScore = 0;
    private timerEvent: Phaser.Time.TimerEvent | null = null;
    private timerText!: Phaser.GameObjects.Text;

    constructor() { super({ key: "SortScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      try {
        const raw = localStorage.getItem("tax-guide-catsort-best");
        if (raw) this.bestScore = Number(raw);
      } catch {}
      this.showIdle();
    }

    private get isEn() { return this.lang === "en"; }
    private get W() { return Number(this.scale.width); }
    private clearAll() {
      this.children.removeAll(true);
      if (this.timerEvent) { this.timerEvent.destroy(); this.timerEvent = null; }
    }

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
      this.add.text(cx, 35, "\uD83D\uDDC2\uFE0F", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "Category Sort" : "Clasificar categor\u00edas", {
        fontSize: "16px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.cyan),
      }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Classification" : "Clasificaci\u00f3n", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn
        ? `Sort ${ROUND_SIZE} terms in ${TIME_LIMIT}s!\nCorrect answers add +${TIME_BONUS_PER_CORRECT}s. Combos multiply XP!`
        : `\u00A1Clasifica ${ROUND_SIZE} t\u00e9rminos en ${TIME_LIMIT}s!\nAciertos dan +${TIME_BONUS_PER_CORRECT}s. \u00A1Combos multiplican XP!`, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
        align: "center", wordWrap: { width: this.W - 50 },
      }).setOrigin(0.5);
      if (this.bestScore > 0) {
        this.add.text(cx, 158, `\uD83C\uDFC6 ${this.bestScore}/${ROUND_SIZE}`, {
          fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.cyan),
        }).setOrigin(0.5);
      }
      this.createBtn(cx, 210, this.isEn ? "Start Sorting" : "Comenzar a clasificar", GAME_COLORS.cyan, () => this.startGame());
    }

    private startGame() {
      const categorized = TERMS.filter(t => getCategoryForTerm(t.id));
      this.terms = shuffle(categorized).slice(0, ROUND_SIZE);
      this.currentIdx = 0; this.correct = 0; this.wrong = 0;
      this.combo = 0; this.bestCombo = 0; this.totalXP = 0; this.timeLeft = TIME_LIMIT;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll();
      const cx = this.W / 2;
      const term = this.terms[this.currentIdx];
      if (!term) { this.showResults(); return; }
      const correctCat = getCategoryForTerm(term.id);
      if (!correctCat) { this.currentIdx++; this.showPlaying(); return; }
      const others = shuffle(CATEGORIES.filter(c => c.id !== correctCat.id)).slice(0, 2);
      const catOptions = shuffle([correctCat, ...others]);
      const mult = getComboMultiplier(this.combo);

      // Header
      this.add.text(12, 8, `${this.currentIdx + 1}/${ROUND_SIZE}`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      });
      if (this.combo >= 4) {
        this.add.text(this.W / 2, 8, `x${mult}`, {
          fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber),
        }).setOrigin(0.5);
      }
      this.add.text(this.W - 80, 8, `${this.correct}\u2713 ${this.wrong}\u2717`, {
        fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      });
      this.timerText = this.add.text(this.W - 12, 8, `${this.timeLeft}s`, {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(this.timeLeft < 10 ? GAME_COLORS.red : GAME_COLORS.slate700),
      }).setOrigin(1, 0);

      this.timerEvent = this.time.addEvent({ delay: 1000, loop: true, callback: () => {
        this.timeLeft--;
        this.timerText.setText(`${this.timeLeft}s`);
        this.timerText.setColor(hexColor(this.timeLeft < 10 ? GAME_COLORS.red : GAME_COLORS.slate700));
        if (this.timeLeft <= 0) { this.timerEvent?.destroy(); this.showResults(); }
      }});

      // Progress bar
      const barW = this.W - 24;
      const barBg = this.add.graphics(); barBg.fillStyle(GAME_COLORS.slate200, 0.4); barBg.fillRoundedRect(12, 26, barW, 4, 2);
      const barFill = this.add.graphics(); barFill.fillStyle(GAME_COLORS.cyan, 1);
      barFill.fillRoundedRect(12, 26, barW * ((this.currentIdx + 1) / ROUND_SIZE), 4, 2);

      // Term card
      const cardBg = this.add.graphics(); cardBg.lineStyle(2, GAME_COLORS.slate200); cardBg.fillStyle(0xf8fafc, 1);
      cardBg.fillRoundedRect(12, 38, this.W - 24, 60, 12); cardBg.strokeRoundedRect(12, 38, this.W - 24, 60, 12);

      this.add.text(cx, 52, this.isEn ? term.labelEn : term.labelEs, {
        fontSize: "15px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700),
        wordWrap: { width: this.W - 50 }, align: "center",
      }).setOrigin(0.5);
      this.add.text(cx, 78, this.isEn ? "Which category does this belong to?" : "\u00BFA qu\u00e9 categor\u00eda pertenece?", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      }).setOrigin(0.5);

      // Category buttons
      let answered = false;
      catOptions.forEach((cat, i) => {
        const y = 118 + i * 44;
        const w = this.W - 32; const h = 38;
        const bg = this.add.graphics(); bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xffffff, 0.6);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

        const icon = this.add.text(-w / 2 + 16, 0, cat.icon, { fontSize: "16px" }).setOrigin(0, 0.5);
        const label = this.add.text(-w / 2 + 38, 0, this.isEn ? cat.labelEn : cat.labelEs, {
          fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700),
        }).setOrigin(0, 0.5);

        const c = this.add.container(cx, y, [bg, icon, label]); c.setSize(w, h); c.setInteractive({ useHandCursor: true });

        c.on("pointerdown", () => {
          if (answered) return; answered = true;
          const isCorrect = cat.id === correctCat.id;
          bg.clear();
          if (isCorrect) {
            bg.fillStyle(GAME_COLORS.emerald, 0.15); bg.lineStyle(1.5, GAME_COLORS.emerald, 0.6);
            const newCombo = this.combo + 1;
            const mult2 = getComboMultiplier(newCombo);
            const earned = BASE_XP * mult2;
            this.correct++; this.combo = newCombo; this.totalXP += earned;
            if (newCombo > this.bestCombo) this.bestCombo = newCombo;
            this.timeLeft += TIME_BONUS_PER_CORRECT;
            this.emitParticles(cx, y, GAME_COLORS.emerald);
            // Time bonus flash
            const bonus = this.add.text(this.W - 30, 8, `+${TIME_BONUS_PER_CORRECT}s`, {
              fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
            }).setOrigin(0.5);
            this.tweens.add({ targets: bonus, y: bonus.y - 15, alpha: 0, duration: 600, onComplete: () => bonus.destroy() });
          } else {
            bg.fillStyle(GAME_COLORS.red, 0.15); bg.lineStyle(1.5, GAME_COLORS.red, 0.6);
            this.wrong++; this.combo = 0;
            this.cameras.main.shake(150, 0.003);
          }
          bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

          this.time.delayedCall(600, () => {
            if (this.currentIdx + 1 >= ROUND_SIZE) { this.timerEvent?.destroy(); this.showResults(); }
            else { this.currentIdx++; this.showPlaying(); }
          });
        });
      });
    }

    private showResults() {
      this.clearAll();
      const cx = this.W / 2;
      const perfectBonus = this.correct === ROUND_SIZE ? 20 : 0;
      const finalXP = this.totalXP + perfectBonus;
      if (finalXP > 0) this.callbacks.onXP(finalXP);
      this.callbacks.onGamePlayed();
      if (this.correct > this.bestScore) {
        this.bestScore = this.correct;
        try { localStorage.setItem("tax-guide-catsort-best", String(this.correct)); } catch {}
      }

      const pct = Math.round((this.correct / ROUND_SIZE) * 100);
      const emoji = pct >= 80 ? "\uD83C\uDFC6" : pct >= 50 ? "\uD83D\uDC4D" : "\uD83D\uDCD6";
      const icon = this.add.text(cx, 40, emoji, { fontSize: "40px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 400, ease: "Back.easeOut" });
      if (pct >= 50) this.emitParticles(cx, 60, GAME_COLORS.cyan);

      this.add.text(cx, 85, `${this.correct}/${ROUND_SIZE}`, {
        fontSize: "28px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
        color: hexColor(pct >= 70 ? GAME_COLORS.emerald : GAME_COLORS.amber),
      }).setOrigin(0.5);
      this.add.text(cx, 110, this.isEn ? "correctly sorted" : "clasificados correctamente", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      }).setOrigin(0.5);

      this.add.text(cx - 40, 138, `${this.bestCombo}x`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.amber) }).setOrigin(0.5);
      this.add.text(cx - 40, 152, this.isEn ? "best combo" : "mejor combo", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx + 40, 138, `+${finalXP}`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5);
      this.add.text(cx + 40, 152, "XP", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);

      this.createBtn(cx, 210, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.cyan, () => this.startGame());
    }
  };
}

export const CategorySort = memo(function CategorySort({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed });
  refs.current = { addXP, recordGamePlayed };

  const factory = useCallback((Phaser: typeof import("phaser")) => createSortScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (xp: number) => refs.current.addXP(xp),
      onGamePlayed: () => refs.current.recordGamePlayed("category_sort"),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 260 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={260} className="w-full" />
    </div>
  );
});
