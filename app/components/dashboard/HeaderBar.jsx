import { motion } from "framer-motion";
import ZeroKnowledgeIndicator from "./ZeroKnowledgeIndicator";

export default function HeaderBar({ onLogout, onSettings }) {
  return (
    <header role="banner" className="grid grid-cols-3 items-center mb-12 py-6 px-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-t-xl">
      {/* Left: Logo & Home */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onLogout}
          aria-label="Logout"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-secondary group"
        >
          <div className="h-10 w-24 relative overflow-hidden bg-white/5 rounded p-1 border border-white/10">
            <img 
              src="/sdet-logo.png" 
              alt="SDET Logo" 
              className="h-full w-full object-contain" 
            />
          </div>
        </button>
      </div>

      {/* Center: Title & Security Status */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-[11px] tracking-[0.5em] font-black text-slate-500 uppercase">
          THE SILENT VAULT
        </h1>
        <ZeroKnowledgeIndicator />
      </div>

      {/* Right: Actions & Secure Pill */}
      <div className="flex items-center justify-end gap-6">
        <button 
           onClick={onSettings}
           className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-white transition-colors py-2 uppercase"
           aria-label="Account Settings"
        >
          SETTINGS
        </button>

        <button 
           onClick={onLogout}
           className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-red-400 transition-colors py-2 uppercase"
           aria-label="Logout"
        >
          LOGOUT
        </button>

        <div className="flex items-center gap-2.5 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <motion.div
            className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-[10px] tracking-[0.15em] font-black text-emerald-400 uppercase">
            LIVE SYNC
          </span>
        </div>
      </div>
    </header>
  );
}
