import type { CvDocument } from "@/lib/types/cv";
import { MeridianLayout } from "@/components/templates/MeridianLayout";
import { a4Outer } from "@/components/templates/a4Shell";

export function MeridianTemplate({ data }: { data: CvDocument }) {
  return (
    <div id="cv-tailor-print" data-template="meridian" className="mx-auto bg-white shadow-lg" style={{ ...a4Outer }}>
      <div
        style={{
          padding: "48px 56px",
          backgroundColor: "#ffffff",
          display: "block",
          boxSizing: "border-box",
        }}
      >
        <MeridianLayout data={data} />
      </div>
    </div>
  );
}
