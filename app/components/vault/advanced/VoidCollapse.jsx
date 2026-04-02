"use client";

import { motion } from "framer-motion";

export default function VoidCollapse() {
  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-purple-500 to-black"
        animate={{
          scale: [1, 2, 0],
          opacity: [1, 1, 0],
        }}
        transition={{ duration: 2 }}
      />

      <motion.p
        className="absolute text-white text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Fragmenting identity... irreversible.
      </motion.p>
    </motion.div>
  );
}
