"use client";

import { useState } from "react";
import Tab from "@components/components/Tab";
import PersonalProject from "./PersonalProject";
import CompanyProject from "./CompanyProject";
import { useTranslations } from "next-intl";

const ProjectView = () => {
  const t = useTranslations("project");
  const [tab, setTab] = useState("self");
  const tabs = [
    { label: t("personal"), value: "self" },
    { label: t("company"), value: "company" },
  ];

  return (
    <>
      <div className="mb-4">
        <Tab data={tabs} value={tab} onSelect={setTab} />
      </div>
      {tab === "self" && <PersonalProject />}
      {tab === "company" && <CompanyProject />}
    </>
  );
};

export default ProjectView;
