import React from "react";
import { useTranslations } from "next-intl";

const EmptyData = () => {
  const t = useTranslations("common");
  return (
    <div>
      <h1 className="text-lg md:text-xl font-bold text-center">
        {t("empty_data")}
      </h1>
    </div>
  );
};

export default EmptyData;
