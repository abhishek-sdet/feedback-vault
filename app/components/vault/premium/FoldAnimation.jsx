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
      className="flex flex-col items-center justify-center min-h-[400px] w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ perspective: 1200 }}
    >
      {/* Sealing message */}
      <AnimatePresence>
        {(phase === 'sealing' || phase === 'fold1' || phase === 'fold2') && (
          <motion.div
            key="sealing-msg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 flex flex-col items-center gap-2"
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 17,
                fontStyle: 'italic',
                color: 'rgba(30,27,75,0.65)',
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
        className="z-20"
        animate={
          phase === 'drop' ? { y: 220, opacity: 0, scale: 0.4, rotateX: -70 }
          : { y: 40 }
        }
        transition={{
          duration: phase === 'drop' ? 1.2 : 0.6,
          ease: phase === 'drop' ? [0.45, 0, 0.55, 1] : [0.4, 0, 0.2, 1],
        }}
      >
        <FoldedLetter phase={phase === 'fold1' || phase === 'fold2' ? 'fold' : phase} />
      </motion.div>

      {/* Grievance Box / Vault Monolith */}
      <AnimatePresence>
        {phase === 'drop' && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[-120px] w-[340px] h-[300px] z-10"
          >
            {/* The Monolith Face */}
              <div 
                className="w-full h-full rounded-t-3xl border-t border-x border-white relative overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #f8fafc 0%, #94a3b8 100%)',
                  boxShadow: '0 -50px 100px rgba(37,99,235,0.15), inset 0 2px 4px rgba(255,255,255,1)',
                }}
              >
                {/* Internal glow for the slot area */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
                
                {/* The Slot */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[180px] h-[16px] bg-white rounded-full shadow-[inset_0_4px_20px_rgba(0,0,0,0.1)] border-2 border-indigo-100 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      opacity: [0.2, 0.4, 0.2],
                      boxShadow: [
                        '0 0 15px rgba(16,185,129,0.1)',
                        '0 0 25px rgba(16,185,129,0.3)',
                        '0 0 15px rgba(16,185,129,0.1)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="w-full h-full bg-emerald-500/20 blur-[1px]" 
                  />
                </div>

                {/* Branding / Serial */}
                <div className="absolute bottom-40 left-0 right-0 flex flex-col items-center opacity-60 group">
                  <span className="text-[11px] uppercase tracking-[0.6em] text-indigo-950 font-black drop-shadow-sm">
                    Sovereign Vault
                  </span>
                  <div className="h-px w-8 bg-blue-900/10 my-2" />
                  <span className="text-[8px] text-blue-900/30 tracking-[0.3em] font-mono font-bold">
                    NODE-SDET-INITIATIVE-01
                  </span>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
