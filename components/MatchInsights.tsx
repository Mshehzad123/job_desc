"use client";

function IconPlus() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-amber-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function MatchInsights({
  matchScore,
  skillGaps,
  onAddSkillFromGap,
}: {
  matchScore: number;
  skillGaps: string[];
  onAddSkillFromGap?: (gapRaw: string) => void;
}) {
  return (
    <div className="relative z-0 space-y-5 rounded-xl border border-[#222222] bg-[#111111] p-5 print:hidden">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          JD Match Score
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums leading-none text-[#00E5CC]">
          {matchScore}%
        </p>
        <div
          className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuenow={matchScore}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[#00E5CC] transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
          />
        </div>
      </div>

      {skillGaps.length > 0 ?
        <div>
          <p className="mb-3 text-sm font-semibold text-zinc-200">
            Skills to Add for Better Match
          </p>
          <p className="mb-3 text-xs leading-relaxed text-zinc-500">
            The job asks for these skills that could not be inferred from your
            background. Tap{" "}
            <span className="font-medium text-zinc-400">Add to CV</span> to copy
            a skill into your tailored CV (technical list). Or add them
            manually to your real CV when true.
          </p>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((s) => (
              <div
                key={s}
                className="relative z-0 flex flex-wrap items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-950/50 pl-2 pr-1 py-1 text-xs font-medium text-amber-100"
              >
                <IconPlus />
                <span className="max-w-[200px] text-left sm:max-w-xs">{s}</span>
                {onAddSkillFromGap ?
                  <button
                    type="button"
                    onClick={() => onAddSkillFromGap(s)}
                    className="shrink-0 rounded-full bg-amber-500/25 px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition hover:bg-amber-500/40"
                  >
                    Add to CV
                  </button>
                : null}
              </div>
            ))}
          </div>
        </div>
      : null}
    </div>
  );
}
