"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import CarrerItem, { CarrerItemProps, Achievement } from "./CarrerItem";
import SkillItem, { SkillItemProps } from "./SkillItem";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AchievementWithMeta extends Achievement {
  company: string;
  job_title: string;
}

const AboutCV = () => {
  const t = useTranslations("about");
  const [careersData, setCareersData] = useState<CarrerItemProps[]>([]);
  const [skillsData,  setSkillsData]  = useState<SkillItemProps[]>([]);
  const careersRef     = useRef<HTMLDivElement>(null);
  const skillsRef      = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCareers = async () => {
      try {
        const snap = await getDocs(collection(db, "careers"));
        const data: CarrerItemProps[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as CarrerItemProps));
        setCareersData(data);
      } catch (error) {
        console.log(error);
      }
    };
    const getSkills = async () => {
      try {
        const snap = await getDocs(collection(db, "skills"));
        const data: SkillItemProps[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as SkillItemProps));
        setSkillsData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCareers();
    getSkills();
  }, []);

  useEffect(() => {
    if (careersData.length > 0 && careersRef.current) {
      gsap.fromTo(
        careersRef.current.querySelectorAll(".career-entry"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: careersRef.current, start: "top 80%" } }
      );
    }
    if (skillsData.length > 0 && skillsRef.current) {
      gsap.fromTo(
        skillsRef.current.querySelectorAll(".skill-entry"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power2.out",
          scrollTrigger: { trigger: skillsRef.current, start: "top 85%" } }
      );
    }
  }, [careersData, skillsData]);

  useEffect(() => {
    if (allAchievements.length > 0 && achievementsRef.current) {
      gsap.fromTo(
        achievementsRef.current.querySelectorAll(".ach-entry"),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: achievementsRef.current, start: "top 80%" } }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careersData]);

  // Collect all achievements from all careers
  const allAchievements: AchievementWithMeta[] = careersData
    .flatMap((c) =>
      (c.achievements ?? []).map((a) => ({
        ...a,
        company: c.company,
        job_title: c.job_title,
      }))
    )
    .sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className="space-y-16 mt-12">
      {/* Careers */}
      {careersData.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-accent" />
            {t("careers")}
          </h2>
          <div ref={careersRef} className="relative border-l border-border ml-1.5">
            {careersData
              .sort((a, b) => b.company_order - a.company_order)
              .map((career) => (
                <div key={career.id} className="career-entry">
                  <CarrerItem {...career} />
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Achievements timeline */}
      {allAchievements.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-accent" />
            Achievements
          </h2>
          <div ref={achievementsRef} className="relative border-l-2 border-border ml-3 space-y-0">
            {allAchievements.map((ach, idx) => (
              <div key={idx} className="ach-entry relative pl-8 pb-8 group" style={{ opacity: 0 }}>
                {/* Year dot */}
                <div className="absolute -left-3.5 top-0 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-bg-card border-2 border-accent flex items-center justify-center">
                    <span className="text-[9px] font-bold text-accent leading-none">{ach.year}</span>
                  </div>
                </div>

                <div className="bg-bg-card border border-border rounded-lg p-4 hover:border-accent/40 transition-colors group-hover:border-accent/40">
                  <p className="text-text-primary font-semibold text-sm mb-0.5">{ach.title}</p>
                  {ach.description && (
                    <p className="text-text-secondary text-xs leading-relaxed mb-2">{ach.description}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-accent/70">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                    {ach.job_title} · {ach.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsData.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-accent-secondary" />
            {t("skills")}
          </h2>
          <div ref={skillsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsData
              .sort((a, b) => a.skill_order - b.skill_order)
              .map((skill) => (
                <div key={skill.id} className="skill-entry">
                  <SkillItem {...skill} />
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutCV;
