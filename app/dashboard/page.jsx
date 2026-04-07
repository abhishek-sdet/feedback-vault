'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderBar from "../components/dashboard/HeaderBar";
import VaultCore from "../components/dashboard/VaultCore";
import StatsStrip from "../components/dashboard/StatsStrip";
import MessageStream from "../components/dashboard/MessageStream";
import MessageDetail from "../components/dashboard/MessageDetail";
import SettingsModal from "../components/dashboard/SettingsModal";
import { RefreshCcw, Unlock } from 'lucide-react';

const C = {
  bg: '#0b0f19',
  surface: '#111827',
  parchment: '#fffdfa',
};

// ─── Login Guard ──────────────────────────────────────────────────
function DashboardLogin({ onUnlock }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard', { headers: { Authorization: key } });
      if (res.ok) {
        localStorage.setItem('vault_auth_key', key);
        onUnlock(key);
      }
      else setError('Invalid access key.');
    } catch {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0f19]">
       <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#fffdfa] p-12 shadow-2xl rounded-sm"
      >
        <div className="flex flex-col items-center mb-10">
          <img src="/sdet-logo.png" alt="SDET Official Logo" className="h-10 mb-8 object-contain" />
          <h1 className="text-3xl font-serif text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Silent Records</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 font-bold">Warden Authorization Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label htmlFor="access-key" className="sr-only">Access Key</label>
          <input
            id="access-key"
            type="password"
            placeholder="Access Key"
            value={key}
            onChange={e => setKey(e.target.value)}
            aria-describedby={error ? "login-error" : undefined}
            className="w-full bg-black/5 border-b border-black/10 py-4 px-4 outline-none focus:border-black/30 text-black font-serif italic"
          />
          {error && <p id="login-error" className="text-red-600 text-[10px] uppercase font-bold tracking-widest text-center" role="alert">{error}</p>}
          <button
            className="w-full py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            disabled={loading}
          >
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Access Archives'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function DashboardPage() {
  const [authKey, setAuthKey] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newAlert, setNewAlert] = useState(null); // { id, type }
  const [lastId, setLastId] = useState(null);

  const fetchData = useCallback(async (key, isSilent = false) => {
    if (!key) return;
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch('/api/dashboard', { headers: { Authorization: key } });
      if (res.ok) {
        const json = await res.json();
        
        // --- New Message Detection ---
        if (json.length > 0) {
          const firstId = json[0].id;
          if (lastId && firstId !== lastId) {
            // New record arrived!
            setNewAlert(json[0]);
          }
          setLastId(firstId);
        }
        setData(json);

      } else if (res.status === 401) {
        localStorage.removeItem('vault_auth_key');
        setAuthKey(null);
      }
    } catch {
      // Silence background connection errors
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [lastId]);

  const updateEntry = async (id, status) => {
    const res = await fetch('/api/dashboard', { 
      method: 'PATCH', 
      headers: { Authorization: authKey, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id, status }) 
    });
    if (res.status === 401) {
      localStorage.removeItem('vault_auth_key');
      setAuthKey(null);
    } else {
      fetchData(authKey, true); // Silent refresh
    }
  };

  const deleteEntry = async (id) => {
    const res = await fetch('/api/dashboard', { 
      method: 'DELETE', 
      headers: { Authorization: authKey, 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id }) 
    });
    if (res.status === 401) {
      localStorage.removeItem('vault_auth_key');
      setAuthKey(null);
    } else {
      fetchData(authKey, true); // Silent refresh
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vault_auth_key');
    setAuthKey(null);
  };

  const handleKeyUpdate = (newKey) => {
    localStorage.setItem('vault_auth_key', newKey);
    setAuthKey(newKey);
  };

  // Initial Load
  useEffect(() => {
    const saved = localStorage.getItem('vault_auth_key');
    if (saved) {
      setAuthKey(saved);
      fetchData(saved);
    }
  }, []);

  // Background Polling (10s sync)
  useEffect(() => {
    if (!authKey) return;
    const interval = setInterval(() => {
      fetchData(authKey, true);
    }, 10000);
    return () => clearInterval(interval);
  }, [authKey, fetchData]);

  const handleUnlock = (key) => {
    setAuthKey(key);
    fetchData(key);
  };

  if (!authKey) return <DashboardLogin onUnlock={handleUnlock} />;

  const stats = {
    total: data.length,
    unread: data.filter(d => d.status === 'UNREAD').length,
    grievances: data.filter(d => d.type === 'GRIEVANCE').length
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-8 md:px-16 py-12 selection:bg-emerald-500/20">
      
      {/* --- Point: Interactive Notifications --- */}
      <AnimatePresence>
        {newAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-[100] w-full max-w-md px-6 pointer-events-auto cursor-pointer"
            onClick={() => {
              setSelected(newAlert);
              setNewAlert(null);
            }}
          >
            <div className="bg-white/5 border border-emerald-500/30 backdrop-blur-3xl p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between group overflow-hidden">
               {/* Pulse bg */}
               <div className="absolute inset-0 bg-emerald-500/[0.03] animate-pulse" />
               
               <div className="relative z-10 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <RefreshCcw className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">New Record Detected</h4>
                    <p className="text-xs text-white/70 font-medium">A new payload just arrived in the vault.</p>
                 </div>
               </div>

               <div className="relative z-10 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">View Record</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <HeaderBar 
        onLogout={handleLogout} 
        onSettings={() => setIsSettingsOpen(true)}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center mt-12"
      >
        <VaultCore />
        
        <div className="mb-20 text-center">
          <h1 className="text-6xl font-medium tracking-tight italic mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Records
          </h1>
          <p className="text-[10px] tracking-[0.5em] font-bold text-white/20 uppercase">Archived Payloads Found</p>
        </div>

        <StatsStrip 
          total={stats.total} 
          unread={stats.unread} 
          grievances={stats.grievances}
        />

        {loading ? (
          <div className="py-20 opacity-20">
            <RefreshCcw size={24} className="animate-spin" />
          </div>
        ) : (
          <MessageStream
            messages={data}
            onSelect={setSelected}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
          />
        )}
      </motion.div>

      <MessageDetail 
        message={selected} 
        onClose={() => setSelected(null)} 
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        authKey={authKey}
        onKeyUpdate={handleKeyUpdate}
      />
    </div>
  );
}
