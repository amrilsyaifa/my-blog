"use client";

import { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useAuth } from "@components/contexts/AuthContext";
import type { PdfRecord } from "@components/app/api/admin/rag/pdf/route";
import type { ModelOption } from "@components/app/api/admin/rag/models/route";

const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

export default function RagAdminPage() {
  const { user } = useAuth();

  const [syncStatus,  setSyncStatus]  = useState<{ lastSync?: string; chunkCount?: number } | null>(null);
  const [syncing,     setSyncing]     = useState(false);
  const [syncMsg,     setSyncMsg]     = useState("");

  const [pdfs,        setPdfs]        = useState<PdfRecord[]>([]);
  const [uploading,   setUploading]   = useState(false);
  const [uploadMsg,   setUploadMsg]   = useState("");

  // Model selector
  const [models,       setModels]       = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [savingModel,   setSavingModel]   = useState(false);
  const [modelMsg,      setModelMsg]      = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { "x-admin-email": user?.email ?? "" };

  useEffect(() => {
    (async () => {
      const [metaSnap, pdfSnap, configSnap, modelsRes] = await Promise.all([
        getDoc(doc(db, "rag", "meta")),
        getDoc(doc(db, "rag", "pdfs")),
        getDoc(doc(db, "rag", "config")),
        fetch("/api/admin/rag/models"),
      ]);

      if (metaSnap.exists())   setSyncStatus(metaSnap.data() as { lastSync: string; chunkCount: number });
      if (pdfSnap.exists())    setPdfs((pdfSnap.data().list as PdfRecord[]) ?? []);
      if (configSnap.exists()) setSelectedModel((configSnap.data().model as string) || DEFAULT_MODEL);

      if (modelsRes.ok) {
        const json = await modelsRes.json() as { models: ModelOption[] };
        setModels(json.models ?? []);
      }
    })();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res  = await fetch("/api/admin/rag/sync", { method: "POST", headers });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      const meta = { lastSync: new Date().toISOString(), chunkCount: json.chunkCount };
      await setDoc(doc(db, "rag", "meta"), meta);
      setSyncStatus(meta);
      setSyncMsg(`✓ Synced ${json.chunkCount} chunks successfully`);
    } catch (e) {
      setSyncMsg(`Error: ${String(e)}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/admin/rag/pdf", { method: "POST", headers, body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUploadMsg(`✓ Indexed "${json.filename}" (${json.chunkCount} chunks)`);
      const newEntry: PdfRecord = { filename: json.filename, uploadedAt: new Date().toISOString(), chunkCount: json.chunkCount };
      const updatedPdfs = [...pdfs.filter(p => p.filename !== json.filename), newEntry];
      await setDoc(doc(db, "rag", "pdfs"), { list: updatedPdfs });
      setPdfs(updatedPdfs);
    } catch (e) {
      setUploadMsg(`Error: ${String(e)}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}" from knowledge base?`)) return;
    try {
      const res = await fetch("/api/admin/rag/pdf", {
        method:  "DELETE",
        headers: { ...headers, "Content-Type": "application/json" },
        body:    JSON.stringify({ filename }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const remaining = pdfs.filter(p => p.filename !== filename);
      await setDoc(doc(db, "rag", "pdfs"), { list: remaining });
      setPdfs(remaining);
    } catch (e) {
      alert(String(e));
    }
  };

  const handleSaveModel = async () => {
    setSavingModel(true);
    setModelMsg("");
    try {
      await setDoc(doc(db, "rag", "config"), { model: selectedModel }, { merge: true });
      setModelMsg(`✓ Model saved — will take effect within 2 minutes`);
    } catch (e) {
      setModelMsg(`Error: ${String(e)}`);
    } finally {
      setSavingModel(false);
    }
  };

  const btnClass = "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-slate-100">RAG / AI Chat</h1>
        <p className="text-xs text-slate-500 mt-1">Manage the knowledge base and AI model for the chat widget.</p>
      </div>

      {/* AI Model Selector */}
      <div className="border border-[#2d3748] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#0f1117] border-b border-[#2d3748]">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">AI Model (OpenRouter)</p>
        </div>
        <div className="px-4 py-4 bg-[#0a0d14] space-y-3">
          <p className="text-xs text-slate-500">
            Select which free model to use for chat responses. Switch if the current one hits rate limits.
          </p>
          <div className="flex gap-2">
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="flex-1 bg-[#0f1117] border border-[#2d3748] text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {/* Current model always shown even if not in list */}
              {models.length === 0 && (
                <option value={selectedModel}>{selectedModel}</option>
              )}
              {models.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({(m.context / 1000).toFixed(0)}K ctx)
                </option>
              ))}
            </select>
            <button onClick={handleSaveModel} disabled={savingModel} className={btnClass}>
              {savingModel ? "Saving…" : "Save"}
            </button>
          </div>
          {modelMsg && (
            <p className={`text-xs ${modelMsg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>{modelMsg}</p>
          )}
          <p className="text-[10px] text-slate-600">
            Current default: <span className="text-slate-500">{DEFAULT_MODEL}</span>
          </p>
        </div>
      </div>

      {/* Firestore Sync */}
      <div className="border border-[#2d3748] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#0f1117] border-b border-[#2d3748]">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Firestore Knowledge Base</p>
        </div>
        <div className="px-4 py-4 bg-[#0a0d14] space-y-3">
          <p className="text-xs text-slate-500">
            Indexes all Firestore data (profile, careers, skills, certifications, projects, community) into the vector store.
          </p>
          {syncStatus && (
            <div className="text-xs text-slate-400 space-y-0.5">
              <p>Last sync: <span className="text-slate-200">{new Date(syncStatus.lastSync!).toLocaleString()}</span></p>
              <p>Chunks indexed: <span className="text-slate-200">{syncStatus.chunkCount}</span></p>
            </div>
          )}
          <button onClick={handleSync} disabled={syncing} className={btnClass}>
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
          {syncMsg && (
            <p className={`text-xs ${syncMsg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>{syncMsg}</p>
          )}
        </div>
      </div>

      {/* PDF Upload */}
      <div className="border border-[#2d3748] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#0f1117] border-b border-[#2d3748]">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">PDF Documents</p>
        </div>
        <div className="px-4 py-4 bg-[#0a0d14] space-y-4">
          <p className="text-xs text-slate-500">
            Upload supplementary PDF documents to include in the AI knowledge base.
          </p>

          <div
            className="border-2 border-dashed border-[#2d3748] hover:border-indigo-500/50 rounded-xl p-6 text-center transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleUpload(file);
            }}
          >
            <p className="text-sm text-slate-400">
              {uploading ? "Uploading & indexing…" : "Drop a PDF here or click to browse"}
            </p>
            <p className="text-xs text-slate-600 mt-1">PDF only · text-based documents work best</p>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
          </div>
          {uploadMsg && (
            <p className={`text-xs ${uploadMsg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>{uploadMsg}</p>
          )}

          {pdfs.length > 0 && (
            <div className="space-y-2">
              {pdfs.map(p => (
                <div key={p.filename} className="flex items-center justify-between bg-[#0f1117] border border-[#2d3748] rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{p.filename}</p>
                    <p className="text-xs text-slate-500">
                      {p.chunkCount} chunks · {new Date(p.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(p.filename)}
                    className="px-2 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-xs transition-colors">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          {pdfs.length === 0 && (
            <p className="text-xs text-slate-600 italic">No PDFs uploaded yet.</p>
          )}
        </div>
      </div>

      <div className="border border-[#2d3748] rounded-xl px-4 py-3 bg-[#0a0d14] text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-400">Environment variables required:</p>
        <p><code className="text-indigo-400">JINA_API_KEY</code> — Jina AI embedding (jina.ai)</p>
        <p><code className="text-indigo-400">OPENROUTER_API_KEY</code> — OpenRouter LLM (openrouter.ai)</p>
        <p><code className="text-indigo-400">AWS_ACCESS_KEY_ID</code> / <code className="text-indigo-400">AWS_SECRET_ACCESS_KEY</code> / <code className="text-indigo-400">AWS_REGION</code></p>
        <p><code className="text-indigo-400">S3_VECTOR_BUCKET_NAME</code> / <code className="text-indigo-400">S3_VECTOR_INDEX_NAME</code> — dim=1024, cosine</p>
      </div>
    </div>
  );
}
