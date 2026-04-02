"use client";

import { useEffect, useState } from "react";

export default function PenCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`
      }}
    >
      <div className="w-3 h-3 bg-black rounded-full shadow-lg" />
    </div>
  );
}
