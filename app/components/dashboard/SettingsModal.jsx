'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsModal({ isOpen, onClose, authKey, onKeyUpdate }) {
  const [currentKey, setCurrentKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCurrentKey();
    } else {
      setError("");
      setSuccess(false);
      setNewKey("");
    }
  }, [isOpen]);

  const fetchCurrentKey = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/settings", {
        headers: { Authorization: authKey },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentKey(data.accessKey);
      } else {
        setError("Failed to load settings.");
      }
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newKey.length < 4) {
      setError("New key must be at least 4 characters.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "POST",
        headers: { 
          Authorization: authKey,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ newKey }),
      });
      
      if (res.ok) {
        setSuccess(true);
        onKeyUpdate(newKey);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Update failed.");
      }
    } catch {
      setError("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-slate-100 rounded-xl overflow-hidden z-[201] shadow-[0_30px_100px_rgba(0,0,0,0.15)]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Key className="w-5 h-5 text-emerald-500" />
                  Security Settings
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">Management Console</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Current Access Key</label>
                <div className="bg-slate-50 border border-slate-100 rounded p-4 text-emerald-600/50 font-mono text-sm tracking-widest truncate">
                  {loading && !currentKey ? "Fetching..." : currentKey.replace(/./g, "•")}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black">New Access Key</label>
                <input
                  type="password"
                  placeholder="Minimum 4 characters"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded p-4 text-slate-900 font-mono text-sm tracking-widest outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-[11px] uppercase tracking-wider font-bold"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-emerald-600 text-[11px] uppercase tracking-wider font-bold"
                >
                  <ShieldCheck size={14} />
                  Vault Secret Updated Successfully
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-4 rounded font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  loading || success 
                  ? 'bg-emerald-50 text-emerald-600/50 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update Credentials"
                )}
              </button>
            </form>

            {/* Footer Tip */}
            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.1em]">
                Updating the key will sync immediately across all active sessions.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
