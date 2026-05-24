import { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");

  const startDate = new Date(start_date).toLocaleString("en-us", {
    month: "short",
    year: "numeric",
  });
  const endDate = is_active
    ? t("present")
    : new Date(end_date ?? new Date()).toLocaleString("en-us", {
        month: "short",
        year: "numeric",
      });

  return (
    <div className="relative pl-6 pb-8">
      {/* Timeline dot */}
      <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-accent bg-bg" />
      {/* Timeline line drawn via parent */}

      <div className="bg-bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors duration-300 group">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="text-text-primary font-semibold text-base group-hover:text-accent transition-colors">
              {job_title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Link
                href={company_url}
                rel="noopener noreferrer"
                target="_blank"
                className="text-accent text-sm hover:underline"
              >
                {company}
              </Link>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-secondary text-sm">{job_location}</span>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-muted text-xs italic">{job_tipe}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {is_active && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active
              </span>
            )}
            <span className="text-text-muted text-xs whitespace-nowrap">
              {startDate} — {endDate}
            </span>
          </div>
        </div>

        {company_address && (
          <p className="text-text-muted text-xs mb-3">{company_address}</p>
        )}

        {dev_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dev_stack.map((stack, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs rounded-md border border-accent/30 bg-accent/10 text-accent"
              >
                {stack}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrerItem;
