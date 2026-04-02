'use client';

import { useState, useCallback, useEffect } from 'react';
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

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--background)]"
    >
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
            className="absolute w-[2px] h-[2px] bg-slate-400/20 rounded-full"
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

      {/* Ambient background glow - Enhanced */}
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900, height: 700,
          background: 'radial-gradient(ellipse, rgba(71,85,105,0.12) 0%, transparent 80%)',
        }}
      />

      {/* Minimal top nav - High Contrast */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-10 py-8 z-50 bg-slate-950/20 backdrop-blur-md"
        role="navigation"
        aria-label="Primary Vault Navigation"
      >
        <div className="flex items-center gap-4">
          <img src="/sdet-logo.png" alt="SDET Official Logo" className="h-9 w-auto object-contain" />
          <div className="h-4 w-px bg-white/20" aria-hidden="true" />
          <span className="font-serif text-[15px] text-slate-200 tracking-widest font-medium uppercase">
            DIRECT TO KAPIL
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/50 border border-white/5" aria-label="System status: Secure Transmission active">
          <div className="w-[8px] h-[8px] rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} aria-hidden="true" />
          <span className="font-sans text-[11px] text-emerald-400 font-black tracking-widest uppercase">
            ENCRYPTED LINE
          </span>
        </div>
      </motion.nav>

      {/* Screen Reader Status - ARIA Live Region */}
      <div className="sr-only" aria-live="polite" role="status">
        {phase === 'envelope' && "Ready to start. Select the envelope to begin your direct communication with Kapil."}
        {phase === 'trust' && "Message from Kapil: I am listening. Your words come directly to me."}
        {phase === 'letter' && "Writing your confidential record for Kapil. Your identity is protected."}
        {phase === 'sealing' && "Encrypting your record for Kapil's eyes only. Identity sanitization in progress."}
        {phase === 'void' && "Confidential record transferred to Kapil's deep vault."}
        {phase === 'success' && "Submission successful. Your record has been delivered directly to Kapil."}
      </div>

      {/* Main stage - FIXED MARGIN/PADDING FOR HEADER OVERLAP */}
      <main className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center gap-12 pt-32 pb-20" aria-labelledby="vault-heading">
        <h1 id="vault-heading" className="sr-only">The Silent Vault Submission Stage</h1>
        <AnimatePresence mode="wait">
          {/* ... existing phases unchanged ... */}

          {phase === 'envelope' && (
            <motion.div key="envelope">
              <PremiumEnvelope onOpen={handleEnvelopeOpen} />
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
