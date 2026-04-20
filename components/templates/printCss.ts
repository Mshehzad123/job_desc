import type { CSSProperties } from "react";

/** WebKit column break — vendor key not in @types/react `CSSProperties`; spread into `style`. */
export const webkitColumnBreakInsideAvoid = {
  WebkitColumnBreakInside: "avoid",
} as CSSProperties;

/** Prefer keeping blocks intact when printing / rasterizing multi-page CVs */
export const avoidBreak = {
  breakInside: "avoid",
  pageBreakInside: "avoid",
  ...webkitColumnBreakInsideAvoid,
  display: "block",
} as CSSProperties;

/** Space between major sections (block flow — avoid flex gap) */
export const sectionGap: CSSProperties = {
  marginBottom: "24px",
};
