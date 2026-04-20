"use client";

import { useCallback, useState } from "react";

type Tab = "upload" | "paste";

const ACCEPT =
  ".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

interface CVUploadProps {
  cvText: string;
  onCvTextChange: (value: string) => void;
  onExtractSuccess?: (info: { filename: string; chars: number }) => void;
  onExtractError?: (message: string) => void;
}

export function CVUpload({
  cvText,
  onCvTextChange,
  onExtractSuccess,
  onExtractError,
}: CVUploadProps) {
  const [tab, setTab] = useState<Tab>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const extractFile = useCallback(
    async (file: File) => {
      setExtracting(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/extract-cv", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) {
          onExtractError?.(data.error ?? "Could not read this file.");
          return;
        }
        const text = typeof data.text === "string" ? data.text : "";
        onCvTextChange(text);
        onExtractSuccess?.({
          filename: data.filename ?? file.name,
          chars: text.length,
        });
      } catch {
        onExtractError?.("Network error while uploading. Please try again.");
      } finally {
        setExtracting(false);
      }
    },
    [onCvTextChange, onExtractError, onExtractSuccess]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files?.[0];
      if (f) void extractFile(f);
    },
    [extractFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) void extractFile(f);
      e.target.value = "";
    },
    [extractFile]
  );

  return (
    <div className="rounded-xl border border-[#222222] bg-[#111111] p-4 shadow-lg">
      <div className="mb-4 flex gap-2 rounded-lg bg-[#0A0A0A] p-1">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            tab === "upload"
              ? "bg-[#00E5CC] text-[#0A0A0A]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Upload CV
        </button>
        <button
          type="button"
          onClick={() => setTab("paste")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
            tab === "paste"
              ? "bg-[#00E5CC] text-[#0A0A0A]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Paste CV
        </button>
      </div>

      {tab === "upload" ? (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 text-center transition ${
            dragActive
              ? "border-[#00E5CC] bg-[#00E5CC]/5"
              : "border-zinc-700 hover:border-[#00E5CC]/60"
          }`}
        >
          <input
            type="file"
            accept={ACCEPT}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={onInputChange}
            disabled={extracting}
            aria-label="Upload CV file"
          />
          {extracting ? (
            <div className="flex flex-col items-center gap-3">
              <span className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-[#00E5CC] border-t-transparent" />
              <p className="text-sm text-zinc-400">Extracting text…</p>
            </div>
          ) : (
            <>
              <p className="text-base font-medium text-zinc-100">
                Drag & drop your CV here
              </p>
              <p className="mt-2 max-w-xs text-sm text-zinc-500">
                PDF, DOCX, DOC, or TXT — max practical size depends on your
                connection.
              </p>
            </>
          )}
        </div>
      ) : (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-400">
            Paste your full CV
          </span>
          <textarea
            value={cvText}
            onChange={(e) => onCvTextChange(e.target.value)}
            placeholder="Paste your CV text here…"
            rows={14}
            className="w-full resize-y rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#00E5CC] focus:outline-none focus:ring-1 focus:ring-[#00E5CC]"
          />
        </label>
      )}
    </div>
  );
}
