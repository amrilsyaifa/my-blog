"use client";

import { useEffect, useState } from "react";
import ProjectItem, { ProjectItemProps } from "./ProjectItem";
import { useDisclosure } from "@components/hooks/useDisclosure";
import EmptyData from "@components/components/EmptyData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import ProjectShimmer from "./ProjectShimmer";

const ProjectView = () => {
  const [isLoading, handle] = useDisclosure(true);
  const [projects, setProjects] = useState<ProjectItemProps[]>([]);

  const getProjects = async () => {
    try {
      handle.open();
      const querySnapshot = await getDocs(collection(db, "projects"));
      querySnapshot.forEach((doc) => {
        setProjects((prev) => [...prev, doc.data() as ProjectItemProps]);
      });
      handle.close();
    } catch (error) {
      handle.close();
      console.log(error);
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  if (isLoading) {
    return <ProjectShimmer />;
  }

  const hasEmptyData = !isLoading && projects.length === 0;

  return (
    <>
      {hasEmptyData && (
        <div className="w-full flex items-center justify-center md:h-[calc(100vh-30em)] h-[calc(100vh-20em)]">
          <EmptyData />
        </div>
      )}
      {!hasEmptyData && (
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-6 gap-4">
          {projects
            .sort((a, b) => b.order - a.order)
            .map((project, idx) => (
              <ProjectItem {...project} key={idx} />
            ))}
        </div>
      )}
    </>
  );
};

export default ProjectView;
