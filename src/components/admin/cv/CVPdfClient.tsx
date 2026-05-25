"use client";

// All react-pdf imports live here — this whole file is loaded via dynamic({ ssr: false })
// so react-pdf never executes on the server.
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import CVDocumentATS    from "./CVDocumentATS";
import CVDocumentVisual from "./CVDocumentVisual";
import type { CVData } from "./types";

type Template = "ats" | "visual";

interface Props {
  data:      CVData;
  template:  Template;
  fileATS:   string;
  fileVisual: string;
}

export default function CVPdfClient({ data, template, fileATS, fileVisual }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Download buttons row */}
      <div className="flex items-center gap-2 px-4 py-2 shrink-0 border-b border-[#2d3748] bg-[#0f1117]">
        <span className="text-xs text-slate-500 mr-1">Download:</span>
        <PDFDownloadLink
          document={<CVDocumentATS data={data} />}
          fileName={fileATS}
          className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
        >
          {({ loading }) => loading ? "Preparing…" : "ATS (text-only)"}
        </PDFDownloadLink>
        <PDFDownloadLink
          document={<CVDocumentVisual data={data} />}
          fileName={fileVisual}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
        >
          {({ loading }) => loading ? "Preparing…" : "Visual (with photo)"}
        </PDFDownloadLink>
      </div>

      {/* Live preview */}
      <div className="flex-1 overflow-hidden">
        <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: "none" }}>
          {template === "ats"
            ? <CVDocumentATS    data={data} />
            : <CVDocumentVisual data={data} />
          }
        </PDFViewer>
      </div>
    </div>
  );
}
