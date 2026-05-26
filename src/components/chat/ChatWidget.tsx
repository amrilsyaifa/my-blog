"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [open,    setOpen]    = useState(false);
  const [hasNew,  setHasNew]  = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setHasNew(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-200">
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label="Open AI chat"
        className="relative w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center group"
      >
        {/* Unread dot */}
        {hasNew && !open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0d14]" />
        )}

        {/* AI badge */}
        <span className="absolute -top-1 -left-1 text-[9px] font-bold bg-[#1e2130] text-indigo-300 border border-indigo-500/40 rounded-full px-1.5 py-0.5 leading-none">
          AI
        </span>

        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>
    </div>
  );
}
