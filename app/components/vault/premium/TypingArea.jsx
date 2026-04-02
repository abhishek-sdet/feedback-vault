'use client';

import React, { useCallback } from 'react';

export default function TypingArea(props) {
  const { value = '', onChange, disabled } = props || {};
  
  const handleChange = useCallback((e) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return (
    <div className="relative w-full h-full">
      <label htmlFor="feedback-content" className="sr-only">Feedback Content</label>
      <textarea
        id="feedback-content"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Share your Suggestion, Feedback, Grievances, or a new Idea directly with Kapil…"
        maxLength={2000}
        autoFocus
        className="ink-textarea ruled-paper w-full h-full bg-transparent resize-none border-none focus:outline-none focus:ring-0"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 22,
          lineHeight: '32px',
          color: '#2d2416',
          letterSpacing: '0.02em',
          padding: '8px 4px',
          paddingTop: 1,
        }}
      />

      {/* Character count */}
      <div
        className="absolute bottom-0 right-1 text-[11px] tabular-nums"
        style={{
          fontFamily: "'Inter', sans-serif",
          color: (value?.length || 0) > 1800
            ? 'rgba(180, 50, 30, 0.5)'
            : 'rgba(45, 36, 22, 0.2)',
          transition: 'color 0.3s',
        }}
      >
        {value?.length || 0} / 2000
      </div>
    </div>
  );
}
