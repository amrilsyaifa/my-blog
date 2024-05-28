"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import CarrerItem, { CarrerItemProps } from "./CarrerItem";
import SkillItem, { SkillItemProps } from "./SkillItem";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AboutShimmer from "./AboutShimmer";
import { useDisclosure } from "@components/hooks/useDisclosure";

const AboutCV = () => {
  const t = useTranslations("about");
  const [isLoadingCarrer, handleCareer] = useDisclosure(true);
  const [isLoadingSkill, handleSkill] = useDisclosure(true);

  const [careersData, setCareersData] = useState<CarrerItemProps[]>([]);
  const [skillsData, setSkillsData] = useState<SkillItemProps[]>([]);

  const getCareers = async () => {
    try {
      handleCareer.open();
      const querySnapshot = await getDocs(collection(db, "careers"));
      querySnapshot.forEach((doc) => {
        setCareersData((prev) => [...prev, doc.data() as CarrerItemProps]);
      });
      handleCareer.close();
    } catch (error) {
      handleCareer.close();
      console.log(error);
    }
  };

  const getSkills = async () => {
    try {
      handleSkill.open();
      const querySnapshot = await getDocs(collection(db, "skills"));
      querySnapshot.forEach((doc) => {
        setSkillsData((prev) => [...prev, doc.data() as SkillItemProps]);
      });
      handleSkill.close();
    } catch (error) {
      handleSkill.close();
      console.log(error);
    }
  };

  useEffect(() => {
    getCareers();
    getSkills();
  }, []);

  return (
    <>
      {isLoadingCarrer && <AboutShimmer />}
      {!isLoadingCarrer && (
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
        </>
      )}

      {isLoadingSkill && <AboutShimmer />}
      {!isLoadingSkill && (
        <>
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
      )}
    </>
  );
};

export default AboutCV;
