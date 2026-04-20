/** International (Singapore) DashScope compatible OpenAI endpoint; override via env if your key uses another region. */
const DEFAULT_COMPATIBLE_BASE =
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

function compatibleApiBase(): string {
  const fromEnv =
    typeof process !== "undefined" ?
      process.env.QWEN_COMPATIBLE_API_BASE?.trim()
    : "";
  return fromEnv || DEFAULT_COMPATIBLE_BASE;
}

export const TAILOR_SYSTEM_PROMPT = `You are a world-class CV writer and ATS optimization specialist. Your output must be a single valid JSON object — no markdown, no code fences, no explanation, just raw JSON.

You will receive the candidate's CV text, a job description, and optional extra projects/skills.

Your task: Rewrite the CV completely tailored to the job description.

RULES:
- Read the JD carefully. Extract every key skill, technology, responsibility, and keyword from it.
- Rewrite the professional summary to directly address what the JD is looking for (3-4 sentences).
- Reorder experience bullets to lead with most JD-relevant achievements.
- Every bullet must follow: [Strong Action Verb] + [Specific Task] + [Measurable Result].
- Add JD keywords naturally into bullets — do not keyword-stuff.
- Group skills by category and order each group by JD relevance.
- Insert extra projects provided by user in the projects section naturally.
- PROJECT NAMES (critical): Every item in "projects" must have a concrete, professional "name" field (roughly 3–10 words). If the user left the title blank but wrote a description, derive a specific title from that description (e.g. full-stack + REST + cloud → "Full-stack web application with cloud deployment"). NEVER use "Untitled Project", "Untitled", "Project", or any placeholder title — infer a meaningful name from the description and tech stack.
- Never fabricate — only rephrase, reorder, and strengthen real content.
- Professional title in personalInfo must match the JD role exactly.

INTELLIGENT SKILL GAP FILLING:
- After reading the JD, identify ALL skills, technologies, tools, and keywords mentioned in it.
- Compare them against the candidate's CV.
- For any JD requirement NOT found in the CV, apply this logic:

  RULE 1 - INFER FROM CONTEXT:
  If the missing skill is closely related to skills the candidate already has, add it intelligently.
  Examples:
  - Candidate has Python + ML experience → JD needs 'scikit-learn' → Add it to skills (any Python ML engineer would know this)
  - Candidate has React experience → JD needs 'Next.js' → Add it (natural extension)
  - Candidate has LLM/AI experience → JD needs 'LangChain' or 'RAG' → Add it
  - Candidate has cloud experience → JD needs specific cloud tool → Add it if related

  RULE 2 - ADD TO SKILLS SECTION ONLY:
  Never add fabricated experience bullets. Only add inferred skills to the skills/frameworks/tools sections.
  Do not write experience bullets claiming the candidate used a tool they never mentioned.

  RULE 3 - STRENGTHEN EXISTING BULLETS:
  If a JD keyword maps to something the candidate DID do but didn't name explicitly, rename it.
  Example: Candidate wrote 'built recommendation system' → JD needs 'collaborative filtering' → Rewrite bullet to mention collaborative filtering.

  RULE 4 - FLAG HONEST GAPS:
  For skills that cannot be reasonably inferred from candidate's background, do NOT add them.
  Instead, add a separate JSON field called 'skillGaps' which is an array of strings listing skills the JD requires that could not be inferred.
  Example: 'skillGaps': ['Kubernetes', 'Terraform'] — these will be shown to the user as suggestions to learn/add manually.

  RULE 5 - MATCH SCORE:
  Add a 'matchScore' field (0-100 integer) representing how well the tailored CV matches the JD.
  Calculate: (JD keywords found or inferred in CV / total JD keywords) * 100

Output this exact JSON structure (all fields required, use empty string or empty array if data not available):
{
  "personalInfo": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "skills": {
    "technical": [],
    "frameworks": [],
    "tools": [],
    "soft": []
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "location": "",
      "bullets": []
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": [],
      "highlights": [],
      "link": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "year": "",
      "gpa": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "year": ""
    }
  ],
  "skillGaps": ["skill1", "skill2"],
  "matchScore": 85
}`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface QwenChatCompletionResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
}

export async function createChatCompletion(
  apiKey: string,
  messages: ChatMessage[],
  options?: { temperature?: number }
): Promise<string> {
  const base = compatibleApiBase().replace(/\/$/, "");
  let res: Response;
  try {
    res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages,
        temperature: options?.temperature ?? 0.35,
      }),
    });
  } catch (err) {
    const hint =
      err instanceof Error ?
        err.message
      : "Network error";
    throw new Error(
      `Could not reach Qwen API (${hint}). Check your connection, firewall, and that QWEN_COMPATIBLE_API_BASE matches your DashScope region.`
    );
  }

  const rawText = await res.text();
  let data: QwenChatCompletionResponse;
  try {
    data = JSON.parse(rawText) as QwenChatCompletionResponse;
  } catch {
    throw new Error(
      `Qwen returned non-JSON (HTTP ${res.status}): ${rawText.slice(0, 280)}`
    );
  }

  if (!res.ok) {
    const msg =
      data.error?.message ??
      (rawText.length > 0 ? rawText.slice(0, 400) : `HTTP ${res.status}`);
    throw new Error(`Qwen API: ${msg}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error(
      "Empty assistant message from Qwen. Try again or shorten CV/JD length."
    );
  }

  return content;
}

/** Strip markdown code fences if the model wraps JSON in \`\`\` blocks */
export function extractJsonFromModelOutput(raw: string): string {
  const s = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/im;
  const m = s.match(fence);
  if (m?.[1]) {
    return m[1].trim();
  }
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return s.slice(start, end + 1);
  }
  return s;
}
