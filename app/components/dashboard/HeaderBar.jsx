import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ZeroKnowledgeIndicator from "./ZeroKnowledgeIndicator";
import { Bell, Clock, ChevronRight } from "lucide-react";

export default function HeaderBar({ onLogout, onSettings, unreadCount = 0, unreadItems = [], onSelectMessage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header role="banner" className="grid grid-cols-3 items-center mb-12 py-6 px-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-t-xl relative z-[110]">
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
        {/* Notification Bell & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative transition-all duration-300 p-2 rounded-lg ${isDropdownOpen ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <>
                <motion.span 
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
                <span className="absolute -top-2 -right-2 text-[8px] font-black bg-emerald-500 text-slate-950 px-1 rounded-full min-w-[14px] text-center shadow-lg">
                  {unreadCount}
                </span>
              </>
            )}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Backdrop Overlay to close */}
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-slate-900/90 border border-white/10 backdrop-blur-3xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[120]"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Arrivals</h3>
                    <span className="text-[9px] font-bold text-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {unreadCount} New
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {unreadItems.length > 0 ? (
                      unreadItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectMessage(item);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left p-4 hover:bg-emerald-500/5 transition-colors border-b border-white/5 last:border-0 group relative overflow-hidden"
                        >
                          <div className="flex items-start gap-3 relative z-10">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.urgency === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} />
                            <div className="space-y-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white tracking-widest uppercase">{item.feedbackId}</span>
                                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold">
                                  <Clock size={10} />
                                  <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 font-medium truncate italic leading-relaxed">
                                "{item.content.substring(0, 45)}..."
                              </p>
                              <div className="flex items-center text-[9px] text-emerald-500/40 font-black uppercase tracking-widest pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Open Vault <ChevronRight size={10} className="ml-1" />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.02] to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                      ))
                    ) : (
                      <div className="py-12 px-6 text-center">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/5">
                          <Bell size={20} className="text-slate-600" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vault Securely Empty</p>
                      </div>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Monitoring Active</p>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

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
