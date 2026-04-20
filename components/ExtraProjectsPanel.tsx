"use client";

import type { ExtraProjectInput } from "@/lib/types/cv";

interface ExtraProjectsPanelProps {
  projects: ExtraProjectInput[];
  onChange: (projects: ExtraProjectInput[]) => void;
}

export function ExtraProjectsPanel({
  projects,
  onChange,
}: ExtraProjectsPanelProps) {
  const update = (id: string, patch: Partial<ExtraProjectInput>) => {
    onChange(
      projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  const remove = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const add = () => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID ?
        crypto.randomUUID()
      : `proj-${Date.now()}`;
    onChange([
      ...projects,
      {
        id,
        name: "",
        description: "",
        techStack: "",
        date: "",
      },
    ]);
  };

  return (
    <div className="mt-4 rounded-xl border border-[#222222] bg-[#111111] p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-200">
          Extra projects / skills
        </h2>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-[#00E5CC]/15 px-3 py-1.5 text-xs font-semibold text-[#00E5CC] hover:bg-[#00E5CC]/25"
        >
          Add item
        </button>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-zinc-500">
        Add achievements or stack details that are not yet in your CV. The AI
        will weave them in where they fit best.
      </p>

      <div className="flex flex-col gap-4">
        {projects.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-800 px-3 py-6 text-center text-sm text-zinc-600">
            No extra items yet. Optional — skip if everything is already in your
            CV.
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-zinc-800 bg-[#0A0A0A] p-3"
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs text-zinc-500">
                  Title / name
                </span>
                <input
                  value={p.name}
                  onChange={(e) => update(p.id, { name: e.target.value })}
                  className="w-full rounded-md border border-zinc-800 bg-[#111111] px-2 py-1.5 text-sm text-zinc-100 focus:border-[#00E5CC] focus:outline-none focus:ring-1 focus:ring-[#00E5CC]"
                  placeholder="e.g. Internal design system"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs text-zinc-500">
                  Description
                </span>
                <textarea
                  rows={3}
                  value={p.description}
                  onChange={(e) =>
                    update(p.id, { description: e.target.value })
                  }
                  className="w-full resize-y rounded-md border border-zinc-800 bg-[#111111] px-2 py-1.5 text-sm text-zinc-100 focus:border-[#00E5CC] focus:outline-none focus:ring-1 focus:ring-[#00E5CC]"
                  placeholder="Impact, scope, outcomes…"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-zinc-500">
                  Tech stack
                </span>
                <input
                  value={p.techStack}
                  onChange={(e) =>
                    update(p.id, { techStack: e.target.value })
                  }
                  className="w-full rounded-md border border-zinc-800 bg-[#111111] px-2 py-1.5 text-sm text-zinc-100 focus:border-[#00E5CC] focus:outline-none focus:ring-1 focus:ring-[#00E5CC]"
                  placeholder="React, Node, AWS…"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-zinc-500">
                  Date / timeframe
                </span>
                <input
                  value={p.date}
                  onChange={(e) => update(p.id, { date: e.target.value })}
                  className="w-full rounded-md border border-zinc-800 bg-[#111111] px-2 py-1.5 text-sm text-zinc-100 focus:border-[#00E5CC] focus:outline-none focus:ring-1 focus:ring-[#00E5CC]"
                  placeholder="2024 — Present"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
