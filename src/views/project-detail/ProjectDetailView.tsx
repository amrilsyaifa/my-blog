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
import { EmblaOptionsType } from "embla-carousel";
import { useTranslations } from "next-intl";

const OPTIONS: EmblaOptionsType = {};

const ProjectDetailView = () => {
  const t = useTranslations("project_detail");
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
      {data?.images && (
        <>
          <h2 className="text-lg md:text-xl dark:text-[#ec7a56] text-gray-800 mt-8 mb-2">
            {t("overview")}
          </h2>
          <Carousel slides={data.images} options={OPTIONS} />
        </>
      )}
      {data?.description && (
        <>
          <h2 className="text-lg md:text-xl dark:text-[#ec7a56] text-gray-800 mt-8">
            {t("description")}
          </h2>
          <div className="ml-4">
            {data.description.map((val, idx) => (
              <p key={idx} className="mb-2 dark:text-gray-400 text-gray-800">
                {val}
              </p>
            ))}
          </div>
        </>
      )}
      {data?.links && (
        <>
          <h2 className="text-lg md:text-xl dark:text-[#ec7a56] text-gray-800 mt-8">
            {data?.links.length > 1 ? t("links") : t("link")}
          </h2>
          <div className="ml-4 mt-2">
            {data.links.map((val, idx) => (
              <div key={idx} className="flex flex-row items-start gap-4">
                <p className="capitalize min-w-[70px]">{val.title}:</p>
                <Link href={val.url}>
                  <p className="dark:text-[#ec7a56] text-gray-800">{val.url}</p>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      {data?.dev_stack && data?.dev_stack.length > 0 && (
        <div className="flex flex-row items-center text-gray-400 text-md gap-2 flex-wrap mt-8">
          <span className="font-bold dark:text-gray-400 text-gray-800">[ </span>
          {data.dev_stack?.map((stack, idx) => {
            return (
              <div key={stack} className="flex flex-row items-center">
                <span className="text-gray-800 dark:text-[#ec7a56]">
                  {stack}
                </span>
                {idx !== (data?.dev_stack?.length ?? 0) - 1 && (
                  <div className="ml-2 w-1.5 h-1.5 rounded-full dark:bg-[#ec7a56] bg-gray-600" />
                )}
              </div>
            );
          })}
          <span className="font-bold dark:text-gray-400 text-gray-800"> ]</span>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailView;
