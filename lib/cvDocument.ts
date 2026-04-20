import type { CvDocument, TailoredCV } from "@/lib/types/cv";

/** Strip AI-only fields before rendering or exporting the CV document. */
export function toCvDocument(cv: TailoredCV): CvDocument {
  const { skillGaps: _g, matchScore: _m, ...doc } = cv;
  return doc;
}
