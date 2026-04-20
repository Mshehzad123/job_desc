import type {
  CertificationItem,
  ExperienceItem,
  PersonalInfo,
  ProjectItem,
  TailoredCV,
} from "@/lib/types/cv";
import { resolveProjectDisplayName } from "@/lib/projectTitle";

function asMatchScore(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function asString(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => asString(x)).filter(Boolean);
}

/** Accept legacy single string tech stack from older model output */
function asStringArrayOrLegacyString(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => asString(x)).filter(Boolean);
  if (typeof v === "string" && v.trim()) {
    return v
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizePersonalInfo(raw: unknown): PersonalInfo {
  const pi =
    raw && typeof raw === "object" ?
      (raw as Record<string, unknown>)
    : {};
  return {
    name: asString(pi.name),
    title: asString(pi.title),
    email: asString(pi.email),
    phone: asString(pi.phone),
    location: asString(pi.location),
    linkedin: asString(pi.linkedin),
    github: asString(pi.github),
  };
}

function normalizeExperience(raw: unknown[]): ExperienceItem[] {
  return raw.map((item) => {
    const e =
      item && typeof item === "object" ?
        (item as Record<string, unknown>)
      : {};
    return {
      company: asString(e.company),
      role: asString(e.role),
      duration: asString(e.duration),
      location: asString(e.location),
      bullets: asStringArray(e.bullets),
    };
  });
}

function normalizeProjects(raw: unknown[]): ProjectItem[] {
  return raw.map((item) => {
    const p =
      item && typeof item === "object" ?
        (item as Record<string, unknown>)
      : {};
    const description = asString(p.description);
    const techStack = asStringArrayOrLegacyString(p.techStack);
    return {
      name: resolveProjectDisplayName(asString(p.name), description, techStack),
      description,
      techStack,
      highlights: asStringArray(p.highlights),
      link: asString(p.link),
    };
  });
}

function normalizeCertifications(raw: unknown): CertificationItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") {
      return { name: item.trim(), issuer: "", year: "" };
    }
    const c =
      item && typeof item === "object" ?
        (item as Record<string, unknown>)
      : {};
    return {
      name: asString(c.name),
      issuer: asString(c.issuer),
      year: asString(c.year),
    };
  }).filter((c) => c.name || c.issuer || c.year);
}

export function normalizeTailoredCv(raw: unknown): TailoredCV {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI returned invalid JSON structure.");
  }
  const o = raw as Record<string, unknown>;

  const skillsRaw = o.skills;
  const skillsObj =
    skillsRaw && typeof skillsRaw === "object" ?
      (skillsRaw as Record<string, unknown>)
    : {};

  const experienceRaw = Array.isArray(o.experience) ? o.experience : [];
  const projectsRaw = Array.isArray(o.projects) ? o.projects : [];
  const educationRaw = Array.isArray(o.education) ? o.education : [];

  const education = educationRaw.map((item) => {
    const e =
      item && typeof item === "object" ?
        (item as Record<string, unknown>)
      : {};
    return {
      institution: asString(e.institution),
      degree: asString(e.degree),
      year: asString(e.year),
      gpa: asString(e.gpa),
    };
  });

  const skillGaps = asStringArray(o.skillGaps);

  return {
    personalInfo: normalizePersonalInfo(o.personalInfo),
    summary: asString(o.summary),
    skills: {
      technical: asStringArray(skillsObj.technical),
      frameworks: asStringArray(skillsObj.frameworks),
      tools: asStringArray(skillsObj.tools),
      soft: asStringArray(skillsObj.soft),
    },
    experience: normalizeExperience(experienceRaw),
    projects: normalizeProjects(projectsRaw),
    education,
    certifications: normalizeCertifications(o.certifications),
    skillGaps,
    matchScore: asMatchScore(o.matchScore),
  };
}
