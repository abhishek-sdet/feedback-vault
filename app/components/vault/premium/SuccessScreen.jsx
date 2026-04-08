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
        className="text-[clamp(3.5rem,15vw,6rem)] font-serif font-black mb-12 text-indigo-950 tracking-tighter italic leading-[0.9]"
      >
        Your voice <br/> has landed.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="flex flex-col items-center gap-10 mb-12"
      >
        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="text-indigo-950/60 text-[clamp(1.1rem,4vw,1.5rem)] max-w-3xl font-light leading-relaxed tracking-wide italic"
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
          className="group flex items-center gap-8 px-16 py-6 rounded-full border-2 border-indigo-600/10 bg-white shadow-[0_20px_60px_-10px_rgba(30,27,75,0.06)] text-[14px] font-black uppercase tracking-[0.5em] text-indigo-950 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:-translate-y-2 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.25)]"
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
