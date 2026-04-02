import { motion } from "framer-motion";
import { Trash2, Archive } from "lucide-react";
import SentimentTag from "./SentimentTag";

export default function MessageItem({ msg, onClick, onUpdate, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(msg.id);
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    onUpdate(msg.id, 'READ');
  };

  return (
    <motion.article
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Message from ${new Date(msg.created_at).toLocaleDateString()}: ${msg.content.substring(0, 50)}...`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`py-8 border-b border-white/5 cursor-pointer group flex items-center gap-8 transition-all focus:bg-white/[0.03] outline-none px-6 hover:bg-white/[0.01] ${
        msg.status === 'UNREAD' ? 'opacity-100' : 'opacity-60'
      }`}
      whileHover={{ scale: 1.002, x: 4 }}
    >
      {/* Date & Sender Column */}
      <div className="w-48 shrink-0 flex flex-col gap-1">
        <time dateTime={msg.created_at} className="text-[10px] text-slate-500 tracking-[0.2em] font-black uppercase">
          {new Date(msg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </time>
        <div className="flex items-center gap-1.5 min-w-0">
           <span className={`text-[11px] font-bold truncate ${msg.is_anonymous ? 'text-slate-600' : 'text-emerald-500 underline decoration-emerald-500/30 underline-offset-4'}`}>
             {msg.is_anonymous ? 'ANONYMOUS' : (msg.employee_name || 'SIGNED')}
           </span>
           {(msg.image_url || msg.video_url || msg.file_url) && (
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" title="Has Attachments" />
           )}
        </div>
      </div>

      {/* Content Column - Flexible */}
      <div className="flex-1 min-w-0 flex items-center gap-4">
        <p className={`text-[15px] truncate font-medium tracking-tight ${msg.status === 'UNREAD' ? "text-slate-100" : "text-slate-400"}`}>
          {msg.content}
        </p>
        <SentimentTag text={msg.content} />
      </div>

      {/* Type & Actions Column */}
      <div className="w-48 shrink-0 flex items-center justify-end gap-6 text-right">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border ${
          msg.type === 'GRIEVANCE' 
            ? 'bg-red-500/5 text-red-500 border-red-500/20' 
            : msg.type === 'IDEA'
            ? 'bg-violet-500/5 text-violet-500 border-violet-500/20'
            : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
        }`}>
          {msg.type}
        </span>
        
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {msg.status === 'UNREAD' && (
            <button 
              onClick={handleArchive} 
              aria-label="Archive"
              className="text-emerald-500 hover:text-emerald-300 transition-colors p-1.5 hover:bg-emerald-500/10 rounded"
            >
              <Archive size={16} />
            </button>
          )}
          <button 
            onClick={handleDelete} 
            aria-label="Delete"
            className="text-red-500 hover:text-red-300 transition-colors p-1.5 hover:bg-red-500/10 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
