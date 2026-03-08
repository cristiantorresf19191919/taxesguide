"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { PhaserGame, GAME_COLORS, hexColor } from "./PhaserGame";
import { TERMS } from "@/app/data/terms";
import { useProgress } from "@/app/contexts/ProgressContext";

type Lang = "en" | "es";
type Card = { id: string; pairId: string; content: string; type: "term" | "def" };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a;
}

const PAIRS = 6;
const XP_BASE = 30;

function createMatcherScene(Phaser: typeof import("phaser")) {
  return class MatcherScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private cards: Card[] = [];
    private cardSprites: any[] = [];
    private flipped: number[] = [];
    private matched: string[] = [];
    private attempts = 0;
    private elapsed = 0;
    private matchStreak = 0;
    private bestStreak = 0;
    private locked = false;
    private timerEvent: any = null;
    private timerText: any;
    private matchText: any;
    private bestTime: number | null = null;

    constructor() { super({ key: "MatcherScene" }); }
    receiveData(data: any) { this.lang = data.lang; this.callbacks = data.callbacks; try { const raw = localStorage.getItem("tax-guide-matcher-best"); if (raw) this.bestTime = Number(raw); } catch {} this.showIdle(); }
    private get isEn() { return this.lang === "en"; }
    private get W() { return Number(this.scale.width); }
    private clearAll() { this.children.removeAll(true); if (this.timerEvent) { this.timerEvent.destroy(); this.timerEvent = null; } }

    private emitParticles(x: number, y: number, color: number) {
      const key = `p_${color}`; if (!this.textures.exists(key)) { const g = (this.make as any).graphics({ add: false }); g.fillStyle(color); g.fillCircle(4, 4, 4); g.generateTexture(key, 8, 8); g.destroy(); }
      const e = this.add.particles(x, y, key, { speed: { min: 80, max: 200 }, angle: { min: 0, max: 360 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, lifespan: 600, quantity: 12, emitting: false }); e.explode(); this.time.delayedCall(1000, () => e.destroy());
    }

    private createBtn(x: number, y: number, label: string, color: number, onClick: () => void) {
      const w = this.W - 48; const h = 44;
      const bg = this.add.graphics(); bg.fillStyle(color); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
      const txt = this.add.text(0, 0, label, { fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: "#fff" }).setOrigin(0.5);
      const c = this.add.container(x, y, [bg, txt]); c.setSize(w, h); c.setInteractive({ useHandCursor: true }); c.on("pointerdown", onClick);
    }

    private showIdle() {
      this.clearAll(); const cx = this.W / 2;
      this.add.text(cx, 35, "🃏", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "Term Matcher" : "Emparejar términos", { fontSize: "17px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.pink) }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Memory" : "Memoria", { fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn ? "Flip cards to match terms with definitions.\nConsecutive matches earn streak bonus XP!" : "Voltea cartas para emparejar términos.\n¡Emparejamientos consecutivos = XP de racha!", { fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500), align: "center", wordWrap: { width: this.W - 50 } }).setOrigin(0.5);
      if (this.bestTime !== null) { const m = Math.floor(this.bestTime / 60); const s = this.bestTime % 60; this.add.text(cx, 158, `🏆 ${m}:${s.toString().padStart(2, "0")}`, { fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5); }
      this.createBtn(cx, 210, this.isEn ? "Start Game" : "Iniciar juego", GAME_COLORS.pink, () => this.startGame());
    }

    private startGame() {
      const selected = shuffle(TERMS).slice(0, PAIRS); this.cards = [];
      selected.forEach(term => { this.cards.push({ id: `${term.id}-t`, pairId: term.id, content: this.isEn ? term.labelEn : term.labelEs, type: "term" }); this.cards.push({ id: `${term.id}-d`, pairId: term.id, content: this.isEn ? term.shortEn : term.shortEs, type: "def" }); });
      this.cards = shuffle(this.cards); this.flipped = []; this.matched = []; this.attempts = 0; this.elapsed = 0; this.matchStreak = 0; this.bestStreak = 0; this.locked = false;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll(); const cx = this.W / 2;
      this.add.text(12, 8, "🃏", { fontSize: "16px" });
      this.add.text(34, 10, this.isEn ? "Term Matcher" : "Emparejar", { fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700) });
      this.matchText = this.add.text(this.W - 60, 10, `${this.matched.length}/${PAIRS}`, { fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500) });
      this.timerText = this.add.text(this.W - 12, 10, "0:00", { fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700) }).setOrigin(1, 0);
      this.timerEvent = this.time.addEvent({ delay: 1000, loop: true, callback: () => { this.elapsed++; const m = Math.floor(this.elapsed / 60); const s = this.elapsed % 60; this.timerText.setText(`${m}:${s.toString().padStart(2, "0")}`); } });

      const cols = 4; const cardW = (this.W - 40 - (cols - 1) * 6) / cols; const cardH = 50; const startX = 20 + cardW / 2; const startY = 36 + cardH / 2;
      this.cardSprites = [];
      this.cards.forEach((card, idx) => {
        const col = idx % cols; const row = Math.floor(idx / cols);
        const x = startX + col * (cardW + 6); const y = startY + row * (cardH + 6);
        const bg = this.add.graphics(); bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xf8fafc); bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8); bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
        const q = this.add.text(0, 0, "?", { fontSize: "16px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
        const f = this.add.text(0, 0, card.content, { fontSize: card.type === "term" ? "8px" : "7px", fontFamily: "system-ui, sans-serif", fontStyle: card.type === "term" ? "bold" : "normal", color: hexColor(card.type === "term" ? GAME_COLORS.slate900 : GAME_COLORS.slate500), wordWrap: { width: cardW - 8 }, align: "center" }).setOrigin(0.5).setVisible(false);
        const c = this.add.container(x, y, [bg, q, f]); c.setSize(cardW, cardH); c.setInteractive({ useHandCursor: true });
        c.setData("idx", idx); c.setData("bg", bg); c.setData("q", q); c.setData("f", f); c.setData("w", cardW); c.setData("h", cardH);
        c.on("pointerdown", () => this.flipCard(idx));
        this.cardSprites.push(c);
      });
    }

    private flipCard(idx: number) {
      if (this.locked || this.flipped.includes(idx) || this.matched.includes(this.cards[idx].pairId)) return;
      const s = this.cardSprites[idx]; const q = s.getData("q"); const f = s.getData("f"); const bg = s.getData("bg"); const w = s.getData("w"); const h = s.getData("h");
      this.tweens.add({ targets: s, scaleX: 0, duration: 80, onComplete: () => { q.setVisible(false); f.setVisible(true); bg.clear(); bg.lineStyle(1.5, GAME_COLORS.pink, 0.6); bg.fillStyle(0xfdf2f8); bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8); this.tweens.add({ targets: s, scaleX: 1, duration: 80 }); } });
      this.flipped.push(idx);
      if (this.flipped.length === 2) {
        this.locked = true; this.attempts++;
        const [a, b] = this.flipped; const c1 = this.cards[a]; const c2 = this.cards[b];
        if (c1.pairId === c2.pairId && c1.type !== c2.type) {
          this.matched.push(c1.pairId); this.matchStreak++; if (this.matchStreak > this.bestStreak) this.bestStreak = this.matchStreak;
          this.matchText.setText(`${this.matched.length}/${PAIRS}`);
          [a, b].forEach(i => { const sp = this.cardSprites[i]; const bg2 = sp.getData("bg"); const w2 = sp.getData("w"); const h2 = sp.getData("h"); bg2.clear(); bg2.lineStyle(1.5, GAME_COLORS.emerald, 0.6); bg2.fillStyle(0xecfdf5); bg2.fillRoundedRect(-w2 / 2, -h2 / 2, w2, h2, 8); bg2.strokeRoundedRect(-w2 / 2, -h2 / 2, w2, h2, 8); });
          this.emitParticles(this.cardSprites[a].x, this.cardSprites[a].y, GAME_COLORS.emerald);
          this.flipped = []; this.locked = false;
          if (this.matched.length === PAIRS) { this.timerEvent?.destroy(); this.time.delayedCall(400, () => this.showWon()); }
        } else {
          this.matchStreak = 0;
          this.time.delayedCall(600, () => {
            [a, b].forEach(i => { const sp = this.cardSprites[i]; const q2 = sp.getData("q"); const f2 = sp.getData("f"); const bg2 = sp.getData("bg"); const w2 = sp.getData("w"); const h2 = sp.getData("h");
              this.tweens.add({ targets: sp, scaleX: 0, duration: 80, onComplete: () => { f2.setVisible(false); q2.setVisible(true); bg2.clear(); bg2.lineStyle(1, GAME_COLORS.slate200); bg2.fillStyle(0xf8fafc); bg2.fillRoundedRect(-w2 / 2, -h2 / 2, w2, h2, 8); bg2.strokeRoundedRect(-w2 / 2, -h2 / 2, w2, h2, 8); this.tweens.add({ targets: sp, scaleX: 1, duration: 80 }); } }); });
            this.flipped = []; this.locked = false;
          });
        }
      }
    }

    private showWon() {
      this.clearAll(); const cx = this.W / 2;
      const attemptBonus = Math.max(0, 20 - Math.max(0, this.attempts - PAIRS));
      const speedBonus = Math.max(0, Math.floor((180 - this.elapsed) / 8));
      const streakBonus = this.bestStreak >= 3 ? 10 : 0;
      const totalXP = XP_BASE + attemptBonus + speedBonus + streakBonus;
      this.callbacks.onXP(totalXP); this.callbacks.onGamePlayed(); this.callbacks.onMatcherTime(this.elapsed);
      if (this.bestTime === null || this.elapsed < this.bestTime) { this.bestTime = this.elapsed; try { localStorage.setItem("tax-guide-matcher-best", String(this.elapsed)); } catch {} }
      const t = this.add.text(cx, 35, "🎉", { fontSize: "40px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: t, scaleX: 1, scaleY: 1, duration: 500, ease: "Back.easeOut" });
      this.emitParticles(cx, 55, GAME_COLORS.pink);
      this.add.text(cx, 80, this.isEn ? "All Matched!" : "¡Todos emparejados!", { fontSize: "17px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700) }).setOrigin(0.5);
      const m = Math.floor(this.elapsed / 60); const s = this.elapsed % 60;
      this.add.text(cx - 55, 110, `${this.attempts}`, { fontSize: "18px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.pink) }).setOrigin(0.5);
      this.add.text(cx - 55, 126, this.isEn ? "attempts" : "intentos", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx, 110, `${m}:${s.toString().padStart(2, "0")}`, { fontSize: "18px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700) }).setOrigin(0.5);
      this.add.text(cx, 126, this.isEn ? "time" : "tiempo", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.add.text(cx + 55, 110, `+${totalXP}`, { fontSize: "18px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet) }).setOrigin(0.5);
      this.add.text(cx + 55, 126, "XP", { fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400) }).setOrigin(0.5);
      this.createBtn(cx, 200, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.pink, () => this.startGame());
    }
  };
}

export const TermMatcher = memo(function TermMatcher({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed, recordMatcherTime } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed, recordMatcherTime });
  refs.current = { addXP, recordGamePlayed, recordMatcherTime };
  const factory = useCallback((P: typeof import("phaser")) => createMatcherScene(P), []);
  const sceneData = useMemo(() => ({ lang, callbacks: { onXP: (n: number) => refs.current.addXP(n), onGamePlayed: () => refs.current.recordGamePlayed("term_matcher"), onMatcherTime: (s: number) => refs.current.recordMatcherTime(s) } }), [lang]);
  return <div className="flex flex-col p-2" style={{ minHeight: 260 }}><PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={260} className="w-full" /></div>;
});
