"use client";

import CloudinaryUpload from "@components/components/admin/CloudinaryUpload";

export interface CertificationFormData {
  title:  string;
  issuer: string;
  href:   string;
  badge:  string;
  color:  string;
  order:  number;
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

interface Props { data: CertificationFormData; onChange: (d: CertificationFormData) => void; }

export default function CertificationForm({ data, onChange }: Props) {
  const set = <K extends keyof CertificationFormData>(k: K, v: CertificationFormData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Title</label>
        <input className={cls} value={data.title} onChange={e => set("title", e.target.value)} />
      </div>
      <div>
        <label className={lbl}>Issuer</label>
        <input className={cls} value={data.issuer} onChange={e => set("issuer", e.target.value)} placeholder="e.g. HackerRank" />
      </div>
      <div>
        <label className={lbl}>Certificate URL</label>
        <input className={cls} value={data.href} onChange={e => set("href", e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label className={lbl}>Badge Emoji (or leave blank for image)</label>
        <input className={cls} value={data.badge} onChange={e => set("badge", e.target.value)} placeholder="e.g. ⚛️" />
      </div>
      <CloudinaryUpload
        label="Badge Image (overrides emoji if set)"
        url={data.badge.startsWith("http") ? data.badge : undefined}
        folder="portfolio/certifications"
        onUpload={url => set("badge", url)}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.color}
              onChange={e => set("color", e.target.value)}
              className="h-9 w-14 rounded-lg border border-[#2d3748] bg-transparent cursor-pointer"
            />
            <input className={cls} value={data.color} onChange={e => set("color", e.target.value)} placeholder="#6366f1" />
          </div>
        </div>
        <div>
          <label className={lbl}>Order</label>
          <input className={cls} type="number" value={data.order} onChange={e => set("order", Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
}
