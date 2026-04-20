/** Must load before `pdf-parse` so pdfjs gets Node canvas + DOMMatrix polyfills (Vercel / serverless). */
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export type CvFileKind = "pdf" | "docx" | "doc" | "txt";

export function detectKindFromFilename(filename: string): CvFileKind | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "docx";
  if (ext === "doc") return "doc";
  if (ext === "txt") return "txt";
  return null;
}

export async function extractCvText(
  buffer: Buffer,
  kind: CvFileKind
): Promise<string> {
  switch (kind) {
    case "pdf": {
      const parser = new PDFParse({
        data: new Uint8Array(buffer),
        CanvasFactory,
      });
      try {
        const textResult = await parser.getText();
        return normalizeWhitespace(textResult.text ?? "");
      } finally {
        await parser.destroy();
      }
    }
    case "txt":
      return normalizeWhitespace(buffer.toString("utf-8"));
    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return normalizeWhitespace(result.value ?? "");
    }
    case "doc":
      throw new Error(
        "Legacy Microsoft Word (.doc) is not supported. Please save your file as .docx or export to PDF."
      );
    default:
      throw new Error("Unsupported file type.");
  }
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ").trim();
}
