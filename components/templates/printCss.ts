import type { CSSProperties } from "react";

/** Prefer keeping blocks intact when printing / rasterizing multi-page CVs */
export const avoidBreak: CSSProperties = {
  breakInside: "avoid",
  pageBreakInside: "avoid",
  WebkitColumnBreakInside: "avoid",
  display: "block",
};

/** Space between major sections (block flow — avoid flex gap) */
export const sectionGap: CSSProperties = {
  marginBottom: "24px",
};
