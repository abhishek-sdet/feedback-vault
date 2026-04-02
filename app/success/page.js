"use client";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import "../../styles/vault.css";

export default function Success() {
  return (
    <main className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center">
      {/* Background radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,250,240,0.015) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="mb-8"
      >
        <img src="/sdet-logo.png" alt="SDET Logo" className="h-10 w-auto object-contain brightness-0 invert opacity-40 mx-auto" />
      </motion.div>

      {/* Subtle Success Indicator */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 relative"
      >
        <div className="w-[80px] h-[80px] rounded-full border border-emerald-500/20 flex items-center justify-center">
          <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.5, duration: 0.5 }}
             className="w-[12px] h-[12px] rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
          />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-4xl font-medium mb-6 text-slate-100"
      >
        Sealed & Secured.
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.7, duration: 1 }}
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="text-slate-400 text-sm max-w-sm mb-16 font-light leading-relaxed tracking-wide"
      >
        Your submission has been mixed into the global vault. Even we cannot trace this back to your device. SDET Tech thanks you for your honesty.
      </motion.p>

      <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         transition={{ delay: 1.2 }}
      >
        <Link href="/">
          <button 
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 hover:text-slate-200 transition-colors border border-white/5 py-3 px-8 rounded-sm hover:border-white/10"
          >
            <ChevronLeft size={14} className="opacity-50" /> Return to Entry
          </button>
        </Link>
      </motion.div>
    </main>
  );
}
