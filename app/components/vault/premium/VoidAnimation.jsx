'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleAbsorb from './cinematic/ParticleAbsorb';
import LightRays from './cinematic/LightRays';

export default function VoidAnimation(props) {
  const { onComplete } = props || {};
  const [phase, setPhase] = useState('impact'); // impact → expand

  useEffect(() => {
    // Stage timings:
    // 0ms: Impact (The green dot appears)
    // 800ms: Expansion (The shockwave and screen wash)
    // 2500ms: Complete (Settle into success state)
    const t1 = setTimeout(() => setPhase('expand'), 800);
    const t2 = setTimeout(() => onComplete?.(), 2500);
    return () => [t1, t2].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      initial={{ backgroundColor: 'transparent' }}
      animate={{ 
        backgroundColor: phase === 'expand' ? '#ffffff' : 'transparent' 
      }}
      transition={{ duration: 1.5 }}
      style={{ zIndex: 100 }}
    >
      <div className="relative flex items-center justify-center">
        
        {/* The Core Impact Point (Represents the landed letter) */}
        <motion.div
          key="impact-point"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            phase === 'impact' 
              ? { scale: 1, opacity: 1.5 } 
              : { scale: 0.8, opacity: 0 }
          }
          transition={{ 
            type: 'spring',
            stiffness: phase === 'impact' ? 200 : 100,
            damping: 15,
            duration: 0.6 
          }}
          className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,1)] relative z-20"
        >
          {/* Inner Core Glow */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-white rounded-full opacity-40 blur-[1px]"
          />
        </motion.div>

        {/* Shockwave Expansion */}
        <AnimatePresence>
          {phase === 'expand' && (
            <>
              {/* Radial Fade Wash */}
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px]"
              />

              {/* Kinetic Shockwave Ring */}
              <motion.div
                initial={{ scale: 0.1, opacity: 0.8, border: '2px solid rgba(16,185,129,0.6)' }}
                animate={{ scale: 15, opacity: 0, border: '1px solid rgba(16,185,129,0)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[100px] h-[100px] rounded-full z-10"
              />

              {/* Particle Burst (Subtle) */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ 
                    x: Math.cos((i * 45) * Math.PI / 180) * 400, 
                    y: Math.sin((i * 45) * Math.PI / 180) * 400, 
                    opacity: 0,
                    scale: 0 
                  }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                  className="absolute w-1 h-1 bg-emerald-300 rounded-full blur-[1px]"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Screen Dimming / Transition Background */}
      {phase === 'expand' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[#ffffff] pointer-events-none"
          style={{ mixBlendMode: 'normal' }}
        />
      )}
    </motion.div>
  );
}
