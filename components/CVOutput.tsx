"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toCvDocument } from "@/lib/cvDocument";
import type { CVTemplateId, TailoredCV } from "@/lib/types/cv";
import { AtlasTemplate } from "@/components/templates/AtlasTemplate";
import { CarbonTemplate } from "@/components/templates/CarbonTemplate";
import { FrostTemplate } from "@/components/templates/FrostTemplate";
import { LegacyTemplate } from "@/components/templates/LegacyTemplate";
import { MeridianTemplate } from "@/components/templates/MeridianTemplate";
import { NoirTemplate } from "@/components/templates/NoirTemplate";
import { PrismTemplate } from "@/components/templates/PrismTemplate";
import { QuantumTemplate } from "@/components/templates/QuantumTemplate";
import { SlateTemplate } from "@/components/templates/SlateTemplate";
import { VertexTemplate } from "@/components/templates/VertexTemplate";

const LOADING_STEPS = [
  "Reading your CV…",
  "Analyzing job description…",
  "Tailoring content…",
  "Formatting CV…",
] as const;

export interface CVOutputProps {
  data: TailoredCV | null;
  template: CVTemplateId;
  loading?: boolean;
}

export function CVOutput({ data, template, loading }: CVOutputProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      return;
    }
    setStepIndex(0);
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [loading]);

  if (loading) {
    return (
      <div className="relative isolate overflow-hidden rounded-xl border border-[#222222] bg-[#111111] p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#00E5CC] border-t-transparent" />
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {LOADING_STEPS[stepIndex]}
            </p>
            <p className="text-xs text-zinc-500">
              Step {stepIndex + 1} of {LOADING_STEPS.length}
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-8 max-w-md rounded bg-zinc-800" />
          <div className="mx-auto h-4 max-w-lg rounded bg-zinc-800/70" />
          <div className="h-3 rounded bg-zinc-800/50" />
          <div className="h-3 rounded bg-zinc-800/50" />
          <div className="h-3 max-w-[90%] rounded bg-zinc-800/50" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="relative isolate overflow-hidden rounded-xl border border-dashed border-zinc-700 bg-[#111111]/80 p-10 text-center shadow-inner">
        <p className="text-sm text-zinc-500">
          Your tailored CV will appear here after you run the assistant.
        </p>
      </div>
    );
  }

  const doc = toCvDocument(data);
  const matchScore = data.matchScore;

  let templateNode: ReactNode;
  switch (template) {
    case "atlas":
      templateNode = <AtlasTemplate data={doc} />;
      break;
    case "meridian":
      templateNode = <MeridianTemplate data={doc} />;
      break;
    case "vertex":
      templateNode = <VertexTemplate data={doc} />;
      break;
    case "noir":
      templateNode = <NoirTemplate data={doc} />;
      break;
    case "frost":
      templateNode = <FrostTemplate data={doc} />;
      break;
    case "carbon":
      templateNode = <CarbonTemplate data={doc} />;
      break;
    case "slate":
      templateNode = <SlateTemplate data={doc} />;
      break;
    case "prism":
      templateNode = <PrismTemplate data={doc} />;
      break;
    case "quantum":
      templateNode = <QuantumTemplate data={doc} matchScore={matchScore} />;
      break;
    case "legacy":
      templateNode = <LegacyTemplate data={doc} />;
      break;
    default:
      templateNode = <LegacyTemplate data={doc} />;
  }

  return (
    <div className="relative isolate max-w-full overflow-x-hidden rounded-xl [overflow-y:visible]">
      {templateNode}
    </div>
  );
}
