"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import CarrerItem, { CarrerItemProps } from "./CarrerItem";
import SkillItem, { SkillItemProps } from "./SkillItem";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";

const AboutCV = () => {
  const t = useTranslations("about");

  const [careersData, setCareersData] = useState<CarrerItemProps[]>([]);
  const [skillsData, setSkillsData] = useState<SkillItemProps[]>([]);

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

  useEffect(() => {
    getCareers();
    getSkills();
  }, []);

  return (
    <>
      {careersData.length > 0 && (
        <div className="retro-section">
          <h3 style={{ color: "#0000FF", marginBottom: "16px" }}>
            💼 {t("careers")}
          </h3>
          <div className="retro-timeline">
            {careersData
              .sort((a, b) => b.company_order - a.company_order)
              .map((career) => (
                <div key={career.id} className="retro-timeline-item">
                  <CarrerItem {...career} />
                </div>
              ))}
          </div>
        </div>
      )}

      {skillsData.length > 0 && (
        <div className="retro-section">
          <h3 style={{ color: "#0000FF", marginBottom: "16px" }}>
            ⚡ {t("skills")}
          </h3>
          <div className="retro-skills-grid">
            {skillsData
              .sort((a, b) => a.skill_order - b.skill_order)
              .map((skill) => (
                <div key={skill.id} className="retro-skill-item">
                  <SkillItem {...skill} />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AboutCV;
