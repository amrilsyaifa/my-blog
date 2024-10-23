"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AboutForm, { AboutFormData } from "@components/components/admin/forms/AboutForm";

const EMPTY: AboutFormData = {
  name: "", role: "", location: "", interests: "",
  experience_start: "2020-01-01", greeting_en: "", greeting_id: "",
};

export default function AboutAdminPage() {
  const [form,    setForm]    = useState<AboutFormData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "about", "profile"));
        if (snap.exists()) setForm(snap.data() as AboutFormData);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "about", "profile"), form as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">About / Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Greeting and info cards shown on the About page</p>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-[#1e2130] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <AboutForm data={form} onChange={setForm} />
      )}
    </div>
  );
}
