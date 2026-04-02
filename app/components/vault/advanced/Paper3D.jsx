"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Paper3D({ children }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;

    setRotate({
      x: x * 10,
      y: y * -10,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      className="p-6 bg-[#fffaf0] rounded-md shadow-2xl"
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
      }}
    >
      {children}
    </motion.div>
  );
}
