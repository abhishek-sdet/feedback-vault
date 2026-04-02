"use client";

import { motion } from "framer-motion";

export default function VaultCore() {
  return (
    <div className="relative flex justify-center items-center mt-10 mb-12">
      {/* Outer Pulse Aura */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-emerald-400/5 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
        animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
      />
      
      {/* Inner Aura */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-emerald-400/20"
        animate={{ scale: [1, 2], opacity: [0.6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
      />

      {/* Core Node */}
      <motion.div
        className="w-2.5 h-2.5 bg-emerald-400 rounded-full cursor-help relative z-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ boxShadow: '0 0 10px rgba(52,211,153,0.5)' }}
      />
    </div>
  );
}
