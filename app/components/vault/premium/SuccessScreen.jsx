'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export default function SuccessScreen({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center p-6 text-center w-full"
      role="region"
      aria-label="Success Acknowledgement from the CEO"
    >

      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-[clamp(1.75rem,8vw,3.75rem)] font-medium mb-8 text-white tracking-tight italic"
      >
        Thank you. <br/> Your voice is in my hands.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="flex flex-col items-center gap-10 mb-12"
      >
        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="text-slate-200 text-[clamp(0.95rem,2.5vw,1.25rem)] max-w-2xl font-light leading-relaxed tracking-[0.02em] opacity-80 italic"
        >
          "I personally review every entry in this vault. Your honesty is what 
          helps us build a better company together. Take pride in speaking up."
        </p>
        
        {/* Kapil's Signature - Enlarged */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="mt-4"
        >
          <span className="text-3xl md:text-4xl text-emerald-400" style={{ fontFamily: "'Caveat', cursive" }}>
            — Kapil
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-4 bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">Verified Anonymous & Secure Transmission</span>
        </div>

        <button
          onClick={onReset}
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="group flex items-center gap-4 px-8 md:px-12 py-3.5 md:py-5 rounded-sm border border-white/10 bg-white/[0.04] text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/[0.1] hover:border-white/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        >
          <ChevronLeft 
            size={16} 
            className="group-hover:-translate-x-1 transition-transform duration-300" 
          /> 
          Safe Exit
        </button>
      </motion.div>
    </motion.div>
  );
}
