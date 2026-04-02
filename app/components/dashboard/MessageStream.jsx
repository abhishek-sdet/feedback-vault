"use client";

import MessageItem from "./MessageItem";

export default function MessageStream({ messages, onSelect, onUpdate, onDelete }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
         <p className="text-[10px] tracking-[0.4em] font-bold uppercase italic">The Archives are Current</p>
      </div>
    );
  }

  return (
    <ul className="w-full max-w-4xl mx-auto border-x border-white/[0.02] px-2 min-h-[400px] flex flex-col" aria-label="Feedback Records">
      {messages.map((msg) => (
        <li key={msg.id}>
          <MessageItem 
            msg={msg} 
            onClick={() => onSelect(msg)} 
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
