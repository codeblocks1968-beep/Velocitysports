"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FighterRuntime } from "../types";
import { MOVES } from "../data/moves";

interface FighterMeshProps {
  fighter: FighterRuntime;
  mirror?: boolean;
}

function limbColor(base: string, injury: number, bruise: number, cut: number) {
  const c = new THREE.Color(base);
  if (bruise > 0) c.lerp(new THREE.Color("#4a2020"), bruise * 0.6);
  if (cut > 0) c.lerp(new THREE.Color("#8b0000"), cut * 0.5);
  if (injury > 0.5) c.multiplyScalar(0.92);
  return `#${c.getHexString()}`;
}

export function FighterMesh({ fighter, mirror }: FighterMeshProps) {
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null);

  const { config, injuries, sweatLevel, dirtLevel } = fighter;
  const skin = limbColor(config.skinTone, injuries.head.severity, injuries.head.bruise, injuries.head.cut);
  const torso = limbColor(config.outfitPrimary, injuries.torso.severity, injuries.torso.bruise, injuries.torso.cut);

  useFrame((_, dt) => {
    if (!group.current) return;
    const [x, , z] = fighter.position;
    group.current.position.set(x, 0, z);
    group.current.rotation.y = fighter.rotation + (mirror ? Math.PI : 0);

    const t = performance.now() * 0.001;
    let armSwing = Math.sin(t * 3) * 0.08;
    let legSwing = Math.sin(t * 3 + Math.PI) * 0.06;
    let bodyTilt = 0;

    if (fighter.state === "walk") {
      armSwing = Math.sin(t * 8) * 0.35;
      legSwing = Math.sin(t * 8 + Math.PI) * 0.4;
    }
    if (fighter.state === "block") {
      if (rightArm.current) rightArm.current.rotation.x = -1.2;
      if (leftArm.current) leftArm.current.rotation.x = -1.2;
    }
    if (fighter.state === "attack" && fighter.currentMove) {
      const move = MOVES[fighter.currentMove];
      const phase = fighter.movePhase;
      const power = phase === "active" ? 1 : phase === "startup" ? 0.4 : 0.2;
      if (move.isKick && leftLeg.current) {
        leftLeg.current.rotation.x = -1.4 * power;
      } else if (rightArm.current) {
        rightArm.current.rotation.x = -1.6 * power;
        rightArm.current.rotation.z = move.id === "hook" ? 0.8 * power : 0;
      }
      bodyTilt = -0.15 * power;
    }
    if (fighter.state === "hitstun" || fighter.state === "knockdown") {
      bodyTilt = 0.35;
      if (rightArm.current) rightArm.current.rotation.x = 0.5;
    }
    if (fighter.state === "dodge") {
      bodyTilt = 0.5;
    }

    if (fighter.state !== "block" && fighter.state !== "attack") {
      if (leftArm.current) leftArm.current.rotation.x = armSwing;
      if (rightArm.current) rightArm.current.rotation.x = -armSwing;
    }
    if (fighter.state !== "attack" || !MOVES[fighter.currentMove!]?.isKick) {
      if (leftLeg.current) leftLeg.current.rotation.x = legSwing;
      if (rightLeg.current) rightLeg.current.rotation.x = -legSwing;
    }
    group.current.rotation.x = bodyTilt;

    if (head.current) {
      const sweat = sweatLevel * 0.15;
      (head.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.05 + sweat + dirtLevel * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Torso */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.75, 0.32]} />
        <meshStandardMaterial color={torso} roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Accent gear */}
      <mesh position={[0, 1.35, 0.17]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.02]} />
        <meshStandardMaterial
          color={config.outfitSecondary}
          emissive={config.outfitSecondary}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Head */}
      <mesh ref={head} position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={skin}
          roughness={0.45}
          metalness={0.05}
          emissive="#331100"
          emissiveIntensity={0.05 + sweatLevel * 0.15}
        />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.88, -0.02]} castShadow>
        <boxGeometry args={[0.24, 0.1, 0.22]} />
        <meshStandardMaterial color={config.hairColor} roughness={0.9} />
      </mesh>
      {/* Tattoo accent */}
      <mesh position={[0.28, 1.2, 0.16]}>
        <planeGeometry args={[0.12, 0.25]} />
        <meshStandardMaterial
          color={config.tattooAccent}
          transparent
          opacity={0.85}
          emissive={config.tattooAccent}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Arms */}
      <group ref={leftArm} position={[-0.38, 1.35, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.38, 1.35, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.45, 6, 12]} />
          <meshStandardMaterial
            color={limbColor(
              skin,
              injuries.rightArm.severity,
              injuries.rightArm.bruise,
              injuries.rightArm.cut
            )}
            roughness={0.5}
          />
        </mesh>
        {/* Gloves */}
        <mesh position={[0, -0.52, 0.05]} castShadow>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color="#111" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>
      {/* Legs */}
      <group ref={leftLeg} position={[-0.18, 0.72, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.55, 6, 12]} />
          <meshStandardMaterial color={config.outfitPrimary} roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.18, 0.72, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.55, 6, 12]} />
          <meshStandardMaterial color={config.outfitPrimary} roughness={0.7} />
        </mesh>
      </group>
      {/* Shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
