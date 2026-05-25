"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import CVForm from "@components/components/admin/cv/CVForm";
import type { CVData, CareerCV, SkillCV, CertCV, Achievement, ProjectCV, Language } from "@components/components/admin/cv/types";

// Single dynamic import for ALL react-pdf code — prevents "Ro is not a function"
const CVPdfClient = dynamic(
  () => import("@components/components/admin/cv/CVPdfClient"),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  )}
);

const EMPTY: CVData = {
  name: "", role: "", location: "",
  email: "", phone: "", linkedin: "", github: "",
  portfolio_url: "", target_job: "", photo_url: "", summary: "",
  education: [], careers: [], skills: [], certifications: [],
  projects: [], languages: [],
};

type Template = "ats" | "visual";

export default function CVGeneratorPage() {
  const [data,     setData]     = useState<CVData>(EMPTY);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [template, setTemplate] = useState<Template>("ats");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [aboutSnap, cvSnap, careersSnap, skillsSnap, certsSnap, projectsSnap] = await Promise.all([
        getDoc(doc(db, "about", "profile")),
        getDoc(doc(db, "cv", "profile")),
        getDocs(collection(db, "careers")),
        getDocs(collection(db, "skills")),
        getDocs(collection(db, "certifications")),
        getDocs(collection(db, "projects")),
      ]);

      const about  = aboutSnap.exists() ? (aboutSnap.data() as Record<string, unknown>) : {};
      const cvProf = cvSnap.exists()    ? (cvSnap.data()    as Record<string, unknown>) : {};

      // Saved include/exclude sets — null means "never saved", treat all as included
      const savedCareerIds   = cvProf.included_careers  as string[] | null ?? null;
      const savedSkillIds    = cvProf.included_skills   as string[] | null ?? null;
      const savedCertIds     = cvProf.included_certs    as string[] | null ?? null;
      const savedProjectIds  = cvProf.included_projects as string[] | null ?? null;

      const careers: CareerCV[] = careersSnap.docs
        .map(d => {
          const r = d.data() as Record<string, unknown>;
          return {
            id:           d.id,
            job_title:    (r.job_title    as string)  ?? "",
            company:      (r.company      as string)  ?? "",
            job_location: (r.job_location as string)  ?? "",
            job_tipe:     (r.job_tipe     as string)  ?? "",
            start_date:   (r.start_date   as string)  ?? "",
            end_date:     (r.end_date     as string)  ?? "",
            is_active:    (r.is_active    as boolean) ?? false,
            work_details: (r.work_details as string[])     ?? [],
            achievements: (r.achievements as Achievement[]) ?? [],
            included: savedCareerIds ? savedCareerIds.includes(d.id) : true,
          };
        })
        .sort((a, b) => (b.start_date ?? "").localeCompare(a.start_date ?? ""));

      const skills: SkillCV[] = skillsSnap.docs.map(d => {
        const r = d.data() as Record<string, unknown>;
        return {
          id:       d.id,
          name:     (r.name as string)   ?? "",
          data:     (r.data as string[]) ?? [],
          included: savedSkillIds ? savedSkillIds.includes(d.id) : true,
        };
      });

      const certifications: CertCV[] = certsSnap.docs.map(d => {
        const r = d.data() as Record<string, unknown>;
        return {
          id:       d.id,
          title:    (r.title  as string) ?? "",
          issuer:   (r.issuer as string) ?? "",
          year:     (r.year   as string) ?? "",
          included: savedCertIds ? savedCertIds.includes(d.id) : true,
        };
      });

      const projects: ProjectCV[] = projectsSnap.docs
        .map(d => {
          const r = d.data() as Record<string, unknown>;
          return {
            id:          d.id,
            title:       (r.title_en   as string) || (r.title       as string) || "",
            description: (r.description_en as string) || (r.description as string) || "",
            link:        (r.link        as string) ?? "",
            project_by:  (r.project_by  as string) ?? "self",
            included:    savedProjectIds ? savedProjectIds.includes(d.id) : false,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      setData({
        name:           (cvProf.name     as string) || (about.name     as string) || "",
        role:           (cvProf.role     as string) || (about.role     as string) || "",
        location:       (cvProf.location as string) || (about.location as string) || "",
        email:          (cvProf.email      as string) ?? "",
        phone:          (cvProf.phone      as string) ?? "",
        linkedin:       (cvProf.linkedin   as string) ?? "",
        github:         (cvProf.github     as string) ?? "",
        portfolio_url:   (cvProf.portfolio_url   as string)           ?? "",
        target_job:      (cvProf.target_job      as string)           ?? "",
        photo_url:       (cvProf.photo_url       as string)           ?? "",
        summary:         (cvProf.summary         as string)           ?? "",
        education:       (cvProf.education       as CVData["education"])    ?? [],
        languages: (cvProf.languages as Language[]) ?? [],
        careers,
        skills,
        certifications,
        projects,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveDraft = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "cv", "profile"), {
        name:              data.name,
        role:              data.role,
        location:          data.location,
        email:             data.email,
        phone:             data.phone,
        linkedin:          data.linkedin,
        github:            data.github,
        portfolio_url:      data.portfolio_url,
        target_job:         data.target_job,
        photo_url:          data.photo_url,
        summary:            data.summary,
        education:          data.education,
        languages:          data.languages,
        included_careers:   data.careers.filter(c => c.included).map(c => c.id),
        included_skills:    data.skills.filter(s => s.included).map(s => s.id),
        included_certs:     data.certifications.filter(c => c.included).map(c => c.id),
        included_projects:  data.projects.filter(p => p.included).map(p => p.id),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const firstName  = data.name.split(" ")[0] ?? "Firstname";
  const lastName   = data.name.split(" ").slice(1).join("_") || "Lastname";
  const fileATS    = `${firstName}_${lastName}_Resume_ATS.pdf`;
  const fileVisual = `${firstName}_${lastName}_Resume.pdf`;

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0a0d14]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3748] bg-[#0f1117] shrink-0">
        <div>
          <h1 className="text-lg font-bold text-slate-100">CV Generator</h1>
          <p className="text-xs text-slate-500">ATS-optimized resume from your portfolio data</p>
        </div>
        <button
          onClick={saveDraft}
          disabled={saving || loading}
          className="px-4 py-2 rounded-lg bg-[#1e2130] hover:bg-[#252a3a] border border-[#2d3748] text-slate-300 text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Draft"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Form */}
          <div className="w-96 shrink-0 overflow-y-auto border-r border-[#2d3748] p-4 space-y-3">
            <CVForm data={data} onChange={setData} />
          </div>

          {/* Right — Preview */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Template toggle */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2d3748] bg-[#0f1117] shrink-0">
              <span className="text-xs text-slate-500 mr-2">Preview:</span>
              <button
                onClick={() => setTemplate("ats")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${template === "ats" ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
              >
                ATS Template
              </button>
              <button
                onClick={() => setTemplate("visual")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${template === "visual" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-slate-200"}`}
              >
                Visual Template
              </button>
            </div>

            {/* PDF panel — single dynamic import for all react-pdf */}
            <div className="flex-1 overflow-hidden">
              <CVPdfClient
                data={data}
                template={template}
                fileATS={fileATS}
                fileVisual={fileVisual}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
