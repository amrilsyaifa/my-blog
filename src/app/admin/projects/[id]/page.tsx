"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useParams, useRouter } from "next/navigation";
import DynamicList from "@components/components/admin/DynamicList";
import CloudinaryUpload from "@components/components/admin/CloudinaryUpload";

interface LinkItem  { title: string; url: string; }
interface ImageItem { description: string; url: string; }

interface DetailForm {
  title:       string;
  meta_desc:   string;
  description: string[];
  links:       LinkItem[];
  images:      ImageItem[];
  dev_stack:   string[];
}

const EMPTY: DetailForm = {
  title: "", meta_desc: "", description: [], links: [], images: [], dev_stack: [],
};

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

export default function ProjectDetailAdminPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [form,    setForm]    = useState<DetailForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const set = <K extends keyof DetailForm>(k: K, v: DetailForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const fetch = useCallback(async () => {
    const snap = await getDoc(doc(db, "project_detail", id));
    if (snap.exists()) {
      setForm({ ...EMPTY, ...snap.data() } as DetailForm);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "project_detail", id), form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ── Link helpers ── */
  const addLink    = () => set("links", [...form.links, { title: "", url: "" }]);
  const updateLink = (i: number, k: keyof LinkItem, v: string) => {
    const next = [...form.links];
    next[i] = { ...next[i], [k]: v };
    set("links", next);
  };
  const removeLink = (i: number) => set("links", form.links.filter((_, idx) => idx !== i));

  /* ── Image helpers ── */
  const addImage    = (url: string) => set("images", [...form.images, { description: "", url }]);
  const updateDesc  = (i: number, v: string) => {
    const next = [...form.images];
    next[i] = { ...next[i], description: v };
    set("images", next);
  };
  const removeImage = (i: number) => set("images", form.images.filter((_, idx) => idx !== i));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-300 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-slate-100">Project Detail — {id}</h1>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className={lbl}>Title</label>
          <input className={cls} value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Meta Description</label>
          <textarea className={cls} rows={2} value={form.meta_desc} onChange={e => set("meta_desc", e.target.value)} />
        </div>

        <DynamicList label="Description Paragraphs" value={form.description} onChange={v => set("description", v)} placeholder="Paragraph text…" />
        <DynamicList label="Tech Stack" value={form.dev_stack} onChange={v => set("dev_stack", v)} placeholder="e.g. React" />

        {/* Links */}
        <div className="space-y-2">
          <label className={lbl}>Links</label>
          {form.links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${cls} flex-1`} placeholder="Label" value={link.title} onChange={e => updateLink(i, "title", e.target.value)} />
              <input className={`${cls} flex-1`} placeholder="https://…" value={link.url} onChange={e => updateLink(i, "url", e.target.value)} />
              <button type="button" onClick={() => removeLink(i)} className="px-2 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm">×</button>
            </div>
          ))}
          <button type="button" onClick={addLink} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add link</button>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <label className={lbl}>Carousel Images</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-3 items-start bg-[#13151f] border border-[#2d3748] rounded-xl p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {img.url && <img src={img.url} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />}
              <div className="flex-1 space-y-2">
                <input className={cls} placeholder="Caption" value={img.description} onChange={e => updateDesc(i, e.target.value)} />
              </div>
              <button type="button" onClick={() => removeImage(i)} className="px-2 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm mt-1">×</button>
            </div>
          ))}
          <CloudinaryUpload label="Add Image" folder="portfolio/projects" onUpload={addImage} />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-green-400 text-sm">✓ Saved!</span>}
      </div>
    </div>
  );
}
