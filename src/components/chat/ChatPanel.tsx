"use client";

import { useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useTranslations } from "next-intl";

interface Message {
  role:    "user" | "assistant";
  content: string;
}

interface Props {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: Props) {
  const t = useTranslations("chat");
  const [step,       setStep]       = useState<"survey" | "chat">("survey");
  const [name,       setName]       = useState("");
  const [position,   setPosition]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState("");
  const [streaming, setStreaming] = useState(false);

  const sessionId = useRef(crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (step === "chat") inputRef.current?.focus();
  }, [step]);

  const startChat = async () => {
    const n = name.trim();
    const p = position.trim();
    if (!n || !p || submitting) return;
    setSubmitting(true);
    try {
      await setDoc(doc(db, "chat_sessions", sessionId.current), {
        visitorName:     n,
        visitorPosition: p,
        startedAt:       new Date().toISOString(),
        lastActivity:    new Date().toISOString(),
        messages:        [],
      });
    } catch {
      // best-effort — don't block user from chatting
    } finally {
      setSubmitting(false);
      setStep("chat");
    }
  };

  const saveSession = async (msgs: Message[]) => {
    try {
      await setDoc(
        doc(db, "chat_sessions", sessionId.current),
        {
          messages:     msgs.map(m => ({ role: m.role, content: m.content })),
          lastActivity: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch {
      // best-effort
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    const assistantIdx = nextMessages.length;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    let finalContent = "Failed to get a response. Please try again.";
    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        finalContent = err.error ?? "Something went wrong.";
        setMessages(prev => {
          const updated = [...prev];
          updated[assistantIdx] = { role: "assistant", content: finalContent };
          return updated;
        });
        return;
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   full    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[assistantIdx] = { role: "assistant", content: full };
          return updated;
        });
      }
      finalContent = full;
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[assistantIdx] = { role: "assistant", content: finalContent };
        return updated;
      });
    } finally {
      setStreaming(false);
      const finalMessages: Message[] = [
        ...nextMessages,
        { role: "assistant", content: finalContent },
      ];
      await saveSession(finalMessages);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col w-[380px] h-[520px] bg-[#0f1117] border border-[#2d3748] rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d3748] bg-[#0f1117] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-slate-100">{t("header")}</span>
        </div>
        <button onClick={onClose}
          className="text-slate-500 hover:text-slate-200 transition-colors text-lg leading-none">
          ×
        </button>
      </div>

      {/* Survey step */}
      {step === "survey" && (
        <div className="flex-1 flex flex-col justify-center px-6 py-6 space-y-5">
          <div className="space-y-1 text-center">
            <p className="text-base font-semibold text-slate-100">{t("survey_title")}</p>
            <p className="text-xs text-slate-500">{t("survey_subtitle")}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{t("name_label")}</label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") document.getElementById("pos-input")?.focus();
                }}
                placeholder={t("name_placeholder")}
                className="w-full bg-[#1e2130] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{t("position_label")}</label>
              <input
                id="pos-input"
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") startChat(); }}
                placeholder={t("position_placeholder")}
                className="w-full bg-[#1e2130] border border-[#2d3748] text-slate-200 text-sm rounded-lg px-3 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>

            <button
              onClick={startChat}
              disabled={!name.trim() || !position.trim() || submitting}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? t("submitting") : t("start")}
            </button>
          </div>
        </div>
      )}

      {/* Chat step */}
      {step === "chat" && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {isEmpty ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 text-center">
                  {t("greeting", { name })}
                </p>
                <div className="space-y-2">
                  {([t("starter_1"), t("starter_2"), t("starter_3")] as string[]).map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="w-full text-left text-xs text-slate-400 hover:text-slate-200 border border-[#2d3748] hover:border-indigo-500/40 bg-[#1e2130] hover:bg-[#252a3a] rounded-lg px-3 py-2 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-indigo-600/30 text-indigo-100 border border-indigo-500/30"
                      : "bg-[#1e2130] text-slate-200 border border-[#2d3748]"
                  }`}>
                    {m.content || (
                      <span className="inline-flex gap-1 items-center text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-[#2d3748] shrink-0">
            <div className="flex items-end gap-2 bg-[#1e2130] border border-[#2d3748] rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("input_placeholder")}
                disabled={streaming}
                className="flex-1 bg-transparent text-slate-200 text-xs placeholder:text-slate-600 resize-none focus:outline-none leading-relaxed max-h-28 overflow-y-auto"
              />
              <button onClick={() => send(input)} disabled={!input.trim() || streaming}
                className="shrink-0 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1.5 text-center">{t("shift_enter")}</p>
          </div>
        </>
      )}
    </div>
  );
}
