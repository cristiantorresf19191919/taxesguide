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

const GRID_SIZE = 3;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const XP_PER_CELL = 4;
const BINGO_BONUS = 35;

type BingoCell = { term: (typeof TERMS)[0]; claimed: boolean; failed: boolean };

const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkBingo(cells: BingoCell[]): number[] | null {
  for (const line of WIN_LINES) { if (line.every(i => cells[i].claimed)) return line; }
  return null;
}

function createBingoScene(Phaser: typeof import("phaser")) {
  return class BingoScene extends Phaser.Scene {
    private lang: Lang = "en";
    private callbacks: any = {};
    private cells: BingoCell[] = [];
    private claimedCount = 0;
    private totalXP = 0;
    private bestClaimed = 0;
    private winLine: number[] | null = null;
    private questionActive = false;
    private questionCellIdx = -1;

    constructor() { super({ key: "BingoScene" }); }

    receiveData(data: any) {
      this.lang = data.lang;
      this.callbacks = data.callbacks;
      try { const raw = localStorage.getItem("tax-guide-bingo-best"); if (raw) this.bestClaimed = Number(raw); } catch {}
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

    private showIdle() {
      this.clearAll();
      const cx = this.W / 2;
      this.add.text(cx, 35, "\uD83C\uDFB1", { fontSize: "30px" }).setOrigin(0.5);
      this.add.text(cx, 68, this.isEn ? "Tax Bingo" : "Bingo fiscal", {
        fontSize: "17px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.orange),
      }).setOrigin(0.5);
      this.add.text(cx, 88, this.isEn ? "Strategy" : "Estrategia", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
      }).setOrigin(0.5);
      this.add.text(cx, 118, this.isEn
        ? "Pick cells, answer correctly to claim them.\nGet 3 in a row for BINGO and bonus XP!"
        : "Elige celdas, responde bien para reclamarlas.\n\u00A1Haz 3 en l\u00EDnea para BINGO y XP extra!", {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
        align: "center", wordWrap: { width: this.W - 50 },
      }).setOrigin(0.5);
      if (this.bestClaimed > 0) {
        this.add.text(cx, 158, `\uD83C\uDFC6 ${this.bestClaimed}`, {
          fontSize: "13px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.orange),
        }).setOrigin(0.5);
      }
      this.createBtn(cx, 210, this.isEn ? "Start Bingo" : "Comenzar Bingo", GAME_COLORS.orange, () => this.startGame());
    }

    private startGame() {
      const selectedTerms = shuffle(TERMS).slice(0, TOTAL_CELLS);
      this.cells = selectedTerms.map(term => ({ term, claimed: false, failed: false }));
      this.claimedCount = 0; this.totalXP = 0; this.winLine = null; this.questionActive = false;
      this.showPlaying();
    }

    private showPlaying() {
      this.clearAll();
      const cx = this.W / 2;

      // Header
      this.add.text(12, 8, "\uD83C\uDFB1", { fontSize: "16px" });
      this.add.text(34, 10, this.isEn ? "Tax Bingo" : "Bingo fiscal", {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700),
      });
      this.add.text(this.W - 12, 10, `${this.claimedCount}\u2713`, {
        fontSize: "11px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.emerald),
      }).setOrigin(1, 0);

      // 3x3 Grid
      const cellSize = (this.W - 36 - 8) / 3;
      const startX = 18 + cellSize / 2;
      const startY = 38 + cellSize / 2;

      this.cells.forEach((cell, idx) => {
        const col = idx % 3; const row = Math.floor(idx / 3);
        const x = startX + col * (cellSize + 4);
        const y = startY + row * (cellSize + 4);

        const bg = this.add.graphics();
        if (cell.claimed) {
          bg.lineStyle(1.5, GAME_COLORS.emerald, 0.6); bg.fillStyle(0xecfdf5, 1);
        } else if (cell.failed) {
          bg.lineStyle(1, GAME_COLORS.red, 0.3); bg.fillStyle(0xfef2f2, 0.5);
        } else {
          bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xf8fafc, 1);
        }
        bg.fillRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 10);
        bg.strokeRoundedRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize, 10);

        const label = this.isEn ? cell.term.labelEn : cell.term.labelEs;
        const txt = this.add.text(0, 0, label, {
          fontSize: "9px", fontFamily: "system-ui, sans-serif", fontStyle: "bold",
          color: hexColor(cell.claimed ? GAME_COLORS.emerald : cell.failed ? GAME_COLORS.slate400 : GAME_COLORS.slate700),
          wordWrap: { width: cellSize - 10 }, align: "center",
        }).setOrigin(0.5);

        const overlay = cell.claimed ? this.add.text(0, 0, "\u2705", { fontSize: "22px" }).setOrigin(0.5) :
                        cell.failed ? this.add.text(0, 0, "\u274C", { fontSize: "16px" }).setOrigin(0.5).setAlpha(0.4) : null;

        const items = overlay ? [bg, txt, overlay] : [bg, txt];
        const container = this.add.container(x, y, items);
        container.setSize(cellSize, cellSize);

        if (!cell.claimed && !cell.failed && !this.questionActive) {
          container.setInteractive({ useHandCursor: true });
          container.on("pointerdown", () => this.openQuestion(idx));
        }
      });

      if (!this.questionActive) {
        this.add.text(cx, this.W < 350 ? 235 : 245, this.isEn ? "Tap a cell to answer" : "Toca una celda para responder", {
          fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate400),
        }).setOrigin(0.5);
      }
    }

    private openQuestion(cellIdx: number) {
      this.questionActive = true;
      this.questionCellIdx = cellIdx;
      this.clearAll();
      const cx = this.W / 2;
      const cell = this.cells[cellIdx];
      const term = cell.term;

      const wrongTerms = shuffle(TERMS.filter(t => t.id !== term.id)).slice(0, 3);
      const correctDef = this.isEn ? term.shortEn : term.shortEs;
      const allOptions = shuffle([correctDef, ...wrongTerms.map(t => this.isEn ? t.shortEn : t.shortEs)]);
      const correctIdx = allOptions.indexOf(correctDef);

      // Question card
      const cardBg = this.add.graphics(); cardBg.lineStyle(2, GAME_COLORS.orange, 0.5); cardBg.fillStyle(0xfff7ed, 1);
      cardBg.fillRoundedRect(12, 10, this.W - 24, 60, 12); cardBg.strokeRoundedRect(12, 10, this.W - 24, 60, 12);

      this.add.text(cx, 25, this.isEn ? "Define this term:" : "Define este t\u00E9rmino:", {
        fontSize: "9px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.orange),
      }).setOrigin(0.5);
      this.add.text(cx, 48, this.isEn ? term.labelEn : term.labelEs, {
        fontSize: "14px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.slate700),
        wordWrap: { width: this.W - 50 }, align: "center",
      }).setOrigin(0.5);

      // Options
      let answered = false;
      allOptions.forEach((opt, i) => {
        const y = 88 + i * 40;
        const w = this.W - 32; const h = 34;
        const bg = this.add.graphics();
        bg.lineStyle(1, GAME_COLORS.slate200); bg.fillStyle(0xffffff, 0.8);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
        const txt = this.add.text(0, 0, opt, {
          fontSize: "10px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate700),
          wordWrap: { width: w - 16 }, align: "center",
        }).setOrigin(0.5);
        const c = this.add.container(cx, y, [bg, txt]); c.setSize(w, h); c.setInteractive({ useHandCursor: true });

        c.on("pointerdown", () => {
          if (answered) return; answered = true;
          const isCorrect = i === correctIdx;
          bg.clear();
          if (isCorrect) {
            bg.fillStyle(GAME_COLORS.emerald, 0.15); bg.lineStyle(1.5, GAME_COLORS.emerald, 0.6);
            this.emitParticles(cx, y, GAME_COLORS.emerald);
          } else {
            bg.fillStyle(GAME_COLORS.red, 0.15); bg.lineStyle(1.5, GAME_COLORS.red, 0.6);
            this.cameras.main.shake(150, 0.003);
          }
          bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8); bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);

          this.time.delayedCall(800, () => {
            if (isCorrect) {
              this.cells[cellIdx].claimed = true;
              this.claimedCount++;
              this.totalXP += XP_PER_CELL;
              const bingo = checkBingo(this.cells);
              if (bingo) {
                this.winLine = bingo;
                this.questionActive = false;
                this.showWon();
                return;
              }
            } else {
              this.cells[cellIdx].failed = true;
            }
            this.questionActive = false;
            const remaining = this.cells.filter(c => !c.claimed && !c.failed);
            if (remaining.length === 0 && !checkBingo(this.cells)) {
              this.showWon();
            } else {
              this.showPlaying();
            }
          });
        });
      });
    }

    private showWon() {
      this.clearAll();
      const cx = this.W / 2;
      const hasBingo = this.winLine !== null;
      const finalXP = this.totalXP + (hasBingo ? BINGO_BONUS : 0);

      if (finalXP > 0) this.callbacks.onXP(finalXP);
      this.callbacks.onGamePlayed();
      if (hasBingo) this.callbacks.onBingoWin();
      if (this.claimedCount > this.bestClaimed) {
        this.bestClaimed = this.claimedCount;
        try { localStorage.setItem("tax-guide-bingo-best", String(this.claimedCount)); } catch {}
      }

      const emoji = hasBingo ? "\uD83C\uDF89" : "\uD83D\uDC4F";
      const icon = this.add.text(cx, 40, emoji, { fontSize: "44px" }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: icon, scaleX: 1, scaleY: 1, duration: 500, ease: "Back.easeOut" });
      if (hasBingo) {
        this.emitParticles(cx - 30, 50, GAME_COLORS.orange);
        this.emitParticles(cx + 30, 50, GAME_COLORS.amber);
      }

      this.add.text(cx, 90, hasBingo ? "BINGO!" : (this.isEn ? "Game Over" : "Fin del juego"), {
        fontSize: "20px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.orange),
      }).setOrigin(0.5);
      this.add.text(cx, 115, `${this.claimedCount}/${TOTAL_CELLS} ${this.isEn ? "cells claimed" : "celdas reclamadas"}`, {
        fontSize: "12px", fontFamily: "system-ui, sans-serif", color: hexColor(GAME_COLORS.slate500),
      }).setOrigin(0.5);
      this.add.text(cx, 145, `+${finalXP} XP`, {
        fontSize: "20px", fontFamily: "system-ui, sans-serif", fontStyle: "bold", color: hexColor(GAME_COLORS.violet),
      }).setOrigin(0.5);
      this.createBtn(cx, 210, this.isEn ? "Play Again" : "Jugar de nuevo", GAME_COLORS.orange, () => this.startGame());
    }
  };
}

export const TaxBingo = memo(function TaxBingo({ lang }: { lang: Lang }) {
  const { addXP, recordGamePlayed, recordBingoWin } = useProgress();
  const refs = useRef({ addXP, recordGamePlayed, recordBingoWin });
  refs.current = { addXP, recordGamePlayed, recordBingoWin };

  const factory = useCallback((Phaser: typeof import("phaser")) => createBingoScene(Phaser), []);
  const sceneData = useMemo(() => ({
    lang,
    callbacks: {
      onXP: (xp: number) => refs.current.addXP(xp),
      onGamePlayed: () => refs.current.recordGamePlayed("tax_bingo"),
      onBingoWin: () => refs.current.recordBingoWin(),
    },
  }), [lang]);

  return (
    <div className="flex flex-col p-2" style={{ minHeight: 260 }}>
      <PhaserGame sceneFactory={factory} sceneData={sceneData} width={400} height={260} className="w-full" />
    </div>
  );
});
