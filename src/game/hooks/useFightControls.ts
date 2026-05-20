"use client";

import { useEffect } from "react";
import { MOVES } from "../data/moves";
import type { MoveId } from "../types";
import { useFightStore } from "../store/fightStore";

const KEY_TO_MOVE: Record<string, MoveId> = {
  j: "jab",
  k: "cross",
  l: "hook",
  u: "uppercut",
  i: "lowKick",
  o: "highKick",
  m: "knee",
  n: "elbow",
  g: "takedown",
  h: "groundStrike",
  e: "finisher",
};

export function useFightControls() {
  const playerInput = useFightStore((s) => s.playerInput);
  const twoPlayer = useFightStore((s) => s.settings.twoPlayer);

  useEffect(() => {
    const keys = new Set<string>();
    let blockHeld = false;

    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.add(k);

      if (k === "shift") {
        blockHeld = true;
        playerInput({ type: "block", held: true });
        return;
      }
      if (k === " ") {
        e.preventDefault();
        playerInput({ type: "dodge" });
        return;
      }
      if (KEY_TO_MOVE[k]) {
        playerInput({ type: "attack", move: KEY_TO_MOVE[k] });
      }
      if (k === "e") playerInput({ type: "finisher" });
    };

    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.delete(k);
      if (k === "shift" && blockHeld) {
        blockHeld = false;
        playerInput({ type: "block", held: false });
      }
    };

    let raf = 0;
    const loop = () => {
      let x = 0;
      let z = 0;
      if (keys.has("w")) z -= 1;
      if (keys.has("s")) z += 1;
      if (keys.has("a")) x -= 1;
      if (keys.has("d")) x += 1;
      if (x !== 0 || z !== 0) {
        const len = Math.hypot(x, z) || 1;
        playerInput({ type: "move", x: x / len, z: z / len });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [playerInput, twoPlayer]);
}
