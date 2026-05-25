"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CVData, EducationItem, Language, SkillCV } from "./types";

const cls = "w-full bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
const lbl = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1";
const addBtn = "text-xs text-indigo-400 hover:text-indigo-300 border border-dashed border-[#2d3748] hover:border-indigo-500/50 rounded-lg px-3 py-2 w-full transition-colors";

interface Props {
  data:     CVData;
  onChange: (d: CVData) => void;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "portfolio/cv" }),
  });
  const { signature, timestamp, apiKey, cloudName } = await signRes.json();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("api_key",   apiKey);
  fd.append("folder",    "portfolio/cv");
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
  const json = await res.json();
  if (!json.secure_url) throw new Error("Upload failed");
  return json.secure_url as string;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#2d3748] rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#0f1117] hover:bg-[#1a1f2e] transition-colors text-left">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{title}</span>
        <span className="text-slate-500 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-4 py-4 space-y-4 bg-[#0a0d14]">{children}</div>}
    </div>
  );
}

function SkillCategoryRow({
  skill, onToggleCategory, onToggleItem, onToggleAll,
}: {
  skill: SkillCV;
  onToggleCategory: (checked: boolean) => void;
  onToggleItem: (item: string, checked: boolean) => void;
  onToggleAll: (allChecked: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const allSelected = skill.included_items.length === skill.data.length;
  const someSelected = skill.included_items.length > 0 && !allSelected;

  return (
    <div className="border border-[#2d3748] rounded-lg overflow-hidden">
      {/* Category header row */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-[#0f1117]">
        <input type="checkbox" checked={skill.included}
          onChange={e => onToggleCategory(e.target.checked)}
          className="accent-indigo-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 font-medium">{skill.name}</p>
          <p className="text-xs text-slate-500">
            {skill.included_items.length}/{skill.data.length} selected
          </p>
        </div>
        {skill.included && (
          <button type="button" onClick={() => setOpen(v => !v)}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors shrink-0">
            {open ? "▲ Hide" : "▼ Items"}
          </button>
        )}
      </div>

      {/* Individual items */}
      {skill.included && open && (
        <div className="px-3 py-2 bg-[#0a0d14] border-t border-[#2d3748] space-y-1">
          {/* Select all / none */}
          <div className="flex gap-3 mb-2">
            <button type="button" onClick={() => onToggleAll(true)}
              disabled={allSelected}
              className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors">
              All
            </button>
            <button type="button" onClick={() => onToggleAll(false)}
              disabled={!someSelected && !allSelected}
              className="text-xs text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors">
              None
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skill.data.map(item => {
              const checked = skill.included_items.includes(item);
              return (
                <label key={item}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
                    checked
                      ? "border-indigo-500/50 bg-indigo-600/10 text-indigo-300"
                      : "border-[#2d3748] text-slate-500 hover:border-slate-500"
                  }`}>
                  <input type="checkbox" checked={checked}
                    onChange={e => onToggleItem(item, e.target.checked)}
                    className="accent-indigo-500 w-3 h-3" />
                  {item}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EducationEditor({ value, onChange }: { value: EducationItem[]; onChange: (v: EducationItem[]) => void }) {
  const add    = () => onChange([...value, { degree: "", institution: "", year: "" }]);
  const update = (i: number, k: keyof EducationItem, v: string) => {
    const next = [...value]; next[i] = { ...next[i], [k]: v }; onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0f1117] border border-[#2d3748] rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <input className={`${cls} flex-1`} placeholder="Degree (e.g. Bachelor of Computer Science)" value={item.degree} onChange={e => update(i, "degree", e.target.value)} />
            <button type="button" onClick={() => remove(i)} className="px-2 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm shrink-0">×</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={cls} placeholder="Institution" value={item.institution} onChange={e => update(i, "institution", e.target.value)} />
            <input className={cls} placeholder="Year (e.g. 2020)" value={item.year} onChange={e => update(i, "year", e.target.value)} />
          </div>
          <input className={cls} placeholder="GPA (optional)" value={item.gpa ?? ""} onChange={e => update(i, "gpa", e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={add} className={addBtn}>+ Add Education</button>
    </div>
  );
}


const PROFICIENCY_OPTIONS = ["Native", "Professional", "Conversational", "Basic"];

function LanguageEditor({ value, onChange }: { value: Language[]; onChange: (v: Language[]) => void }) {
  const add    = () => onChange([...value, { name: "", proficiency: "Professional" }]);
  const update = (i: number, k: keyof Language, v: string) => {
    const next = [...value]; next[i] = { ...next[i], [k]: v }; onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input className={`${cls} flex-1`} placeholder="e.g. English" value={item.name} onChange={e => update(i, "name", e.target.value)} />
          <select
            className={`${cls} w-40 shrink-0`}
            value={item.proficiency}
            onChange={e => update(i, "proficiency", e.target.value)}
          >
            {PROFICIENCY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="button" onClick={() => remove(i)} className="px-2 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm shrink-0">×</button>
        </div>
      ))}
      <button type="button" onClick={add} className={addBtn}>+ Add Language</button>
    </div>
  );
}

export default function CVForm({ data, onChange }: Props) {
  const set = <K extends keyof CVData>(k: K, v: CVData[K]) => onChange({ ...data, [k]: v });

  const photoInputRef    = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError,     setPhotoError]     = useState("");

  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true);
    setPhotoError("");
    try {
      const url = await uploadToCloudinary(file);
      set("photo_url", url);
    } catch {
      setPhotoError("Upload failed. Try again.");
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">

      {/* 1. Contact & Photo */}
      <Section title="Contact & Photo">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Full Name</label>
            <input className={cls} value={data.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Target Job Title</label>
            <input className={cls} placeholder="e.g. Senior Software Engineer" value={data.target_job} onChange={e => set("target_job", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Location</label>
            <input className={cls} value={data.location} onChange={e => set("location", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Email</label>
            <input className={cls} type="email" value={data.email} onChange={e => set("email", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Phone</label>
            <input className={cls} placeholder="+62..." value={data.phone} onChange={e => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>LinkedIn</label>
            <input className={cls} placeholder="linkedin.com/in/..." value={data.linkedin} onChange={e => set("linkedin", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>GitHub</label>
            <input className={cls} placeholder="github.com/..." value={data.github} onChange={e => set("github", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Portfolio URL</label>
            <input className={cls} placeholder="yoursite.com" value={data.portfolio_url} onChange={e => set("portfolio_url", e.target.value)} />
          </div>
        </div>

        {/* Photo */}
        <div>
          <label className={lbl}>Profile Photo <span className="text-slate-500 normal-case tracking-normal font-normal">(Visual template only)</span></label>
          <div className="flex items-center gap-3">
            {data.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photo_url} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50 shrink-0" />
            )}
            <div className="flex-1">
              <button type="button" disabled={photoUploading} onClick={() => photoInputRef.current?.click()}
                className="px-4 py-2 text-xs rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 transition-colors disabled:opacity-50">
                {photoUploading ? "Uploading…" : data.photo_url ? "Change Photo" : "Upload Photo"}
              </button>
              {data.photo_url && (
                <button type="button" onClick={() => set("photo_url", "")} className="ml-2 text-xs text-red-400 hover:text-red-300">Remove</button>
              )}
              {photoError && <p className="text-xs text-red-400 mt-1">{photoError}</p>}
            </div>
          </div>
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); }} />
        </div>
      </Section>

      {/* 2. Summary */}
      <Section title="Professional Summary">
        <p className="text-xs text-slate-500 -mt-1">Write 3-4 sentences. Include your top skills and years of experience.</p>
        <textarea className={`${cls} resize-none`} rows={5}
          placeholder="e.g. Software Engineer with 5+ years building scalable web applications using TypeScript, React, and Node.js..."
          value={data.summary} onChange={e => set("summary", e.target.value)} />
        <p className="text-xs text-slate-600 text-right">{data.summary.length} chars</p>
      </Section>

      {/* 3. Experience */}
      <Section title="Professional Experience">
        <p className="text-xs text-slate-500 -mt-1">
          From your <Link href="/admin/careers" className="text-indigo-400 underline underline-offset-2">Careers</Link> data. Toggle to include/exclude. Work details and achievements are edited there.
        </p>
        {data.careers.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No careers found.</p>
        ) : (
          <div className="space-y-2">
            {data.careers.map((c, i) => (
              <label key={c.id} className="flex items-start gap-3 p-3 rounded-lg border border-[#2d3748] hover:border-indigo-500/30 cursor-pointer transition-colors">
                <input type="checkbox" checked={c.included}
                  onChange={e => {
                    const next = [...data.careers];
                    next[i] = { ...next[i], included: e.target.checked };
                    set("careers", next);
                  }}
                  className="mt-0.5 accent-indigo-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium">{c.job_title}</p>
                  <p className="text-xs text-slate-500">{c.company} · {c.is_active ? "Present" : c.end_date}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {c.work_details?.length ?? 0} bullet{(c.work_details?.length ?? 0) !== 1 ? "s" : ""}
                    {(c.achievements?.length ?? 0) > 0 && ` · ${c.achievements.length} achievement${c.achievements.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </Section>

      {/* 4. Education */}
      <Section title="Education">
        <EducationEditor value={data.education} onChange={v => set("education", v)} />
      </Section>

      {/* 5. Skills */}
      <Section title="Skills" defaultOpen={false}>
        <p className="text-xs text-slate-500 -mt-1">
          From your <Link href="/admin/skills" className="text-indigo-400 underline underline-offset-2">Skills</Link> data. Toggle categories and individual items.
        </p>
        {data.skills.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No skills found.</p>
        ) : (
          <div className="space-y-2">
            {data.skills.map((s, i) => (
              <SkillCategoryRow
                key={s.id}
                skill={s}
                onToggleCategory={checked => {
                  const next = [...data.skills];
                  next[i] = { ...next[i], included: checked };
                  set("skills", next);
                }}
                onToggleItem={(item, checked) => {
                  const next = [...data.skills];
                  const items = checked
                    ? [...next[i].included_items, item]
                    : next[i].included_items.filter(x => x !== item);
                  next[i] = { ...next[i], included_items: items };
                  set("skills", next);
                }}
                onToggleAll={allChecked => {
                  const next = [...data.skills];
                  next[i] = { ...next[i], included_items: allChecked ? [...next[i].data] : [] };
                  set("skills", next);
                }}
              />
            ))}
          </div>
        )}
      </Section>

      {/* 6. Certifications */}
      <Section title="Certifications" defaultOpen={false}>
        <p className="text-xs text-slate-500 -mt-1">
          From your <Link href="/admin/certifications" className="text-indigo-400 underline underline-offset-2">Certifications</Link> data. Toggle to include/exclude.
        </p>
        {data.certifications.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No certifications found.</p>
        ) : (
          <div className="space-y-2">
            {data.certifications.map((c, i) => (
              <label key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#2d3748] hover:border-indigo-500/30 cursor-pointer transition-colors">
                <input type="checkbox" checked={c.included}
                  onChange={e => {
                    const next = [...data.certifications];
                    next[i] = { ...next[i], included: e.target.checked };
                    set("certifications", next);
                  }}
                  className="accent-indigo-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.issuer}{c.year ? ` · ${c.year}` : ""}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </Section>

      {/* 7. Portfolio */}
      <Section title="Portfolio" defaultOpen={false}>
        <p className="text-xs text-slate-500 -mt-1">
          Pulled from your <Link href="/admin/projects" className="text-indigo-400 underline underline-offset-2">Projects</Link>. Tick the ones to show in the CV. All projects default to unchecked.
        </p>
        {data.projects.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No projects found.</p>
        ) : (
          <div className="space-y-2">
            {data.projects.map((p, i) => (
              <label key={p.id} className="flex items-start gap-3 p-3 rounded-lg border border-[#2d3748] hover:border-indigo-500/30 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={p.included}
                  onChange={e => {
                    const next = [...data.projects];
                    next[i] = { ...next[i], included: e.target.checked };
                    set("projects", next);
                  }}
                  className="mt-0.5 accent-indigo-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium">{p.title}</p>
                  {p.link && <p className="text-xs text-slate-500 truncate">{p.link}</p>}
                  <p className="text-xs text-slate-600">{p.project_by === "self" ? "Personal" : "Company"}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </Section>

      {/* 8. Languages */}
      <Section title="Languages" defaultOpen={false}>
        <LanguageEditor value={data.languages} onChange={v => set("languages", v)} />
      </Section>

    </div>
  );
}
