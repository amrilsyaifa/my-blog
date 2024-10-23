"use client";

export interface AboutFormData {
  name:             string;
  role:             string;
  location:         string;
  interests:        string;
  experience_start: string;
  greeting_en:      string;
  greeting_id?:     string;
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

interface Props { data: AboutFormData; onChange: (d: AboutFormData) => void; }

export default function AboutForm({ data, onChange }: Props) {
  const set = <K extends keyof AboutFormData>(k: K, v: AboutFormData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Name</label>
          <input className={cls} value={data.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Role / Title</label>
          <input className={cls} value={data.role} onChange={e => set("role", e.target.value)} placeholder="Software Engineer" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Location</label>
          <input className={cls} value={data.location} onChange={e => set("location", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Interests</label>
          <input className={cls} value={data.interests} onChange={e => set("interests", e.target.value)} placeholder="Gaming, Coffee" />
        </div>
      </div>
      <div>
        <label className={lbl}>Experience Start Date</label>
        <input className={cls} type="date" value={data.experience_start} onChange={e => set("experience_start", e.target.value)} />
      </div>
      <div>
        <label className={lbl}>Greeting / Bio (English) <span className="text-red-400">*</span></label>
        <textarea className={cls} rows={4} value={data.greeting_en} onChange={e => set("greeting_en", e.target.value)} placeholder="I'm a fullstack developer from..." />
      </div>
      <div>
        <label className={lbl}>Greeting / Bio (Indonesia) <span className="text-slate-500">(optional)</span></label>
        <textarea className={cls} rows={4} value={data.greeting_id ?? ""} onChange={e => set("greeting_id", e.target.value)} placeholder="Saya seorang developer fullstack dari..." />
      </div>
    </div>
  );
}
