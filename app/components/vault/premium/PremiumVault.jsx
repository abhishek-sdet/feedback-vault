'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PremiumEnvelope from './PremiumEnvelope';
import TrustMessage from './TrustMessage';
import PremiumLetter from './PremiumLetter';
import FoldAnimation from './FoldAnimation';
import VoidAnimation from './VoidAnimation';
import SuccessScreen from './SuccessScreen';
import useAdaptiveTiming from './cinematic/useAdaptiveTiming';
import { useRouter } from 'next/navigation';

// State machine: envelope → trust → letter → sealing → fold1 → fold2 → drop → void → done
export default function PremiumVault() {
  const [phase, setPhase] = useState('envelope');
  const [text, setText] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [attachments, setAttachments] = useState({ image: null, video: null, file: null });
  
  const [foldPhase, setFoldPhase] = useState('sealing');
  const [isDissolving, setIsDissolving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const phaseContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate adaptive delays based on current text
  const { foldDelay, dropDelay, voidDelay } = useAdaptiveTiming(text);

  const handleEnvelopeOpen = useCallback(() => {
    setPhase('trust');
  }, []);

  const handleTrustComplete = useCallback(() => {
    setPhase('letter');
  }, []);

  // Smart Classification Helper
  const classifyFeedback = (content) => {
    const grievanceKeywords = ['broken', 'issue', 'problem', 'bad', 'hate', 'fail', 'error', 'slow', 'angry', 'worst', 'stuck', 'help', 'not working'];
    const lowercaseContent = content.toLowerCase();
    return grievanceKeywords.some(kw => lowercaseContent.includes(kw)) ? 'GRIEVANCE' : 'FEEDBACK';
  };

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return;
    
    // Step 0: Start dissolution (Text encrypts and ink lifts)
    setIsDissolving(true);

    // Step 1: Wait for dissolution to complete, then start sealing
    setTimeout(() => {
      setPhase('sealing');
    }, foldDelay * 0.8);

    // Step 2: Fold stages
    setTimeout(() => setFoldPhase('fold1'), foldDelay);
    setTimeout(() => setFoldPhase('fold2'), foldDelay + (dropDelay - foldDelay) / 2);
    setTimeout(() => setFoldPhase('drop'), dropDelay);
    
    // Step 3: Transition to void (Impact)
    setTimeout(() => setPhase('void'), voidDelay);

    // Prepare FormData
    const formData = new FormData();
    formData.append('content', text);
    formData.append('employee_name', employeeName);
    formData.append('employee_email', employeeEmail);
    formData.append('employee_phone', employeePhone);
    formData.append('is_anonymous', isAnonymous.toString());
    if (attachments.image) formData.append('image', attachments.image);
    if (attachments.video) formData.append('video', attachments.video);
    if (attachments.file) formData.append('file', attachments.file);

    try {
      fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
    } catch { /* silent */ }
  }, [text, employeeName, isAnonymous, attachments, foldDelay, dropDelay, voidDelay]);

  const handleVoidComplete = useCallback(() => {
    setPhase('success');
  }, []);

  const handleReset = useCallback(() => {
    setPhase('envelope');
    setText('');
    setEmployeeName('');
    setEmployeeEmail('');
    setEmployeePhone('');
    setIsAnonymous(true);
    setAttachments({ image: null, video: null, file: null });
    setIsDissolving(false);
    setFoldPhase('sealing');
  }, []);

  // --- Asset Accessibility: Focus Management ---
  useEffect(() => {
    if (phaseContainerRef.current) {
      phaseContainerRef.current.focus({ preventScroll: true });
    }
  }, [phase]);

  const handleEnvelopeKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnvelopeOpen();
    }
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center transition-all duration-1000 ${
        (phase === 'success' || phase === 'trust') ? 'justify-center pt-0 overflow-hidden' : 'justify-start pt-0 pb-20 overflow-y-auto'
      }`}
    >
      <div className="mesh-bg" aria-hidden="true" />
      {/* Cinematic Film Grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-[99]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
        aria-hidden="true"
      />

      {/* Digital Stardust - Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-blue-500/20 rounded-full"
            initial={{ 
              x: Math.random() * 2000 - 1000, 
              y: Math.random() * 2000 - 1000,
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute pointer-events-none opacity-[0.1]"
        aria-hidden="true"
        style={{
          top: '20%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1000px, 180vw)', height: 'min(800px, 140vh)',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)',
        }}
      />

      {/* Minimal top nav - High Contrast / Human Tone */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-12 py-7 z-50 bg-white/70 backdrop-blur-3xl border-b border-indigo-500/10 shadow-[0_10px_40px_rgba(30,27,75,0.03)]"
        role="navigation"
        aria-label="Primary Vault Navigation"
      >
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <img src="/sdet-logo.png" alt="SDET Official Logo" className="h-7 md:h-9 w-auto object-contain" />
          <div className="h-4 w-[2px] bg-indigo-600 hidden sm:block" aria-hidden="true" />
          <span className="font-serif text-[11px] md:text-[16px] text-indigo-950 tracking-[0.25em] font-black uppercase hidden sm:block">
            Open Channel <span className="text-indigo-600/40 px-2">//</span> Your Voice to Kapil
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-50/50 border border-blue-100/50 shadow-sm shadow-blue-500/5" aria-label="System status: Secure Transmission active">
          <div className="w-[8px] h-[8px] rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} aria-hidden="true" />
          <span className="font-sans text-[11px] text-emerald-400 font-black tracking-widest uppercase">
            Safe & Encrypted
          </span>
        </div>
      </motion.nav>

      {/* Screen Reader Status - ARIA Live Region */}
      <div className="sr-only" aria-live="polite" role="status">
        {phase === 'envelope' && "Employee Voice Platform. Ready to start. Select the envelope below to begin your direct communication safely."}
        {phase === 'trust' && "I am listening. If something feels wrong or improvable — tell us. Your words are protected."}
        {phase === 'letter' && "Sharing your thoughts. You are in a safe space."}
        {phase === 'sealing' && "Moving your message to the secure vault. Your privacy is our priority."}
        {phase === 'void' && "Your voice has reached Kapil's vault."}
        {phase === 'success' && "Thank you for speaking up. Your feedback helps improve the company."}
      </div>

      {/* Main stage - FIXED MARGIN/PADDING FOR HEADER OVERLAP */}
      <main className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center gap-10 pt-24 pb-20" aria-labelledby="vault-heading">
        <h2 id="vault-heading" className="sr-only">The Safe Submission Stage</h2>
        
        <AnimatePresence mode="wait">
          {phase === 'envelope' && (
            <motion.div 
              key="envelope"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-12 w-full"
            >
              {/* Point 2: Entry Page / Landing Screen - Sovereign Branding */}
              <div className="text-center space-y-6 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-10 py-3 rounded-full border border-indigo-600/20 bg-indigo-600/[0.03] shadow-[0_10px_30px_rgba(37,99,235,0.05)] backdrop-blur-xl"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-600">Sovereign Direct Access</span>
                </motion.div>
                
                <h1 className="text-[clamp(3rem,15vw,5rem)] font-serif italic text-gradient tracking-tighter leading-[0.95] pb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  I am listening. <br/> Speak freely.
                </h1>

                {/* Point 2: CEO Message - Personal Note Tone */}
                <p className="text-indigo-950/70 text-[16px] md:text-[18px] font-light leading-relaxed max-w-xl mx-auto tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                  "I personally guarantee that your voice reaches my desk without a single filter. 
                  Share your truth, and we will build a stronger SDET together."
                  <span className="block mt-8 text-[11px] uppercase tracking-[0.4em] font-black text-indigo-600/50">— Kapil, Founder</span>
                </p>
              </div>

              {/* Point 1: Trust Assurances - "My 4 Promises" Grid */}
              <div className="w-full max-w-3xl space-y-6">
                <div className="flex items-center gap-6 px-12">
                  <div className="h-[1px] flex-grow bg-slate-100" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-950/20">The 4 Core Protections</span>
                  <div className="h-[1px] flex-grow bg-slate-100" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                      { label: "No IP tracking", detail: "I will never log your digital footprint" },
                      { label: "Total Anonymity", detail: "Your identity remains your choice" },
                      { label: "Direct Access", detail: "Your voice reaches my desk directly" },
                      { label: "Zero Retaliation", detail: "I guarantee a safe space for honesty" }
                    ].map((trust, i) => (
                      <motion.div
                        key={trust.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="p-10 rounded-[2.5rem] bg-white border border-indigo-50 backdrop-blur-3xl transition-all duration-700 group cursor-default shadow-[0_20px_60px_-20px_rgba(30,27,75,0.05)] hover:shadow-[0_60px_100px_-20px_rgba(37,99,235,0.12)] hover:-translate-y-4"
                      >
                        <div className="flex flex-col gap-6">
                           <div className="w-[16px] h-[16px] rounded-full bg-indigo-50 group-hover:bg-indigo-600 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
                           <h4 className="text-[12px] font-black uppercase tracking-[0.25em] text-indigo-950 group-hover:text-indigo-600 transition-colors">{trust.label}</h4>
                           <p className="text-[11px] text-slate-500 leading-relaxed font-medium tracking-wide opacity-80">{trust.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>

                <div 
                  className="flex flex-col items-center gap-6 mt-12 w-full max-w-sm"
                  ref={phaseContainerRef}
                  tabIndex={-1}
                  aria-live="polite"
                >
                  <div className="flex flex-col items-center gap-3">
                     <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] animate-pulse">
                      Ready? Open the vault below
                    </p>
                     {/* Directional Indicator */}
                     <svg 
                       className="w-4 h-4 text-emerald-500/40 animate-bounce"
                       fill="none" 
                       viewBox="0 0 24 24" 
                       stroke="currentColor"
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                     </svg>
                  </div>

                  <div 
                    className="relative group p-4 outline-none focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-xl"
                    role="button"
                    tabIndex={0}
                    aria-label="Open the secure vault envelope"
                    onKeyDown={handleEnvelopeKeyDown}
                  >
                    <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                    <PremiumEnvelope onOpen={handleEnvelopeOpen} />
                  </div>
                </div>
            </motion.div>
          )}

          {phase === 'trust' && (
            <motion.div
              key="trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TrustMessage onComplete={handleTrustComplete} />
            </motion.div>
          )}

          {phase === 'letter' && (
            <motion.div key="letter" className="w-full">
              <PremiumLetter
                text={text}
                onChange={setText}
                employeeName={employeeName}
                onNameChange={setEmployeeName}
                employeeEmail={employeeEmail}
                onEmailChange={setEmployeeEmail}
                employeePhone={employeePhone}
                onPhoneChange={setEmployeePhone}
                isAnonymous={isAnonymous}
                onAnonymousChange={setIsAnonymous}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                onSubmit={handleSubmit}
                isDissolving={isDissolving}
              />
            </motion.div>
          )}

          {phase === 'sealing' && (
            <motion.div
              key="sealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <FoldAnimation phase={foldPhase} />
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <SuccessScreen onReset={handleReset} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Void overlay — rendered on top when active */}
      <AnimatePresence>
        {phase === 'void' && (
          <VoidAnimation onComplete={handleVoidComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
