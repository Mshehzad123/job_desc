import type { CSSProperties } from "react";
import type { CvDocument } from "@/lib/types/cv";
import { getInitials } from "@/lib/cvDisplayUtils";
import {
  a4TwoColumnRoot,
  tableCellMain,
  tableCellSidebar,
} from "@/components/templates/a4Shell";
import { avoidBreak, sectionGap } from "@/components/templates/printCss";

const GOLD = "#C9A84C";

function MH({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#000000" }}>
        {title}
      </div>
      <div style={{ height: "1px", backgroundColor: GOLD, marginTop: "6px" }} />
    </div>
  );
}

const sec: CSSProperties = { ...avoidBreak, ...sectionGap, display: "block" };

export function NoirTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? { technical: [], frameworks: [], tools: [], soft: [] };

  const lines = [pi.email, pi.phone, pi.location, pi.linkedin, pi.github].filter((x) => x?.trim());
  const skillSections = (
    [
      ["TECHNICAL", sk.technical],
      ["FRAMEWORKS", sk.frameworks],
      ["TOOLS", sk.tools],
      ["SOFT SKILLS", sk.soft],
    ] as const
  ).filter(([, items]) => (items?.length ?? 0) > 0);

  return (
    <div
      id="cv-tailor-print"
      data-template="noir"
      className="shadow-lg"
      style={{ ...a4TwoColumnRoot, backgroundColor: "#FAFAF7" }}
    >
      <aside
        style={tableCellSidebar(260, {
          backgroundColor: "#000000",
          padding: "28px 20px",
        })}
      >
        <div style={{ ...avoidBreak, textAlign: "center" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              border: `2px solid ${GOLD}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: "22px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {getInitials(pi.name || "?")}
          </div>
          <div style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, marginTop: "12px" }}>{pi.name || ""}</div>
          <div style={{ color: GOLD, fontSize: "11px", marginTop: "6px" }}>{pi.title || ""}</div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "16px 0" }} />
        <div style={{ ...avoidBreak }}>
          <div style={{ color: GOLD, fontSize: "9px", letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", marginBottom: "10px" }}>
            CONTACT
          </div>
          {lines.map((l, i) => (
            <div key={i} style={{ color: "#ffffff", fontSize: "10px", lineHeight: 2 }}>
              {l}
            </div>
          ))}
        </div>
        {skillSections.map(([label, items]) => (
          <div key={label} style={{ ...avoidBreak, marginTop: "16px" }}>
            <div style={{ color: GOLD, fontSize: "9px", letterSpacing: "0.2em", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
              {label}
            </div>
            <div style={{ display: "block", lineHeight: 1.9 }}>
              {(items ?? []).map((s, i) =>
                s?.trim() ?
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      margin: "0 6px 6px 0",
                      border: `1px solid ${GOLD}`,
                      color: GOLD,
                      fontSize: "9px",
                      padding: "3px 8px",
                      borderRadius: 0,
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
      <main style={tableCellMain({ backgroundColor: "#FAFAF7", padding: "36px 32px", display: "block" })}>
        {data.summary?.trim() ?
          <div style={sec}>
            <MH title="SUMMARY" />
            <p style={{ fontSize: "12px", color: "#222222", lineHeight: 1.8, fontStyle: "italic", margin: 0 }}>{data.summary.trim()}</p>
          </div>
        : null}
        {(data.experience ?? []).length > 0 ?
          <div style={sec}>
            <MH title="EXPERIENCE" />
            {(data.experience ?? []).map((exp, idx) => (
              <div key={idx} style={{ ...avoidBreak, marginBottom: idx === (data.experience ?? []).length - 1 ? 0 : "18px" }}>
                <div style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                  <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", fontSize: "12px", fontWeight: 700, color: "#000000" }}>
                      {exp.company || ""}
                    </div>
                    <div style={{ display: "table-cell", fontSize: "10px", color: "#666666", textAlign: "right", whiteSpace: "nowrap" }}>
                      {exp.duration || ""}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: GOLD, marginTop: "4px" }}>{exp.role || ""}</div>
                {(exp.bullets ?? []).map((b, i) =>
                  b?.trim() ?
                    <div key={i} style={{ fontSize: "11px", color: "#333333", lineHeight: 1.6, marginTop: "6px", paddingLeft: "12px", textIndent: "-12px" }}>
                      <span style={{ color: GOLD }}>— </span>
                      {b.trim()}
                    </div>
                  : null
                )}
              </div>
            ))}
          </div>
        : null}
        {(data.projects ?? []).length > 0 ?
          <div style={sec}>
            <MH title="PROJECTS" />
            {(data.projects ?? []).map((p, idx) => (
              <div key={idx} style={{ ...avoidBreak, borderLeft: `2px solid ${GOLD}`, paddingLeft: "12px", marginBottom: idx === (data.projects ?? []).length - 1 ? 0 : "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#000000" }}>{p.name || ""}</div>
                {p.description?.trim() ?
                  <p style={{ fontSize: "11px", color: "#555555", margin: "6px 0 0" }}>{p.description.trim()}</p>
                : null}
              </div>
            ))}
          </div>
        : null}
        {(data.education ?? []).length > 0 ?
          <div style={sec}>
            <MH title="EDUCATION" />
            {(data.education ?? []).map((ed, idx) => (
              <div key={idx} style={{ ...avoidBreak, display: "table", width: "100%", tableLayout: "fixed", marginBottom: "10px" }}>
                <div style={{ display: "table-row" }}>
                  <div style={{ display: "table-cell", verticalAlign: "top" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#000000" }}>{ed.institution || ""}</div>
                    <div style={{ fontSize: "11px", color: "#555555" }}>{ed.degree || ""}</div>
                  </div>
                  <div style={{ display: "table-cell", fontSize: "10px", color: "#888888", textAlign: "right", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    {ed.year || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        : null}
        {(data.certifications ?? []).length > 0 ?
          <div style={{ ...sec, marginBottom: 0 }}>
            <MH title="CERTIFICATIONS" />
            {(data.certifications ?? []).map((c, idx) => (
              <div key={idx} style={{ ...avoidBreak, marginBottom: "6px", fontSize: "11px", color: "#333333" }}>
                <strong style={{ color: "#000000" }}>{c.name || ""}</strong> {[c.issuer, c.year].filter(Boolean).join(" · ")}
              </div>
            ))}
          </div>
        : null}
      </main>
    </div>
  );
}
