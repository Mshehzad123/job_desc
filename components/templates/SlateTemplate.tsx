import type { CvDocument } from "@/lib/types/cv";
import { webkitColumnBreakInsideAvoid } from "@/components/templates/printCss";

export function SlateTemplate({ data }: { data: CvDocument }) {
  const pi = data.personalInfo ?? {};

  const contactParts = [pi.location, pi.phone, pi.email, pi.linkedin, pi.github].filter(Boolean);

  return (
    <div
      id="cv-tailor-print"
      data-template="slate"
      style={{
        display: "block",
        width: "794px",
        maxWidth: "794px",
        minHeight: "1123px",
        height: "auto",
        backgroundColor: "#ffffff",
        fontFamily: "'Times New Roman', Georgia, serif",
        padding: "56px 44px",
        boxSizing: "border-box",
        overflow: "visible",
        color: "#000000",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px", breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid }}>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#000000",
            marginBottom: "4px",
          }}
        >
          {pi.name || ""}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#222222",
            marginBottom: "8px",
          }}
        >
          {pi.title || ""}
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "#444444",
            lineHeight: 1.6,
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {contactParts.join(" • ")}
        </div>
      </div>

      <div style={{ borderTop: "2px solid #000000", marginBottom: "3px" }} />
      <div style={{ borderTop: "1px solid #000000", marginBottom: "20px" }} />

      {data.summary?.trim() ?
        <div style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, marginBottom: "20px", display: "block" }}>
          <SlateSectionHeader title="SUMMARY" />
          <p
            style={{
              fontSize: "12px",
              color: "#222222",
              lineHeight: 1.8,
              margin: 0,
              textAlign: "justify",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {data.summary.trim()}
          </p>
        </div>
      : null}

      {(data.experience ?? []).length > 0 ?
        <div style={{ marginBottom: "20px", display: "block" }}>
          <SlateSectionHeader title="WORK EXPERIENCE" />
          {(data.experience ?? []).map((exp, idx) => (
            <div key={idx} style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, marginBottom: "16px", display: "block" }}>
              <div style={{ display: "table", width: "100%", maxWidth: "100%", tableLayout: "fixed" }}>
                <span
                  style={{
                    display: "table-cell",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#000000",
                    minWidth: 0,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {exp.role || ""}
                </span>
                <span
                  style={{
                    display: "table-cell",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#000000",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "150px",
                    lineHeight: 1.35,
                    paddingBottom: "1px",
                    verticalAlign: "top",
                  }}
                >
                  {exp.duration || ""}
                </span>
              </div>
              <div style={{ display: "table", width: "100%", maxWidth: "100%", tableLayout: "fixed", marginBottom: "6px" }}>
                <span
                  style={{
                    display: "table-cell",
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "#333333",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {exp.company || ""}
                  {exp.location ? ` | ${exp.location}` : ""}
                </span>
              </div>
              {(exp.bullets ?? []).map((b, i) =>
                b?.trim() ?
                  <div
                    key={i}
                    style={{
                      display: "table",
                      width: "100%",
                      maxWidth: "100%",
                      fontSize: "12px",
                      color: "#222222",
                      lineHeight: 1.7,
                      marginTop: "4px",
                      paddingLeft: "8px",
                    }}
                  >
                    <span style={{ display: "table-cell", width: "16px", verticalAlign: "top" }}>•</span>
                    <span style={{ display: "table-cell", textAlign: "justify", wordBreak: "break-word", overflowWrap: "break-word", maxWidth: "100%" }}>
                      {b.trim()}
                    </span>
                  </div>
                : null
              )}
            </div>
          ))}
        </div>
      : null}

      {(data.projects ?? []).length > 0 ?
        <div style={{ marginBottom: "20px", display: "block" }}>
          <SlateSectionHeader title="PROJECTS" />
          {(data.projects ?? []).map((p, idx) => (
            <div key={idx} style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, marginBottom: "14px", display: "block" }}>
              <div style={{ display: "table", width: "100%", maxWidth: "100%", tableLayout: "fixed", marginBottom: "4px" }}>
                <span style={{ display: "table-cell", fontSize: "12px", fontWeight: 700, color: "#000000", minWidth: 0, wordBreak: "break-word", overflowWrap: "anywhere" }}>{p.name || ""}</span>
                {p.link ?
                  <span style={{ display: "table-cell", width: "150px", textAlign: "right", fontSize: "11px", color: "#555555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.35, paddingBottom: "1px", verticalAlign: "top" }}>
                    {p.link}
                  </span>
                : null}
              </div>
              {p.description?.trim() ?
                <p style={{ fontSize: "12px", color: "#333333", lineHeight: 1.7, margin: "4px 0", textAlign: "justify", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {p.description.trim()}
                </p>
              : null}
              {(p.techStack ?? []).length > 0 ?
                <p style={{ fontSize: "11px", color: "#444444", fontStyle: "italic", margin: "4px 0", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  Technologies: {(p.techStack ?? []).join(", ")}
                </p>
              : null}
              {(p.highlights ?? []).map((h, i) =>
                h?.trim() ?
                  <div
                    key={i}
                    style={{
                      display: "table",
                      width: "100%",
                      maxWidth: "100%",
                      fontSize: "12px",
                      color: "#222222",
                      lineHeight: 1.7,
                      paddingLeft: "8px",
                      marginTop: "3px",
                    }}
                  >
                    <span style={{ display: "table-cell", width: "16px", verticalAlign: "top" }}>•</span>
                    <span style={{ display: "table-cell", wordBreak: "break-word", overflowWrap: "break-word", maxWidth: "100%" }}>{h.trim()}</span>
                  </div>
                : null
              )}
            </div>
          ))}
        </div>
      : null}

      {(data.education ?? []).length > 0 ?
        <div style={{ marginBottom: "20px", display: "block" }}>
          <SlateSectionHeader title="EDUCATION" />
          {(data.education ?? []).map((ed, idx) => (
            <div key={idx} style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, marginBottom: "10px", display: "block" }}>
              <div style={{ display: "table", width: "100%", maxWidth: "100%", tableLayout: "fixed" }}>
                <span style={{ display: "table-cell", fontSize: "12px", fontWeight: 700, color: "#000000" }}>{ed.degree || ""}</span>
                <span
                  style={{
                    display: "table-cell",
                    width: "150px",
                    textAlign: "right",
                    fontSize: "11px",
                    color: "#444444",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.35,
                    paddingBottom: "1px",
                    verticalAlign: "top",
                  }}
                >
                  {ed.year || ""}
                </span>
              </div>
              <div style={{ fontSize: "12px", fontStyle: "italic", color: "#333333" }}>
                {ed.institution || ""}
                {ed.gpa ? ` — GPA: ${ed.gpa}` : ""}
              </div>
            </div>
          ))}
        </div>
      : null}

      {data.skills ?
        <div style={{ marginBottom: "20px", display: "block" }}>
          <SlateSectionHeader title="SKILLS" />
          {[
            { label: "Technical", items: data.skills.technical },
            { label: "Frameworks", items: data.skills.frameworks },
            { label: "Tools", items: data.skills.tools },
            { label: "Soft Skills", items: data.skills.soft },
          ]
            .filter((s) => s.items?.length)
            .map((section, idx) => (
              <div key={idx} style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, marginBottom: "6px", display: "table", width: "100%", maxWidth: "100%", tableLayout: "fixed" }}>
                <span style={{ display: "table-cell", width: "110px", fontSize: "12px", fontWeight: 700, color: "#000000", verticalAlign: "top" }}>
                  {section.label}:
                </span>
                <span style={{ display: "table-cell", fontSize: "12px", color: "#222222", lineHeight: 1.7, wordBreak: "break-word", overflowWrap: "anywhere" }}>{section.items?.join(", ")}</span>
              </div>
            ))}
        </div>
      : null}

      {(data.certifications ?? []).length > 0 ?
        <div style={{ display: "block" }}>
          <SlateSectionHeader title="CERTIFICATIONS" />
          {(data.certifications ?? []).map((c, idx) => (
            <div key={idx} style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, display: "table", width: "100%", maxWidth: "100%", tableLayout: "fixed", marginBottom: "6px" }}>
              <span style={{ display: "table-cell", fontSize: "12px", fontWeight: 700, color: "#000000" }}>{c.name || ""}</span>
              <span
                style={{
                  display: "table-cell",
                  width: "150px",
                  textAlign: "right",
                  fontSize: "11px",
                  color: "#555555",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.35,
                  paddingBottom: "1px",
                  verticalAlign: "top",
                }}
              >
                {[c.issuer, c.year].filter(Boolean).join(" · ")}
              </span>
            </div>
          ))}
        </div>
      : null}
    </div>
  );
}

function SlateSectionHeader({ title }: { title: string }) {
  return (
    <div style={{ breakInside: "avoid", pageBreakInside: "avoid", ...webkitColumnBreakInsideAvoid, marginBottom: "10px", display: "block" }}>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#000000",
          paddingBottom: "4px",
        }}
      >
        {title}
      </div>
      <div style={{ borderTop: "1px solid #000000" }} />
    </div>
  );
}
