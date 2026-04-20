import type { ReactNode } from "react";
import type { CvDocument } from "@/lib/types/cv";

const TEAL = "#00E5CC";
const NAVY = "#0f172a";
const GOLD = "rgba(255,215,0,0.6)";

export function LegacyTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};
  const sk = data.skills ?? { technical: [], frameworks: [], tools: [], soft: [] };

  return (
    <div
      id="cv-tailor-print"
      data-template="legacy"
      className="shadow-lg"
      style={{
        display: "table",
        tableLayout: "fixed",
        width: "794px",
        minHeight: "1123px",
        height: "auto",
        maxWidth: "100%",
        fontFamily: "Inter, Arial, sans-serif",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "table-cell",
          width: "240px",
          backgroundColor: NAVY,
          verticalAlign: "top",
          padding: "36px 20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ breakInside: "avoid", pageBreakInside: "avoid", marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.3,
              marginBottom: "6px",
              wordBreak: "break-word",
            }}
          >
            {pi.name || ""}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: TEAL,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {pi.title || ""}
          </div>
          <div
            style={{
              marginTop: "16px",
              borderTop: `1px solid ${GOLD}`,
            }}
          />
        </div>

        <SideSection title="CONTACT">
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github].filter(Boolean).map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: "9px",
                color: "#cbd5e1",
                lineHeight: 1.9,
                wordBreak: "break-all",
              }}
            >
              {item}
            </div>
          ))}
        </SideSection>

        {[...(sk.technical ?? []), ...(sk.frameworks ?? []), ...(sk.tools ?? [])].length > 0 ?
          <SideSection title="EXPERTISE">
            {[...(sk.technical ?? []), ...(sk.frameworks ?? []), ...(sk.tools ?? [])]
              .filter((s) => s?.trim())
              .map((s, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "9px",
                    color: "#e2e8f0",
                    lineHeight: 1.9,
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: TEAL, flexShrink: 0, marginTop: "1px" }}>›</span>
                  <span style={{ wordBreak: "break-word" }}>{s.trim()}</span>
                </div>
              ))}
          </SideSection>
        : null}

        {(sk.soft ?? []).filter((s) => s?.trim()).length > 0 ?
          <SideSection title="CORE STRENGTHS">
            {(sk.soft ?? []).filter((s) => s?.trim()).map((s, i) => (
              <div
                key={i}
                style={{
                  fontSize: "9px",
                  color: "#94a3b8",
                  fontStyle: "italic",
                  lineHeight: 1.9,
                  wordBreak: "break-word",
                }}
              >
                {s.trim()}
              </div>
            ))}
          </SideSection>
        : null}

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: TEAL,
            border: `1px solid ${TEAL}`,
            padding: "8px",
            letterSpacing: "0.1em",
          }}
        >
          10+ YEARS
        </div>
      </div>

      <div
        style={{
          display: "table-cell",
          verticalAlign: "top",
          backgroundColor: "#ffffff",
          padding: "36px 28px",
          boxSizing: "border-box",
        }}
      >
        {data.summary?.trim() ?
          <MainSection title="EXECUTIVE SUMMARY">
            <p
              style={{
                fontSize: "12px",
                color: "#1e293b",
                lineHeight: 1.8,
                margin: 0,
                textAlign: "justify",
              }}
            >
              {data.summary.trim()}
            </p>
          </MainSection>
        : null}

        {(data.experience ?? []).length > 0 ?
          <MainSection title="PROFESSIONAL EXPERIENCE">
            {(data.experience ?? []).map((exp, idx) => (
              <div
                key={idx}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  marginBottom: "16px",
                  paddingBottom: "14px",
                  borderBottom: idx < (data.experience ?? []).length - 1 ? "1px solid #f1f5f9" : "none",
                  display: "block",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    gap: "8px",
                    marginBottom: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: NAVY,
                      flex: 1,
                      minWidth: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    {exp.company || ""}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      lineHeight: 1.35,
                      paddingBottom: "1px",
                    }}
                  >
                    {exp.duration || ""}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: TEAL,
                      flex: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {exp.role || ""}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      lineHeight: 1.35,
                      paddingBottom: "1px",
                    }}
                  >
                    {exp.location || ""}
                  </span>
                </div>

                {(exp.bullets ?? []).filter((b) => b?.trim()).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "6px",
                      fontSize: "11px",
                      color: "#334155",
                      lineHeight: 1.6,
                      marginTop: "5px",
                      paddingLeft: "4px",
                    }}
                  >
                    <span style={{ color: TEAL, flexShrink: 0, marginTop: "1px" }}>›</span>
                    <span style={{ wordBreak: "break-word", flex: 1 }}>{b.trim()}</span>
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        : null}

        {(data.projects ?? []).length > 0 ?
          <MainSection title="KEY PROJECTS">
            {(data.projects ?? []).map((p, idx) => (
              <div
                key={idx}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  marginBottom: "14px",
                  display: "block",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: NAVY,
                    }}
                  >
                    {p.name || ""}
                  </span>
                  {(p.techStack ?? []).filter((t) => t?.trim()).map((t, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "9px",
                        fontFamily: "monospace",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        padding: "1px 6px",
                        color: "#475569",
                      }}
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
                {p.description?.trim() ?
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#475569",
                      lineHeight: 1.6,
                      margin: "4px 0",
                    }}
                  >
                    {p.description.trim()}
                  </p>
                : null}
                {(p.highlights ?? []).filter((h) => h?.trim()).map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "6px",
                      fontSize: "11px",
                      color: "#334155",
                      lineHeight: 1.6,
                      marginTop: "3px",
                      paddingLeft: "4px",
                    }}
                  >
                    <span style={{ color: TEAL, flexShrink: 0 }}>›</span>
                    <span style={{ flex: 1, wordBreak: "break-word" }}>{h.trim()}</span>
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        : null}

        {(data.education ?? []).length > 0 ?
          <MainSection title="EDUCATION">
            {(data.education ?? []).map((ed, idx) => (
              <div
                key={idx}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: NAVY,
                      wordBreak: "break-word",
                    }}
                  >
                    {ed.institution || ""}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                    }}
                  >
                    {ed.degree || ""}
                    {ed.gpa ? ` — GPA: ${ed.gpa}` : ""}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    lineHeight: 1.35,
                    paddingBottom: "1px",
                  }}
                >
                  {ed.year || ""}
                </div>
              </div>
            ))}
          </MainSection>
        : null}

        {(data.certifications ?? []).length > 0 ?
          <MainSection title="CERTIFICATIONS">
            {(data.certifications ?? []).map((c, idx) => (
              <div
                key={idx}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "7px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: NAVY,
                    flex: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {c.name || ""}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    lineHeight: 1.35,
                    paddingBottom: "1px",
                  }}
                >
                  {[c.issuer, c.year].filter(Boolean).join(" · ")}
                </span>
              </div>
            ))}
          </MainSection>
        : null}
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        breakInside: "avoid",
        pageBreakInside: "avoid",
        marginBottom: "20px",
        display: "block",
      }}
    >
      <div
        style={{
          fontSize: "9px",
          fontWeight: 700,
          color: "#00E5CC",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function MainSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        breakInside: "avoid",
        pageBreakInside: "avoid",
        marginBottom: "22px",
        display: "block",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
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
        <div
          style={{
            height: "2px",
            backgroundColor: "#00E5CC",
            marginTop: "5px",
          }}
        />
      </div>
      {children}
    </div>
  );
}
