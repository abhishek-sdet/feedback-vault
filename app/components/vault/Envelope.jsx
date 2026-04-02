"use client";

import { motion } from "framer-motion";

export default function Envelope({ onOpen }) {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <motion.div
        className="relative w-[300px] h-[200px] cursor-pointer"
        onClick={onOpen}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Envelope Body */}
        <div className="absolute w-full h-full bg-[#f5e6c8] rounded-md shadow-xl" />

        {/* Flap */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[50%] bg-[#e8d3a3] origin-top"
          initial={{ rotateX: 0 }}
          whileHover={{ rotateX: -20 }}
          transition={{ duration: 0.6 }}
        />

        <p className="absolute bottom-4 text-center w-full text-sm text-gray-700">
          Click to open your confidential letter
        </p>
      </motion.div>
    </div>
  );
}
