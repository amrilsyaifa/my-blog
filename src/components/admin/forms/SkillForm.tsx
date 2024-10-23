"use client";

import DynamicList from "@components/components/admin/DynamicList";

export interface SkillFormData {
  name:        string;
  data:        string[];
  skill_order: number;
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

interface Props { data: SkillFormData; onChange: (d: SkillFormData) => void; }

export default function SkillForm({ data, onChange }: Props) {
  const set = <K extends keyof SkillFormData>(k: K, v: SkillFormData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Category Name</label>
        <input className={cls} value={data.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Frontend" />
      </div>
      <DynamicList
        label="Skills"
        value={data.data}
        onChange={v => set("data", v)}
        placeholder="e.g. React, TypeScript…"
      />
      <div>
        <label className={lbl}>Order</label>
        <input className={cls} type="number" value={data.skill_order} onChange={e => set("skill_order", Number(e.target.value))} />
      </div>
    </div>
  );
}
