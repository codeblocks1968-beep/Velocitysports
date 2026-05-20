"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { CombatHUD } from "@/game/components/CombatHUD";

const FightScene = dynamic(
  () => import("@/game/components/FightScene").then((m) => m.FightScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-white/40 font-bebas tracking-widest">
        Loading arena...
      </div>
    ),
  }
);

export default function FightPlayPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <Link
        href="/fight"
        className="absolute left-4 top-4 z-20 font-bebas text-sm tracking-widest text-white/40 hover:text-white"
      >
        ← Menu
      </Link>
      <div className="absolute inset-0">
        <FightScene />
      </div>
      <CombatHUD />
    </main>
  );
}
