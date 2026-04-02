"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LightRays() {
  const rays = Array.from({ length: 12 });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {rays.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] h-[300px] origin-center"
          style={{
            background: 'linear-gradient(to top, transparent, rgba(16, 185, 129, 0.4), transparent)',
            rotate: `${i * 30}deg`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: [0, 1.2, 0.8],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Central Gravitational Pulse */}
      <motion.div 
        className="absolute w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
