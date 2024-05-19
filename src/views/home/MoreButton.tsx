"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";

interface MoreButtonProps {
  title: string;
}

const MoreButton: FC<MoreButtonProps> = ({ title }) => {
  const { locale } = useParams();

  return (
    <div className="mt-4">
      <Link
        href={`/${locale}/about`}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {title}
      </Link>
    </div>
  );
};

export default MoreButton;
