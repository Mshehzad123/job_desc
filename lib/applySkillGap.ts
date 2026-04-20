import type { TailoredCV } from "@/lib/types/cv";

/** Strip parenthetical notes so "Express.js (explicit...)" → "Express.js" */
export function cleanSkillLabel(raw: string): string {
  const noParen = raw.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const collapsed = noParen.replace(/\s+/g, " ").trim();
  return collapsed || raw.trim();
}

function hasSimilarSkill(list: string[], skill: string): boolean {
  const s = skill.toLowerCase();
  return list.some((x) => {
    const xl = x.toLowerCase();
    return xl === s || xl.includes(s) || s.includes(xl);
  });
}

/** Add suggested skill to technical skills, remove from gaps, nudge match score. */
export function applySkillGapToCv(cv: TailoredCV, gapRaw: string): TailoredCV {
  const label = cleanSkillLabel(gapRaw);
  if (!label) return cv;

  const technical = [...(cv.skills?.technical ?? [])];
  if (!hasSimilarSkill(technical, label)) {
    technical.push(label);
  }

  const skillGaps = (cv.skillGaps ?? []).filter((g) => {
    const cleaned = cleanSkillLabel(g);
    return cleaned.toLowerCase() !== label.toLowerCase();
  });

  return {
    ...cv,
    skills: {
      ...cv.skills,
      technical,
    },
    skillGaps,
    matchScore: Math.min(100, (cv.matchScore ?? 0) + 2),
  };
}
