"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InkCanvas from "./advanced/InkCanvas";
import Paper3D from "./advanced/Paper3D";
import PenCursor from "./advanced/PenCursor";
import VoidCollapse from "./advanced/VoidCollapse";

export default function LetterPaper({ onSubmit }) {
  const [voidMode, setVoidMode] = useState(false);

  const handleSubmit = () => {
    setVoidMode(true);
    // Let the animation play before completing
    setTimeout(() => {
      onSubmit && onSubmit("Handwritten Payload Secured");
    }, 3000);
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {!voidMode ? (
          <motion.div
            key="paper-container"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8">
              <Paper3D>
                <div className="w-[600px] h-[400px] relative">
                  {/* Paper lines background effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-10" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, #000 28px)'
                    }} 
                  />
                  <InkCanvas />
                </div>
              </Paper3D>
              
              {/* The Pen Cursor only active over the paper area effectively */}
              <PenCursor />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold tracking-widest uppercase shadow-2xl border border-white/10 hover:bg-black transition-colors"
            >
              Seal & Destroy Identity
            </motion.button>
          </motion.div>
        ) : (
          <VoidCollapse key="void-sequence" />
        )}
      </AnimatePresence>
      
      {!voidMode && (
        <p className="mt-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">
           Using biometric ink transmission...
        </p>
      )}
    </div>
  );
}
