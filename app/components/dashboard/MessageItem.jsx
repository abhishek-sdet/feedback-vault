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
      className={`py-8 border-b border-slate-100 cursor-pointer group flex items-center gap-8 transition-all focus:bg-slate-50 outline-none px-6 hover:bg-slate-50/50 ${
        msg.status === 'UNREAD' ? 'opacity-100' : 'opacity-60'
      }`}
      whileHover={{ scale: 1.002, x: 4 }}
    >
      {/* Date & Sender Column */}
      <div className="w-48 shrink-0 flex flex-col gap-1">
        <time dateTime={msg.created_at} className="text-[10px] text-slate-400 tracking-[0.2em] font-black uppercase flex flex-col gap-0.5">
          <span>{new Date(msg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span className="text-emerald-600/60 lowercase tracking-normal font-mono">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </time>
        <div className="flex items-center gap-1.5 min-w-0">
           <span className={`text-[11px] font-bold truncate ${msg.is_anonymous ? 'text-slate-400' : 'text-emerald-600 underline decoration-emerald-600/20 underline-offset-4'}`}>
             {msg.is_anonymous ? 'ANONYMOUS' : (msg.employee_name || 'SIGNED')}
           </span>
           {(msg.image_url || msg.video_url || msg.file_url) && (
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" title="Has Attachments" />
           )}
        </div>
      </div>

      {/* Content Column - Flexible */}
      <div className="flex-1 min-w-0 flex items-center gap-4">
        <p className={`text-[15px] truncate font-medium tracking-tight ${msg.status === 'UNREAD' ? "text-slate-800" : "text-slate-400"}`}>
          {msg.content}
        </p>
        <SentimentTag text={msg.content} />
      </div>

      {/* Type & Actions Column */}
      <div className="w-48 shrink-0 flex items-center justify-end gap-6 text-right">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border ${
          msg.type === 'GRIEVANCE' 
            ? 'bg-red-50 text-red-600 border-red-100' 
            : msg.type === 'IDEA'
            ? 'bg-violet-50 text-violet-600 border-violet-100'
            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          {msg.type}
        </span>
        
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {msg.status === 'UNREAD' && (
            <button 
              onClick={handleArchive} 
              aria-label="Archive"
              className="text-emerald-600 hover:text-emerald-700 transition-colors p-1.5 hover:bg-emerald-50 rounded"
            >
              <Archive size={16} />
            </button>
          )}
          <button 
            onClick={handleDelete} 
            aria-label="Delete"
            className="text-red-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
