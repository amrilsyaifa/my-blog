"use client";

import { useRef, useState } from "react";

export interface CommunityFormData {
  title_en:        string;
  title_id?:       string;
  description_en:  string;
  description_id?: string;
  date:            string;
  location:        string;
  photos:          string[];
  order:           number;
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";
const tabActive   = "px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white";
const tabInactive = "px-4 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-200 border border-[#2d3748]";

interface Props { data: CommunityFormData; onChange: (d: CommunityFormData) => void; }

async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "portfolio/community" }),
  });
  const { signature, timestamp, apiKey, cloudName } = await signRes.json();

  const fd = new FormData();
  fd.append("file",      file);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("api_key",   apiKey);
  fd.append("folder",    "portfolio/community");

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url as string;
}

function PhotoGrid({ photos, onChange }: { photos: string[]; onChange: (p: string[]) => void }) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...photos];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIdx(null);
    setOverIdx(null);
  };

  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {photos.map((url, i) => (
        <div
          key={url + i}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
          onDrop={() => handleDrop(i)}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          className={[
            "relative group rounded-lg overflow-hidden border aspect-square cursor-grab active:cursor-grabbing transition-all duration-150",
            i === 0 ? "border-indigo-500" : "border-[#2d3748]",
            dragIdx === i ? "opacity-40" : "",
            overIdx === i && dragIdx !== i ? "border-t-2 border-t-indigo-400 scale-[1.02]" : "",
          ].join(" ")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="w-full h-full object-cover" />

          {/* Cover badge */}
          {i === 0 && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded">
              COVER
            </span>
          )}

          {/* Drag handle indicator */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="white" className="drop-shadow">
              <circle cx="2.5" cy="2.5" r="1.5"/><circle cx="7.5" cy="2.5" r="1.5"/>
              <circle cx="2.5" cy="7"   r="1.5"/><circle cx="7.5" cy="7"   r="1.5"/>
              <circle cx="2.5" cy="11.5" r="1.5"/><circle cx="7.5" cy="11.5" r="1.5"/>
            </svg>
          </div>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
            className="absolute bottom-1 right-1 w-6 h-6 bg-red-600/90 hover:bg-red-500 text-white rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default function CommunityForm({ data, onChange }: Props) {
  const [lang, setLang] = useState<"en" | "id">("en");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState("");
  const [error, setError]         = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof CommunityFormData>(k: K, v: CommunityFormData[K]) =>
    onChange({ ...data, [k]: v });

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1} / ${files.length}…`);
      try {
        const url = await uploadToCloudinary(files[i]);
        uploaded.push(url);
      } catch {
        setError(`Failed to upload ${files[i].name}`);
      }
    }
    set("photos", [...data.photos, ...uploaded]);
    setUploading(false);
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Language tabs */}
      <div className="flex gap-2 pb-3 border-b border-[#2d3748]">
        <button type="button" onClick={() => setLang("en")} className={lang === "en" ? tabActive : tabInactive}>
          🇬🇧 English <span className="text-red-400">*</span>
        </button>
        <button type="button" onClick={() => setLang("id")} className={lang === "id" ? tabActive : tabInactive}>
          🇮🇩 Indonesia <span className="text-slate-500">(optional)</span>
        </button>
      </div>

      {lang === "en" && (
        <>
          <div>
            <label className={lbl}>Title (English) <span className="text-red-400">*</span></label>
            <input className={cls} value={data.title_en} onChange={e => set("title_en", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Description (English) <span className="text-red-400">*</span></label>
            <textarea className={cls} rows={3} value={data.description_en} onChange={e => set("description_en", e.target.value)} />
          </div>
        </>
      )}

      {lang === "id" && (
        <>
          <div>
            <label className={lbl}>Judul (Indonesia)</label>
            <input className={cls} value={data.title_id ?? ""} onChange={e => set("title_id", e.target.value)} placeholder="Biarkan kosong untuk pakai versi English" />
          </div>
          <div>
            <label className={lbl}>Deskripsi (Indonesia)</label>
            <textarea className={cls} rows={3} value={data.description_id ?? ""} onChange={e => set("description_id", e.target.value)} placeholder="Biarkan kosong untuk pakai versi English" />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Date</label>
          <input className={cls} type="date" value={data.date} onChange={e => set("date", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Location</label>
          <input className={cls} value={data.location} onChange={e => set("location", e.target.value)} />
        </div>
      </div>

      {/* Photos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={lbl}>
            Photos
            {data.photos.length > 0 && (
              <span className="ml-2 text-indigo-400 normal-case tracking-normal font-normal">
                {data.photos.length} photo{data.photos.length !== 1 ? "s" : ""} · drag to reorder · first = cover
              </span>
            )}
          </label>
        </div>

        <PhotoGrid photos={data.photos} onChange={(p) => set("photos", p)} />

        {/* Drop zone / upload button */}
        <div
          className="border-2 border-dashed border-[#2d3748] hover:border-indigo-500/50 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-xs text-indigo-400">{progress}</p>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-xs text-slate-400">Click or drag & drop photos here</p>
              <p className="text-[10px] text-slate-600">Multiple files supported · JPG, PNG, WEBP</p>
            </>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
        />
      </div>

      <div>
        <label className={lbl}>Order</label>
        <input className={cls} type="number" value={data.order} onChange={e => set("order", Number(e.target.value))} />
      </div>
    </div>
  );
}
