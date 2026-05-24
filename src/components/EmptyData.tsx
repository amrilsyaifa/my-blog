import React from "react";
import { useTranslations } from "next-intl";

const EmptyData = () => {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted">
      <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center mb-4 text-2xl">
        ∅
      </div>
      <p className="text-sm">{t("empty_data")}</p>
    </div>
  );
};

export default EmptyData;
