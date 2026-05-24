"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import CarrerItem, { CarrerItemProps } from "./CarrerItem";
import SkillItem, { SkillItemProps } from "./SkillItem";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutCV = () => {
  const t = useTranslations("about");
  const [careersData, setCareersData] = useState<CarrerItemProps[]>([]);
  const [skillsData, setSkillsData] = useState<SkillItemProps[]>([]);
  const careersRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCareers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "careers"));
        querySnapshot.forEach((doc) => {
          setCareersData((prev) => [...prev, doc.data() as CarrerItemProps]);
        });
      } catch (error) {
        console.log(error);
      }
    };
    const getSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "skills"));
        querySnapshot.forEach((doc) => {
          setSkillsData((prev) => [...prev, doc.data() as SkillItemProps]);
        });
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
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: careersRef.current,
            start: "top 80%",
          },
        }
      );
    }
    if (skillsData.length > 0 && skillsRef.current) {
      gsap.fromTo(
        skillsRef.current.querySelectorAll(".skill-entry"),
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, [careersData, skillsData]);

  return (
    <div className="space-y-12 mt-12">
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

      {/* Skills */}
      {skillsData.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-accent-secondary" />
            {t("skills")}
          </h2>
          <div
            ref={skillsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
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
