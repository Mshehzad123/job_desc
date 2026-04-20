import type { CSSProperties } from "react";
import type { CvDocument } from "@/lib/types/cv";
import { safeHref } from "@/lib/cvDisplayUtils";
import { a4Outer, tableCellMain, tableCellSidebar } from "@/components/templates/a4Shell";
import { avoidBreak, sectionGap } from "@/components/templates/printCss";

const TEAL = "#00E5CC";
const NAVY = "#0f172a";

function ColHeader({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: "9px",
        fontWeight: 700,
        textTransform: "uppercase",
        color: NAVY,
        borderBottom: `2px solid ${TEAL}`,
        marginBottom: "12px",
        paddingBottom: "4px",
      }}
    >
      {children}
    </div>
  );
}

const item: CSSProperties = { ...avoidBreak, ...sectionGap, display: "block" };

export function PrismTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? { technical: [], frameworks: [], tools: [], soft: [] };
  const contact = [pi.email, pi.phone, pi.location].filter(Boolean).join(" · ");

  const cats = (
    [
      ["Technical", sk.technical],
      ["Frameworks", sk.frameworks],
      ["Tools", sk.tools],
      ["Soft skills", sk.soft],
    ] as const
  ).filter(([, a]) => (a?.length ?? 0) > 0);

  return (
    <div
      id="cv-tailor-print"
      data-template="prism"
      className="shadow-lg"
      style={{ ...a4Outer, backgroundColor: "#ffffff" }}
    >
      <header
        style={{
          ...avoidBreak,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: "32px 40px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", margin: 0 }}>{pi.name || ""}</h1>
        <p style={{ fontSize: "14px", color: TEAL, marginTop: "6px" }}>{pi.title || ""}</p>
        {contact ?
          <div style={{ marginTop: "8px", fontSize: "10px", color: "#e2e8f0" }}>{contact}</div>
        : null}
      </header>

      <div style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
        <aside
          style={tableCellSidebar(278, {
            width: "35%",
            backgroundColor: "#f8fafc",
            padding: "24px 20px",
            borderRight: "1px solid #e2e8f0",
          })}
        >
          {cats.length > 0 ?
            <div style={{ ...item, marginBottom: "20px" }}>
              <ColHeader>Skills</ColHeader>
              {cats.map(([label, items]) => (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: NAVY, marginBottom: "6px" }}>{label}</div>
                  <div style={{ display: "block" }}>
                    {(items ?? []).map((s, i) =>
                      s?.trim() ?
                        <span
                          key={i}
                          style={{
                            display: "inline-block",
                            marginRight: "6px",
                            marginBottom: "6px",
                            fontSize: "10px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            color: "#333333",
                            padding: "3px 8px",
                            borderRadius: "999px",
                          }}
                        >
                          {s.trim()}
                        </span>
                      : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          : null}

          {(data.education ?? []).length > 0 ?
            <div style={{ ...item, marginBottom: "20px" }}>
              <ColHeader>Education</ColHeader>
              {(data.education ?? []).map((ed, idx) => (
                <div key={idx} style={{ ...avoidBreak, marginBottom: "10px", fontSize: "11px", color: NAVY }}>
                  <div style={{ fontWeight: 700 }}>{ed.institution || ""}</div>
                  <div>{ed.degree || ""}</div>
                  <div style={{ color: "#64748b" }}>{ed.year || ""}</div>
                </div>
              ))}
            </div>
          : null}

          {(data.certifications ?? []).length > 0 ?
            <div style={item}>
              <ColHeader>Certifications</ColHeader>
              {(data.certifications ?? []).map((c, idx) => (
                <div key={idx} style={{ ...avoidBreak, fontSize: "10px", color: "#334155", marginBottom: "6px" }}>
                  {c.name || ""} · {c.issuer || ""} {c.year || ""}
                </div>
              ))}
            </div>
          : null}
        </aside>

        <main style={tableCellMain({ backgroundColor: "#ffffff", padding: "24px 28px", display: "block", width: "65%" })}>
          {data.summary?.trim() ?
            <div style={{ ...item, marginBottom: "20px" }}>
              <ColHeader>Summary</ColHeader>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: 0 }}>{data.summary.trim()}</p>
            </div>
          : null}

          {(data.experience ?? []).length > 0 ?
            <div style={{ ...item, marginBottom: "20px" }}>
              <ColHeader>Experience</ColHeader>
              {(data.experience ?? []).map((exp, idx) => (
                <div key={idx} style={{ ...avoidBreak, marginBottom: "16px" }}>
                  <div style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                    <span style={{ display: "table-cell", fontSize: "13px", fontWeight: 700, color: NAVY }}>{exp.company || ""}</span>
                    <span style={{ display: "table-cell", fontSize: "11px", color: "#64748b", textAlign: "right", whiteSpace: "nowrap", width: "110px" }}>
                      {exp.duration || ""}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: TEAL, marginTop: "4px" }}>{exp.role || ""}</div>
                  {(exp.bullets ?? []).map((b, i) =>
                    b?.trim() ?
                      <div key={i} style={{ fontSize: "12px", color: "#4b5563", marginTop: "6px", paddingLeft: "8px" }}>
                        • {b.trim()}
                      </div>
                    : null
                  )}
                </div>
              ))}
            </div>
          : null}

          {(data.projects ?? []).length > 0 ?
            <div style={item}>
              <ColHeader>Projects</ColHeader>
              {(data.projects ?? []).map((p, idx) => (
                <div key={idx} style={{ ...avoidBreak, marginBottom: "14px" }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: "13px" }}>
                    {p.name || ""}
                    {p.link?.trim() ?
                      <a href={safeHref(p.link, "https://example.com")} style={{ marginLeft: "8px", fontSize: "11px", color: TEAL }} target="_blank" rel="noreferrer">
                        ↗
                      </a>
                    : null}
                  </div>
                  {p.description?.trim() ?
                    <p style={{ fontSize: "12px", color: "#555555", marginTop: "6px" }}>{p.description.trim()}</p>
                  : null}
                </div>
              ))}
            </div>
          : null}
        </main>
      </div>
    </div>
  );
}
