"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function ParticleAbsorb() {
  // Generate particles only once
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 200 + Math.random() * 400; // Start from far out
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 1 + Math.random() * 2,
        duration: 1 + Math.random() * 1,
        delay: Math.random() * 0.5,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/60"
          initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          animate={{
            x: 0,
            y: 0,
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.4, 0, 0.2, 1], // Inward pull ease
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          style={{
            width: p.size,
            height: p.size,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
