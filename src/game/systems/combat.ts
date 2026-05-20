import { FIGHTING_STYLES } from "../data/fightingStyles";
import { MOVES } from "../data/moves";
import type {
  BodyPart,
  FighterRuntime,
  LimbInjury,
  MoveId,
} from "../types";

const WEIGHT_MULT = { light: 0.92, middle: 1, heavy: 1.12 };

function emptyInjury(): LimbInjury {
  return { severity: 0, bruise: 0, cut: 0, swelling: 0 };
}

export function createInjuries(): Record<BodyPart, LimbInjury> {
  return {
    head: emptyInjury(),
    torso: emptyInjury(),
    leftArm: emptyInjury(),
    rightArm: emptyInjury(),
    leftLeg: emptyInjury(),
    rightLeg: emptyInjury(),
  };
}

export function createFighterRuntime(
  config: FighterRuntime["config"],
  isPlayer: boolean,
  startX: number,
  facing: number
): FighterRuntime {
  return {
    config,
    position: [startX, 0, 0],
    rotation: facing,
    velocity: [0, 0, 0],
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    state: "idle",
    stateTimer: 0,
    currentMove: null,
    movePhase: null,
    blockHeld: false,
    injuries: createInjuries(),
    combo: 0,
    wins: 0,
    isPlayer,
    dirtLevel: 0,
    sweatLevel: 0,
  };
}

export function distance2D(a: FighterRuntime, b: FighterRuntime): number {
  const dx = a.position[0] - b.position[0];
  const dz = a.position[2] - b.position[2];
  return Math.sqrt(dx * dx + dz * dz);
}

export function facingTarget(from: FighterRuntime, to: FighterRuntime): number {
  return Math.atan2(to.position[0] - from.position[0], to.position[2] - from.position[2]);
}

export function canAct(fighter: FighterRuntime): boolean {
  return ["idle", "walk"].includes(fighter.state);
}

export function canFinisher(attacker: FighterRuntime, defender: FighterRuntime): boolean {
  return (
    defender.health <= 22 &&
    attacker.stamina >= 20 &&
    distance2D(attacker, defender) <= MOVES.finisher.range &&
    canAct(attacker)
  );
}

export function limbPowerMod(fighter: FighterRuntime, part: BodyPart): number {
  const inj = fighter.injuries[part];
  return Math.max(0.45, 1 - inj.severity * 0.55);
}

export function movementSpeedMod(fighter: FighterRuntime): number {
  const leg =
    (fighter.injuries.leftLeg.severity + fighter.injuries.rightLeg.severity) / 2;
  const stamina = fighter.stamina / fighter.maxStamina;
  return (0.55 + stamina * 0.45) * (1 - leg * 0.35);
}

function applyInjury(fighter: FighterRuntime, zone: BodyPart, force: number) {
  const inj = fighter.injuries[zone];
  inj.bruise = Math.min(1, inj.bruise + force * 0.04);
  inj.swelling = Math.min(1, inj.swelling + force * 0.025);
  if (force > 14) inj.cut = Math.min(1, inj.cut + force * 0.02);
  inj.severity = Math.min(1, inj.bruise * 0.5 + inj.cut * 0.35 + inj.swelling * 0.3);
}

export function computeDamage(
  attacker: FighterRuntime,
  defender: FighterRuntime,
  moveId: MoveId,
  counterBonus: number
): number {
  const move = MOVES[moveId];
  const style = FIGHTING_STYLES[attacker.config.style];
  const weight = WEIGHT_MULT[attacker.config.weightClass];

  let mult = style.strikeMult;
  if (move.isKick) mult = style.kickMult;
  if (move.isGrapple) mult = style.grappleMult;

  const limb = limbPowerMod(attacker, move.hitZone === "head" ? "rightArm" : "rightLeg");
  const defense = defender.blockHeld ? style.defenseMult * 0.35 : 1;
  const injDef = 1 - defender.injuries[move.hitZone].severity * 0.2;

  let dmg =
    move.baseDamage *
    mult *
    weight *
    limb *
    defense *
    injDef *
    (1 + counterBonus) *
    (0.85 + attacker.stamina / attacker.maxStamina * 0.15);

  if (defender.state === "dodge") dmg *= 0.2;
  return Math.round(dmg * 10) / 10;
}

export interface HitResult {
  hit: boolean;
  damage: number;
  counter: boolean;
  cinematic: boolean;
  knockdown: boolean;
}

export function resolveHit(
  attacker: FighterRuntime,
  defender: FighterRuntime,
  moveId: MoveId
): HitResult {
  const move = MOVES[moveId];
  const dist = distance2D(attacker, defender);

  if (dist > move.range) {
    return { hit: false, damage: 0, counter: false, cinematic: false, knockdown: false };
  }

  const counter =
    defender.state === "attack" &&
    defender.movePhase === "startup" &&
    attacker.movePhase === "active";

  const damage = computeDamage(attacker, defender, moveId, counter ? 0.35 : 0);
  const cinematic = damage >= move.cinematicThreshold && move.cinematicThreshold > 0;

  applyInjury(defender, move.hitZone, damage);
  defender.sweatLevel = Math.min(1, defender.sweatLevel + 0.03);
  defender.dirtLevel = Math.min(1, defender.dirtLevel + 0.01);
  attacker.sweatLevel = Math.min(1, attacker.sweatLevel + 0.02);

  const knockdown =
    damage >= 22 ||
    (moveId === "takedown" && !defender.blockHeld) ||
    defender.health - damage <= 0;

  return { hit: true, damage, counter, cinematic, knockdown };
}

export function startMove(fighter: FighterRuntime, moveId: MoveId): boolean {
  if (!canAct(fighter)) return false;
  if (moveId === "groundStrike" && fighter.state !== "ground") return false;
  if (moveId === "finisher") return false;

  const move = MOVES[moveId];
  const style = FIGHTING_STYLES[fighter.config.style];
  const cost = move.staminaCost * style.staminaCostMult;

  if (fighter.stamina < cost) return false;

  fighter.stamina -= cost;
  fighter.state = "attack";
  fighter.currentMove = moveId;
  fighter.movePhase = "startup";
  fighter.stateTimer = move.startup;
  return true;
}

export function tickMovePhase(fighter: FighterRuntime, dt: number): "hit" | null {
  if (fighter.state !== "attack" || !fighter.currentMove) return null;

  const move = MOVES[fighter.currentMove];
  fighter.stateTimer -= dt;

  if (fighter.movePhase === "startup" && fighter.stateTimer <= 0) {
    fighter.movePhase = "active";
    fighter.stateTimer = move.active;
    return "hit";
  }
  if (fighter.movePhase === "active" && fighter.stateTimer <= 0) {
    fighter.movePhase = "recovery";
    fighter.stateTimer = move.recovery;
    return null;
  }
  if (fighter.movePhase === "recovery" && fighter.stateTimer <= 0) {
    fighter.state = "idle";
    fighter.currentMove = null;
    fighter.movePhase = null;
    fighter.stateTimer = 0;
  }
  return null;
}

export function applyHitToDefender(
  defender: FighterRuntime,
  attacker: FighterRuntime,
  result: HitResult,
  moveId: MoveId
) {
  if (!result.hit) return;

  const move = MOVES[moveId];
  defender.health = Math.max(0, defender.health - result.damage);
  attacker.combo += 1;

  const kb = move.knockback * (attacker.config.weightClass === "heavy" ? 1.15 : 1);
  const angle = facingTarget(attacker, defender);
  defender.velocity[0] += Math.sin(angle) * kb;
  defender.velocity[2] += Math.cos(angle) * kb;

  if (defender.health <= 0) {
    defender.state = "ko";
  } else if (result.knockdown) {
    defender.state = "knockdown";
    defender.stateTimer = 2.2;
  } else {
    defender.state = "hitstun";
    defender.stateTimer = 0.35 + result.damage * 0.01;
  }
}
