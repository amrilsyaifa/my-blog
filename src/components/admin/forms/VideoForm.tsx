"use client";

export interface VideoFormData {
  title:   string;
  videoId: string;
  order:   number;
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

interface Props { data: VideoFormData; onChange: (d: VideoFormData) => void; }

export default function VideoForm({ data, onChange }: Props) {
  const set = <K extends keyof VideoFormData>(k: K, v: VideoFormData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Title</label>
        <input className={cls} value={data.title} onChange={e => set("title", e.target.value)} />
      </div>
      <div>
        <label className={lbl}>YouTube Video ID</label>
        <input className={cls} value={data.videoId} onChange={e => set("videoId", e.target.value)} placeholder="e.g. dQw4w9WgXcQ" />
        <p className="text-xs text-slate-500 mt-1">The part after ?v= in the YouTube URL</p>
      </div>
      <div>
        <label className={lbl}>Order</label>
        <input className={cls} type="number" value={data.order} onChange={e => set("order", Number(e.target.value))} />
      </div>
    </div>
  );
}
