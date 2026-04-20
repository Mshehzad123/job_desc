/**
 * Resolve display titles for CV projects when the model or user leaves name blank
 * or uses generic placeholders.
 */

function isGenericProjectName(name: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n) return true;
  if (/^untitled(\s+project)?$/i.test(n)) return true;
  if (/^project\s*(\d+)?$/i.test(n)) return true;
  if (/^(n\/a|na|tbd|\.\.\.|…|-+)$/i.test(n)) return true;
  return false;
}

function titleCasePhrase(s: string): string {
  const small = new Set(["a", "an", "the", "and", "or", "of", "to", "in", "for", "with", "from"]);
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && small.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

/** Short readable title from the opening sentence when no pattern matches */
function titleFromOpening(description: string, maxLen = 72): string {
  const oneLine = description.replace(/\s+/g, " ").trim();
  if (!oneLine) return "Professional project";
  const first = oneLine.split(/(?<=[.!?])\s+/)[0]?.trim() || oneLine;
  const truncated =
    first.length > maxLen ? `${first.slice(0, Math.max(0, maxLen - 1)).trim()}…` : first;
  return titleCasePhrase(truncated);
}

/**
 * Infer a resume-style project title from free text (description + optional tech hints).
 */
export function inferProjectTitleFromDescription(description: string, techStack: string[] = []): string {
  const d = description.replace(/\s+/g, " ").trim();
  const techLower = techStack.map((t) => t.toLowerCase()).join(" ");
  const blob = `${d} ${techLower}`.toLowerCase();

  if (!d && techStack.length) {
    const top = techStack
      .filter(Boolean)
      .slice(0, 3)
      .map((t) => t.trim())
      .join(" · ");
    return top ? `${top} project` : "Professional project";
  }
  if (!d) return "Professional project";

  const rules: [RegExp, string][] = [
    [/full[\s-]?stack|end[\s-]to[\s-]end|responsive\s+frontend.*backend|frontend.*restful?\s+backend/i, "Full-stack web application"],
    [/restful?\s+(api|backend)|rest\s+api/i, "REST API & backend project"],
    [/responsive\s+(web\s+)?(ui|frontend|design)/i, "Responsive web frontend"],
    [/machine\s+learning|\brag\b|llm|deep\s+learning/i, "ML / intelligent application"],
    [/e[\s-]?commerce|online\s+store|shopping\s+cart/i, "E-commerce application"],
    [/mobile\s+(app|application)|react\s+native|flutter/i, "Mobile application"],
    [/dashboard|analytics\s+portal|admin\s+panel/i, "Analytics & dashboard application"],
    [/microservices|kubernetes|\bk8s\b/i, "Distributed / microservices platform"],
    [/real[\s-]?time|websocket/i, "Real-time application"],
    [/cloud\s+deployment|\baws\b|\bazure\b|\bgcp\b|serverless/i, "Cloud-deployed application"],
    [/docker|container/i, "Containerized application"],
    [/design\s+system|component\s+library/i, "Design system & UI library"],
  ];

  for (const [re, title] of rules) {
    if (re.test(blob)) return title;
  }

  return titleFromOpening(d);
}

export function resolveProjectDisplayName(rawName: string, description: string, techStack: string[] = []): string {
  const name = rawName.trim();
  if (name && !isGenericProjectName(name)) return name;
  return inferProjectTitleFromDescription(description, techStack);
}
