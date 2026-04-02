"use client";

import { motion } from "framer-motion";

export default function GrievanceBox({ show }) {
  if (!show) return null;

  return (
    <div className="flex justify-center mt-10">
      <motion.div
        className="w-[200px] h-[200px] bg-gray-800 rounded-md relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        {/* Slot */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[10px] bg-black" />

        <p className="text-white text-center mt-20 text-sm">
          Confidential Box
        </p>
      </motion.div>
    </div>
  );
}
