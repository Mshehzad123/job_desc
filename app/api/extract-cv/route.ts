import { NextResponse } from "next/server";
import {
  detectKindFromFilename,
  extractCvText,
} from "@/lib/cvParser";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const name =
    file instanceof File && file.name ? file.name : "document";
  const kind = detectKindFromFilename(name);

  if (!kind) {
    return NextResponse.json(
      {
        error:
          "Unsupported file type. Please upload a .pdf, .docx, .doc, or .txt file.",
      },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());

  try {
    const text = await extractCvText(buf, kind);
    if (!text.trim()) {
      return NextResponse.json(
        {
          error:
            "No readable text was found in this file. Try another format or paste your CV text manually.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text,
      filename: name,
      kind,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to extract text.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
