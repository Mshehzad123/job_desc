import type { CvDocument } from "@/lib/types/cv";
import { safeHref } from "@/lib/cvDisplayUtils";
import { avoidBreak } from "@/components/templates/printCss";
import { IconLink, IconMail, IconMap, IconPhone } from "@/components/templates/icons";

const ACCENT = "#00E5CC";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center">
      <div className="mr-2 h-[14px] w-[3px] shrink-0" style={{ backgroundColor: ACCENT }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
        {children}
      </span>
      <div className="ml-2 h-px flex-1 bg-[#e5e5e5]" />
    </div>
  );
}

export function MeridianLayout({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? {
    technical: [],
    frameworks: [],
    tools: [],
    soft: [],
  };

  const body = "text-[#444]";
  const muted = "text-[#666]";
  const sub = "text-[#555]";

  const contactParts: React.ReactNode[] = [];
  if (pi.email)
    contactParts.push(
      <span key="mail" className="inline-flex items-center gap-1.5">
        <IconMail className="h-3 w-3 shrink-0 text-[#888]" />
        {pi.email}
      </span>
    );
  if (pi.phone)
    contactParts.push(
      <span key="ph" className="inline-flex items-center gap-1.5">
        <IconPhone className="h-3 w-3 shrink-0 text-[#888]" />
        {pi.phone}
      </span>
    );
  if (pi.location)
    contactParts.push(
      <span key="loc" className="inline-flex items-center gap-1.5">
        <IconMap className="h-3 w-3 shrink-0 text-[#888]" />
        {pi.location}
      </span>
    );
  if (pi.linkedin)
    contactParts.push(
      <a
        key="li"
        href={safeHref(pi.linkedin, "https://linkedin.com")}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
      >
        <IconLink className="h-3 w-3 shrink-0 text-[#888]" />
        LinkedIn
      </a>
    );
  if (pi.github)
    contactParts.push(
      <a
        key="gh"
        href={safeHref(pi.github, "https://github.com")}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
      >
        <IconLink className="h-3 w-3 shrink-0 text-[#888]" />
        GitHub
      </a>
    );

  const SkillRow = ({
    label,
    items,
  }: {
    label: string;
    items: string[];
  }) => {
    if (!items?.length) return null;
    return (
      <div className="mb-4 flex flex-wrap gap-y-2 sm:flex-nowrap" style={avoidBreak}>
        <span className="mb-1 w-full shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#888] sm:mb-0 sm:w-[100px]">
          {label}
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {items.map((s, i) => (
            <span
              key={`${label}-${i}-${s}`}
              className="rounded-full border border-[#e0e0e0] bg-[#f5f5f5] px-[10px] py-1 text-[11px] text-[#333]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`font-sans ${body}`} style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <header style={avoidBreak}>
        <h1 className="text-[32px] font-bold leading-tight text-[#1a1a1a]">
          {pi.name || ""}
        </h1>
        <p className="mt-1 text-[15px]" style={{ color: ACCENT }}>
          {pi.title || ""}
        </p>
        <div className="my-3 h-0.5 w-[60px]" style={{ backgroundColor: ACCENT }} />
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] ${muted}`}>
          {contactParts.map((node, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {i > 0 ? <span className="text-[#ccc]">|</span> : null}
              {node}
            </span>
          ))}
        </div>
      </header>

      {data.summary?.trim() ?
        <section className="mt-8" style={avoidBreak}>
          <SectionHeader>Summary</SectionHeader>
          <div className="mt-3">
            <p className={`text-[13px] leading-[1.8] ${body}`}>{data.summary.trim()}</p>
          </div>
        </section>
      : null}

      {sk.technical?.length ||
      sk.frameworks?.length ||
      sk.tools?.length ||
      sk.soft?.length ?
        <section className="mt-8">
          <SectionHeader>Skills</SectionHeader>
          <div className="mt-3">
            <SkillRow label="Technical" items={sk.technical ?? []} />
            <SkillRow label="Frameworks" items={sk.frameworks ?? []} />
            <SkillRow label="Tools" items={sk.tools ?? []} />
            <SkillRow label="Soft" items={sk.soft ?? []} />
          </div>
        </section>
      : null}

      {data.experience?.length ?
        <section className="mt-8">
          <SectionHeader>Experience</SectionHeader>
          <div className="mt-3 space-y-6">
            {(data.experience ?? []).map((exp, idx) => (
              <article key={`exp-${idx}`} style={avoidBreak}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[13px] font-bold text-[#1a1a1a]">
                    {exp.company || ""}
                  </span>
                  <span className="text-[11px] text-[#999]">{exp.duration || ""}</span>
                </div>
                <p className="mt-0.5 text-[12px] italic" style={{ color: ACCENT }}>
                  {exp.role || ""}
                </p>
                {exp.location?.trim() ?
                  <p className="text-[11px] text-[#aaa]">{exp.location}</p>
                : null}
                <ul className={`mt-2 list-none space-y-1 pl-4 text-[12px] leading-[1.6] ${body}`}>
                  {(exp.bullets ?? []).map((b, i) =>
                    b?.trim() ?
                      <li key={i} className="relative pl-2">
                        <span className="absolute left-0 text-[#1a1a1a]">•</span>
                        {b.trim()}
                      </li>
                    : null
                  )}
                </ul>
              </article>
            ))}
          </div>
        </section>
      : null}

      {data.projects?.length ?
        <section className="mt-8">
          <SectionHeader>Projects</SectionHeader>
          <div className="mt-3 space-y-3">
            {(data.projects ?? []).map((p, idx) => (
              <article
                key={`proj-${idx}`}
                className="rounded-lg border border-[#efefef] bg-[#fafafa] p-[14px]"
                style={avoidBreak}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[13px] font-bold text-[#1a1a1a]">{p.name || ""}</h3>
                  {p.link?.trim() ?
                    <a
                      href={safeHref(p.link, "https://example.com")}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00E5CC]"
                      aria-label="Project link"
                    >
                      <IconLink className="h-4 w-4" />
                    </a>
                  : null}
                </div>
                {p.description?.trim() ?
                  <p className={`mt-2 text-[12px] leading-[1.5] ${sub}`}>{p.description.trim()}</p>
                : null}
                {(p.techStack ?? []).length > 0 ?
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(p.techStack ?? []).map((t, i) => (
                      <span
                        key={i}
                        className="rounded border border-[#ddd] bg-white px-2 py-0.5 text-[10px] text-[#333]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                : null}
                {(p.highlights ?? []).length > 0 ?
                  <ul className={`mt-2 list-none space-y-1 text-[12px] ${body}`}>
                    {(p.highlights ?? []).map((h, i) =>
                      h?.trim() ?
                        <li key={i} className="flex gap-2">
                          <span className="text-[#00E5CC]">▸</span>
                          {h.trim()}
                        </li>
                      : null
                    )}
                  </ul>
                : null}
              </article>
            ))}
          </div>
        </section>
      : null}

      {data.education?.length ?
        <section className="mt-8">
          <SectionHeader>Education</SectionHeader>
          <div className="mt-3 space-y-3">
            {(data.education ?? []).map((ed, idx) => (
              <div
                key={`ed-${idx}`}
                className="flex flex-wrap justify-between gap-2 text-[12px]"
                style={avoidBreak}
              >
                <span className="font-bold text-[#1a1a1a]">{ed.institution || ""}</span>
                <span className="text-[11px] text-[#999]">{ed.year || ""}</span>
                <div className="w-full text-[11px] text-[#555]">{ed.degree || ""}</div>
              </div>
            ))}
          </div>
        </section>
      : null}

      {data.certifications?.length ?
        <section className="mt-8">
          <SectionHeader>Certifications</SectionHeader>
          <ul className="mt-3 space-y-2 text-[11px]">
            {(data.certifications ?? []).map((c, i) => (
              <li key={i} style={avoidBreak}>
                <span className="font-bold text-[#1a1a1a]">{c.name || ""}</span>
                <span className="text-[10px] text-[#888]">
                  {" "}
                  {[c.issuer, c.year].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      : null}
    </div>
  );
}
