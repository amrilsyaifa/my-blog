"use client";

import { useTranslations } from "next-intl";

interface Props {
  onDismiss: () => void;
}

export default function ChatCoachmark({ onDismiss }: Props) {
  const t = useTranslations("chat");

  return (
    <div className="relative animate-in slide-in-from-bottom-3 fade-in duration-300">
      {/* Callout box */}
      <div className="bg-indigo-600 text-white rounded-2xl px-4 py-3.5 shadow-xl shadow-indigo-900/30 max-w-[220px] sm:max-w-[240px]">
        <p className="font-semibold text-sm mb-1 leading-snug">{t("coachmark_title")}</p>
        <p className="text-xs text-indigo-200 leading-relaxed">{t("coachmark_desc")}</p>
        <button
          onClick={onDismiss}
          className="mt-2.5 text-[11px] font-semibold text-white/70 hover:text-white transition-colors underline underline-offset-2"
        >
          {t("coachmark_cta")}
        </button>

        {/* Pulse ring — decorative */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-200" />
        </span>
      </div>

      {/* Arrow pointing down toward the button */}
      <div className="absolute -bottom-[7px] right-6 w-3.5 h-3.5 bg-indigo-600 rotate-45 rounded-sm" />
    </div>
  );
}
