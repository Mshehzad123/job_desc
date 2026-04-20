"use client";

import { useCallback, useState } from "react";
import { toCvDocument } from "@/lib/cvDocument";
import type { CVTemplateId, TailoredCV } from "@/lib/types/cv";
import {
  downloadCvDocx,
  downloadCvPdfFromElement,
} from "@/lib/cvRenderer";

interface DownloadButtonsProps {
  tailored: TailoredCV | null;
  disabled?: boolean;
  template: CVTemplateId;
}

export function DownloadButtons({ tailored, disabled, template }: DownloadButtonsProps) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [docxBusy, setDocxBusy] = useState(false);

  const onPdf = useCallback(async () => {
    const el = document.getElementById("cv-tailor-print");
    if (!el) return;
    setPdfBusy(true);
    try {
      await downloadCvPdfFromElement(el as HTMLElement, "tailored-cv.pdf", {
        backgroundColor: template === "carbon" ? "#0f0f0f" : "#ffffff",
      });
    } catch {
      alert(
        "Could not create the PDF. If this keeps happening, try downloading DOCX instead."
      );
    } finally {
      setPdfBusy(false);
    }
  }, [template]);

  const onDocx = useCallback(async () => {
    if (!tailored) return;
    setDocxBusy(true);
    try {
      await downloadCvDocx(toCvDocument(tailored));
    } catch {
      alert("Could not create the Word document. Please try again.");
    } finally {
      setDocxBusy(false);
    }
  }, [tailored]);

  const canDownload = Boolean(tailored) && !disabled;

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <button
        type="button"
        disabled={!canDownload || pdfBusy}
        onClick={() => void onPdf()}
        className="inline-flex items-center justify-center rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pdfBusy ?
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Preparing PDF…
          </>
        : "Download PDF"}
      </button>
      <button
        type="button"
        disabled={!canDownload || docxBusy}
        onClick={() => void onDocx()}
        className="inline-flex items-center justify-center rounded-lg border border-[#00E5CC]/40 bg-[#00E5CC]/10 px-4 py-2.5 text-sm font-semibold text-[#00E5CC] transition hover:bg-[#00E5CC]/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {docxBusy ?
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#00E5CC] border-t-transparent" />
            Preparing DOCX…
          </>
        : "Download DOCX"}
      </button>
    </div>
  );
}
