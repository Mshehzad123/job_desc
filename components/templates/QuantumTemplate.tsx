import type { CSSProperties, ReactNode } from "react";
import type { CvDocument } from "@/lib/types/cv";
import { safeHref } from "@/lib/cvDisplayUtils";
import { a4Outer } from "@/components/templates/a4Shell";
import { avoidBreak } from "@/components/templates/printCss";

const TEAL = "#00E5CC";
const NAVY = "#0f172a";

function DotHeader({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: TEAL, flexShrink: 0 }} />
      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: NAVY }}>{title}</span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#eeeeee" }} />
    </div>
  );
}

const sec: CSSProperties = { ...avoidBreak, marginBottom: "20px", display: "block" };

export function QuantumTemplate({
  data,
  matchScore,
}: {
  data: CvDocument;
  matchScore?: number | null;
}) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? { technical: [], frameworks: [], tools: [], soft: [] };
  const contactParts: ReactNode[] = [];
  if (pi.email?.trim()) contactParts.push(<span key="e">{pi.email}</span>);
  if (pi.phone?.trim()) contactParts.push(<span key="p">{pi.phone}</span>);
  if (pi.location?.trim()) contactParts.push(<span key="l">{pi.location}</span>);
  if (pi.linkedin?.trim())
    contactParts.push(
      <a key="li" href={safeHref(pi.linkedin, "https://linkedin.com")} style={{ color: "#555555" }} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
    );
  if (pi.github?.trim())
    contactParts.push(
      <a key="gh" href={safeHref(pi.github, "https://github.com")} style={{ color: "#555555" }} target="_blank" rel="noreferrer">
        GitHub
      </a>
    );

  const score =
    matchScore != null && !Number.isNaN(Number(matchScore)) ?
      Math.min(100, Math.max(0, Number(matchScore)))
    : null;

  const flatSkills = [...(sk.technical ?? []), ...(sk.frameworks ?? []), ...(sk.tools ?? []), ...(sk.soft ?? [])].filter(Boolean);

  return (
    <div id="cv-tailor-print" data-template="quantum" className="bg-white shadow-lg" style={{ ...a4Outer, backgroundColor: "#ffffff" }}>
      <header
        style={{
          ...avoidBreak,
          position: "relative",
          padding: "40px 48px",
          borderLeft: `6px solid ${TEAL}`,
          boxSizing: "border-box",
        }}
      >
        {score != null ?
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: `2px solid ${TEAL}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: TEAL,
            }}
          >
            {score}%
          </div>
        : null}
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: NAVY, margin: 0 }}>{pi.name || ""}</h1>
        <p style={{ fontSize: "15px", color: TEAL, marginTop: "4px" }}>{pi.title || ""}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px", fontSize: "11px", color: "#555555" }}>
          {contactParts.map((node, i) => (
            <span key={i}>{node}</span>
          ))}
        </div>
      </header>

      <div style={{ padding: "0 48px 48px", display: "block", boxSizing: "border-box" }}>
        {data.summary?.trim() ?
          <section style={sec}>
            <DotHeader title="SUMMARY" />
            <div
              style={{
                fontSize: "13px",
                color: "#444444",
                lineHeight: 1.8,
                backgroundColor: "#f0fffe",
                borderLeft: `3px solid ${TEAL}`,
                padding: "16px",
                borderRadius: "0 8px 8px 0",
              }}
            >
              {data.summary.trim()}
            </div>
          </section>
        : null}

        {flatSkills.length > 0 ?
          <section style={sec}>
            <DotHeader title="SKILLS" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {flatSkills.map((s, i) =>
                s?.trim() ?
                  <span
                    key={i}
                    style={{
                      fontSize: "11px",
                      backgroundColor: "#f0fffe",
                      border: "1px solid rgba(0,229,204,0.25)",
                      color: NAVY,
                      padding: "4px 12px",
                      borderRadius: "999px",
                    }}
                  >
                    {s.trim()}
                  </span>
                : null
              )}
            </div>
          </section>
        : null}

        {(data.experience ?? []).length > 0 ?
          <section style={sec}>
            <DotHeader title="EXPERIENCE" />
            {(data.experience ?? []).map((exp, idx) => (
              <div
                key={idx}
                style={{
                  ...avoidBreak,
                  backgroundColor: "#ffffff",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  marginBottom: idx === (data.experience ?? []).length - 1 ? 0 : "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: NAVY }}>{exp.company || ""}</span>
                  <span style={{ fontSize: "10px", color: "#999999" }}>{exp.duration || ""}</span>
                </div>
                <div style={{ fontSize: "12px", color: TEAL, fontStyle: "italic", marginTop: "8px", marginBottom: "8px" }}>{exp.role || ""}</div>
                {(exp.bullets ?? []).map((b, i) =>
                  b?.trim() ?
                    <div key={i} style={{ fontSize: "11px", color: "#444444", display: "flex", gap: "6px", marginTop: "4px" }}>
                      <span style={{ color: TEAL }}>▸</span>
                      <span>{b.trim()}</span>
                    </div>
                  : null
                )}
              </div>
            ))}
          </section>
        : null}

        {(data.projects ?? []).length > 0 ?
          <section style={sec}>
            <DotHeader title="PROJECTS" />
            {(data.projects ?? []).map((p, idx) => (
              <div
                key={idx}
                style={{
                  ...avoidBreak,
                  backgroundColor: "#fafafa",
                  borderLeft: `3px solid ${TEAL}`,
                  padding: "12px 12px 12px 16px",
                  borderRadius: "0 8px 8px 0",
                  marginBottom: idx === (data.projects ?? []).length - 1 ? 0 : "12px",
                }}
              >
                <div style={{ fontWeight: 700, color: NAVY, fontSize: "13px" }}>{p.name || ""}</div>
                {p.description?.trim() ?
                  <p style={{ fontSize: "11px", color: "#555555", marginTop: "6px" }}>{p.description.trim()}</p>
                : null}
                {(p.techStack ?? []).length > 0 ?
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {(p.techStack ?? []).map((t, i) =>
                      t?.trim() ?
                        <span key={i} style={{ fontSize: "10px", backgroundColor: "#f0fffe", color: NAVY, padding: "2px 8px", borderRadius: "4px" }}>
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
          <section style={{ ...sec, marginBottom: 0 }}>
            <DotHeader title="EDUCATION" />
            {(data.education ?? []).map((ed, idx) => (
              <div key={idx} style={{ ...avoidBreak, fontSize: "12px", marginBottom: "8px", color: "#444444" }}>
                <strong style={{ color: NAVY }}>{ed.institution || ""}</strong> · {ed.degree || ""} · {ed.year || ""}
              </div>
            ))}
          </section>
        : null}

        {(data.certifications ?? []).length > 0 ?
          <section style={{ ...sec, marginBottom: 0 }}>
            <DotHeader title="CERTIFICATIONS" />
            {(data.certifications ?? []).map((c, idx) => (
              <div key={idx} style={{ ...avoidBreak, fontSize: "11px", color: "#555555", marginBottom: "6px" }}>
                <strong style={{ color: NAVY }}>{c.name || ""}</strong> · {[c.issuer, c.year].filter(Boolean).join(" · ")}
              </div>
            ))}
          </section>
        : null}
      </div>
    </div>
  );
}
