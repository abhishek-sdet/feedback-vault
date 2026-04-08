'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingArea from './TypingArea';
import CryptoDissolve from './cinematic/CryptoDissolve';
import InkDissolve from './cinematic/InkDissolve';
import { Camera, Video, Paperclip, X, User, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function PremiumLetter({ 
  text, onChange, 
  employeeName, onNameChange,
  employeeEmail, onEmailChange,
  employeePhone, onPhoneChange,
  isAnonymous, onAnonymousChange,
  attachments, onAttachmentsChange,
  onSubmit, disabled, isDissolving 
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const paperRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!paperRef.current || isDissolving) return;
    const rect = paperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -3, y: dx * 3 }); // max 3 degrees
  }, [isDissolving]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachmentsChange({ ...attachments, [type]: file });
    }
  };

  const removeAttachment = (type) => {
    onAttachmentsChange({ ...attachments, [type]: null });
  };

  const canSubmit = text.trim().length > 0 && !disabled && !isDissolving;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-8 w-full"
    >
      {/* Paper Segment */}
      <motion.div
        ref={paperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isDissolving ? 0.98 : 1,
          boxShadow: isDissolving 
            ? '0 10px 40px rgba(0,0,0,0.1)' 
            : `
              ${-tilt.y * 2}px ${tilt.x * 2 + 20}px 60px rgba(0,0,0,0.1),
              0 4px 20px rgba(0,0,0,0.05)
            `,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        className="paper-surface w-full max-w-[min(620px,92vw)] rounded-sm relative overflow-hidden flex flex-col"
      >
        <div className="p-6 sm:p-10 md:p-14 relative z-10 flex-grow" style={{ minHeight: 'clamp(350px, 60vh, 550px)' }}>
          {/* Ink Dissolve Overlay */}
          <InkDissolve trigger={isDissolving} />

          {/* Letter header */}
          <div className="flex justify-between items-start mb-12 border-b border-black/[0.03] pb-8">
            <div className="flex flex-col gap-4">
              <div className="h-10 w-24 relative overflow-hidden bg-white/5 rounded p-1 border border-black/5 opacity-50">
                <img src="/sdet-logo.png" alt="SDET" className="h-full w-full object-contain" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[12px] font-black tracking-[0.2em] uppercase text-black/60 font-sans">
                  Personal & Confidential
                </h4>
                <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 font-bold">
                  Directly to my desk
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: 'rgba(45,36,22,0.6)', fontWeight: 600, fontStyle: 'italic' }}>
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <div className="w-12 h-0.5 bg-black/[0.05] ml-auto mt-2 rounded-full" />
            </div>
          </div>

          {/* Writing area */}
          <div style={{ minHeight: 180, marginBottom: 'clamp(20px, 5vh, 40px)' }} role="textbox" aria-multiline="true" aria-label="Your Feedback Content">
            {isDissolving ? (
              <CryptoDissolve text={text} trigger={true} />
            ) : (
              <TypingArea value={text} onChange={onChange} disabled={disabled} />
            )}
          </div>

          {/* Attachments & Identity Section */}
          <AnimatePresence>
            {!isDissolving && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 md:pt-8 border-t border-black/5 space-y-6 md:space-y-8"
              >
                {/* Identity Field */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    {!isAnonymous && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-grow w-full max-w-sm relative group"
                      >
                        <User size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-black/60 transition-colors" />
                        <label htmlFor="employee-name" className="sr-only">Your Name (Optional)</label>
                        <input 
                          id="employee-name"
                          type="text"
                          placeholder="Your Name (Optional)"
                          value={employeeName}
                          onChange={(e) => onNameChange(e.target.value)}
                          className="w-full bg-transparent pl-7 py-2 border-b border-black/10 outline-none font-serif italic text-sm text-black font-bold transition-all placeholder:text-black/20 focus:border-black/40 opacity-80"
                        />
                      </motion.div>
                    )}

                    <div className={isAnonymous ? "w-full flex justify-end" : ""}>
                      <button 
                        onClick={() => onAnonymousChange(!isAnonymous)}
                        role="switch"
                        aria-checked={isAnonymous}
                        aria-label="Stay Anonymous"
                        className="flex items-center gap-3 group shrink-0 focus-secondary rounded-full p-1"
                      >
                      <div className={`w-11 h-6 rounded-full relative transition-all duration-500 ease-in-out ${isAnonymous ? 'bg-black' : 'bg-black/10'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-500 cubic-bezier(0.68, -0.55, 0.265, 1.55) ${isAnonymous ? 'left-6' : 'left-1'}`} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-black/50 group-hover:text-black/80 transition-colors flex items-center gap-1.5">
                          Choose Anonymous Mode
                        </span>
                        {isAnonymous && (
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[8px] uppercase font-bold tracking-widest text-emerald-600 flex items-center gap-1 mt-0.5"
                          >
                            <ShieldCheck size={8} /> Secure Archive
                          </motion.span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {!isAnonymous && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="relative group">
                        <Mail size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-black/60 transition-colors" />
                        <label htmlFor="employee-email" className="sr-only">Your Email ID</label>
                        <input 
                          id="employee-email"
                          type="email"
                          placeholder="Your Email ID"
                          value={employeeEmail}
                          onChange={(e) => onEmailChange(e.target.value)}
                          className="w-full bg-transparent pl-7 py-2 border-b border-black/10 outline-none font-serif italic text-sm text-black font-bold transition-all placeholder:text-black/20 focus:border-black/40 opacity-80"
                        />
                      </div>
                      <div className="relative group">
                        <Phone size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-black/60 transition-colors" />
                        <label htmlFor="employee-phone" className="sr-only">Phone Number</label>
                        <input 
                          id="employee-phone"
                          type="tel"
                          placeholder="Phone Number"
                          value={employeePhone}
                          onChange={(e) => onPhoneChange(e.target.value)}
                          className="w-full bg-transparent pl-7 py-2 border-b border-black/10 outline-none font-serif italic text-sm text-black font-bold transition-all placeholder:text-black/20 focus:border-black/40 opacity-80"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Media Attachment Hub */}
                <div className="flex flex-wrap gap-4">
                   {/* Capture Buttons */}
                   <div className="flex gap-2">
                     <button 
                       onClick={() => imageInputRef.current?.click()}
                       className={`flex items-center gap-2 px-4 py-2 rounded-sm border border-black/5 hover:bg-black/5 transition-all text-[10px] font-bold uppercase tracking-widest ${attachments.image ? 'text-emerald-700 bg-emerald-50/30' : 'text-black/40'}`}
                     >
                       <Camera size={14} />
                       {attachments.image ? 'Photo Added' : 'Add Photo'}
                     </button>
                     <button 
                       onClick={() => videoInputRef.current?.click()}
                       className={`flex items-center gap-2 px-4 py-2 rounded-sm border border-black/5 hover:bg-black/5 transition-all text-[10px] font-bold uppercase tracking-widest ${attachments.video ? 'text-emerald-700 bg-emerald-50/30' : 'text-black/40'}`}
                     >
                       <Video size={14} />
                       {attachments.video ? 'Video Added' : 'Add Video'}
                     </button>
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className={`flex items-center gap-2 px-4 py-2 rounded-sm border border-black/5 hover:bg-black/5 transition-all text-[10px] font-bold uppercase tracking-widest ${attachments.file ? 'text-emerald-700 bg-emerald-50/30' : 'text-black/40'}`}
                     >
                       <Paperclip size={14} />
                       {attachments.file ? 'File Added' : 'Attach File'}
                     </button>
                   </div>

                   {/* Previews */}
                   <div className="flex gap-3 flex-wrap">
                      {Object.entries(attachments).map(([type, file]) => file && (
                        <motion.div 
                          key={type}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-sm border border-black/5"
                        >
                          <span className="text-[9px] font-bold text-black/60 truncate max-w-[120px]">{file.name}</span>
                          <button onClick={() => removeAttachment(type)} className="text-black/20 hover:text-red-500 transition-colors">
                            <X size={10} />
                          </button>
                        </motion.div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden Inputs */}
          <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={(e) => handleFileChange('image', e)} />
          <input type="file" ref={videoInputRef} hidden accept="video/*" onChange={(e) => handleFileChange('video', e)} />
          <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileChange('file', e)} />
        </div>
      </motion.div>

      {/* Submit */}
      <motion.button
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Seal and Send your record to the vault"
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`px-20 py-6 rounded-full border-2 transition-all text-[13px] font-black tracking-[0.5em] uppercase focus-secondary shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 ${
          canSubmit 
            ? 'text-indigo-950 border-indigo-600/10 cursor-pointer bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.3)]' 
            : 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50 opacity-60'
        }`}
      >
        Speak Freely & Send
      </motion.button>

        My Personal Promise: I will never track your identity. This is our safe space.
    </motion.div>
  );
}
