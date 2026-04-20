import type { CvDocument, TailoredCV } from "@/lib/types/cv";

/** Strip AI-only fields before rendering or exporting the CV document. */
export function toCvDocument({ skillGaps, matchScore, ...doc }: TailoredCV): CvDocument {
  void skillGaps;
  void matchScore;
  return doc;
}
