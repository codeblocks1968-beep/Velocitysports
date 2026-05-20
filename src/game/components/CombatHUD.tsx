"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useFightStore } from "../store/fightStore";
import { MOVES } from "../data/moves";
import { FIGHTING_STYLES } from "../data/fightingStyles";

export function CombatHUD() {
  const p1 = useFightStore((s) => s.p1);
  const p2 = useFightStore((s) => s.p2);
  const meta = useFightStore((s) => s.meta);
  const cinematic = useFightStore((s) => s.cinematic);
  const settings = useFightStore((s) => s.settings);
  const lastHit = useFightStore((s) => s.lastHitFlash);
  const resetRound = useFightStore((s) => s.resetRound);

  const minutes = Math.floor(meta.timeRemaining / 60);
  const seconds = Math.floor(meta.timeRemaining % 60)
    .toString()
    .padStart(2, "0");

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col p-4 md:p-6"
      animate={{ opacity: lastHit > 0 ? 0.85 : 1 }}
    >
      {lastHit > 0 && (
        <motion.div
          className="absolute inset-0 bg-red-600/20"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
        />
      )}

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <FighterBar
          name={p1.config.name}
          style={FIGHTING_STYLES[p1.config.style].label}
          health={p1.health}
          stamina={p1.stamina}
          combo={p1.combo}
          align="left"
        />
        <div className="text-center">
          <p className="font-bebas text-3xl tracking-widest text-white">
            {minutes}:{seconds}
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Round {meta.round}
          </p>
          {cinematic.slowMo < 1 && (
            <p className="mt-1 font-bebas text-velocity-blue text-sm tracking-widest">
              SLOW MOTION
            </p>
          )}
        </div>
        <FighterBar
          name={p2.config.name}
          style={FIGHTING_STYLES[p2.config.style].label}
          health={p2.health}
          stamina={p2.stamina}
          combo={p2.combo}
          align="right"
        />
      </motion.div>

      {/* Crowd hype */}
      <div className="mx-auto mt-2 w-48">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-velocity-blue to-velocity-lime transition-all"
            style={{ width: `${meta.crowdHype * 100}%` }}
          />
        </div>
        <p className="mt-1 text-center text-[9px] uppercase tracking-widest text-white/30">
          Crowd Hype
        </p>
      </div>

      {/* Controls hint */}
      <div className="mt-auto pointer-events-auto">
        {meta.showFrameAnalysis && (
          <div className="mb-3 glass max-w-md p-3 text-xs text-white/60">
            <p className="font-bebas text-velocity-blue tracking-widest mb-1">
              Training — Frame Data
            </p>
            <p>
              Jab {MOVES.jab.startup}s startup / {MOVES.jab.active}s active. Block
              reduces damage ~65%. Counter during opponent startup for +35% damage.
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 text-[10px] text-white/40 uppercase tracking-wider">
          <span>WASD Move</span>
          <span>J K L U Strikes</span>
          <span>I O Kicks</span>
          <span>Shift Block</span>
          <span>Space Dodge</span>
          <span>E Finisher</span>
        </div>
      </div>

      <AnimatePresence>
        {meta.winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="glass p-10 text-center"
            >
              <p className="font-bebas text-5xl text-gradient mb-2">
                {meta.winner === "p1" ? "VICTORY" : "DEFEAT"}
              </p>
              <p className="text-white/60 mb-6">
                {meta.winner === "p1" ? p1.config.name : p2.config.name} wins by
                knockout or decision
              </p>
              <motion.div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => resetRound()}
                  className="px-6 py-2 font-bebas tracking-widest bg-velocity-blue text-black"
                >
                  Rematch
                </button>
                <Link
                  href="/fight"
                  className="px-6 py-2 font-bebas tracking-widest border border-white/20 text-white"
                >
                  Menu
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FighterBar({
  name,
  style,
  health,
  stamina,
  combo,
  align,
}: {
  name: string;
  style: string;
  health: number;
  stamina: number;
  combo: number;
  align: "left" | "right";
}) {
  return (
    <div className={`w-40 md:w-56 ${align === "right" ? "text-right" : ""}`}>
      <p className="font-bebas text-xl text-white tracking-wide">{name}</p>
      <p className="text-[10px] text-velocity-blue uppercase tracking-widest">
        {style}
      </p>
      <motion.div
        className={`mt-2 h-2 overflow-hidden rounded-sm bg-white/10 ${align === "right" ? "ml-auto" : ""}`}
        style={{ width: "100%" }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-red-400"
          animate={{ width: `${health}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>
      <div
        className={`mt-1 h-1 overflow-hidden rounded-sm bg-white/5 ${align === "right" ? "ml-auto" : ""}`}
        style={{ width: "80%" }}
      >
        <motion.div
          className="h-full bg-velocity-blue"
          animate={{ width: `${stamina}%` }}
        />
      </div>
      {combo > 1 && (
        <p className="mt-1 font-bebas text-velocity-lime text-sm">
          {combo}x COMBO
        </p>
      )}
    </div>
  );
}
