import type { CSSProperties } from "react";
import type { CvDocument } from "@/lib/types/cv";
import { getInitials, safeHref } from "@/lib/cvDisplayUtils";
import {
  a4TwoColumnRoot,
  tableCellMain,
  tableCellSidebar,
} from "@/components/templates/a4Shell";
import { avoidBreak, sectionGap } from "@/components/templates/printCss";

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#0f172a",
        }}
      >
        {title}
      </div>
      <div style={{ height: "1.5px", backgroundColor: "#00E5CC", marginTop: "4px" }} />
    </div>
  );
}

const sectionBlock: CSSProperties = {
  ...avoidBreak,
  ...sectionGap,
};

export function AtlasTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? {
    technical: [],
    frameworks: [],
    tools: [],
    soft: [],
  };

  const contactLines = [
    pi.email,
    pi.phone,
    pi.location,
    pi.linkedin,
    pi.github,
  ].filter((x) => x?.trim());

  const skillGroups = (
    [
      { label: "TECHNICAL", items: sk.technical ?? [] },
      { label: "FRAMEWORKS", items: sk.frameworks ?? [] },
      { label: "TOOLS", items: sk.tools ?? [] },
      { label: "SOFT SKILLS", items: sk.soft ?? [] },
    ] as const
  ).filter((g) => (g.items?.length ?? 0) > 0);

  return (
    <div
      id="cv-tailor-print"
      data-template="atlas"
      className="shadow-lg"
      style={{
        ...a4TwoColumnRoot,
        backgroundColor: "#ffffff",
      }}
    >
      <aside
        style={tableCellSidebar(280, {
          backgroundColor: "#0f172a",
          padding: "28px 20px",
        })}
      >
        <div style={{ ...avoidBreak, textAlign: "center" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              backgroundColor: "#00E5CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {getInitials(pi.name || "?")}
          </div>
          <div style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700, marginTop: "12px" }}>{pi.name || ""}</div>
          <div style={{ color: "#00E5CC", fontSize: "11px", marginTop: "4px", marginBottom: "20px" }}>{pi.title || ""}</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: "16px" }} />

        <div style={{ ...avoidBreak, marginBottom: "16px" }}>
          <div
            style={{
              color: "#00E5CC",
              fontSize: "9px",
              letterSpacing: "0.15em",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            CONTACT
          </div>
          {contactLines.map((line, i) => (
            <div
              key={i}
              style={{ color: "#ffffff", fontSize: "10px", lineHeight: 1.9, wordBreak: "break-all" }}
            >
              {line}
            </div>
          ))}
        </div>

        {skillGroups.map((g, idx) => (
            <div key={idx} style={{ ...avoidBreak, marginBottom: "16px" }}>
              <div
                style={{
                  color: "#00E5CC",
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {g.label}
              </div>
              <div style={{ display: "block", lineHeight: 1.9 }}>
                {(g.items ?? []).map((s, i) =>
                  s?.trim() ?
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        margin: "0 6px 6px 0",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "#ffffff",
                        fontSize: "9px",
                        borderRadius: "999px",
                        padding: "3px 8px",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      {s.trim()}
                    </span>
                  : null
                )}
              </div>
            </div>
          ))}
      </aside>

      <main
        style={tableCellMain({
          backgroundColor: "#ffffff",
          padding: "36px 32px",
          display: "block",
        })}
      >
        {data.summary?.trim() ?
          <div style={sectionBlock}>
            <SectionHeader title="SUMMARY" />
            <p style={{ fontSize: "12px", color: "#333", lineHeight: 1.7, margin: 0 }}>{data.summary.trim()}</p>
          </div>
        : null}

        {(data.experience ?? []).length > 0 ?
          <div style={sectionBlock}>
            <SectionHeader title="EXPERIENCE" />
            {(data.experience ?? []).map((exp, idx) => (
              <div
                key={idx}
                style={{
                  ...avoidBreak,
                  marginBottom: idx === (data.experience ?? []).length - 1 ? 0 : "20px",
                }}
              >
                <div style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                  <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", fontSize: "12px", fontWeight: 700, color: "#0f172a", verticalAlign: "top" }}>
                      {exp.company || ""}
                    </div>
                    <div
                      style={{
                        display: "table-cell",
                        fontSize: "10px",
                        color: "#888",
                        whiteSpace: "nowrap",
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      {exp.duration || ""}
                    </div>
                  </div>
                </div>
                <div style={{ display: "table", width: "100%", marginTop: "4px", tableLayout: "fixed" }}>
                  <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", fontSize: "11px", color: "#00E5CC", fontStyle: "italic" }}>
                      {exp.role || ""}
                    </div>
                    <div style={{ display: "table-cell", fontSize: "10px", color: "#aaa", textAlign: "right", whiteSpace: "nowrap" }}>
                      {exp.location || ""}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "6px", paddingLeft: "8px" }}>
                  {(exp.bullets ?? []).map((b, i) =>
                    b?.trim() ?
                      <div key={i} style={{ fontSize: "11px", color: "#444", lineHeight: 1.6, paddingLeft: "8px", textIndent: "-8px" }}>
                        <span style={{ color: "#00E5CC" }}>▸ </span>
                        {b.trim()}
                      </div>
                    : null
                  )}
                </div>
              </div>
            ))}
          </div>
        : null}

        {(data.projects ?? []).length > 0 ?
          <div style={sectionBlock}>
            <SectionHeader title="PROJECTS" />
            {(data.projects ?? []).map((proj, idx) => (
              <div key={idx} style={{ ...avoidBreak, marginBottom: idx === (data.projects ?? []).length - 1 ? 0 : "18px" }}>
                <div style={{ display: "block" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", marginRight: "8px" }}>{proj.name || ""}</span>
                  {proj.link?.trim() ?
                    <a href={safeHref(proj.link, "https://example.com")} target="_blank" rel="noreferrer" style={{ fontSize: "10px", color: "#00E5CC" }}>
                      ↗
                    </a>
                  : null}
                </div>
                {proj.description?.trim() ?
                  <p style={{ fontSize: "11px", color: "#555", lineHeight: 1.5, margin: "6px 0 0" }}>{proj.description.trim()}</p>
                : null}
                {(proj.techStack ?? []).length > 0 ?
                  <div style={{ display: "block", marginTop: "8px", lineHeight: 2 }}>
                    {(proj.techStack ?? []).map((t, i) =>
                      t?.trim() ?
                        <span
                          key={i}
                          style={{
                            display: "inline-block",
                            margin: "0 6px 4px 0",
                            fontSize: "10px",
                            backgroundColor: "#f0fffe",
                            border: "1px solid rgba(0, 229, 204, 0.25)",
                            color: "#0f172a",
                            fontFamily: "ui-monospace, monospace",
                            padding: "2px 6px",
                          }}
                        >
                          {t.trim()}
                        </span>
                      : null
                    )}
                  </div>
                : null}
                {(proj.highlights ?? []).map((h, i) =>
                  h?.trim() ?
                    <div key={i} style={{ fontSize: "11px", color: "#444", marginTop: "4px", paddingLeft: "8px", textIndent: "-8px" }}>
                      <span style={{ color: "#00E5CC" }}>▸ </span>
                      {h.trim()}
                    </div>
                  : null
                )}
              </div>
            ))}
          </div>
        : null}

        {(data.education ?? []).length > 0 ?
          <div style={sectionBlock}>
            <SectionHeader title="EDUCATION" />
            {(data.education ?? []).map((edu, idx) => (
              <div key={idx} style={{ ...avoidBreak, display: "table", width: "100%", tableLayout: "fixed", marginBottom: "10px" }}>
                <div style={{ display: "table-row" }}>
                  <div style={{ display: "table-cell", verticalAlign: "top" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{edu.institution || ""}</div>
                    <div style={{ fontSize: "11px", color: "#555" }}>{edu.degree || ""}</div>
                  </div>
                  <div style={{ display: "table-cell", fontSize: "11px", color: "#888", textAlign: "right", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    {edu.year || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        : null}

        {(data.certifications ?? []).length > 0 ?
          <div style={{ ...sectionBlock, marginBottom: 0 }}>
            <SectionHeader title="CERTIFICATIONS" />
            {(data.certifications ?? []).map((c, idx) => (
              <div key={idx} style={{ ...avoidBreak, marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{c.name || ""}</span>
                <span style={{ fontSize: "10px", color: "#888", marginLeft: "8px" }}>
                  {[c.issuer, c.year].filter(Boolean).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        : null}
      </main>
    </div>
  );
}
