"use client";

import React from "react";
import { motion } from "framer-motion";

export default function InkDissolve({ trigger }) {
  const particles = Array.from({ length: 80 });

  if (!trigger) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {particles.map((_, i) => {
        // Random drift coordinates
        const x = Math.random() * 500 - 250;
        const y = Math.random() * 300 - 150;
        const size = Math.random() * 2 + 1;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#2d2416]/80"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x,
              y,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.005,
              ease: "easeOut",
            }}
            style={{
              width: size,
              height: size,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
}
