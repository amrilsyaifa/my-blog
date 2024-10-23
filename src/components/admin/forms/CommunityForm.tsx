"use client";

import { useState } from "react";
import CloudinaryUpload from "@components/components/admin/CloudinaryUpload";

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

export default function CommunityForm({ data, onChange }: Props) {
  const [lang, setLang] = useState<"en" | "id">("en");
  const set = <K extends keyof CommunityFormData>(k: K, v: CommunityFormData[K]) =>
    onChange({ ...data, [k]: v });

  const addPhoto    = (url: string) => set("photos", [...data.photos, url]);
  const removePhoto = (i: number)   => set("photos", data.photos.filter((_, idx) => idx !== i));

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

      {/* EN fields */}
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

      {/* ID fields */}
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

      {/* Common fields */}
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
      <div className="space-y-2">
        <label className={lbl}>Photos</label>
        <div className="flex flex-wrap gap-3">
          {data.photos.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-[#2d3748]" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >×</button>
            </div>
          ))}
        </div>
        <CloudinaryUpload label="Add Photo" folder="portfolio/community" onUpload={addPhoto} />
      </div>

      <div>
        <label className={lbl}>Order</label>
        <input className={cls} type="number" value={data.order} onChange={e => set("order", Number(e.target.value))} />
      </div>
    </div>
  );
}
