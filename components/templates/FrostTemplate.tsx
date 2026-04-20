import type { CSSProperties, ReactNode } from "react";
import type { CvDocument } from "@/lib/types/cv";
import { a4Outer } from "@/components/templates/a4Shell";
import { avoidBreak } from "@/components/templates/printCss";

const BLUE = "#2563EB";

function SH({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "9px", fontWeight: 700, color: BLUE, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {title}
      </div>
    </div>
  );
}

const sec: CSSProperties = { ...avoidBreak, marginBottom: "24px", display: "block" };

export function FrostTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? { technical: [], frameworks: [], tools: [], soft: [] };

  const contacts: ReactNode[] = [];
  if (pi.email) contacts.push(<span key="e">{pi.email}</span>);
  if (pi.phone) contacts.push(<span key="p">{pi.phone}</span>);
  if (pi.location) contacts.push(<span key="l">{pi.location}</span>);
  if (pi.linkedin) contacts.push(<span key="li">{pi.linkedin}</span>);
  if (pi.github) contacts.push(<span key="gh">{pi.github}</span>);

  const categories = (
    [
      ["Technical", sk.technical],
      ["Frameworks", sk.frameworks],
      ["Tools", sk.tools],
      ["Soft", sk.soft],
    ] as const
  ).filter(([, arr]) => (arr?.length ?? 0) > 0);

  return (
    <div id="cv-tailor-print" data-template="frost" className="bg-white shadow-lg" style={{ ...a4Outer }}>
      <div style={{ padding: "52px 64px", display: "block", boxSizing: "border-box", backgroundColor: "#ffffff" }}>
        <header style={avoidBreak}>
          <h1 style={{ fontSize: "34px", fontWeight: 700, color: "#0a0a0a", margin: 0 }}>{pi.name || ""}</h1>
          <p style={{ fontSize: "14px", color: BLUE, marginTop: "4px" }}>{pi.title || ""}</p>
          <div style={{ height: "1px", backgroundColor: BLUE, marginTop: "16px", marginBottom: "16px", width: "100%" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "11px", color: "#555555" }}>
            {contacts.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </header>

        {data.summary?.trim() ?
          <section style={{ ...sec, marginTop: "28px" }}>
            <SH title="SUMMARY" />
            <p style={{ fontSize: "13px", color: "#333333", lineHeight: 1.8, margin: 0 }}>{data.summary.trim()}</p>
          </section>
        : null}

        {categories.length > 0 ?
          <section style={sec}>
            <SH title="SKILLS" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.flatMap(([_, items]) =>
                (items ?? []).map((s, i) =>
                  s?.trim() ?
                    <span
                      key={`${items}-${i}-${s}`}
                      style={{
                        backgroundColor: "#EFF6FF",
                        border: "1px solid #BFDBFE",
                        color: "#1D4ED8",
                        fontSize: "11px",
                        borderRadius: "999px",
                        padding: "4px 12px",
                      }}
                    >
                      {s.trim()}
                    </span>
                  : null
                )
              )}
            </div>
          </section>
        : null}

        {(data.experience ?? []).length > 0 ?
          <section style={sec}>
            <SH title="EXPERIENCE" />
            {(data.experience ?? []).map((exp, idx) => (
              <div
                key={idx}
                style={{
                  ...avoidBreak,
                  borderLeft: `3px solid ${BLUE}`,
                  paddingLeft: "16px",
                  marginBottom: idx === (data.experience ?? []).length - 1 ? 0 : "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a" }}>{exp.company || ""}</span>
                  <span style={{ fontSize: "10px", color: "#888888" }}>{exp.duration || ""}</span>
                </div>
                <div style={{ fontSize: "12px", color: BLUE, marginTop: "4px" }}>{exp.role || ""}</div>
                {(exp.bullets ?? []).map((b, i) =>
                  b?.trim() ?
                    <div key={i} style={{ fontSize: "11px", color: "#444444", lineHeight: 1.6, marginTop: "6px", paddingLeft: "8px" }}>
                      • {b.trim()}
                    </div>
                  : null
                )}
              </div>
            ))}
          </section>
        : null}

        {(data.projects ?? []).length > 0 ?
          <section style={sec}>
            <SH title="PROJECTS" />
            {(data.projects ?? []).map((p, idx) => (
              <div
                key={idx}
                style={{
                  ...avoidBreak,
                  backgroundColor: "#ffffff",
                  border: "1px solid #BFDBFE",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  marginBottom: idx === (data.projects ?? []).length - 1 ? 0 : "12px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a" }}>{p.name || ""}</div>
                {p.description?.trim() ?
                  <p style={{ fontSize: "11px", color: "#444444", marginTop: "8px" }}>{p.description.trim()}</p>
                : null}
                {(p.techStack ?? []).length > 0 ?
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {(p.techStack ?? []).map((t, i) =>
                      t?.trim() ?
                        <span key={i} style={{ fontSize: "10px", backgroundColor: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: "4px" }}>
                          {t.trim()}
                        </span>
                      : null
                    )}
                  </div>
                : null}
              </div>
            ))}
          </section>
        : null}

        {(data.education ?? []).length > 0 ?
          <section style={sec}>
            <SH title="EDUCATION" />
            {(data.education ?? []).map((ed, idx) => (
              <div key={idx} style={{ ...avoidBreak, display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "10px", fontSize: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#0a0a0a" }}>{ed.institution || ""}</div>
                  <div style={{ color: "#555555" }}>{ed.degree || ""}</div>
                </div>
                <div style={{ color: "#888888", fontSize: "11px", whiteSpace: "nowrap" }}>{ed.year || ""}</div>
              </div>
            ))}
          </section>
        : null}

        {(data.certifications ?? []).length > 0 ?
          <section style={{ ...sec, marginBottom: 0 }}>
            <SH title="CERTIFICATIONS" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(data.certifications ?? []).map((c, idx) => (
                <span
                  key={idx}
                  style={{
                    ...avoidBreak,
                    fontSize: "11px",
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    color: "#1D4ED8",
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {c.name || ""}
                  {[c.issuer, c.year].filter(Boolean).length ? ` · ${[c.issuer, c.year].filter(Boolean).join(" ")}` : ""}
                </span>
              ))}
            </div>
          </section>
        : null}
      </div>
    </div>
  );
}
