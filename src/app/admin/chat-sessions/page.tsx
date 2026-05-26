"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@components/configs/firebase";

interface ChatMessage {
  role:    "user" | "assistant";
  content: string;
}

interface ChatSession {
  id:              string;
  visitorName:     string;
  visitorPosition: string;
  startedAt:       string;
  lastActivity:    string;
  messages:        ChatMessage[];
}

export default function ChatSessionsPage() {
  const [sessions,   setSessions]   = useState<ChatSession[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, "chat_sessions"), orderBy("lastActivity", "desc"));
      const snap = await getDocs(q);
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus sesi ini?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "chat_sessions", id));
      setSessions(prev => prev.filter(s => s.id !== id));
      if (expanded === id) setExpanded(null);
    } finally {
      setDeleting(null);
    }
  };

  const total   = sessions.length;
  const msgTotal = sessions.reduce((acc, s) => acc + (s.messages?.length ?? 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Chat Sessions</h1>
          <p className="text-xs text-slate-500 mt-1">Visitor conversations with the AI assistant.</p>
        </div>
        <button onClick={load}
          className="px-3 py-1.5 rounded-lg border border-[#2d3748] hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs transition-colors">
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Sessions",  value: total },
          { label: "Total Messages",  value: msgTotal },
          { label: "Avg. Msg / Session", value: total ? (msgTotal / total).toFixed(1) : "—" },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0f1117] border border-[#2d3748] rounded-xl px-4 py-3">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className="text-xl font-bold text-slate-100 mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Session list */}
      <div className="space-y-2">
        {loading && (
          <p className="text-sm text-slate-500 text-center py-8">Loading…</p>
        )}
        {!loading && sessions.length === 0 && (
          <p className="text-sm text-slate-600 italic text-center py-8">Belum ada sesi chat.</p>
        )}

        {!loading && sessions.map(s => (
          <div key={s.id} className="border border-[#2d3748] rounded-xl overflow-hidden">
            {/* Session header row */}
            <div
              className="flex items-center gap-4 px-4 py-3 bg-[#0f1117] cursor-pointer hover:bg-[#13151f] transition-colors"
              onClick={() => setExpanded(prev => prev === s.id ? null : s.id)}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-indigo-300">
                  {s.visitorName?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{s.visitorName}</p>
                <p className="text-xs text-slate-500 truncate">{s.visitorPosition}</p>
              </div>

              {/* Meta */}
              <div className="text-right shrink-0 space-y-0.5">
                <p className="text-xs text-slate-400">{(s.messages?.length ?? 0)} pesan</p>
                <p className="text-[10px] text-slate-600">
                  {s.lastActivity ? new Date(s.lastActivity).toLocaleString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  }) : "—"}
                </p>
              </div>

              {/* Expand indicator */}
              <span className="text-slate-600 text-xs ml-1 shrink-0">
                {expanded === s.id ? "▲" : "▼"}
              </span>
            </div>

            {/* Expanded conversation */}
            {expanded === s.id && (
              <div className="border-t border-[#2d3748] bg-[#0a0d14]">
                {/* Conversation */}
                <div className="px-4 py-3 space-y-2 max-h-72 overflow-y-auto">
                  {(!s.messages || s.messages.length === 0) && (
                    <p className="text-xs text-slate-600 italic">Belum ada pesan.</p>
                  )}
                  {s.messages?.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-indigo-600/20 text-indigo-100 border border-indigo-500/20"
                          : "bg-[#1e2130] text-slate-200 border border-[#2d3748]"
                      }`}>
                        <span className={`block text-[10px] mb-1 font-medium ${m.role === "user" ? "text-indigo-400" : "text-slate-500"}`}>
                          {m.role === "user" ? s.visitorName : "Amril AI"}
                        </span>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer actions */}
                <div className="px-4 py-2.5 border-t border-[#2d3748] flex items-center justify-between">
                  <p className="text-[10px] text-slate-600">
                    Dimulai: {s.startedAt ? new Date(s.startedAt).toLocaleString("id-ID") : "—"}
                  </p>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="px-2.5 py-1 rounded-lg bg-red-900/30 hover:bg-red-800/50 text-red-400 text-xs transition-colors disabled:opacity-50"
                  >
                    {deleting === s.id ? "Menghapus…" : "Hapus"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
