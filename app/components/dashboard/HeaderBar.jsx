import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ZeroKnowledgeIndicator from "./ZeroKnowledgeIndicator";
import { Bell, Clock, ChevronRight, Mail, Shield, Zap, CheckCircle2 } from "lucide-react";

export default function HeaderBar({ onLogout, onSettings, unreadCount = 0, unreadItems = [], onSelectMessage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header role="banner" className="grid grid-cols-3 items-center mb-12 py-6 px-4 border-b border-slate-100 bg-white/50 backdrop-blur-md rounded-t-xl relative z-[110]">
      {/* Left: Logo & Home */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-24 relative overflow-hidden bg-slate-50 rounded p-1 border border-slate-200">
          <img 
            src="/sdet-logo.png" 
            alt="SDET Logo" 
            className="h-full w-full object-contain" 
          />
        </div>
      </div>

      {/* Center: Title & Security Status */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-[11px] tracking-[0.5em] font-black text-slate-400 uppercase">
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
            className={`relative transition-all duration-300 p-2 rounded-lg ${isDropdownOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <>
                <motion.span 
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
                <span className="absolute -top-2 -right-2 text-[8px] font-black bg-emerald-500 text-white px-1 rounded-full min-w-[14px] text-center shadow-lg">
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
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-2xl shadow-[0_30px_60px_rgba(15,23,42,0.15)] overflow-hidden z-[120]"
                >
                  {/* Dropdown Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex flex-col">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Intelligence Brief</h3>
                      <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">Real-time Archival Stream</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest hover:bg-emerald-100 transition-colors">
                      <CheckCircle2 size={10} /> Clear Brief
                    </button>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                    {unreadItems.length > 0 ? (
                      unreadItems.map((item, idx) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                            onSelectMessage(item);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left p-6 hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0 group flex gap-5"
                        >
                          {/* Left Column: Icon & ID */}
                          <div className="flex flex-col items-center gap-3 shrink-0 pt-1">
                            <div className={`p-2.5 rounded-xl border ${
                              item.type === 'GRIEVANCE' 
                                ? 'bg-red-50 text-red-500 border-red-100' 
                                : item.type === 'IDEA'
                                ? 'bg-violet-50 text-violet-600 border-violet-100'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {item.type === 'GRIEVANCE' ? <Shield size={14} /> : item.type === 'IDEA' ? <Zap size={14} /> : <Mail size={14} />}
                            </div>
                            <div className="h-full w-px bg-slate-100 group-last:hidden" />
                          </div>

                          {/* Right Column: Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-900 tracking-[0.2em] uppercase">{item.feedbackId}</span>
                              <div className="flex flex-col items-end text-[8px] text-slate-400 font-bold bg-white border border-slate-100 px-2 py-1 rounded shadow-sm">
                                <div className="flex items-center gap-1">
                                  <Clock size={8} />
                                  <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span className="text-[7px] text-slate-300 uppercase tracking-tighter">{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                              </div>
                            </div>
                            
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                              "{item.content}"
                            </p>
                            
                            <div className="flex items-center justify-between pt-1">
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                item.urgency === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {item.urgency || 'Standard'} Priority
                              </span>
                              <span className="flex items-center text-[9px] text-emerald-600 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                View Secure Record <ChevronRight size={10} className="ml-1" />
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      ))
                    ) : (
                      <div className="py-20 px-10 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                          <CheckCircle2 size={28} className="text-slate-200" />
                        </div>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Aura Neutralized</h4>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-2">Archives are securely up to date</p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Vault Protocol Active</p>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-emerald-500/30 rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-1 bg-emerald-500/10 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <button 
           onClick={onSettings}
           className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-slate-900 transition-colors py-2 uppercase"
           aria-label="Account Settings"
        >
          SETTINGS
        </button>

        <button 
           onClick={onLogout}
           className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-red-500 transition-colors py-2 uppercase"
           aria-label="Logout"
        >
          LOGOUT
        </button>

        <div className="flex items-center gap-2.5 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
          <motion.div
            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-[10px] tracking-[0.15em] font-black text-emerald-600 uppercase">
            LIVE SYNC
          </span>
        </div>
      </div>
    </header>
  );
}
