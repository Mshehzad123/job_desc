import { NextResponse } from "next/server";
import {
  createChatCompletion,
  extractJsonFromModelOutput,
  TAILOR_SYSTEM_PROMPT,
} from "@/lib/qwen";
import { normalizeTailoredCv } from "@/lib/cvNormalize";
import type { TailorRequestBody } from "@/lib/types/cv";

export const runtime = "nodejs";

function buildUserContent(
  cvText: string,
  jobDescription: string,
  extraProjects: TailorRequestBody["extraProjects"]
): string {
  const extras =
    extraProjects?.length ?
      extraProjects
        .map(
          (p, i) =>
            `${i + 1}. ${p.name?.trim() || "(no title — infer a professional project name from description + tech)"}\n   Description: ${p.description || ""}\n   Tech: ${p.techStack || ""}\n   Date: ${p.date || ""}`
        )
        .join("\n")
    : "(none provided)";

  return `## Candidate CV (source text)\n${cvText}\n\n## Target job description\n${jobDescription}\n\n## Extra projects / skills to weave in naturally\n${extras}`;
}

export async function POST(req: Request) {
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: QWEN_API_KEY is not set." },
      { status: 500 }
    );
  }

  let body: Partial<TailorRequestBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const cvText = typeof body.cvText === "string" ? body.cvText.trim() : "";
  const jobDescription =
    typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
  const extraProjects = Array.isArray(body.extraProjects) ?
    body.extraProjects
  : [];

  if (!cvText) {
    return NextResponse.json(
      { error: "Please provide your CV text or upload a file first." },
      { status: 400 }
    );
  }
  if (!jobDescription) {
    return NextResponse.json(
      { error: "Please paste the job description." },
      { status: 400 }
    );
  }

  const userContent = buildUserContent(cvText, jobDescription, extraProjects);

  try {
    const raw = await createChatCompletion(apiKey, [
      { role: "system", content: TAILOR_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ]);

    const jsonStr = extractJsonFromModelOutput(raw);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      throw new Error(
        "The model returned text that is not valid JSON. Try running Tailor again, or shorten your CV / job description."
      );
    }
    const tailoredCV = normalizeTailoredCv(parsed);

    return NextResponse.json({ tailoredCV });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Could not generate a tailored CV.";
    if (process.env.NODE_ENV === "development") {
      console.error("[api/tailor]", e);
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
