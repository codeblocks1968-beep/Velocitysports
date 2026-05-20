export type FightingStyle =
  | "boxing"
  | "mma"
  | "muay-thai"
  | "karate"
  | "taekwondo"
  | "wrestling"
  | "kung-fu"
  | "jiu-jitsu";

export type AIPersonality = "aggressive" | "defensive" | "tactical" | "counter";

export type GameMode =
  | "story"
  | "tournament"
  | "ranked"
  | "local-vs"
  | "survival"
  | "training"
  | "underground"
  | "championship";

export type BodyPart = "head" | "torso" | "leftArm" | "rightArm" | "leftLeg" | "rightLeg";

export type FighterState =
  | "idle"
  | "walk"
  | "attack"
  | "block"
  | "dodge"
  | "hitstun"
  | "knockdown"
  | "ground"
  | "grapple"
  | "finisher"
  | "ko";

export type MoveId =
  | "jab"
  | "cross"
  | "hook"
  | "uppercut"
  | "lowKick"
  | "highKick"
  | "knee"
  | "elbow"
  | "takedown"
  | "groundStrike"
  | "finisher";

export interface LimbInjury {
  severity: number; // 0-1
  bruise: number;
  cut: number;
  swelling: number;
}

export interface FighterConfig {
  id: string;
  name: string;
  style: FightingStyle;
  weightClass: "light" | "middle" | "heavy";
  skinTone: string;
  hairColor: string;
  outfitPrimary: string;
  outfitSecondary: string;
  tattooAccent: string;
  voicePitch: number;
}

export interface FighterRuntime {
  config: FighterConfig;
  position: [number, number, number];
  rotation: number;
  velocity: [number, number, number];
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  state: FighterState;
  stateTimer: number;
  currentMove: MoveId | null;
  movePhase: "startup" | "active" | "recovery" | null;
  blockHeld: boolean;
  injuries: Record<BodyPart, LimbInjury>;
  combo: number;
  wins: number;
  isPlayer: boolean;
  aiPersonality?: AIPersonality;
  dirtLevel: number;
  sweatLevel: number;
}

export interface ArenaConfig {
  id: string;
  name: string;
  description: string;
  floorColor: string;
  accentColor: string;
  fogColor: string;
  fogDensity: number;
  ambientIntensity: number;
  sunColor: string;
  sunIntensity: number;
  weather: "clear" | "rain" | "fog" | "neon-night";
  crowdDensity: number;
  destructible: boolean;
  timeOfDay: "day" | "dusk" | "night";
}

export interface FightSettings {
  mode: GameMode;
  arenaId: string;
  rounds: number;
  roundTime: number;
  player1: FighterConfig;
  player2: FighterConfig;
  aiPersonality: AIPersonality;
  twoPlayer: boolean;
}

export interface CinematicState {
  slowMo: number;
  slowMoTimer: number;
  cameraMode: "combat" | "finisher" | "replay" | "broadcast";
  shakeIntensity: number;
  finisherActive: boolean;
}

export interface FightMeta {
  round: number;
  timeRemaining: number;
  crowdHype: number;
  pressure: number;
  winner: "p1" | "p2" | null;
  paused: boolean;
  showFrameAnalysis: boolean;
}
