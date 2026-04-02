"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function ZeroKnowledgeIndicator() {
  return (
    <div className="flex items-center gap-3 bg-emerald-400/5 px-4 py-1.5 rounded-full border border-emerald-400/10">
      {/* Animated lock pulse */}
      <motion.div
        className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />

      <div className="flex items-center gap-2">
        <ShieldCheck size={10} className="text-emerald-400/60" />
        <span className="text-[9px] tracking-[0.25em] font-black italic text-emerald-400/80 uppercase">
          Zero-Knowledge Verified
        </span>
      </div>
    </div>
  );
}
