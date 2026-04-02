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
    >
      <motion.div
        className="mb-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.3 }}
      >
        <img src="/sdet-logo.png" alt="SDET Logo" className="h-4 w-auto mx-auto object-contain" />
      </motion.div>

      <motion.div
        className="mb-14 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: 0.5 
        }}
      >
        <div className="w-[120px] h-[120px] rounded-full border border-emerald-500/10 flex items-center justify-center relative bg-emerald-500/[0.02]">
          {/* Scanning Beam */}
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
             className="absolute inset-0 rounded-full bg-gradient-to-t from-emerald-500/20 to-transparent blur-[2px]"
             style={{ maskImage: 'radial-gradient(circle, transparent 40%, black 100%)' }}
          />

          {/* Triple Ring Beacon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-dashed border-emerald-500/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-dotted border-emerald-500/30"
          />
          
          <motion.div
            className="w-[12px] h-[12px] rounded-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,1)] z-10"
            animate={{
              scale: [1, 1.3, 1],
              boxShadow: [
                '0 0 20px rgba(16,185,129,0.5)',
                '0 0 40px rgba(16,185,129,1)',
                '0 0 20px rgba(16,185,129,0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-3xl font-medium mb-6 text-slate-100 tracking-tight"
      >
        TRANSMISSION SEALED.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="text-slate-400 text-[13px] max-w-sm mb-20 font-light leading-relaxed tracking-[0.05em] opacity-80"
      >
        Your record has been encrypted and absorbed into Kapil's private vault. 
        It is now for his eyes only.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <button
          onClick={onReset}
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="group flex items-center gap-3 px-8 py-3.5 rounded-sm border border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <ChevronLeft 
            size={14} 
            className="group-hover:-translate-x-1 transition-transform duration-300 text-slate-500 group-hover:text-white" 
          /> 
          Return to Entry
        </button>
      </motion.div>
    </motion.div>
  );
}
