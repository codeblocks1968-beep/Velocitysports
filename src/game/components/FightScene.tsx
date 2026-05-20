"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Physics, RigidBody } from "@react-three/rapier";
import { getArena } from "../data/arenas";
import { useFightStore } from "../store/fightStore";
import { ArenaScene } from "./ArenaScene";
import { FighterMesh } from "./FighterMesh";
import { CombatCamera } from "./CombatCamera";
import { ImpactEffects } from "./ImpactEffects";
import { useFightControls } from "../hooks/useFightControls";

function FightLoop() {
  useFrame((_, dt) => {
    useFightStore.getState().tick(Math.min(dt, 0.05));
  });
  return null;
}

function SceneContent() {
  const p1 = useFightStore((s) => s.p1);
  const p2 = useFightStore((s) => s.p2);
  const arenaId = useFightStore((s) => s.settings.arenaId);
  const crowdHype = useFightStore((s) => s.meta.crowdHype);
  const arena = getArena(arenaId);

  useFightControls();

  return (
    <>
      <CombatCamera />
      <FightLoop />
      <ArenaScene arena={arena} crowdHype={crowdHype} />
      <FighterMesh fighter={p1} />
      <FighterMesh fighter={p2} mirror />
      <ImpactEffects />
    </>
  );
}

export function FightScene() {
  const initFight = useFightStore((s) => s.initFight);

  useEffect(() => {
    initFight();
  }, [initFight]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.5, 7], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, toneMappingExposure: 1.2 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody type="fixed" friction={1} restitution={0}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <boxGeometry args={[20, 20, 0.1]} />
          </mesh>
        </RigidBody>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Physics>
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.6} />
        <Vignette eskil={false} offset={0.2} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  );
}
