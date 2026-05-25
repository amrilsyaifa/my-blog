import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { redirect } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;

  const docSnap = await getDoc(doc(db, "project_detail", id));

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      title: `ASY | ${data.title}`,
      description: data.meta_desc ?? "Amril Syaifa Yasin",
    };
  }

  redirect(`/${locale}/404`);
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
