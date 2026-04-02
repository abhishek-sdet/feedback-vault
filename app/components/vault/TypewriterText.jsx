"use client";

import { useEffect, useState } from "react";

export default function TypewriterText({ text, onComplete }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay((prev) => prev + text[i]);
      i++;
      if (i === text.length) {
        clearInterval(interval);
        onComplete && onComplete();
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-center text-gray-600 text-sm max-w-md mx-auto">
      {display}
    </p>
  );
}
