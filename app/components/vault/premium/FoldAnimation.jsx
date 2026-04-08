'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoldedLetter from './cinematic/FoldedLetter';

const foldVariants = {
  initial: { scaleY: 1, rotateX: 0, y: 0, opacity: 1 },
  fold1: {
    rotateX: -90,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
  },
  fold2: {
    rotateX: -180,
    scaleY: 0.5,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  drop: {
    y: 120,
    opacity: 0,
    scale: 0.6,
    transition: { duration: 0.8, ease: [0.4, 0, 1, 1] },
  },
};

export default function FoldAnimation(props) {
  const { phase } = props || {};
  // phase: 'sealing' | 'fold1' | 'fold2' | 'drop'
  
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[500px] w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ perspective: 1500 }}
    >
      {/* Sealing message */}
      <AnimatePresence>
        {(phase === 'sealing' || phase === 'fold1' || phase === 'fold2') && (
          <motion.div
            key="sealing-msg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 flex flex-col items-center gap-2 z-30"
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 18,
                fontStyle: 'italic',
                color: '#1e1b4b',
                letterSpacing: '0.04em',
              }}
            >
              Encrypting for Kapil's eyes only…
            </p>
            <p className="text-[12px] uppercase font-black tracking-[0.4em] text-indigo-600 animate-pulse">
              Identity Sanitization in Progress…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paper folding (Cinematic Upgrade) */}
      <motion.div
        className="z-20 relative"
        initial={{ y: 0, opacity: 0 }}
        animate={
          phase === 'drop' ? { y: 220, opacity: 0, scale: 0.3, rotateX: -60, filter: 'blur(4px)' }
          : { y: 60, opacity: 1 }
        }
        transition={{
          duration: phase === 'drop' ? 1.4 : 0.8,
          ease: phase === 'drop' ? [0.45, 0, 0.55, 1] : "easeOut",
        }}
      >
        <FoldedLetter phase={phase === 'fold1' || phase === 'fold2' ? 'fold' : phase} />
      </motion.div>

      {/* Grievance Box / Vault Monolith - NOW PERSISTENT */}
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        animate={{ 
          opacity: 1, 
          y: phase === 'drop' ? 0 : 40,
          scale: phase === 'drop' ? 1 : 0.95
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[-100px] w-[380px] h-[340px] z-10"
      >
        {/* The Monolith Face - High Contrast Platinum Steel */}
        <div 
          className="w-full h-full rounded-t-[3rem] border-t-2 border-x-2 border-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #f1f5f9 0%, #64748b 100%)',
            boxShadow: `
              0 -40px 100px rgba(30,27,75,0.1),
              0 20px 50px rgba(0,0,0,0.1),
              inset 0 2px 5px rgba(255,255,255,1)
            `,
          }}
        >
          {/* Internal Glow Path */}
          <motion.div 
            animate={{ 
              opacity: phase === 'drop' ? [0.1, 0.3, 0.1] : 0.05,
              scale: phase === 'drop' ? [1, 1.2, 1] : 1
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-0 left-0 right-0 h-40 bg-indigo-500/20 blur-[80px] rounded-full" 
          />
          
          {/* The Slot - Sharper focus */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[200px] h-[18px] bg-slate-950 rounded-full shadow-[inset_0_4px_12px_rgba(30,27,75,0.8)] border border-indigo-500/20 flex items-center justify-center">
            <motion.div 
              animate={{ 
                opacity: phase === 'drop' ? [0.4, 1, 0.4] : 0.2,
                boxShadow: phase === 'drop' 
                  ? [
                      '0 0 20px rgba(37,99,235,0.3)',
                      '0 0 40px rgba(37,99,235,0.6)',
                      '0 0 20px rgba(37,99,235,0.3)'
                    ]
                  : 'none'
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-full h-full bg-indigo-500/40 blur-[2px] rounded-full" 
            />
          </div>

          {/* Branding / Serial - Massive Impact */}
          <div className="absolute bottom-40 left-0 right-0 flex flex-col items-center group">
            <motion.span 
              animate={{ opacity: phase === 'drop' ? 1 : 0.4 }}
              className="text-[12px] uppercase tracking-[0.7em] text-indigo-950 font-black drop-shadow-md"
            >
              Sovereign Vault
            </motion.span>
            <div className="h-[2px] w-12 bg-indigo-950/20 my-3" />
            <span className="text-[9px] text-indigo-950/30 tracking-[0.4em] font-mono font-bold">
              NODE-SDET-INITIATIVE-01
            </span>
          </div>

          {/* Liquid Metal Refraction - Subtle Moving Highlight */}
          <motion.div 
            animate={{ x: [-500, 500] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
