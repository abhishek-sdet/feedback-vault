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
        className="relative cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-200/20 rounded-sm shadow-2xl"
        style={{
          width: 300,
          height: 200,
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
        }}
      >
        {/* Body - Interactive Light */}
        <div
          className="absolute inset-0 rounded-sm transition-colors duration-500"
          style={{ 
            background: isOpen 
              ? '#f2e8d0' 
              : `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #f9f3e6 0%, #f2e8d0 60%)` 
          }}
        />

        {/* Left triangle fold */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            width: 0, height: 0,
            borderBottom: '100px solid #e8dcc4',
            borderRight: '150px solid transparent',
          }}
        />

        {/* Right triangle fold */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: 0, height: 0,
            borderBottom: '100px solid #e8dcc4',
            borderLeft: '150px solid transparent',
          }}
        />

        {/* Bottom V flap */}
        <div
          className="absolute top-1/2 left-0 right-0"
          style={{
            height: 0,
            borderLeft: '150px solid #ddd0b3',
            borderRight: '150px solid #ddd0b3',
            borderBottom: '0px solid transparent',
            borderTop: '60px solid transparent',
          }}
        />

        {/* Top flap (animated) */}
        <motion.div
          className="absolute top-0 left-0 right-0 origin-top"
          animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d', zIndex: 10 }}
        >
          <div
            style={{
              width: 0, height: 0,
              borderLeft: '150px solid transparent',
              borderRight: '150px solid transparent',
              borderTop: '110px solid #e0d4b8',
            }}
          />
        </motion.div>

        {/* Wax seal */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center z-20"
            style={{
              width: 40, height: 40,
              background: 'radial-gradient(circle at 35% 35%, #c0392b, #922b21)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, fontFamily: 'serif' }}>S</span>
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
