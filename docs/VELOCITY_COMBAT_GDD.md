# VELOCITY COMBAT — Game Design Document

## Vision

A next-generation realistic fighting game combining MMA simulation, cinematic martial-arts presentation, and competitive esports systems. Target platform: **Unreal Engine 5** (Nanite, Lumen, Chaos Physics, MetaHuman, Control Rig, Motion Matching).

This repository includes a **browser vertical slice** (`/fight`) demonstrating core combat loops. The full AAA production path is outlined below.

---

## Core Pillars

| Pillar | Implementation (UE5 Target) |
|--------|----------------------------|
| Ultra-realistic visuals | MetaHuman, ray-traced Lumen, material layering for skin/sweat/blood |
| Combat simulation | Physics-based hit reactions, weight classes, limb injuries |
| Cinematic presentation | Sequencer finishers, slow-mo, broadcast cameras |
| Depth | 8 mo-cap styles, ground game, stamina, psychological pressure |
| Competition | Dedicated servers, EAC, ranked seasons, cross-play |

---

## Combat System (UE5)

### Fighting Styles (Motion Capture)

- Boxing, MMA, Muay Thai, Karate, Taekwondo, Wrestling, Kung Fu, Jiu-Jitsu
- Per-style move lists, stance, footwork, and AI preference weights
- Procedural animation blending between mo-cap clips via **Motion Matching**

### Mechanics

- Footwork, dodge, block (damage reduction), grapple, takedown, ground-and-pound
- **Stamina** drains on exertion; regen when pacing
- **Injury model**: bruise, cut, swelling per body region → movement/ damage modifiers
- **Hit resolution**: range, startup/active/recovery frames, counter windows, weight class
- Context **finishers** when opponent health &lt; threshold
- Ragdoll blend on knockdown/KO via Chaos

### Damage Visualization

- Layered material parameters: `BruiseMask`, `CutMask`, `Swelling`, `Sweat`, `Dirt`
- Cloth tearing on heavy impacts (Chaos Cloth)

---

## Characters

- MetaHuman creator integration: face sculpt, skin, hair, tattoos
- Outfit slots: fight gear, walkout attire, accessories
- Personality traits → AI aggression, taunts, crowd interaction
- Progression: skill tree, perks, unlockable finishers

---

## AI

| Personality | Behavior |
|-------------|----------|
| Aggressive | Pressure, combos, low block rate |
| Defensive | Block, dodge, counter-punch windows |
| Tactical | Range control, stamina management |
| Counter | Reads player patterns (last N inputs) |

- Mid-fight strategy shifts based on health, crowd hype, round time
- Reaction timing scaled by difficulty

---

## Game Modes

| Mode | Status (Slice / UE5) |
|------|----------------------|
| Story | Roadmap / UE5 |
| Tournament | Roadmap |
| Ranked Online | Roadmap (EOS + dedicated) |
| Local VS | Roadmap |
| Survival | Roadmap |
| Training + frame data | **Playable (web)** |
| Underground / Championship | **Playable (web)** |

---

## Arenas (8)

Underground club, neon rooftop, stadium, dojo, urban street, warehouse, rain neon city, desert.

Each arena: crowd cards, weather, destructibles (Chaos), day/night, interactive props.

---

## Audio

- Wwise / MetaSounds: impacts, cloth, breathing, crowd layers
- Adaptive music: orchestral + electronic stems by round intensity
- Spatial audio (Steam Audio / UE5 Audio)

---

## Multiplayer (UE5)

- Dedicated Linux servers, rollback or input-delay netcode for fighters
- Easy Anti-Cheat, skill-based matchmaking, spectator + replay CDN
- Cross-play: PC, PS5, Xbox Series

---

## Technical Stack (Production)

```
Unreal Engine 5.4+
├── Rendering: Nanite environments, Lumen GI, ray tracing
├── Animation: Control Rig, Motion Matching, IK foot locking
├── Physics: Chaos rigid + cloth
├── Characters: MetaHuman + custom body morphs
├── Networking: Epic Online Services
└── Pipeline: Perforce, mo-cap studio, Houdini destruction
```

### Milestones

1. **Vertical slice** (1 arena, 2 fighters, 1 style) — 3 months
2. **Combat alpha** (all styles, injury, AI) — 6 months
3. **Multiplayer beta** — 9 months
4. **Content complete** — 18–24 months (team of 15–40)

---

## Web Vertical Slice (This Repo)

- **Route**: `/fight` → menu, `/fight/customize`, `/fight/play`
- **Stack**: Next.js, React Three Fiber, Rapier, post-processing bloom
- **Controls**: WASD, J/K/L/U strikes, I/O kicks, Shift block, Space dodge, E finisher

Use this slice for gameplay tuning before porting constants to UE5 DataTables.

---

## Inspiration Map

| Reference | Borrowed Element |
|-----------|------------------|
| UFC / EA Sports UFC | Grappling, damage, presentation |
| Fight Night | Impact feel, head movement |
| Sifu | Stance discipline, visual grit |
| Sleeping Dogs | Urban arenas, environmental storytelling |
| Mortal Kombat (non-fantasy) | Cinematic finishers, camera |
| Martial arts cinema | Pacing, emotional beats |

---

## Legal / Production Note

Full AAA scope requires licensed mo-cap, voice cast, ratings (ESRB/PEGI), and platform certification. Budget estimate for UE5 production: **$8M–$25M+** depending on scope and team geography.
