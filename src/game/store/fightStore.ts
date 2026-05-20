import { create } from "zustand";
import { getArena } from "../data/arenas";
import { DEFAULT_FIGHTER } from "../data/fightingStyles";
import {
  createFighterRuntime,
  resolveHit,
  applyHitToDefender,
  tickMovePhase,
  startMove,
  canFinisher,
  canAct,
  movementSpeedMod,
} from "../systems/combat";
import { AdaptiveAI } from "../systems/ai";
import { MOVES } from "../data/moves";
import type {
  AIPersonality,
  CinematicState,
  FightMeta,
  FightSettings,
  FighterConfig,
  FighterRuntime,
  GameMode,
  MoveId,
} from "../types";

function defaultConfig(overrides?: Partial<FighterConfig>): FighterConfig {
  return {
    id: "fighter",
    name: DEFAULT_FIGHTER.name,
    style: DEFAULT_FIGHTER.style,
    weightClass: DEFAULT_FIGHTER.weightClass,
    skinTone: DEFAULT_FIGHTER.skinTone,
    hairColor: DEFAULT_FIGHTER.hairColor,
    outfitPrimary: DEFAULT_FIGHTER.outfitPrimary,
    outfitSecondary: DEFAULT_FIGHTER.outfitSecondary,
    tattooAccent: DEFAULT_FIGHTER.tattooAccent,
    voicePitch: DEFAULT_FIGHTER.voicePitch,
    ...overrides,
  };
}

interface FightStore {
  settings: FightSettings;
  p1: FighterRuntime;
  p2: FighterRuntime;
  meta: FightMeta;
  cinematic: CinematicState;
  ai: AdaptiveAI | null;
  lastHitFlash: number;
  impactEvents: { x: number; y: number; z: number; intensity: number; id: number }[];
  playerHistory: MoveId[];

  setMode: (mode: GameMode) => void;
  setArena: (arenaId: string) => void;
  setAIPersonality: (p: AIPersonality) => void;
  updatePlayerConfig: (partial: Partial<FighterConfig>) => void;
  initFight: () => void;
  tick: (dt: number) => void;
  playerInput: (action: PlayerInput) => void;
  resetRound: () => void;
}

export type PlayerInput =
  | { type: "move"; x: number; z: number }
  | { type: "attack"; move: MoveId }
  | { type: "block"; held: boolean }
  | { type: "dodge" }
  | { type: "finisher" };

let impactId = 0;

export const useFightStore = create<FightStore>((set, get) => ({
  settings: {
    mode: "training",
    arenaId: "stadium",
    rounds: 3,
    roundTime: 180,
    player1: defaultConfig({ id: "p1", name: "You" }),
    player2: defaultConfig({
      id: "p2",
      name: "Rival",
      outfitSecondary: "#ff4400",
      style: "muay-thai",
    }),
    aiPersonality: "tactical",
    twoPlayer: false,
  },
  p1: createFighterRuntime(defaultConfig({ id: "p1", name: "You" }), true, -1.8, 0),
  p2: createFighterRuntime(
    defaultConfig({ id: "p2", name: "Rival", style: "muay-thai" }),
    false,
    1.8,
    Math.PI
  ),
  meta: {
    round: 1,
    timeRemaining: 180,
    crowdHype: 0.3,
    pressure: 0,
    winner: null,
    paused: false,
    showFrameAnalysis: false,
  },
  cinematic: {
    slowMo: 1,
    slowMoTimer: 0,
    cameraMode: "combat",
    shakeIntensity: 0,
    finisherActive: false,
  },
  ai: null,
  lastHitFlash: 0,
  impactEvents: [],
  playerHistory: [],

  setMode: (mode) =>
    set((s) => ({
      settings: { ...s.settings, mode },
      meta: {
        ...s.meta,
        showFrameAnalysis: mode === "training",
      },
    })),

  setArena: (arenaId) =>
    set((s) => ({ settings: { ...s.settings, arenaId } })),

  setAIPersonality: (aiPersonality) =>
    set((s) => ({ settings: { ...s.settings, aiPersonality } })),

  updatePlayerConfig: (partial) =>
    set((s) => ({
      settings: {
        ...s.settings,
        player1: { ...s.settings.player1, ...partial },
      },
    })),

  initFight: () => {
    const { settings } = get();
    const arena = getArena(settings.arenaId);
    set({
      p1: createFighterRuntime(settings.player1, true, -1.8, 0),
      p2: createFighterRuntime(settings.player2, false, 1.8, Math.PI),
      meta: {
        round: 1,
        timeRemaining: settings.roundTime,
        crowdHype: arena.crowdDensity * 0.4,
        pressure: 0,
        winner: null,
        paused: false,
        showFrameAnalysis: settings.mode === "training",
      },
      cinematic: {
        slowMo: 1,
        slowMoTimer: 0,
        cameraMode: "combat",
        shakeIntensity: 0,
        finisherActive: false,
      },
      ai: settings.twoPlayer ? null : new AdaptiveAI(settings.aiPersonality),
      impactEvents: [],
      playerHistory: [],
    });
  },

  resetRound: () => {
    const { settings } = get();
    set({
      p1: createFighterRuntime(settings.player1, true, -1.8, 0),
      p2: createFighterRuntime(settings.player2, false, 1.8, Math.PI),
      meta: {
        ...get().meta,
        timeRemaining: settings.roundTime,
        winner: null,
      },
    });
  },

  playerInput: (action) => {
    const state = get();
    if (state.meta.winner || state.meta.paused) return;
    const p1 = { ...state.p1, position: [...state.p1.position] as [number, number, number], velocity: [...state.p1.velocity] as [number, number, number], injuries: { ...state.p1.injuries } };
    const p2 = { ...state.p2, position: [...state.p2.position] as [number, number, number], velocity: [...state.p2.velocity] as [number, number, number], injuries: { ...state.p2.injuries } };

    applyPlayerAction(p1, p2, action, state);
    set({ p1, p2 });
  },

  tick: (dt) => {
    const state = get();
    if (state.meta.paused || state.meta.winner) return;

    const slow = state.cinematic.slowMo;
    const scaledDt = dt * slow;

    const p1 = cloneFighter(state.p1);
    const p2 = cloneFighter(state.p2);
    let cinematic = { ...state.cinematic };
    let meta = { ...state.meta };
    let impactEvents = [...state.impactEvents];
    let lastHitFlash = state.lastHitFlash;
    const playerHistory = [...state.playerHistory];

    meta.timeRemaining = Math.max(0, meta.timeRemaining - scaledDt);
    meta.crowdHype = Math.min(1, meta.crowdHype + scaledDt * 0.02);
    meta.pressure = Math.min(1, meta.pressure + scaledDt * 0.008);

    regenStamina(p1, scaledDt);
    regenStamina(p2, scaledDt);

    if (state.ai) {
      const action = state.ai.decide(p2, p1);
      if (action) applyPlayerAction(p2, p1, action, state);
    }

    processFighterTick(p1, p2, scaledDt, (result, moveId, attacker, defender) => {
      if (result.cinematic) {
        cinematic.slowMo = 0.25;
        cinematic.slowMoTimer = 0.6;
        cinematic.shakeIntensity = 0.4;
      }
      if (moveId === "finisher") {
        cinematic.finisherActive = true;
        cinematic.cameraMode = "finisher";
        cinematic.slowMo = 0.15;
        cinematic.slowMoTimer = 1.2;
      }
      impactEvents.push({
        x: defender.position[0],
        y: 1.4,
        z: defender.position[2],
        intensity: result.damage / 20,
        id: impactId++,
      });
      lastHitFlash = 0.15;
      meta.crowdHype = Math.min(1, meta.crowdHype + 0.08);
    });

    processFighterTick(p2, p1, scaledDt, (result, moveId) => {
      if (result.cinematic) {
        cinematic.slowMo = 0.25;
        cinematic.slowMoTimer = 0.6;
        cinematic.shakeIntensity = 0.4;
      }
      if (moveId === "finisher") {
        cinematic.finisherActive = true;
        cinematic.cameraMode = "finisher";
      }
      impactEvents.push({
        x: p1.position[0],
        y: 1.4,
        z: p1.position[2],
        intensity: result.damage / 20,
        id: impactId++,
      });
      lastHitFlash = 0.15;
    });

    applyPhysics(p1, scaledDt);
    applyPhysics(p2, scaledDt);
    clampArena(p1);
    clampArena(p2);

    if (cinematic.slowMoTimer > 0) {
      cinematic.slowMoTimer -= dt;
      if (cinematic.slowMoTimer <= 0) {
        cinematic.slowMo = 1;
        cinematic.finisherActive = false;
        cinematic.cameraMode = "combat";
      }
    }
    if (cinematic.shakeIntensity > 0) {
      cinematic.shakeIntensity = Math.max(0, cinematic.shakeIntensity - dt * 1.5);
    }
    if (lastHitFlash > 0) lastHitFlash -= dt;

    if (p1.state === "ko") meta.winner = "p2";
    else if (p2.state === "ko") meta.winner = "p1";
    else if (meta.timeRemaining <= 0) {
      meta.winner = p1.health >= p2.health ? "p1" : "p2";
    }

    set({
      p1,
      p2,
      meta,
      cinematic,
      impactEvents: impactEvents.slice(-8),
      lastHitFlash,
      playerHistory,
    });
  },
}));

function cloneFighter(f: FighterRuntime): FighterRuntime {
  return {
    ...f,
    position: [...f.position] as [number, number, number],
    velocity: [...f.velocity] as [number, number, number],
    injuries: JSON.parse(JSON.stringify(f.injuries)),
  };
}

function applyPlayerAction(
  self: FighterRuntime,
  opponent: FighterRuntime,
  action: PlayerInput,
  state: ReturnType<typeof useFightStore.getState>
) {
  switch (action.type) {
    case "move": {
      if (!["idle", "walk"].includes(self.state)) break;
      const speed = 2.8 * movementSpeedMod(self);
      self.velocity[0] += action.x * speed;
      self.velocity[2] += action.z * speed;
      self.state = "walk";
      break;
    }
    case "attack":
      if (startMove(self, action.move)) {
        if (self.isPlayer) {
          state.playerHistory.push(action.move);
          state.ai?.recordPlayerMove(action.move);
        }
      }
      break;
    case "block":
      self.blockHeld = action.held;
      if (action.held && canAct(self)) self.state = "block";
      else if (self.state === "block") self.state = "idle";
      break;
    case "dodge":
      if (self.stamina >= 8 && canAct(self)) {
        self.stamina -= 8;
        self.state = "dodge";
        self.stateTimer = 0.35;
      }
      break;
    case "finisher":
      if (canFinisher(self, opponent) && startMove(self, "finisher")) {
        /* cinematic handled on hit */
      }
      break;
  }
}

function regenStamina(f: FighterRuntime, dt: number) {
  if (f.state === "ko") return;
  const regen = f.state === "idle" || f.state === "walk" ? 12 : 6;
  f.stamina = Math.min(f.maxStamina, f.stamina + regen * dt);
}

function processFighterTick(
  self: FighterRuntime,
  opponent: FighterRuntime,
  dt: number,
  onHit: (
    result: ReturnType<typeof resolveHit>,
    moveId: MoveId,
    attacker: FighterRuntime,
    defender: FighterRuntime
  ) => void
) {
  if (self.state === "hitstun" || self.state === "knockdown") {
    self.stateTimer -= dt;
    if (self.stateTimer <= 0) {
      self.state = self.state === "knockdown" ? "ground" : "idle";
    }
  }
  if (self.state === "dodge") {
    self.stateTimer -= dt;
    if (self.stateTimer <= 0) self.state = "idle";
  }

  const phase = tickMovePhase(self, dt);
  if (phase === "hit" && self.currentMove) {
    const result = resolveHit(self, opponent, self.currentMove);
    if (result.hit) {
      applyHitToDefender(opponent, self, result, self.currentMove);
      onHit(result, self.currentMove, self, opponent);
    } else {
      self.combo = 0;
    }
  }
}

function applyPhysics(f: FighterRuntime, dt: number) {
  f.position[0] += f.velocity[0] * dt * 60;
  f.position[2] += f.velocity[2] * dt * 60;
  f.velocity[0] *= 0.88;
  f.velocity[2] *= 0.88;
}

function clampArena(f: FighterRuntime) {
  const limit = 5.5;
  f.position[0] = Math.max(-limit, Math.min(limit, f.position[0]));
  f.position[2] = Math.max(-limit, Math.min(limit, f.position[2]));
}
