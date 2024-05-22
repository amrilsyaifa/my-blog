import { FC } from "react";
import { Sun } from "react-feather";
import Link from "next/link";

export interface CarrerItemProps {
  id: string;
  job_title: string;
  job_tipe: string;
  job_location: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  company_address: string;
  company_url: string;
  dev_stack: string[];
  company_order: number;
}

const CarrerItem: FC<CarrerItemProps> = ({
  job_title,
  job_tipe,
  company,
  job_location,
  company_address,
  is_active,
  start_date,
  end_date,
  dev_stack,
  company_url,
}) => {
  const startDate = new Date(start_date).toLocaleString("en-us", {
    month: "short",
    year: "numeric",
  });
  const endDate = is_active
    ? "Present"
    : new Date(end_date ?? new Date()).toLocaleString("en-us", {
        month: "short",
        year: "numeric",
      });
  return (
    <div className="flex flex-row gap-4 ">
      <div className="w-4 h-4">
        <Sun className="dark:text-[#ec7a56] text-gray-800 w-4 h-4 mt-1.5" />
      </div>
      <div className="flex flex-col items-start">
        <h3 className="font-bold text-lg dark:text-[#ec7a56] text-gray-800 ">
          {job_title}
          <span className="font-normal text-sm pl-2 dark:text-white text-gray-800">
            ({job_tipe})
          </span>
        </h3>
        <div className="flex flex-row items-center gap-2">
          <Link href={company_url} rel="noopener noreferrer" target="_blank">
            <p className="dark:text-gray-400 text-gray-800 text-md">
              {company}.
            </p>
          </Link>
          <div className="w-1.5 h-1.5 rounded-full dark:bg-[#ec7a56] bg-gray-600" />
          <p className="font-bold text-md dark:text-gray-400 text-gray-800">
            {job_location}
          </p>
        </div>
        <p className="text-md dark:text-gray-400 text-gray-800">
          {startDate} - {endDate}
        </p>
        <div className="flex flex-row items-center text-gray-400 text-md gap-2 flex-wrap">
          <span className="font-bold dark:text-gray-400 text-gray-800">[ </span>
          {dev_stack.map((stack, idx) => {
            return (
              <div key={stack} className="flex flex-row items-center">
                <span className="text-gray-800 dark:text-[#ec7a56]">
                  {stack}
                </span>
                {idx !== dev_stack.length - 1 && (
                  <div className="ml-2 w-1.5 h-1.5 rounded-full dark:bg-[#ec7a56] bg-gray-600" />
                )}
              </div>
            );
          })}
          <span className="font-bold dark:text-gray-400 text-gray-800"> ]</span>
        </div>
        <p className=" text-md dark:text-gray-400 text-gray-800">
          {company_address}
        </p>
      </div>
    </div>
  );
};

export default CarrerItem;
