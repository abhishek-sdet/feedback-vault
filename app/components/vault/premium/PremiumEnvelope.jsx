'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PremiumEnvelope(props) {
  const { onOpen } = props || {};
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isOpen, setIsOpen] = useState(false);
  const envelopeRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!envelopeRef.current || isOpen) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(onOpen, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-8"
    >
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'rgba(255,250,240,0.4)',
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        Confidential
      </motion.p>

      {/* Envelope */}
      <motion.div
        ref={envelopeRef}
        role="button"
        tabIndex={0}
        aria-label={isOpen ? "Envelope opened" : "Open confidential envelope"}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onKeyDown={(e) => {
          if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.02, y: -8 }}
        className="relative cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-200/20 rounded-sm shadow-2xl w-[min(300px,85vw)] aspect-[3/2]"
        style={{
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
        }}
      >
        {/* Body - Interactive Light */}
        <div
          className="absolute inset-0 rounded-sm transition-colors duration-500 overflow-hidden"
          style={{ 
            background: isOpen 
              ? '#f2e8d0' 
              : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #f9f3e6 0%, #f2e8d0 60%)` 
          }}
        >
          {/* Left triangle fold - Liquid */}
          <div
            className="absolute inset-0 bg-[#e8dcc4]"
            style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}
          />

          {/* Right triangle fold - Liquid */}
          <div
            className="absolute inset-0 bg-[#e8dcc4]"
            style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}
          />

          {/* Bottom V flap - Liquid */}
          <div
            className="absolute inset-0"
            style={{ 
              clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)',
              background: '#ddd0b3'
            }}
          />
        </div>

        {/* Top flap (animated) - Liquid */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-full origin-top"
          animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d', zIndex: 10 }}
        >
          <div
            className="w-full h-full"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
              background: '#e0d4b8'
            }}
          />
        </motion.div>

        {/* Wax seal - Liquid */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center z-20"
            style={{
              width: '14%',
              aspectRatio: '1/1',
              background: 'radial-gradient(circle at 35% 35%, #c0392b, #922b21)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span className="text-[min(14px,4vw)]" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontFamily: 'serif' }}>S</span>
          </motion.div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ delay: 0.8 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          color: 'rgba(255,250,240,0.28)',
          fontSize: 12,
          letterSpacing: '0.1em',
        }}
      >
        Click to open
      </motion.p>
    </motion.div>
  );
}
