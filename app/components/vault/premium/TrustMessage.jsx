'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINES = [
  'I am listening. Your words come directly to me.',
  'This is our encrypted channel. Your safety is my personal promise.',
];

export default function TrustMessage(props) {
  const { onComplete } = props || {};
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [phase, setPhase] = useState(0); // 0=line1, 1=line2, 2=done

  useEffect(() => {
    let i = 0;
    let cancelled = false;

    const typeChar = () => {
      if (cancelled) return;
      if (i < LINES[0].length) {
        setLine1(LINES[0].slice(0, i + 1));
        i++;
        setTimeout(typeChar, 38);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          setPhase(1);
          let j = 0;
          const typeLine2 = () => {
            if (cancelled) return;
            if (j < LINES[1].length) {
              setLine2(LINES[1].slice(0, j + 1));
              j++;
              setTimeout(typeLine2, 32);
            } else {
              setPhase(2);
              setTimeout(() => { if (!cancelled) onComplete?.(); }, 2900);
            }
          };
          typeLine2();
        }, 320);
      }
    };

    setTimeout(typeChar, 200);
    return () => { cancelled = true; };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-3 text-center px-6"
    >
      <p
        className="text-[17px] leading-relaxed tracking-wide"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'rgba(255,250,240,0.72)',
          minHeight: '1.6em',
        }}
      >
        {line1}
        {phase === 0 && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            className="ml-[1px]"
          >|</motion.span>
        )}
      </p>

      {phase >= 1 && (
        <p
          className="text-[14px] leading-relaxed tracking-widest uppercase"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255,250,240,0.35)',
            letterSpacing: '0.14em',
            minHeight: '1.4em',
          }}
        >
          {line2}
          {phase === 1 && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              className="ml-[1px]"
            >|</motion.span>
          )}
        </p>
      )}
    </motion.div>
  );
}
