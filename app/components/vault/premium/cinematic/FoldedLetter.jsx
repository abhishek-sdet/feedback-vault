"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FoldedLetter({ phase }) {
  // phase can be: "idle", "fold", "drop"
  
  return (
    <div className="relative w-[320px] h-[240px]" style={{ perspective: '1200px' }}>
      {/* 
          We use a 3-panel structure.
          Top Panel: Folds down.
          Middle Panel: Static.
          Bottom Panel: Folds up.
      */}

      {/* TOP FOLD */}
      <motion.div
        className="absolute top-0 w-full h-1/3 bg-[#fffaf0] border-b border-black/5 origin-top z-30"
        initial={{ rotateX: 0 }}
        animate={
          phase === "fold" || phase === "drop"
            ? { rotateX: -170 } // Not quite 180 to show some thickness
            : { rotateX: 0 }
        }
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{
          boxShadow: "inset 0 -10px 30px rgba(0,0,0,0.02)",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
         {/* Subtle inner shadow when folded */}
         {phase !== "idle" && (
           <div className="absolute inset-0 bg-black/5 pointer-events-none" />
         )}
      </motion.div>

      {/* MIDDLE (STATIC CORE) */}
      <div 
        className="absolute top-1/3 w-full h-1/3 bg-[#fffaf0] z-10"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}
      >
        {/* Shadow cast by top fold */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={phase !== "idle" ? { opacity: 1 } : { opacity: 0 }}
          className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" 
        />
      </div>

      {/* BOTTOM FOLD */}
      <motion.div
        className="absolute bottom-0 w-full h-1/3 bg-[#fffaf0] border-t border-black/5 origin-bottom z-20"
        initial={{ rotateX: 0 }}
        animate={
          phase === "fold" || phase === "drop"
            ? { rotateX: 170 }
            : { rotateX: 0 }
        }
        transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          boxShadow: "inset 0 10px 30px rgba(0,0,0,0.02)",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Shadow cast by bottom fold */}
        {phase !== "idle" && (
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        )}
      </motion.div>

      {/* CREASE LINES (Visual only) */}
      <div className="absolute top-1/3 w-full h-[1px] bg-black/5 z-40" />
      <div className="absolute bottom-1/3 w-full h-[1px] bg-black/5 z-40" />
    </div>
  );
}
