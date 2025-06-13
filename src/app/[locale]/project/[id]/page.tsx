import { db } from "@components/configs/firebase";
import ProjectDetailView from "@components/views/project-detail/ProjectDetailView";
import { doc, getDoc } from "firebase/firestore";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string; locale: "en" | "id" };
};

export interface LinkProps {
  title: string;
  url: string;
}

export interface ImageProps {
  description: string;
  url: string;
}

export interface ProjectDetailProps {
  title: string;
  meta_desc: string;
  description?: string[];
  links?: LinkProps[];
  images?: ImageProps[];
  dev_stack?: string[];
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // / read route params
  const { id, locale } = params;

  // fetch data from firestore
  const docRef = doc(db, "project_detail", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as ProjectDetailProps;
    return {
      title: `ASY | ${data.title}`,
      description: data.meta_desc ?? "Amril Syaifa Yasin",
    };
  }

  redirect(`/${locale}/404`);
}

export default function ProjectDetail() {
  return (
    <main className="flex min-h-[calc(100vh-5.5em)] flex-col items-start p-4 md:p-24 pt-20 bg-gray-100 dark:bg-slate-900">
      <div className="max-w-screen-xl md:max-w-screen-md mx-auto w-full">
        <ProjectDetailView />
      </div>
    </main>
  );
}
