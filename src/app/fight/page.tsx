"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { VelocityButton } from "@/components/ui/VelocityButton";
import { ARENAS } from "@/game/data/arenas";
import { FIGHTING_STYLES } from "@/game/data/fightingStyles";
import { useFightStore } from "@/game/store/fightStore";
import type { AIPersonality, GameMode } from "@/game/types";

const MODES: { id: GameMode; label: string; desc: string; playable: boolean }[] = [
  { id: "story", label: "Story Mode", desc: "Cinematic underground rise to champion.", playable: false },
  { id: "tournament", label: "Tournament", desc: "Bracket elimination across global arenas.", playable: false },
  { id: "ranked", label: "Ranked Online", desc: "Dedicated servers, ELO, anti-cheat.", playable: false },
  { id: "local-vs", label: "Local Versus", desc: "Same-screen competitive.", playable: false },
  { id: "survival", label: "Survival", desc: "Endless escalating opponents.", playable: false },
  { id: "training", label: "Training", desc: "Frame analysis and move lab.", playable: true },
  { id: "underground", label: "Underground", desc: "Illegal street fight circuit.", playable: true },
  { id: "championship", label: "Championship", desc: "Broadcast arena title fight.", playable: true },
];

const AI_TYPES: AIPersonality[] = ["aggressive", "defensive", "tactical", "counter"];

export default function FightHubPage() {
  const settings = useFightStore((s) => s.settings);
  const setMode = useFightStore((s) => s.setMode);
  const setArena = useFightStore((s) => s.setArena);
  const setAIPersonality = useFightStore((s) => s.setAIPersonality);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bebas text-2xl tracking-widest text-white/60 hover:text-white">
          ← Velocity
        </Link>
        <span className="font-bebas text-velocity-blue tracking-[0.4em] text-sm">
          COMBAT
        </span>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-bebas text-6xl md:text-8xl leading-none tracking-tighter mb-4">
            <span className="text-white">VELOCITY</span>{" "}
            <span className="text-gradient">COMBAT</span>
          </h1>
          <p className="text-white/50 max-w-2xl mb-12 font-light">
            Next-generation realistic fighting — cinematic martial arts, brutal physics,
            and adaptive AI. This vertical slice runs in your browser; full UE5 production
            is documented in the design bible.
          </p>
        </motion.div>

        <section className="mb-12">
          <h2 className="font-bebas text-2xl tracking-widest text-velocity-blue mb-4">
            Game Modes
          </h2>
          <motion.div className="grid sm:grid-cols-2 gap-3">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                disabled={!mode.playable}
                onClick={() => mode.playable && setMode(mode.id)}
                className={`glass p-4 text-left transition-all ${
                  settings.mode === mode.id
                    ? "border-velocity-blue/50 neon-glow-blue"
                    : "opacity-80 hover:opacity-100"
                } ${!mode.playable ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <p className="font-bebas text-xl">{mode.label}</p>
                <p className="text-xs text-white/40 mt-1">{mode.desc}</p>
                {!mode.playable && (
                  <span className="text-[10px] uppercase text-velocity-lime mt-2 inline-block">
                    UE5 Roadmap
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </section>

        <section className="mb-12">
          <h2 className="font-bebas text-2xl tracking-widest text-velocity-blue mb-4">
            Arena
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {ARENAS.map((arena) => (
              <button
                key={arena.id}
                type="button"
                onClick={() => setArena(arena.id)}
                className={`glass p-3 text-left text-sm ${
                  settings.arenaId === arena.id ? "border-velocity-lime/40" : ""
                }`}
              >
                <p className="font-bebas text-lg">{arena.name}</p>
                <p className="text-[10px] text-white/35 line-clamp-2">{arena.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-bebas text-2xl tracking-widest text-velocity-blue mb-4">
            AI Personality
          </h2>
          <motion.div className="flex flex-wrap gap-2">
            {AI_TYPES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAIPersonality(p)}
                className={`px-4 py-2 font-bebas tracking-widest uppercase text-sm border ${
                  settings.aiPersonality === p
                    ? "bg-velocity-blue text-black border-velocity-blue"
                    : "border-white/20 text-white/60"
                }`}
              >
                {p}
              </button>
            ))}
          </motion.div>
        </section>

        <section className="mb-12">
          <h2 className="font-bebas text-2xl tracking-widest text-velocity-blue mb-4">
            Fighting Styles
          </h2>
          <p className="text-sm text-white/40 mb-4">
            Customize your fighter on the creator screen. Eight mo-cap styles with unique
            damage profiles.
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(FIGHTING_STYLES).map(([id, s]) => (
              <span
                key={id}
                className="px-3 py-1 text-xs border border-white/10 text-white/50 uppercase tracking-wider"
              >
                {s.label}
              </span>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/fight/customize">
            <VelocityButton variant="outline" size="lg" neon={false} className="w-full sm:w-auto">
              Character Creator
            </VelocityButton>
          </Link>
          <Link href="/fight/play">
            <VelocityButton variant="primary" size="lg" className="w-full sm:w-auto">
              Enter Arena
            </VelocityButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
