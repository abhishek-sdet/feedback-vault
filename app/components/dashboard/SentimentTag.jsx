"use client";

import { motion } from "framer-motion";

export default function SentimentTag({ text }) {
  const getSentiment = () => {
    const t = text.toLowerCase();

    if (t.includes("stress") || t.includes("pressure") || t.includes("burnout") || t.includes("anxiety"))
      return { label: "STRESS RISK", color: "text-rose-500", bg: "bg-rose-500/10" };

    if (t.includes("improve") || t.includes("suggest") || t.includes("better") || t.includes("change"))
      return { label: "SUGGESTION", color: "text-amber-500", bg: "bg-amber-500/10" };

    if (t.includes("great") || t.includes("happy") || t.includes("love") || t.includes("thanks"))
      return { label: "POSITIVE", color: "text-emerald-500", bg: "bg-emerald-500/10" };

    return { label: "NEUTRAL", color: "text-white/30", bg: "bg-white/5" };
  };

  const s = getSentiment();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-2 py-0.5 rounded-sm ${s.bg} flex items-center justify-center`}
    >
      <span className={`text-[8px] font-black tracking-[0.2em] uppercase ${s.color}`}>
        {s.label}
      </span>
    </motion.div>
  );
}
