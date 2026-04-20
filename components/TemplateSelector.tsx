"use client";

import { CV_TEMPLATE_OPTIONS } from "@/lib/cvTemplates";
import type { CVTemplateId } from "@/lib/types/cv";

export interface TemplateSelectorProps {
  selected: CVTemplateId;
  onSelect: (id: CVTemplateId) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Choose a template
      </p>
      <p className="mb-4 text-[11px] leading-relaxed text-zinc-600">
        Ten layouts optimized for senior engineers — two-column executives, minimal singles, dark mode, and formal corporate styles.
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {CV_TEMPLATE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <div
              key={opt.id}
              className={`flex cursor-pointer flex-col rounded-lg border p-3.5 transition hover:border-[#00E5CC]/40 ${
                isSelected ? "border-2 border-[#00E5CC] bg-[#0a1a19]" : "border border-[#222222] bg-[#111111]"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(opt.id);
                }
              }}
            >
              <p className="text-[13px] font-bold text-white">{opt.name}</p>
              <p className="mt-1 text-[10px] font-medium text-[#00E5CC]">{opt.blurb}</p>
              <p className="mt-2 line-clamp-2 flex-1 text-[11px] leading-snug text-[#666666]">{opt.preview}</p>
              <div
                className="mt-3 h-1 w-full rounded-sm"
                style={{ background: opt.accentBar }}
                aria-hidden
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
