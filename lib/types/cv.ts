export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  techStack: string[];
  highlights: string[];
  link: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  gpa: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

/** CV content only — safe for PDF/DOCX and print (no AI meta fields). */
export interface CvDocument {
  personalInfo: PersonalInfo;
  summary: string;
  skills: {
    technical: string[];
    frameworks: string[];
    tools: string[];
    soft: string[];
  };
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

/** Full API payload including match metadata (not shown on CV paper). */
export interface TailoredCV extends CvDocument {
  skillGaps?: string[];
  matchScore?: number;
}

export interface ExtraProjectInput {
  id: string;
  name: string;
  description: string;
  techStack: string;
  date: string;
}

export interface TailorRequestBody {
  cvText: string;
  jobDescription: string;
  extraProjects: Omit<ExtraProjectInput, "id">[];
}

export type CVTemplateId =
  | "atlas"
  | "meridian"
  | "vertex"
  | "noir"
  | "frost"
  | "carbon"
  | "slate"
  | "prism"
  | "quantum"
  | "legacy";
