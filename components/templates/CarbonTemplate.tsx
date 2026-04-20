import type { CSSProperties } from "react";
import type { CvDocument } from "@/lib/types/cv";
import { a4Outer } from "@/components/templates/a4Shell";
import { avoidBreak } from "@/components/templates/printCss";

const ACCENT = "#00E5CC";
const BG = "#0f0f0f";

function SH({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "9px", fontWeight: 700, color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ height: "1px", backgroundColor: "rgba(0,229,204,0.125)", marginTop: "8px", width: "100%" }} />
    </div>
  );
}

const sec: CSSProperties = { ...avoidBreak, marginBottom: "22px", display: "block" };

export function CarbonTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? { technical: [], frameworks: [], tools: [], soft: [] };

  const meta = [pi.email, pi.phone, pi.location].filter(Boolean).join(" · ");

  const skillLines = (
    [
      ["Technical", sk.technical],
      ["Frameworks", sk.frameworks],
      ["Tools", sk.tools],
      ["Soft", sk.soft],
    ] as const
  ).filter(([, arr]) => (arr?.length ?? 0) > 0);

  return (
    <div id="cv-tailor-print" data-template="carbon" className="shadow-lg" style={{ ...a4Outer, backgroundColor: BG, color: "#cccccc" }}>
      <header
        style={{
          ...avoidBreak,
          backgroundColor: "#161616",
          borderBottom: "1px solid rgba(0,229,204,0.25)",
          padding: "36px 40px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#ffffff", margin: 0 }}>{pi.name || ""}</h1>
        <p style={{ fontSize: "14px", color: ACCENT, marginTop: "6px" }}>{pi.title || ""}</p>
        {meta ?
          <div style={{ marginTop: "12px", fontSize: "11px", color: "#888888" }}>
            {meta.split(" · ").map((part, i, arr) => (
              <span key={i}>
                {i > 0 ? <span style={{ margin: "0 6px", color: "#555" }}>•</span> : null}
                {part}
              </span>
            ))}
          </div>
        : null}
      </header>

      <div style={{ padding: "36px 40px", display: "block", boxSizing: "border-box" }}>
        {data.summary?.trim() ?
          <section style={sec}>
            <SH title="SUMMARY" />
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#cccccc", margin: 0 }}>{data.summary.trim()}</p>
          </section>
        : null}

        {skillLines.length > 0 ?
          <section style={sec}>
            <SH title="SKILLS" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skillLines.flatMap(([label, items]) =>
                (items ?? []).map((s, i) =>
                  s?.trim() ?
                    <span
                      key={`${label}-${i}`}
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "10px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid rgba(0,229,204,0.19)",
                        color: ACCENT,
                        padding: "4px 8px",
                        borderRadius: "4px",
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
                  paddingBottom: "16px",
                  marginBottom: idx === (data.experience ?? []).length - 1 ? 0 : "0",
                  borderBottom: idx === (data.experience ?? []).length - 1 ? "none" : "1px solid #1a1a1a",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{exp.company || ""}</span>
                  <span style={{ fontSize: "10px", color: "#555555" }}>{exp.duration || ""}</span>
                </div>
                <div style={{ fontSize: "12px", color: ACCENT, marginTop: "4px" }}>{exp.role || ""}</div>
                {(exp.bullets ?? []).map((b, i) =>
                  b?.trim() ?
                    <div key={i} style={{ fontSize: "11px", color: "#aaaaaa", lineHeight: 1.6, display: "flex", gap: "6px", marginTop: "6px" }}>
                      <span style={{ color: ACCENT }}>▸</span>
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
            <SH title="PROJECTS" />
            {(data.projects ?? []).map((p, idx) => (
              <div
                key={idx}
                style={{
                  ...avoidBreak,
                  backgroundColor: "#161616",
                  border: "1px solid rgba(0,229,204,0.125)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: idx === (data.projects ?? []).length - 1 ? 0 : "12px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{p.name || ""}</div>
                {p.description?.trim() ?
                  <p style={{ fontSize: "11px", color: "#aaaaaa", marginTop: "8px" }}>{p.description.trim()}</p>
                : null}
                {(p.techStack ?? []).length > 0 ?
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {(p.techStack ?? []).map((t, i) =>
                      t?.trim() ?
                        <span key={i} style={{ fontSize: "10px", color: ACCENT, border: "1px solid rgba(0,229,204,0.25)", padding: "2px 6px", borderRadius: "4px" }}>
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
              <div key={idx} style={{ ...avoidBreak, marginBottom: "8px", fontSize: "12px" }}>
                <span style={{ fontWeight: 700, color: "#ffffff" }}>{ed.institution || ""}</span>
                <span style={{ color: "#555555", marginLeft: "12px" }}>{ed.year || ""}</span>
                <div style={{ color: "#aaaaaa", fontSize: "11px" }}>{ed.degree || ""}</div>
              </div>
            ))}
          </section>
        : null}

        {(data.certifications ?? []).length > 0 ?
          <section style={{ ...sec, marginBottom: 0 }}>
            <SH title="CERTIFICATIONS" />
            {(data.certifications ?? []).map((c, idx) => (
              <div key={idx} style={{ ...avoidBreak, fontSize: "11px", color: "#aaaaaa", marginBottom: "6px" }}>
                <span style={{ color: "#ffffff", fontWeight: 600 }}>{c.name || ""}</span> · {[c.issuer, c.year].filter(Boolean).join(" · ")}
              </div>
            ))}
          </section>
        : null}
      </div>
    </div>
  );
}
