"use client";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { CvDocument } from "@/lib/types/cv";

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function downloadCvPdfFromElement(
  element: HTMLElement,
  filename = "tailored-cv.pdf",
  options?: { backgroundColor?: string }
): Promise<void> {
  const tpl = element.getAttribute("data-template");
  const bg =
    options?.backgroundColor ??
    (tpl === "carbon" ? "#0f0f0f" : "#ffffff");

  const prev = {
    height: element.style.height,
    minHeight: element.style.minHeight,
    maxHeight: element.style.maxHeight,
    overflow: element.style.overflow,
  };

  element.style.height = "auto";
  element.style.minHeight = "auto";
  element.style.maxHeight = "none";
  element.style.overflow = "visible";

  await new Promise<void>((r) => setTimeout(r, 300));

  const w = Math.min(element.scrollWidth, 794);
  const h = element.scrollHeight;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: bg,
    logging: false,
    width: w,
    height: h,
    windowWidth: w,
    windowHeight: h,
    scrollX: 0,
    scrollY: 0,
  });

  element.style.height = prev.height;
  element.style.minHeight = prev.minHeight;
  element.style.maxHeight = prev.maxHeight;
  element.style.overflow = prev.overflow;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;
  let page = 1;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = -(pdfHeight * page);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    page += 1;
  }

  pdf.save(filename);
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `• ${text}`, size: 22 })],
    spacing: { after: 80 },
    indent: { left: 360 },
  });
}

function addHeading(title: string): Paragraph {
  return new Paragraph({
    text: title.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}

export async function downloadCvDocx(
  cv: CvDocument,
  filename = "tailored-cv.docx"
): Promise<void> {
  const pi = cv.personalInfo;
  const children: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: pi.name || "Candidate", bold: true, size: 36 }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
  ];

  if (pi.title) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: pi.title, size: 24, italics: true, bold: true }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      })
    );
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: [pi.email, pi.phone, pi.location].filter(Boolean).join(" · "),
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  const social: string[] = [];
  if (pi.linkedin) social.push(`LinkedIn: ${pi.linkedin}`);
  if (pi.github) social.push(`GitHub: ${pi.github}`);
  if (social.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: social.join(" · "), size: 20 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  if (cv.summary?.trim()) {
    children.push(addHeading("Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: cv.summary.trim(), size: 22 })],
        spacing: { after: 200 },
      })
    );
  }

  const sk = cv.skills;
  if (
    sk.technical?.length ||
    sk.frameworks?.length ||
    sk.tools?.length ||
    sk.soft?.length
  ) {
    children.push(addHeading("Skills"));
    const rows: Array<{ label: string; items: string[] }> = [
      { label: "Technical", items: sk.technical ?? [] },
      { label: "Frameworks", items: sk.frameworks ?? [] },
      { label: "Tools", items: sk.tools ?? [] },
      { label: "Soft", items: sk.soft ?? [] },
    ];
    for (const row of rows) {
      if (!row.items.length) continue;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${row.label}: `, bold: true, size: 22 }),
            new TextRun({ text: row.items.join(", "), size: 22 }),
          ],
          spacing: { after: 120 },
        })
      );
    }
  }

  if (cv.experience?.length) {
    children.push(addHeading("Experience"));
    for (const exp of cv.experience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.role}${exp.company ? ` — ${exp.company}` : ""}`,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 40 },
        })
      );
      const meta = [exp.duration, exp.location].filter(Boolean).join(" · ");
      if (meta) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: meta, italics: true, size: 20 })],
            spacing: { after: 80 },
          })
        );
      }
      for (const b of exp.bullets ?? []) {
        if (b?.trim()) children.push(bulletParagraph(b.trim()));
      }
      children.push(new Paragraph({ spacing: { after: 160 } }));
    }
  }

  if (cv.projects?.length) {
    children.push(addHeading("Projects"));
    for (const p of cv.projects) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name || "Project", bold: true, size: 24 }),
          ],
          spacing: { after: 60 },
        })
      );
      if (p.description?.trim()) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: p.description.trim(), size: 22 })],
            spacing: { after: 80 },
          })
        );
      }
      if ((p.techStack ?? []).length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Stack: ${(p.techStack ?? []).join(", ")}`,
                italics: true,
                size: 20,
              }),
            ],
            spacing: { after: 80 },
          })
        );
      }
      for (const h of p.highlights ?? []) {
        if (h?.trim()) children.push(bulletParagraph(h.trim()));
      }
      if (p.link?.trim()) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: p.link.trim(), size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  if (cv.education?.length) {
    children.push(addHeading("Education"));
    for (const e of cv.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${e.degree}${e.institution ? ` — ${e.institution}` : ""}`,
              bold: true,
              size: 22,
            }),
          ],
          spacing: { after: 40 },
        })
      );
      const line = [e.year, e.gpa].filter(Boolean).join(" · ");
      if (line) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  if (cv.certifications?.length) {
    children.push(addHeading("Certifications"));
    for (const c of cv.certifications) {
      const line = [c.name, c.issuer, c.year].filter(Boolean).join(" — ");
      if (line.trim()) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${line}`, size: 22 })],
            spacing: { after: 80 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, filename);
}
