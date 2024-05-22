import React from "react";
import { useTranslations } from "next-intl";

const EmptyData = () => {
  const t = useTranslations("common");
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{t("empty_data")}</h1>
    </div>
  );
};

export default EmptyData;
