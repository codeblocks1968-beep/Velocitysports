"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RotatingEarthProps {
  size?: number;       // diameter in px
  opacity?: number;    // 0–1
  className?: string;
  /**
   * Optional: path to an AI-generated video (MP4 / WebM).
   * Place the file in /public, e.g. "/earth.mp4"
   * When provided the video replaces the CSS-animated globe.
   * Falls back to the CSS globe if the video fails to load.
   */
  videoSrc?: string;
  /** Show orbital HUD ring */
  showHUD?: boolean;
  /** Show floating particle dots in orbit */
  showParticles?: boolean;
}

/* ── orbital particle positions ── */
function orbitalParticles(size: number, count = 12) {
  return [...Array(count)].map((_, i) => {
    const angle = (i / count) * 360;
    const tilt  = 20; // degrees
    const r     = size * 0.6;
    const rad   = (angle * Math.PI) / 180;
    const tRad  = (tilt  * Math.PI) / 180;
    return {
      x: r * Math.cos(rad),
      y: r * Math.sin(rad) * Math.cos(tRad),
      size: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
      delay: i * 0.25,
      dur: 1.8 + i * 0.35,
    };
  });
}

const RotatingEarth = ({
  size = 600,
  opacity = 0.35,
  className = "",
  videoSrc,
  showHUD = true,
  showParticles = true,
}: RotatingEarthProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !videoSrc) return;
    vid.muted  = true;
    vid.loop   = true;
    vid.playsInline = true;
    vid.play().then(() => setVideoOk(true)).catch(() => setVideoOk(false));
  }, [videoSrc]);

  const particles = orbitalParticles(size);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity, scale: 1 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      className={`relative flex-shrink-0 pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* ── Outer deep glow ── */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `
            0 0 ${size * 0.18}px ${size * 0.05}px rgba(0,120,255,0.22),
            0 0 ${size * 0.35}px ${size * 0.10}px rgba(0,80,200,0.12),
            0 0 ${size * 0.55}px ${size * 0.15}px rgba(0,242,255,0.05)
          `,
        }}
      />

      {/* ── Aurora borealis ring ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.06,
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(0,242,255,0.07) 15%,
            rgba(0,200,120,0.06) 30%,
            transparent 45%,
            rgba(100,0,255,0.05) 60%,
            rgba(0,242,255,0.07) 75%,
            transparent 90%
          )`,
          filter: `blur(${size * 0.025}px)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Atmosphere ── */}
      <div className="earth-atmosphere" />

      {/* ── Globe: video or CSS ── */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Hidden video element — always mounted when videoSrc given */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover rounded-full"
            style={{ opacity: videoOk ? 1 : 0, transition: "opacity 0.8s" }}
            aria-hidden="true"
          />
        )}

        {/* CSS globe — visible when no video or video failed */}
        {(!videoSrc || !videoOk) && (
          <div className="earth-globe absolute inset-0" aria-hidden="true" />
        )}

        {/* City-lights night-side overlay (always) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(
              ellipse at 65% 50%,
              transparent 30%,
              rgba(255,180,50,0.06) 55%,
              rgba(255,120,30,0.04) 70%,
              rgba(0,0,0,0.45) 100%
            )`,
          }}
        />
      </div>

      {/* ── Specular shine ── */}
      <div className="earth-shine" />

      {/* ── HUD ring ── */}
      {showHUD && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -size * 0.04,
            border: `1px solid rgba(0,242,255,0.18)`,
            boxShadow: "0 0 8px rgba(0,242,255,0.1)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {/* HUD tick marks */}
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: size * 0.045,
                height: 1,
                background: "rgba(0,242,255,0.5)",
                transformOrigin: "left center",
                transform: `rotate(${deg}deg) translateY(-50%)`,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Secondary counter-rotating ring ── */}
      {showHUD && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -size * 0.10,
            border: `1px dashed rgba(0,242,255,0.07)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* ── Orbital particles ── */}
      {showParticles &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
              background: i % 2 === 0 ? "#00f2ff" : "#ccff00",
              boxShadow: i % 2 === 0
                ? "0 0 6px 2px rgba(0,242,255,0.6)"
                : "0 0 6px 2px rgba(204,255,0,0.5)",
            }}
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

      {/* ── Satellite streak ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.22,
          border: "1px solid transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            width: size * 0.04,
            height: 2,
            background: "linear-gradient(to right, rgba(0,242,255,0.9), transparent)",
            borderRadius: 2,
            transform: "translateX(-50%)",
            boxShadow: "0 0 6px rgba(0,242,255,0.6)",
          }}
        />
      </motion.div>

      {/* ── Slow counter-satellite ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: -size * 0.28,
          border: "1px solid transparent",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "50%",
            width: size * 0.025,
            height: 2,
            background: "linear-gradient(to right, rgba(204,255,0,0.8), transparent)",
            borderRadius: 2,
            transform: "translateX(-50%)",
            boxShadow: "0 0 5px rgba(204,255,0,0.5)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default RotatingEarth;
