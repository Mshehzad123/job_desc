"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CVUpload } from "@/components/CVUpload";
import { ExtraProjectsPanel } from "@/components/ExtraProjectsPanel";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { CVOutput } from "@/components/CVOutput";
import { MatchInsights } from "@/components/MatchInsights";
import { TemplateSelector } from "@/components/TemplateSelector";
import { DownloadButtons } from "@/components/DownloadButtons";
import { applySkillGapToCv } from "@/lib/applySkillGap";
import { DEFAULT_TEMPLATE } from "@/lib/cvTemplates";
import type { CVTemplateId, ExtraProjectInput, TailoredCV } from "@/lib/types/cv";

export default function Home() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [extraProjects, setExtraProjects] = useState<ExtraProjectInput[]>([]);
  const [result, setResult] = useState<TailoredCV | null>(null);
  const [template, setTemplate] = useState<CVTemplateId>(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractNotice, setExtractNotice] = useState<string | null>(null);
  const prevLoading = useRef(false);

  const handleAddSkillFromGap = useCallback((gapRaw: string) => {
    setResult((prev) => (prev ? applySkillGapToCv(prev, gapRaw) : null));
  }, []);

  useEffect(() => {
    if (prevLoading.current && !loading && result) {
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 90,
          spread: 65,
          origin: { y: 0.55 },
          colors: ["#00E5CC", "#ffffff", "#22d3ee"],
        });
      });
    }
    prevLoading.current = loading;
  }, [loading, result]);

  const handleTailor = useCallback(async () => {
    setError(null);
    setExtractNotice(null);
    if (!cvText.trim()) {
      setError("Add your CV by uploading a file or pasting the text.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Paste the job description you want to target.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const payload = {
        cvText,
        jobDescription,
        extraProjects: extraProjects.map(
          ({ name, description, techStack, date }) => ({
            name,
            description,
            techStack,
            date,
          })
        ),
      };

      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (!data.tailoredCV) {
        setError("Unexpected response from the server.");
        return;
      }
      setResult(data.tailoredCV as TailoredCV);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [cvText, jobDescription, extraProjects]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      <header className="border-b border-[#222222] bg-[#0A0A0A]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              CV Tailor AI
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-500">
              Upload or paste your CV, add optional projects, paste a job
              description, and get a tailored, ATS-aware version you can export.
            </p>
          </div>
          <p className="text-xs text-zinc-600">
            Powered by Qwen · runs in your browser + secure API routes
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <section className="relative z-[1] flex w-full flex-col lg:w-[40%] lg:max-w-none">
            <CVUpload
              cvText={cvText}
              onCvTextChange={(t) => {
                setCvText(t);
                setExtractNotice(null);
              }}
              onExtractSuccess={({ filename, chars }) => {
                setExtractNotice(
                  `Extracted “${filename}” (${chars.toLocaleString()} characters).`
                );
                setError(null);
              }}
              onExtractError={(msg) => {
                setExtractNotice(null);
                setError(msg);
              }}
            />

            {extractNotice ?
              <div
                className="mt-3 rounded-lg border border-[#00E5CC]/25 bg-[#00E5CC]/10 px-3 py-2 text-sm text-[#00E5CC]"
                role="status"
              >
                {extractNotice}
              </div>
            : null}

            <ExtraProjectsPanel
              projects={extraProjects}
              onChange={setExtraProjects}
            />
          </section>

          <section className="flex w-full flex-1 flex-col gap-4 lg:w-[60%]">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />

            <button
              type="button"
              onClick={() => void handleTailor()}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#00E5CC] px-6 py-4 text-base font-semibold text-[#0A0A0A] shadow-lg shadow-[#00E5CC]/10 transition hover:bg-[#33ecd9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5CC] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start"
            >
              {loading ?
                <>
                  <span className="mr-3 inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
                  Tailoring your CV…
                </>
              : "Tailor my CV"}
            </button>

            {error ?
              <div
                className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                {error}
              </div>
            : null}

            <div className="relative z-0 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Tailored output
              </h2>

              {result && !loading ?
                <>
                  <MatchInsights
                    matchScore={result.matchScore ?? 0}
                    skillGaps={result.skillGaps ?? []}
                    onAddSkillFromGap={handleAddSkillFromGap}
                  />
                  <div className="rounded-xl border border-[#222222] bg-[#111111] p-5">
                    <TemplateSelector selected={template} onSelect={setTemplate} />
                  </div>
                </>
              : null}

              <div
                style={{
                  overflowX: "auto",
                  overflowY: "visible",
                  width: "100%",
                }}
              >
                <CVOutput data={result} template={template} loading={loading} />
              </div>
              <DownloadButtons tailored={result} disabled={loading} template={template} />
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#222222] py-8 text-center text-xs text-zinc-600">
        CV Tailor AI — client-side UX with Next.js API routes. Set{" "}
        <code className="rounded bg-zinc-900 px-1 py-0.5 text-zinc-400">
          QWEN_API_KEY
        </code>{" "}
        in{" "}
        <code className="rounded bg-zinc-900 px-1 py-0.5 text-zinc-400">
          .env.local
        </code>
        .
      </footer>
    </div>
  );
}
