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

  const fetchData = useCallback(async (key) => {
    if (!key) return;
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard', { headers: { Authorization: key } });
      if (res.ok) setData(await res.json());
      else if (res.status === 401) {
        localStorage.removeItem('vault_auth_key');
        setAuthKey(null);
      }
    } catch {
      // Silence connection errors
    } finally {
      setLoading(false);
    }
  }, []);

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
      fetchData(authKey);
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
      fetchData(authKey);
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

  useEffect(() => {
    const saved = localStorage.getItem('vault_auth_key');
    if (saved) {
      setAuthKey(saved);
      fetchData(saved);
    }
  }, [fetchData]);

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
