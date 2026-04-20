import type { CvDocument } from "@/lib/types/cv";
import { safeHref } from "@/lib/cvDisplayUtils";
import { a4Outer } from "@/components/templates/a4Shell";
import { avoidBreak } from "@/components/templates/printCss";
import { IconLink } from "@/components/templates/icons";

const ACCENT = "#00E5CC";
const HEADER_BG = "#0f172a";

function SkillsBlock({ data }: { data: CvDocument }) {
  const sk = data.skills ?? {
    technical: [],
    frameworks: [],
    tools: [],
    soft: [],
  };
  const rows: Array<{ label: string; items: string[] }> = [
    { label: "Technical", items: sk.technical ?? [] },
    { label: "Frameworks", items: sk.frameworks ?? [] },
    { label: "Tools", items: sk.tools ?? [] },
    { label: "Soft", items: sk.soft ?? [] },
  ];
  const any = rows.some((r) => r.items?.length);
  if (!any) return null;

  return (
    <section style={avoidBreak}>
      <div className="mb-3 flex items-center">
        <div className="mr-2 h-[14px] w-[3px] shrink-0 bg-[#00E5CC]" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f172a]">Skills</h2>
      </div>
      <div className="space-y-2 text-[10px] text-[#0f172a]">
        {rows.map((row) =>
          row.items?.length ?
            <p key={row.label} className="leading-relaxed">
              <span className="mr-2 font-semibold text-[#374151]">{row.label}:</span>
              {row.items.map((item, i) =>
                item?.trim() ?
                  <span key={`${row.label}-${i}`} className="mr-1.5 inline-block">
                    <span
                      className="inline-block rounded border border-[#e2e8f0] bg-[#f8fafc] px-2 py-0.5 text-[#0f172a]"
                      style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }}
                    >
                      {item.trim()}
                    </span>
                  </span>
                : null
              )}
            </p>
          : null
        )}
      </div>
    </section>
  );
}

function hasSkillsContent(data: CvDocument): boolean {
  const sk = data.skills ?? {
    technical: [],
    frameworks: [],
    tools: [],
    soft: [],
  };
  return [sk.technical, sk.frameworks, sk.tools, sk.soft].some((a) => (a?.length ?? 0) > 0);
}

export function VertexTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const showSkills = hasSkillsContent(data);

  const contactParts: React.ReactNode[] = [];
  if (pi.email)
    contactParts.push(<span key="e">{pi.email}</span>);
  if (pi.phone) contactParts.push(<span key="p">{pi.phone}</span>);
  if (pi.location) contactParts.push(<span key="l">{pi.location}</span>);

  return (
    <div
      id="cv-tailor-print"
      data-template="vertex"
      className="mx-auto bg-white shadow-lg"
      style={{ ...a4Outer, backgroundColor: "#ffffff" }}
    >
      <header
        className="text-white"
        style={{ backgroundColor: HEADER_BG, padding: "40px 48px", ...avoidBreak }}
      >
        <h1 className="text-[30px] font-bold leading-tight">{pi.name || ""}</h1>
        <p className="mt-1.5 text-[14px]" style={{ color: ACCENT }}>
          {pi.title || ""}
        </p>
        {contactParts.length > 0 ?
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white">
            {contactParts.map((node, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                {i > 0 ? <span className="text-white/40">|</span> : null}
                {node}
              </span>
            ))}
          </div>
        : null}
        {(pi.github?.trim() || pi.linkedin?.trim()) ?
          <div className="mt-3 flex flex-wrap gap-2">
            {pi.github?.trim() ?
              <a
                href={safeHref(pi.github, "https://github.com")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-[10px] font-medium"
                style={{ borderColor: "#00E5CC40", color: ACCENT }}
              >
                GitHub
              </a>
            : null}
            {pi.linkedin?.trim() ?
              <a
                href={safeHref(pi.linkedin, "https://linkedin.com")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-[10px] font-medium"
                style={{ borderColor: "#00E5CC40", color: ACCENT }}
              >
                LinkedIn
              </a>
            : null}
          </div>
        : null}
      </header>

      <div style={{ padding: "40px 48px", display: "block", boxSizing: "border-box" }}>
        <SkillsBlock data={data} />

        {data.summary?.trim() ?
          <section className={showSkills ? "mt-8" : ""} style={avoidBreak}>
            <div className="mb-3 flex items-center">
              <div className="mr-2 h-[14px] w-[3px] shrink-0 bg-[#00E5CC]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f172a]">Summary</h2>
            </div>
            <p className="text-[13px] leading-[1.7] text-[#374151]">{data.summary.trim()}</p>
          </section>
        : null}

        {data.experience?.length ?
          <section className="mt-8">
            <div className="mb-3 flex items-center">
              <div className="mr-2 h-[14px] w-[3px] shrink-0 bg-[#00E5CC]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f172a]">
                Experience
              </h2>
            </div>
            <div className="relative border-l-2 border-[#e5e7eb] pl-5">
              {(data.experience ?? []).map((exp, idx) => (
                <article
                  key={`ex-${idx}`}
                  className="relative pb-8 last:pb-0"
                  style={avoidBreak}
                >
                  <div
                    className="absolute left-[-21px] top-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[13px] font-bold text-[#0f172a]">{exp.company || ""}</span>
                    <span className="text-[11px] text-[#6b7280]">{exp.duration || ""}</span>
                  </div>
                  <p className="mt-0.5 text-[12px]" style={{ color: ACCENT }}>
                    {exp.role || ""}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] leading-[1.6] text-[#4b5563]">
                    {(exp.bullets ?? []).map((b, i) =>
                      b?.trim() ? <li key={i}>{b.trim()}</li> : null
                    )}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        : null}

        {data.projects?.length ?
          <section className="mt-8">
            <div className="mb-3 flex items-center">
              <div className="mr-2 h-[14px] w-[3px] shrink-0 bg-[#00E5CC]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f172a]">
                Projects
              </h2>
            </div>
            <div className="space-y-6">
              {(data.projects ?? []).map((p, idx) => (
                <article
                  key={`pr-${idx}`}
                  className="border-l-[3px] border-[#00E5CC] pl-4"
                  style={{ borderLeftColor: ACCENT, ...avoidBreak }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13px] font-bold text-[#0f172a]">{p.name || ""}</h3>
                    {p.link?.trim() ?
                      <a
                        href={safeHref(p.link, "https://example.com")}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00E5CC]"
                      >
                        <IconLink className="h-4 w-4" />
                      </a>
                    : null}
                  </div>
                  {p.description?.trim() ?
                    <p className="mt-1 text-[12px] text-[#555]">{p.description.trim()}</p>
                  : null}
                  {(p.highlights ?? []).length > 0 ?
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] text-[#4b5563]">
                      {(p.highlights ?? []).map((h, i) =>
                        h?.trim() ? <li key={i}>{h.trim()}</li> : null
                      )}
                    </ul>
                  : null}
                  {(p.techStack ?? []).length > 0 ?
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(p.techStack ?? []).map((t, i) =>
                        t?.trim() ?
                          <span
                            key={i}
                            className="inline-block rounded border border-[#e2e8f0] bg-[#f8fafc] px-2 py-0.5 text-[10px] text-[#0f172a]"
                            style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }}
                          >
                            {t.trim()}
                          </span>
                        : null
                      )}
                    </div>
                  : null}
                </article>
              ))}
            </div>
          </section>
        : null}

        {data.education?.length ?
          <section className="mt-8">
            <div className="mb-3 flex items-center">
              <div className="mr-2 h-[14px] w-[3px] shrink-0 bg-[#00E5CC]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f172a]">
                Education
              </h2>
            </div>
            <div className="space-y-2">
              {(data.education ?? []).map((ed, idx) => (
                <div
                  key={`ed-${idx}`}
                  className="flex flex-wrap justify-between gap-2 text-[12px]"
                  style={avoidBreak}
                >
                  <span className="font-semibold text-[#0f172a]">{ed.institution || ""}</span>
                  <span className="text-[11px] text-[#6b7280]">{ed.year || ""}</span>
                  <p className="w-full text-[11px] text-[#4b5563]">{ed.degree || ""}</p>
                </div>
              ))}
            </div>
          </section>
        : null}

        {data.certifications?.length ?
          <section className="mt-8">
            <div className="mb-3 flex items-center">
              <div className="mr-2 h-[14px] w-[3px] shrink-0 bg-[#00E5CC]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f172a]">
                Certifications
              </h2>
            </div>
            <ul className="space-y-1 text-[11px] text-[#374151]">
              {(data.certifications ?? []).map((c, i) => (
                <li key={i} style={avoidBreak}>
                  <span className="font-semibold text-[#0f172a]">{c.name || ""}</span>
                  <span className="text-[10px] text-[#6b7280]">
                    {" "}
                    {[c.issuer, c.year].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        : null}
      </div>
    </div>
  );
}
