import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Shield, Tag, User, Image as ImageIcon, Film, FileText, Download, Mail, Phone } from "lucide-react";

export default function MessageDetail({ message, onClose }) {
  if (!message) return null;

  const authKey = typeof window !== 'undefined' ? (localStorage.getItem('vault_auth_key') || '') : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />

        {/* The Letter */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#fffdfa] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
          style={{ maxHeight: '90vh' }}
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

          <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
            {/* Header Metadata */}
            <div className="flex justify-between items-start mb-12 opacity-40">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                 <div className="flex items-center gap-3">
                   <Calendar size={12} strokeWidth={3} />
                   <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                     {new Date(message.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Tag size={12} strokeWidth={3} />
                   <span className="text-[10px] uppercase tracking-[0.2em] font-black">{message.type}</span>
                 </div>
                 <div className="flex flex-col gap-3 col-span-2">
                   <div className="flex items-center gap-3">
                     <User size={12} strokeWidth={3} />
                     <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                       {message.is_anonymous ? 'IDENTITY PROTECTED' : `SUBMITTED BY: ${message.employee_name || 'SIGNED RECORD'}`}
                     </span>
                   </div>
                   {!message.is_anonymous && message.employee_email && (
                     <div className="flex items-center gap-3">
                       <Mail size={12} strokeWidth={3} />
                       <span className="text-[10px] uppercase tracking-[0.2em] font-black">{message.employee_email}</span>
                     </div>
                   )}
                   {!message.is_anonymous && message.employee_phone && (
                     <div className="flex items-center gap-3">
                       <Phone size={12} strokeWidth={3} />
                       <span className="text-[10px] uppercase tracking-[0.2em] font-black">{message.employee_phone}</span>
                     </div>
                   )}
                 </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
                <Shield size={10} strokeWidth={3} />
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase">Verified Vault Access</span>
              </div>
            </div>

            {/* Content */}
            <p className="text-xl md:text-2xl leading-[1.8] text-black/80 font-medium whitespace-pre-wrap mb-12 italic" 
               style={{ fontFamily: "'Playfair Display', serif" }}>
              {message.content}
            </p>

            {/* Media/Attachments Section */}
            {(message.image_url || message.video_url || message.file_url) && (
              <div className="mt-16 pt-10 border-t border-black/5 space-y-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black/20">Attachments Found</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image Attachment */}
                  {message.image_url && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-black/40">
                        <ImageIcon size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Image Payload</span>
                      </div>
                      <div className="group relative rounded-sm overflow-hidden border border-black/5 bg-black/[0.02]">
                        <img 
                          src={`/api/dashboard/media/${message.image_url}?key=${encodeURIComponent(authKey)}`} 
                          alt="Attached Evidence" 
                          className="w-full h-auto object-cover max-h-64" 
                        />
                        <a 
                          href={`/api/dashboard/media/${message.image_url}?key=${encodeURIComponent(authKey)}`} 
                          download 
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 text-[10px] font-bold uppercase tracking-widest"
                        >
                          <Download size={16} /> Secure Download
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Video Attachment */}
                  {message.video_url && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-black/40">
                        <Film size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Video Payload</span>
                      </div>
                      <div className="rounded-sm overflow-hidden border border-black/5 bg-black">
                        <video controls className="w-full h-auto max-h-64">
                          <source src={`/api/dashboard/media/${message.video_url}?key=${encodeURIComponent(authKey)}`} />
                        </video>
                      </div>
                    </div>
                  )}

                  {/* Document Attachment */}
                  {message.file_url && (
                    <div className="space-y-4 col-span-full">
                      <div className="flex items-center gap-2 text-black/40">
                        <FileText size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Document Index</span>
                      </div>
                      <a 
                        href={`/api/dashboard/media/${message.file_url}?key=${encodeURIComponent(authKey)}`} 
                        download
                        className="flex items-center justify-between p-6 rounded-sm border border-black/5 bg-black/[0.02] hover:bg-black/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-black/5 rounded-sm">
                            <FileText size={20} className="text-black/40" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-black/60 uppercase tracking-widest">Archived Payload</p>
                            <p className="text-[9px] text-black/20 font-black tracking-widest uppercase">Encrypted Binary</p>
                          </div>
                        </div>
                        <Download size={18} className="text-black/20" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center border-t border-black/5 pt-10 mt-16">
               <div className="flex items-center gap-3">
                 <img src="/sdet-logo.png" alt="SDET" className="h-4 w-auto opacity-30 object-contain" />
                 <span className="text-[9px] uppercase tracking-[0.2em] text-black/20 font-bold">The Silent Vault Master Archive</span>
               </div>
               <button 
                 onClick={onClose}
                 className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 hover:text-black transition-colors px-6 py-2 border border-black/10 rounded-sm hover:bg-black/5"
               >
                 Close Record
               </button>
            </div>
          </div>

          {/* Close Button UI */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-black/20 hover:text-black/60 transition-colors z-20"
          >
            <X size={28} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
