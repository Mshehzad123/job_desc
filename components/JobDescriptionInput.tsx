"use client";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({
  value,
  onChange,
}: JobDescriptionInputProps) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;

  return (
    <div className="rounded-xl border border-[#222222] bg-[#111111] p-4 shadow-lg">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="jd-input"
          className="text-sm font-medium text-zinc-300"
        >
          Job description
        </label>
        <span className="text-xs tabular-nums text-zinc-500">
          {chars.toLocaleString()} characters · {words.toLocaleString()} words
        </span>
      </div>
      <textarea
        id="jd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description you are targeting…"
        rows={12}
        className="w-full resize-y rounded-lg border border-zinc-800 bg-[#0A0A0A] px-3 py-2 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:border-[#00E5CC] focus:outline-none focus:ring-1 focus:ring-[#00E5CC]"
      />
    </div>
  );
}
