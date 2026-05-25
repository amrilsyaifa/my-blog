"use client";

import { useState, useEffect, useCallback } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import CVDocumentATS    from "./admin/cv/CVDocumentATS";
import CVDocumentVisual from "./admin/cv/CVDocumentVisual";
import type { CVData, CareerCV, SkillCV, CertCV, Achievement, ProjectCV, Language, CommunityCV } from "./admin/cv/types";

const EMPTY: CVData = {
  name: "", role: "", location: "",
  email: "", phone: "", linkedin: "", github: "",
  portfolio_url: "", target_job: "", photo_url: "", summary: "",
  education: [], careers: [], skills: [], certifications: [],
  projects: [], languages: [], community: [],
};

export default function CVDownloadLinksInner() {
  const [data,    setData]    = useState<CVData>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [aboutSnap, cvSnap, careersSnap, skillsSnap, certsSnap, projectsSnap, communitySnap] = await Promise.all([
        getDoc(doc(db, "about", "profile")),
        getDoc(doc(db, "cv", "profile")),
        getDocs(collection(db, "careers")),
        getDocs(collection(db, "skills")),
        getDocs(collection(db, "certifications")),
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "community")),
      ]);

      const about  = aboutSnap.exists() ? (aboutSnap.data() as Record<string, unknown>) : {};
      const cvProf = cvSnap.exists()    ? (cvSnap.data()    as Record<string, unknown>) : {};

      const savedCareerIds    = cvProf.included_careers   as string[] | null ?? null;
      const savedSkillIds     = cvProf.included_skills    as string[] | null ?? null;
      const savedCertIds      = cvProf.included_certs     as string[] | null ?? null;
      const savedProjectIds   = cvProf.included_projects  as string[] | null ?? null;
      const savedCommunityIds = cvProf.included_community as string[] | null ?? null;
      const savedSkillItems   = cvProf.skill_items as Record<string, string[]> | null ?? null;

      const careers: CareerCV[] = careersSnap.docs
        .map(d => {
          const r = d.data() as Record<string, unknown>;
          return {
            id:            d.id,
            job_title:     (r.job_title     as string)  ?? "",
            company:       (r.company       as string)  ?? "",
            job_location:  (r.job_location  as string)  ?? "",
            job_tipe:      (r.job_tipe      as string)  ?? "",
            start_date:    (r.start_date    as string)  ?? "",
            end_date:      (r.end_date      as string)  ?? "",
            is_active:     (r.is_active     as boolean) ?? false,
            work_details:  (r.work_details  as string[])      ?? [],
            achievements:  (r.achievements  as Achievement[])  ?? [],
            company_order: (r.company_order as number)  ?? 0,
            included: savedCareerIds ? savedCareerIds.includes(d.id) : true,
          };
        })
        .sort((a, b) => b.company_order - a.company_order);

      const skills: SkillCV[] = skillsSnap.docs.map(d => {
        const r   = d.data() as Record<string, unknown>;
        const all = (r.data as string[]) ?? [];
        return {
          id:             d.id,
          name:           (r.name as string) ?? "",
          data:           all,
          included_items: savedSkillItems?.[d.id] ?? all,
          included:       savedSkillIds ? savedSkillIds.includes(d.id) : true,
        };
      });

      const certifications: CertCV[] = certsSnap.docs.map(d => {
        const r = d.data() as Record<string, unknown>;
        return {
          id:       d.id,
          title:    (r.title  as string) ?? "",
          issuer:   (r.issuer as string) ?? "",
          year:     (r.year   as string) ?? "",
          href:     (r.href   as string) ?? "",
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
            link:        (r.link as string) ?? "",
            project_by:  (r.project_by as string) ?? "self",
            included:    savedProjectIds ? savedProjectIds.includes(d.id) : false,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      const community: CommunityCV[] = communitySnap.docs
        .map(d => {
          const r = d.data() as Record<string, unknown>;
          return {
            id:          d.id,
            title:       (r.title_en as string) || (r.title as string) || "",
            description: (r.description_en as string) || (r.description as string) || "",
            date:        (r.date     as string) ?? "",
            location:    (r.location as string) ?? "",
            included:    savedCommunityIds ? savedCommunityIds.includes(d.id) : false,
          };
        })
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

      setData({
        name:           (about.name        as string) ?? "",
        role:           (about.role        as string) ?? "",
        location:       (about.location    as string) ?? "",
        email:          (cvProf.email      as string) ?? "",
        phone:          (cvProf.phone      as string) ?? "",
        linkedin:       (cvProf.linkedin   as string) ?? "",
        github:         (cvProf.github     as string) ?? "",
        portfolio_url:  (cvProf.portfolio_url  as string) ?? "",
        target_job:     (cvProf.target_job     as string) ?? "",
        photo_url:      (cvProf.photo_url      as string) ?? "",
        summary:        (cvProf.summary        as string) ?? "",
        education:      (cvProf.education      as CVData["education"]) ?? [],
        languages:      (cvProf.languages      as Language[]) ?? [],
        careers,
        skills,
        certifications,
        projects,
        community,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const firstName  = data.name.split(" ")[0] ?? "Resume";
  const lastName   = data.name.split(" ").slice(1).join("_") || "";
  const fileATS    = `${firstName}${lastName ? "_" + lastName : ""}_Resume_ATS.pdf`;
  const fileVisual = `${firstName}${lastName ? "_" + lastName : ""}_Resume.pdf`;

  if (loading) {
    return (
      <div className="flex gap-3 mt-6">
        {[0, 1].map(i => (
          <div key={i} className="h-12 w-44 rounded-xl bg-bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Download CV</p>
      <div className="flex flex-wrap gap-3">
        {/* ATS version */}
        <PDFDownloadLink
          document={<CVDocumentATS data={data} />}
          fileName={fileATS}
          className="group flex items-center gap-3 px-5 py-3 bg-bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300"
        >
          {({ loading: l }) => (
            <>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-text-muted uppercase tracking-widest">ATS Friendly</p>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                  {l ? "Preparing…" : "Download CV"}
                </p>
              </div>
            </>
          )}
        </PDFDownloadLink>

        {/* Visual version */}
        <PDFDownloadLink
          document={<CVDocumentVisual data={data} />}
          fileName={fileVisual}
          className="group flex items-center gap-3 px-5 py-3 bg-bg-card border border-border rounded-xl hover:border-accent/50 hover:shadow-glow-sm transition-all duration-300"
        >
          {({ loading: l }) => (
            <>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-text-muted uppercase tracking-widest">With Design</p>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                  {l ? "Preparing…" : "Download CV"}
                </p>
              </div>
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
