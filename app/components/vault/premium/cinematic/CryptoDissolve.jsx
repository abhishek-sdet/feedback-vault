"use client";

import React, { useEffect, useState, useMemo } from "react";

const SCRAMBLED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-{}[]|;:,.<>?";

export default function CryptoDissolve({ text, trigger }) {
  const [display, setDisplay] = useState(text);
  
  const tokens = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    if (!trigger) return;

    let iterations = 0;
    const maxIterations = tokens.length + 10;

    const interval = setInterval(() => {
      setDisplay((prev) => {
        return tokens.map((char, i) => {
          // If we've passed this char's index, either show empty or keep scrambling a bit more
          if (iterations > i + 15) return " ";
          if (iterations > i) {
            return SCRAMBLED_CHARS[Math.floor(Math.random() * SCRAMBLED_CHARS.length)];
          }
          return char;
        }).join("");
      });

      iterations += 1;

      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplay("");
      }
    }, 25);

    return () => clearInterval(interval);
  }, [trigger, tokens]);

  return (
    <p 
      className="text-black/60 leading-relaxed tracking-wide transition-opacity duration-500"
      style={{ 
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '15px',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        minHeight: '200px',
        opacity: display === "" ? 0 : 1
      }}
    >
      {display}
    </p>
  );
}
