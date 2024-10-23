"use client";

import { useState } from "react";
import CloudinaryUpload from "@components/components/admin/CloudinaryUpload";

export interface DevStack {
  title:           string;
  url:             string;
  is_open_new_tab: boolean;
}

export interface ProjectFormData {
  title_en:        string;
  title_id?:       string;
  description_en:  string;
  description_id?: string;
  link:            string;
  order:           number;
  project_by:      "self" | "company";
  is_detail:       boolean;
  dev_stack:       DevStack[];
  thumbnail?:      string;
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";
const tabActive   = "px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white";
const tabInactive = "px-4 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-200 border border-[#2d3748]";

interface Props { data: ProjectFormData; onChange: (d: ProjectFormData) => void; }

function DevStackEditor({ value, onChange }: { value: DevStack[]; onChange: (v: DevStack[]) => void }) {
  const add    = () => onChange([...value, { title: "", url: "", is_open_new_tab: true }]);
  const update = (i: number, k: keyof DevStack, v: string | boolean) => {
    const next = [...value]; next[i] = { ...next[i], [k]: v }; onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <label className={lbl}>Dev Stack</label>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input className={`${cls} flex-1`} placeholder="Name" value={item.title} onChange={e => update(i, "title", e.target.value)} />
          <input className={`${cls} flex-1`} placeholder="URL (optional)" value={item.url} onChange={e => update(i, "url", e.target.value)} />
          <label className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap">
            <input type="checkbox" checked={item.is_open_new_tab} onChange={e => update(i, "is_open_new_tab", e.target.checked)} className="accent-indigo-600" />
            new tab
          </label>
          <button type="button" onClick={() => remove(i)} className="px-2 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm">×</button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">+ Add tech</button>
    </div>
  );
}

export default function ProjectForm({ data, onChange }: Props) {
  const [lang, setLang] = useState<"en" | "id">("en");
  const set = <K extends keyof ProjectFormData>(k: K, v: ProjectFormData[K]) =>
    onChange({ ...data, [k]: v });

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
      <div>
        <label className={lbl}>Link</label>
        <input className={cls} value={data.link} onChange={e => set("link", e.target.value)} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Project By</label>
          <select className={cls} value={data.project_by} onChange={e => set("project_by", e.target.value as "self" | "company")}>
            <option value="self">Self</option>
            <option value="company">Company</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Order</label>
          <input className={cls} type="number" value={data.order} onChange={e => set("order", Number(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input id="is_detail" type="checkbox" checked={data.is_detail} onChange={e => set("is_detail", e.target.checked)} className="w-4 h-4 accent-indigo-600" />
        <label htmlFor="is_detail" className="text-sm text-slate-300">Has detail page (project_detail doc)</label>
      </div>
      <DevStackEditor value={data.dev_stack} onChange={v => set("dev_stack", v)} />
      <div>
        <label className={lbl}>Thumbnail</label>
        <CloudinaryUpload url={data.thumbnail ?? ""} onUpload={url => set("thumbnail", url)} folder="project-thumbnails" />
      </div>
    </div>
  );
}
