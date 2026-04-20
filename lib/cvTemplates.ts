import type { CVTemplateId } from "@/lib/types/cv";
import { BUILTIN_TEMPLATE_OPTIONS } from "@/templates/built-in";

export type { CVTemplateId };

export const DEFAULT_TEMPLATE: CVTemplateId = "legacy";

export const CV_TEMPLATE_OPTIONS = BUILTIN_TEMPLATE_OPTIONS;
