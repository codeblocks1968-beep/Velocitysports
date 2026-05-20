import type { FightingStyle } from "../types";

export interface StyleProfile {
  label: string;
  strikeMult: number;
  kickMult: number;
  grappleMult: number;
  defenseMult: number;
  staminaCostMult: number;
  moveSpeedMult: number;
  preferredMoves: string[];
}

export const FIGHTING_STYLES: Record<FightingStyle, StyleProfile> = {
  boxing: {
    label: "Boxing",
    strikeMult: 1.25,
    kickMult: 0.6,
    grappleMult: 0.5,
    defenseMult: 1.1,
    staminaCostMult: 0.9,
    moveSpeedMult: 1.15,
    preferredMoves: ["jab", "cross", "hook", "uppercut"],
  },
  mma: {
    label: "MMA",
    strikeMult: 1.05,
    kickMult: 1.05,
    grappleMult: 1.2,
    defenseMult: 1,
    staminaCostMult: 1,
    moveSpeedMult: 1,
    preferredMoves: ["jab", "lowKick", "takedown", "groundStrike"],
  },
  "muay-thai": {
    label: "Muay Thai",
    strikeMult: 1.1,
    kickMult: 1.3,
    grappleMult: 0.9,
    defenseMult: 0.95,
    staminaCostMult: 1.05,
    moveSpeedMult: 0.98,
    preferredMoves: ["lowKick", "highKick", "knee", "elbow"],
  },
  karate: {
    label: "Karate",
    strikeMult: 1.15,
    kickMult: 1.15,
    grappleMult: 0.6,
    defenseMult: 1.05,
    staminaCostMult: 0.95,
    moveSpeedMult: 1.1,
    preferredMoves: ["cross", "highKick", "hook"],
  },
  taekwondo: {
    label: "Taekwondo",
    strikeMult: 0.9,
    kickMult: 1.4,
    grappleMult: 0.4,
    defenseMult: 0.9,
    staminaCostMult: 1.1,
    moveSpeedMult: 1.2,
    preferredMoves: ["highKick", "lowKick", "cross"],
  },
  wrestling: {
    label: "Wrestling",
    strikeMult: 0.85,
    kickMult: 0.5,
    grappleMult: 1.45,
    defenseMult: 1.15,
    staminaCostMult: 1.05,
    moveSpeedMult: 0.92,
    preferredMoves: ["takedown", "groundStrike", "hook"],
  },
  "kung-fu": {
    label: "Kung Fu",
    strikeMult: 1.08,
    kickMult: 1.12,
    grappleMult: 0.75,
    defenseMult: 1.08,
    staminaCostMult: 0.92,
    moveSpeedMult: 1.12,
    preferredMoves: ["hook", "highKick", "elbow", "jab"],
  },
  "jiu-jitsu": {
    label: "Jiu-Jitsu",
    strikeMult: 0.75,
    kickMult: 0.45,
    grappleMult: 1.5,
    defenseMult: 1.2,
    staminaCostMult: 0.98,
    moveSpeedMult: 0.9,
    preferredMoves: ["takedown", "groundStrike", "grapple"],
  },
};

export const DEFAULT_FIGHTER = {
  name: "Fighter",
  style: "mma" as FightingStyle,
  weightClass: "middle" as const,
  skinTone: "#c68642",
  hairColor: "#1a1208",
  outfitPrimary: "#111111",
  outfitSecondary: "#00f2ff",
  tattooAccent: "#ccff00",
  voicePitch: 1,
};
