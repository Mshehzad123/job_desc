import type { CvDocument } from "@/lib/types/cv";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "its",
  "may",
  "new",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "boy",
  "did",
  "she",
  "use",
  "her",
  "many",
  "than",
  "them",
  "these",
  "this",
  "that",
  "with",
  "from",
  "have",
  "been",
  "will",
  "your",
  "what",
  "when",
  "which",
  "while",
  "where",
  "would",
  "could",
  "about",
  "after",
  "before",
  "other",
  "some",
  "such",
  "into",
  "than",
  "then",
  "very",
  "just",
  "also",
  "only",
  "come",
  "over",
  "work",
  "year",
  "years",
  "role",
  "job",
  "team",
]);

function tokenizeKeywords(text: string): string[] {
  const lowered = text.toLowerCase();
  const matches = lowered.match(/[a-z0-9][a-z0-9+#.-]{2,}/g) ?? [];
  const unique = new Set<string>();
  for (const w of matches) {
    if (STOPWORDS.has(w)) continue;
    unique.add(w);
  }
  return [...unique];
}

function flattenCvText(cv: CvDocument): string {
  const pi = cv.personalInfo;
  const parts: string[] = [
    pi.name,
    pi.title,
    pi.email,
    pi.phone,
    pi.location,
    pi.linkedin,
    pi.github,
    cv.summary,
    ...(cv.skills.technical ?? []),
    ...(cv.skills.frameworks ?? []),
    ...(cv.skills.tools ?? []),
    ...(cv.skills.soft ?? []),
  ];
  for (const e of cv.experience) {
    parts.push(e.company, e.role, e.duration, e.location, ...(e.bullets ?? []));
  }
  for (const p of cv.projects) {
    parts.push(
      p.name,
      p.description,
      ...(p.techStack ?? []),
      ...(p.highlights ?? []),
      p.link
    );
  }
  for (const ed of cv.education) {
    parts.push(ed.institution, ed.degree, ed.year, ed.gpa);
  }
  for (const c of cv.certifications) {
    parts.push(c.name, c.issuer, c.year);
  }
  return parts.join(" ").toLowerCase();
}

/**
 * Rough match score: share of JD keywords (length ≥3, de-duped) found in generated CV text.
 */
export function computeTailoringScore(
  jobDescription: string,
  cv: CvDocument
): number {
  const keywords = tokenizeKeywords(jobDescription);
  if (keywords.length === 0) return 0;
  const haystack = flattenCvText(cv);
  let hits = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) hits += 1;
  }
  return Math.min(100, Math.round((hits / keywords.length) * 100));
}
