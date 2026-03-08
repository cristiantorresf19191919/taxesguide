"use client";

import { memo, useEffect, useRef } from "react";

type PhaserGameProps = {
  sceneFactory: (Phaser: typeof import("phaser")) => new () => any;
  sceneData?: Record<string, any>;
  width?: number;
  height?: number;
  className?: string;
};

export const PhaserGame = memo(function PhaserGame({ sceneFactory, sceneData, width = 400, height = 260, className }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let destroyed = false;

    import("phaser").then((Phaser) => {
      if (destroyed || !containerRef.current) return;

      const SceneClass = sceneFactory(Phaser);

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width,
        height,
        transparent: true,
        banner: false,
        scene: SceneClass,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
          expandParent: false,
        },
        input: {
          activePointers: 1,
        },
      });

      gameRef.current = game;

      // Pass data to scene once it's ready
      if (sceneData) {
        game.events.once("ready", () => {
          const scene = game.scene.scenes[0];
          if (scene && typeof (scene as any).receiveData === "function") {
            (scene as any).receiveData(sceneData);
          }
        });
      }
    });

    return () => {
      destroyed = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? "w-full h-full"}
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
});

/** Shared color palette for all Phaser games */
export const GAME_COLORS = {
  white: 0xffffff,
  slate900: 0x0f172a,
  slate700: 0x334155,
  slate500: 0x64748b,
  slate400: 0x94a3b8,
  slate200: 0xe2e8f0,
  emerald: 0x10b981,
  red: 0xef4444,
  amber: 0xf59e0b,
  violet: 0x8b5cf6,
  pink: 0xec4899,
  rose: 0xf43f5e,
  cyan: 0x06b6d4,
  teal: 0x14b8a6,
  indigo: 0x6366f1,
  orange: 0xf97316,
  blue: 0x3b82f6,
};

/** Convert hex number to css string */
export function hexColor(hex: number): string {
  return `#${hex.toString(16).padStart(6, "0")}`;
}
