"use client";

import { useState } from "react";
import DynamicList from "@components/components/admin/DynamicList";

export interface Achievement {
  year:         string;
  title:        string;
  description?: string;
}

export interface CareerFormData {
  job_title:       string;
  job_tipe:        string;
  job_location:    string;
  company:         string;
  company_address: string;
  company_url:     string;
  start_date:      string;
  end_date:        string;
  is_active:       boolean;
  dev_stack:       string[];
  company_order:   number;
  work_details?:   string[];
  achievements?:   Achievement[];
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

interface Props { data: CareerFormData; onChange: (d: CareerFormData) => void; }

function AchievementEditor({
  value,
  onChange,
}: {
  value: Achievement[];
  onChange: (v: Achievement[]) => void;
}) {
  const add    = () => onChange([...value, { year: new Date().getFullYear().toString(), title: "", description: "" }]);
  const update = (i: number, k: keyof Achievement, v: string) => {
    const next = [...value]; next[i] = { ...next[i], [k]: v }; onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <label className={lbl}>Achievements</label>
      {value.map((item, i) => (
        <div key={i} className="bg-[#0a0d14] border border-[#2d3748] rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="w-20 shrink-0">
              <input className={cls} placeholder="Year" value={item.year} onChange={e => update(i, "year", e.target.value)} />
            </div>
            <input className={`${cls} flex-1`} placeholder="Achievement title" value={item.title} onChange={e => update(i, "title", e.target.value)} />
            <button type="button" onClick={() => remove(i)} className="px-2 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm shrink-0">×</button>
          </div>
          <input className={cls} placeholder="Description (optional)" value={item.description ?? ""} onChange={e => update(i, "description", e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
        + Add achievement
      </button>
    </div>
  );
}

export default function CareerForm({ data, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const set = <K extends keyof CareerFormData>(k: K, v: CareerFormData[K]) =>
    onChange({ ...data, [k]: v });

  const tabActive   = "px-4 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white";
  const tabInactive = "px-4 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-200 border border-[#2d3748]";

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 pb-3 border-b border-[#2d3748]">
        <button type="button" onClick={() => setActiveTab("basic")} className={activeTab === "basic" ? tabActive : tabInactive}>
          Basic Info
        </button>
        <button type="button" onClick={() => setActiveTab("details")} className={activeTab === "details" ? tabActive : tabInactive}>
          Work Details & Achievements
        </button>
      </div>

      {activeTab === "basic" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Job Title</label>
              <input className={cls} value={data.job_title} onChange={e => set("job_title", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Employment Type</label>
              <input className={cls} value={data.job_tipe} onChange={e => set("job_tipe", e.target.value)} placeholder="e.g. Full-time" />
            </div>
          </div>
          <div>
            <label className={lbl}>Company</label>
            <input className={cls} value={data.company} onChange={e => set("company", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Company URL</label>
              <input className={cls} value={data.company_url} onChange={e => set("company_url", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input className={cls} value={data.job_location} onChange={e => set("job_location", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={lbl}>Company Address</label>
            <input className={cls} value={data.company_address} onChange={e => set("company_address", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Start Date</label>
              <input className={cls} type="date" value={data.start_date} onChange={e => set("start_date", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>End Date</label>
              <input className={cls} type="date" value={data.end_date} onChange={e => set("end_date", e.target.value)} disabled={data.is_active} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input id="is_active" type="checkbox" checked={data.is_active} onChange={e => set("is_active", e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            <label htmlFor="is_active" className="text-sm text-slate-300">Currently working here</label>
          </div>
          <DynamicList label="Tech Stack" value={data.dev_stack} onChange={v => set("dev_stack", v)} placeholder="e.g. React" />
          <div>
            <label className={lbl}>Order</label>
            <input className={cls} type="number" value={data.company_order} onChange={e => set("company_order", Number(e.target.value))} />
          </div>
        </>
      )}

      {activeTab === "details" && (
        <>
          <div>
            <label className={lbl}>Work Details (responsibilities / tasks)</label>
            <p className="text-xs text-slate-500 mb-1">One bullet per line — press Enter to add a new item</p>
            <textarea
              className={`${cls} min-h-[160px] resize-y leading-relaxed`}
              placeholder={"e.g. Led migration from monolith to microservices\ne.g. Mentored 3 junior engineers"}
              value={(data.work_details ?? []).join("\n")}
              onChange={e => set("work_details", e.target.value.split("\n"))}
            />
          </div>
          <AchievementEditor
            value={data.achievements ?? []}
            onChange={v => set("achievements", v)}
          />
        </>
      )}
    </div>
  );
}
