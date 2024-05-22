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
        <>
          <h3 className="mt-8 text-xl md:text-2xl dark:text-[#ec7a56] text-gray-800">
            {t("careers")}
          </h3>
          <div className="ml-4">
            <ul className="mt-2">
              {careersData
                .sort((a, b) => b.company_order - a.company_order)
                .map((career) => (
                  <li className="mb-3" key={career.id}>
                    <CarrerItem {...career} />
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}

      {skillsData.length > 0 && (
        <>
          <h3 className="mt-8 text-xl md:text-2xl dark:text-[#ec7a56] text-gray-800">
            {t("skills")}
          </h3>
          <div className="ml-4">
            <ul className="mt-2">
              {skillsData
                .sort((a, b) => a.skill_order - b.skill_order)
                .map((skill) => (
                  <li className="mb-3" key={skill.id}>
                    <SkillItem {...skill} />
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default AboutCV;
