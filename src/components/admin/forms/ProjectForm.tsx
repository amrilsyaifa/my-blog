"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import CloudinaryUpload from "@components/components/admin/CloudinaryUpload";
import type { TechStackItem } from "@components/app/admin/tech-stacks/page";

export interface DevStack {
  title:           string;
  value:           string;
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
  const [masterList, setMasterList] = useState<TechStackItem[]>([]);
  const [search,     setSearch]     = useState("");
  const [open,       setOpen]       = useState(false);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "config", "tech_stacks"));
      if (snap.exists()) setMasterList((snap.data().items as TechStackItem[]) ?? []);
    })();
  }, []);

  const selectedValues = new Set(value.map(d => d.value));

  const addTech = (item: TechStackItem) => {
    if (selectedValues.has(item.value)) return;
    onChange([...value, { title: item.label, value: item.value, url: item.url, is_open_new_tab: item.is_open_new_tab }]);
    setSearch("");
    setOpen(false);
  };

  const removeTech = (v: string) => onChange(value.filter(d => d.value !== v));

  const available = masterList.filter(
    m => !selectedValues.has(m.value) &&
    (search === "" || m.label.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-2">
      <label className={lbl}>Dev Stack</label>

      {/* Selected techs */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#0a0d14] border border-[#2d3748] rounded-lg">
          {value.map(tech => (
            <span key={tech.value} className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-xs text-indigo-200">
              {tech.title}
              <button type="button" onClick={() => removeTech(tech.value)}
                className="text-indigo-400 hover:text-red-400 transition-colors leading-none">×</button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown picker from master list */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full text-left text-xs text-indigo-400 hover:text-indigo-300 border border-dashed border-[#2d3748] hover:border-indigo-500/40 rounded-lg px-3 py-2 transition-colors"
        >
          + Pick from tech stack list
        </button>

        {open && (
          <div className="absolute z-20 top-full mt-1 left-0 w-full bg-[#0f1117] border border-[#2d3748] rounded-xl shadow-xl">
            <div className="p-2 border-b border-[#2d3748]">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tech stack…"
                className="w-full bg-transparent text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none px-1"
              />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {available.length === 0 && (
                <p className="px-3 py-2 text-xs text-slate-600 italic">
                  {masterList.length === 0
                    ? "No tech stacks in master list. Add them at /admin/tech-stacks."
                    : "No matches."}
                </p>
              )}
              {available.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => addTech(item)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#1e2130] flex items-center gap-2"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-slate-600 font-mono">{item.value}</span>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-[#2d3748]">
              <button type="button" onClick={() => setOpen(false)} className="w-full text-xs text-slate-600 hover:text-slate-400">Close</button>
            </div>
          </div>
        )}
      </div>

      {masterList.length === 0 && (
        <p className="text-[10px] text-slate-600">
          No master tech stacks found. First add them at{" "}
          <a href="/admin/tech-stacks" target="_blank" className="text-indigo-400 underline">/admin/tech-stacks</a>.
        </p>
      )}
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
