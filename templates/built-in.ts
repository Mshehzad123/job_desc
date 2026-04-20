import type { CVTemplateId } from "@/lib/types/cv";

export const BUILTIN_TEMPLATE_OPTIONS: Array<{
  id: CVTemplateId;
  name: string;
  blurb: string;
  preview: string;
  accentBar: string;
}> = [
  {
    id: "atlas",
    name: "Atlas",
    blurb: "Two-column · Executive",
    preview: "Dark sidebar with teal accents; structured for dense executive CVs.",
    accentBar: "linear-gradient(90deg, #0f172a 30%, #00E5CC 100%)",
  },
  {
    id: "meridian",
    name: "Meridian",
    blurb: "Single column · Clean white",
    preview: "Minimal single-column layout with teal section rails.",
    accentBar: "linear-gradient(90deg, #ffffff 0%, #00E5CC 100%)",
  },
  {
    id: "vertex",
    name: "Vertex",
    blurb: "Dark header · Engineering",
    preview: "Slate header, monospace skills, timeline experience.",
    accentBar: "linear-gradient(90deg, #0f172a 0%, #00E5CC 100%)",
  },
  {
    id: "noir",
    name: "Noir",
    blurb: "Black luxury · Gold accent",
    preview: "Black sidebar with gold trim; cream main column.",
    accentBar: "linear-gradient(90deg, #000000 0%, #C9A84C 100%)",
  },
  {
    id: "frost",
    name: "Frost",
    blurb: "Minimal · Blue accent",
    preview: "Ultra-clean white with blue borders and pill skills.",
    accentBar: "linear-gradient(90deg, #EFF6FF 0%, #2563EB 100%)",
  },
  {
    id: "carbon",
    name: "Carbon",
    blurb: "Dark mode · Full bleed",
    preview: "Bold full-dark CV tuned for tech and engineering roles.",
    accentBar: "linear-gradient(90deg, #0f0f0f 0%, #00E5CC 100%)",
  },
  {
    id: "slate",
    name: "Slate",
    blurb: "Classic Corporate · B&W",
    preview: "Traditional centered header, clean sections. Best for formal/government/corporate roles.",
    accentBar: "#000000",
  },
  {
    id: "prism",
    name: "Prism",
    blurb: "Creative split · Gradient",
    preview: "Gradient header band with two-column skills and story.",
    accentBar: "linear-gradient(90deg, #0f172a 0%, #00E5CC 50%, #1e3a5f 100%)",
  },
  {
    id: "quantum",
    name: "Quantum",
    blurb: "Startup · Accent blocks",
    preview: "Modern cards, teal highlights; optional JD match badge.",
    accentBar: "linear-gradient(90deg, #f0fffe 0%, #00E5CC 100%)",
  },
  {
    id: "legacy",
    name: "Legacy",
    blurb: "Premium executive · 10+ years",
    preview: "Two-column premium layout for senior IC and leadership profiles.",
    accentBar: "linear-gradient(90deg, #1a1a2e 0%, #00E5CC 40%, rgba(255,215,0,0.6) 100%)",
  },
];
