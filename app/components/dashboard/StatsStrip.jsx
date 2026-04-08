"use client";

import { motion } from "framer-motion";

export default function StatsStrip({ total, unread, grievances }) {
  return (
    <section aria-label="Quick Statistics" className="w-full max-w-4xl mb-16">
      <div className="grid grid-cols-3 gap-0 border-y border-slate-100 bg-slate-50/30 backdrop-blur-sm rounded-lg overflow-hidden">
        
        {/* Total Stats */}
        <div className="flex flex-col items-center justify-center py-12 px-6 border-r border-slate-100 group hover:bg-slate-50 transition-all relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.05 }}
            className="absolute inset-0 bg-blue-500 blur-3xl pointer-events-none" 
          />
          <span className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4 z-10">
            Total Records
          </span>
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-6xl font-medium text-slate-900 tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
              {total}
            </span>
          </div>
          {/* Scanline */}
          <motion.div 
            animate={{ y: [-100, 300] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-slate-200 opacity-20"
          />
        </div>

        {/* Unread Stats */}
        <div className="flex flex-col items-center justify-center py-12 px-6 border-r border-slate-100 group hover:bg-emerald-50 transition-all relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
            className="absolute inset-0 bg-emerald-400 blur-3xl pointer-events-none" 
          />
          <span className="text-sm font-black text-emerald-600/60 uppercase tracking-[0.3em] mb-4 z-10">
            New Archival
          </span>
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-6xl font-medium text-emerald-600 tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
              {unread}
            </span>
          </div>
          {/* Scanline */}
          <motion.div 
            animate={{ y: [-100, 300] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-emerald-500/10 opacity-30"
          />
        </div>

        {/* Critical Stats */}
        <div className="flex flex-col items-center justify-center py-12 px-6 group hover:bg-red-50 transition-all relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
            className="absolute inset-0 bg-red-400 blur-3xl pointer-events-none" 
          />
          <span className="text-sm font-black text-red-600/60 uppercase tracking-[0.3em] mb-4 z-10">
            High Priority
          </span>
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-6xl font-medium text-red-600 tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
              {grievances}
            </span>
          </div>
          {/* Scanline */}
          <motion.div 
            animate={{ y: [-100, 300] }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-red-500/10 opacity-30"
          />
        </div>

      </div>
    </section>
  );
}
