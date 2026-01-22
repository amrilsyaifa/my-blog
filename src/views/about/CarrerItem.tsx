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
    <div className="retro-career-card">
      <div className="retro-career-header">
        <span className="retro-career-icon">►</span>
        <h4 style={{ color: "#0000FF", margin: 0, fontSize: "16px" }}>
          {job_title}
        </h4>
        <span style={{ color: "#808080", fontSize: "12px", marginLeft: "8px" }}>
          ({job_tipe})
        </span>
      </div>
      
      <div className="retro-career-details">
        <div style={{ marginBottom: "4px" }}>
          <Link
            href={company_url}
            rel="noopener noreferrer"
            target="_blank"
            style={{ color: "#0000FF", textDecoration: "underline" }}
          >
            {company}
          </Link>
          <span style={{ color: "#000000", margin: "0 8px" }}>•</span>
          <span style={{ color: "#000000", fontWeight: "bold" }}>
            {job_location}
          </span>
        </div>
        
        <div style={{ color: "#808080", fontSize: "12px", marginBottom: "8px" }}>
          📅 {startDate} - {endDate}
          {is_active && (
            <span className="blink" style={{ marginLeft: "8px", color: "#FF0000" }}>
              ● ACTIVE
            </span>
          )}
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
          {dev_stack.map((stack, idx) => (
            <span key={idx} className="tech-badge" style={{ fontSize: "10px" }}>
              {stack}
            </span>
          ))}
        </div>
        
        <div style={{ color: "#808080", fontSize: "11px", marginTop: "8px" }}>
          📍 {company_address}
        </div>
      </div>
    </div>
  );
};

export default CarrerItem;
