import { FIGHTING_STYLES } from "../data/fightingStyles";
import { MOVES } from "../data/moves";
import type { AIPersonality, FighterRuntime, MoveId } from "../types";
import { canAct, canFinisher, distance2D, startMove } from "./combat";

export type AIAction =
  | { type: "move"; x: number; z: number }
  | { type: "attack"; move: MoveId }
  | { type: "block"; held: boolean }
  | { type: "dodge" }
  | { type: "finisher" };

const PERSONALITY_WEIGHTS: Record<
  AIPersonality,
  { attack: number; defend: number; dodge: number; advance: number }
> = {
  aggressive: { attack: 0.55, defend: 0.15, dodge: 0.12, advance: 0.7 },
  defensive: { attack: 0.25, defend: 0.45, dodge: 0.25, advance: 0.35 },
  tactical: { attack: 0.38, defend: 0.28, dodge: 0.22, advance: 0.5 },
  counter: { attack: 0.32, defend: 0.35, dodge: 0.3, advance: 0.4 },
};

export class AdaptiveAI {
  private playerPatterns: MoveId[] = [];
  private readonly maxPatterns = 12;

  constructor(private personality: AIPersonality) {}

  recordPlayerMove(move: MoveId) {
    this.playerPatterns.push(move);
    if (this.playerPatterns.length > this.maxPatterns) {
      this.playerPatterns.shift();
    }
  }

  private pickStyleMove(fighter: FighterRuntime): MoveId {
    const style = FIGHTING_STYLES[fighter.config.style];
    const preferred = style.preferredMoves.filter(
      (m) => m in MOVES
    ) as MoveId[];
    const pool = preferred.length ? preferred : (["jab", "cross", "lowKick"] as MoveId[]);

    const counterBias = this.personality === "counter" ? 0.35 : 0;
    if (Math.random() < counterBias && this.playerPatterns.length > 2) {
      const last = this.playerPatterns[this.playerPatterns.length - 1];
      if (last === "highKick" || last === "hook") return "cross";
      if (last === "jab") return "lowKick";
    }

    return pool[Math.floor(Math.random() * pool.length)];
  }

  decide(self: FighterRuntime, opponent: FighterRuntime): AIAction | null {
    if (self.state === "ko" || self.state === "knockdown") return null;

    const w = PERSONALITY_WEIGHTS[this.personality];
    const dist = distance2D(self, opponent);
    const r = Math.random();

    if (canFinisher(self, opponent) && r < 0.85) {
      return { type: "finisher" };
    }

    if (opponent.state === "attack" && opponent.movePhase === "active") {
      if (r < w.defend) return { type: "block", held: true };
      if (r < w.defend + w.dodge) return { type: "dodge" };
    }

    if (self.blockHeld && dist > 1.8) {
      return { type: "block", held: false };
    }

    if (dist > 2.2 && r < w.advance) {
      const angle = Math.atan2(
        opponent.position[0] - self.position[0],
        opponent.position[2] - self.position[2]
      );
      return {
        type: "move",
        x: Math.sin(angle) * 0.08,
        z: Math.cos(angle) * 0.08,
      };
    }

    if (dist < 1.6 && r < w.attack && canAct(self)) {
      const move = this.pickStyleMove(self);
      if (startMove(self, move)) {
        return { type: "attack", move };
      }
    }

    if (dist < 2.5 && dist > 1.7 && r < w.dodge * 0.5) {
      return { type: "dodge" };
    }

    if (dist > 1.5 && r < 0.25) {
      return {
        type: "move",
        x: (Math.random() - 0.5) * 0.06,
        z: (Math.random() - 0.5) * 0.06,
      };
    }

    return null;
  }
}
