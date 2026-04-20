import type { CSSProperties } from "react";

const font = 'var(--font-inter), Inter, sans-serif';

/** Single-column CV root */
export const a4Outer: CSSProperties = {
  display: "block",
  width: "794px",
  minHeight: "1123px",
  height: "auto",
  maxWidth: "100%",
  fontFamily: font,
  boxSizing: "border-box",
  position: "relative",
  isolation: "isolate",
  overflowX: "hidden",
  overflowY: "visible",
};

/** Two-column CV root — table layout for stable columns in print/PDF */
export const a4TwoColumnRoot: CSSProperties = {
  display: "table",
  tableLayout: "fixed",
  width: "794px",
  minHeight: "1123px",
  height: "auto",
  maxWidth: "100%",
  fontFamily: font,
  boxSizing: "border-box",
  borderCollapse: "collapse",
  position: "relative",
  isolation: "isolate",
  overflowX: "hidden",
  overflowY: "visible",
};

export function tableCellSidebar(widthPx: number, extra: CSSProperties = {}): CSSProperties {
  return {
    display: "table-cell",
    width: `${widthPx}px`,
    verticalAlign: "top",
    boxSizing: "border-box",
    ...extra,
  };
}

export function tableCellMain(extra: CSSProperties = {}): CSSProperties {
  return {
    display: "table-cell",
    verticalAlign: "top",
    width: "auto",
    boxSizing: "border-box",
    ...extra,
  };
}
