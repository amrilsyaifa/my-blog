"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";

export interface TechStackItem {
  label:          string;
  value:          string;
  url:            string;
  is_open_new_tab: boolean;
}

const EMPTY_ITEM: TechStackItem = { label: "", value: "", url: "", is_open_new_tab: true };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";

export default function TechStacksPage() {
  const [items,     setItems]     = useState<TechStackItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);
  const [editIdx,   setEditIdx]   = useState<number | null>(null);
  const [form,      setForm]      = useState<TechStackItem>(EMPTY_ITEM);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "config", "tech_stacks"));
      if (snap.exists()) setItems((snap.data().items as TechStackItem[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const persist = async (next: TechStackItem[]) => {
    setSaving(true);
    await setDoc(doc(db, "config", "tech_stacks"), { items: next });
    setSaving(false);
  };

  const openAdd = () => { setEditIdx(null); setForm(EMPTY_ITEM); setShowForm(true); };
  const openEdit = (i: number) => { setEditIdx(i); setForm(items[i]); setShowForm(true); };

  const saveForm = async () => {
    const next = editIdx !== null
      ? items.map((it, i) => i === editIdx ? form : it)
      : [...items, form];
    setItems(next);
    setShowForm(false);
    await persist(next);
  };

  const confirmDelete = async () => {
    if (deleteIdx === null) return;
    const next = items.filter((_, i) => i !== deleteIdx);
    setItems(next);
    setDeleteIdx(null);
    await persist(next);
  };

  const setField = <K extends keyof TechStackItem>(k: K, v: TechStackItem[K]) => {
    setForm(prev => {
      const next = { ...prev, [k]: v };
      if (k === "label") next.value = slugify(v as string);
      return next;
    });
  };

  const btnClass = "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50";

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Tech Stacks</h1>
          <p className="text-xs text-slate-500 mt-1">Master list of tech stacks used across projects. Label + Value (slug) pairs for filtering.</p>
        </div>
        <button onClick={openAdd} className={btnClass}>+ Add Tech Stack</button>
      </div>

      {/* Table */}
      <div className="border border-[#2d3748] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f1117] border-b border-[#2d3748]">
            <tr>
              {["Label", "Value (slug)", "URL", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-600 text-sm italic">No tech stacks yet.</td></tr>
            )}
            {items.map((item, i) => (
              <tr key={i} className="border-b border-[#2d3748] last:border-0 bg-[#0a0d14] hover:bg-[#0f1117]">
                <td className="px-4 py-3 text-slate-200 font-medium">{item.label}</td>
                <td className="px-4 py-3 font-mono text-xs text-indigo-400">{item.value}</td>
                <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[160px]">{item.url || "—"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(i)} className="px-3 py-1 rounded-lg border border-[#2d3748] hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs transition-colors">Edit</button>
                  <button onClick={() => setDeleteIdx(i)} className="px-3 py-1 rounded-lg bg-red-900/30 hover:bg-red-800/50 text-red-400 text-xs transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1117] border border-[#2d3748] rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-100">{editIdx !== null ? "Edit Tech Stack" : "Add Tech Stack"}</h2>

            <div>
              <label className={lbl}>Label (display name) <span className="text-red-400">*</span></label>
              <input className={cls} value={form.label} placeholder="e.g. React"
                onChange={e => setField("label", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Value (filter slug) <span className="text-red-400">*</span></label>
              <input className={cls} value={form.value} placeholder="e.g. react"
                onChange={e => setField("value", slugify(e.target.value))} />
              <p className="text-[10px] text-slate-600 mt-1">Auto-generated from label. Used for filtering — do not change after projects reference it.</p>
            </div>
            <div>
              <label className={lbl}>URL (optional)</label>
              <input className={cls} value={form.url} placeholder="https://reactjs.org"
                onChange={e => setField("url", e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="tab" checked={form.is_open_new_tab}
                onChange={e => setField("is_open_new_tab", e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <label htmlFor="tab" className="text-sm text-slate-400">Open link in new tab</label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#2d3748] text-slate-400 hover:text-slate-200 text-sm">Cancel</button>
              <button onClick={saveForm} disabled={!form.label || !form.value || saving} className={btnClass}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteIdx !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1117] border border-[#2d3748] rounded-2xl w-full max-w-sm p-6 space-y-4">
            <p className="text-slate-200 text-sm">Delete <span className="font-semibold text-white">{items[deleteIdx]?.label}</span>?</p>
            <p className="text-xs text-slate-500">Existing projects that use this tech will still show it, but the value slug will no longer be available in the master list.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteIdx(null)} className="px-4 py-2 rounded-lg border border-[#2d3748] text-slate-400 text-sm">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
