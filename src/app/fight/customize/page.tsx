"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { VelocityButton } from "@/components/ui/VelocityButton";
import { FIGHTING_STYLES } from "@/game/data/fightingStyles";
import { useFightStore } from "@/game/store/fightStore";
import type { FightingStyle } from "@/game/types";

const SKIN_TONES = ["#f5d0b0", "#c68642", "#8d5524", "#3b2219"];
const HAIR_COLORS = ["#1a1208", "#4a3020", "#888888", "#cc4400"];
const OUTFITS = ["#111111", "#1a1a2e", "#2d1f0e", "#0a0a0a"];

export default function CustomizePage() {
  const config = useFightStore((s) => s.settings.player1);
  const update = useFightStore((s) => s.updatePlayerConfig);

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link href="/fight" className="font-bebas text-white/40 hover:text-white tracking-widest">
        ← Back
      </Link>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bebas text-5xl mt-6 mb-8 text-gradient"
      >
        Fighter Creator
      </motion.h1>

      <label className="block mb-6">
        <span className="text-xs uppercase tracking-widest text-white/40">Fighter Name</span>
        <input
          type="text"
          value={config.name}
          onChange={(e) => update({ name: e.target.value })}
          className="mt-2 w-full glass px-4 py-3 bg-transparent text-white outline-none focus:border-velocity-blue"
        />
      </label>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Fighting Style</p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(FIGHTING_STYLES) as FightingStyle[]).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => update({ style })}
              className={`p-3 font-bebas tracking-wider border ${
                config.style === style
                  ? "border-velocity-blue text-velocity-blue"
                  : "border-white/10 text-white/50"
              }`}
            >
              {FIGHTING_STYLES[style].label}
            </button>
          ))}
        </div>
      </div>

      <ColorPicker label="Skin Tone" colors={SKIN_TONES} value={config.skinTone} onChange={(skinTone) => update({ skinTone })} />
      <ColorPicker label="Hair" colors={HAIR_COLORS} value={config.hairColor} onChange={(hairColor) => update({ hairColor })} />
      <ColorPicker label="Outfit" colors={OUTFITS} value={config.outfitPrimary} onChange={(outfitPrimary) => update({ outfitPrimary })} />

      <label className="block mb-6">
        <span className="text-xs uppercase tracking-widest text-white/40">Accent / Tattoo</span>
        <input
          type="color"
          value={config.tattooAccent}
          onChange={(e) => update({ tattooAccent: e.target.value, outfitSecondary: e.target.value })}
          className="mt-2 h-12 w-full cursor-pointer"
        />
      </label>

      <motion.div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Weight Class</p>
        <div className="flex gap-2">
          {(["light", "middle", "heavy"] as const).map((wc) => (
            <button
              key={wc}
              type="button"
              onClick={() => update({ weightClass: wc })}
              className={`flex-1 py-2 font-bebas tracking-widest uppercase ${
                config.weightClass === wc ? "bg-velocity-lime text-black" : "border border-white/10"
              }`}
            >
              {wc}
            </button>
          ))}
        </div>
      </motion.div>

      <Link href="/fight/play">
        <VelocityButton variant="primary" size="lg" className="w-full">
          Save & Fight
        </VelocityButton>
      </Link>
    </main>
  );
}

function ColorPicker({
  label,
  colors,
  value,
  onChange,
}: {
  label: string;
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-widest text-white/40 mb-2">{label}</p>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`w-10 h-10 rounded-full border-2 ${
              value === c ? "border-velocity-blue scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            aria-label={c}
          />
        ))}
      </div>
    </div>
  );
}
