"use client";

import { useEffect, useState } from "react";
import Carousel from "./Carousel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useParams } from "next/navigation";
import { ProjectDetailProps } from "@components/app/[locale]/project/[id]/page";
import { useDisclosure } from "@components/hooks/useDisclosure";
import ProjectDetailShimmer from "./ProjectDetailShimmer";
import Link from "next/link";

const ProjectDetailView = () => {
  const [isLoading, handle] = useDisclosure(true);

  const [data, setData] = useState({} as ProjectDetailProps);
  const { id } = useParams();

  const getProjectDetail = async () => {
    try {
      handle.open();
      const docRef = doc(db, "project_detail", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        handle.close();
        setData(docSnap.data() as ProjectDetailProps);
      } else {
        handle.close();
        alert("No such document!");
      }
    } catch (error) {
      handle.close();
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    // fetch data from firestore
    getProjectDetail();
  }, []);

  if (isLoading) {
    return <ProjectDetailShimmer />;
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl dark:text-[#ec7a56] text-gray-800 capitalize">
        {data.title}
      </h1>
      <h2 className="text-lg md:text-xl dark:text-[#ec7a56] text-gray-800 mt-8">
        Overview:
      </h2>
      <Carousel />
      <h2 className="text-lg md:text-xl dark:text-[#ec7a56] text-gray-800 mt-8">
        Description:
      </h2>
      <div className="ml-4">
        <p className="mb-2 dark:text-gray-400 text-gray-800">
          Exercitation nisi nisi ex reprehenderit dolor excepteur ea aute
          consectetur voluptate pariatur nulla. Adipisicing cillum aliquip ad
          esse anim ipsum ullamco ex quis laborum. Ullamco nisi tempor Lorem
          elit. Labore velit pariatur sit Lorem velit adipisicing Lorem dolor
          anim mollit.
        </p>
        <p className="mb-2 dark:text-gray-400 text-gray-800">
          Exercitation nisi nisi ex reprehenderit dolor excepteur ea aute
          consectetur voluptate pariatur nulla. Adipisicing cillum aliquip ad
          esse anim ipsum ullamco ex quis laborum. Ullamco nisi tempor Lorem
          elit. Labore velit pariatur sit Lorem velit adipisicing Lorem dolor
          anim mollit.
        </p>
      </div>
      <h2 className="text-lg md:text-xl dark:text-[#ec7a56] text-gray-800 mt-8">
        Link:
      </h2>
      <div className="ml-4 mt-2">
        <div className="flex flex-row items-center gap-4">
          <p>Github: </p>
          <Link href="/">
            <p className="dark:text-[#ec7a56] text-gray-800">
              https://github.com/amrilsyaifa/my-blog
            </p>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p>Github: </p>
          <Link href="/">
            <p className="dark:text-[#ec7a56] text-gray-800">
              https://github.com/amrilsyaifa/my-blog
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
