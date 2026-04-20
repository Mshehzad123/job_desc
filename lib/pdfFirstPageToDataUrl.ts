/**
 * Renders the first page of a PDF to a PNG data URL (client-only).
 */
export async function pdfFirstPageToDataUrl(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const version = pdfjs.version;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const scale = 2;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context.");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const renderTask = page.render({
    canvasContext: ctx,
    viewport,
  });
  await renderTask.promise;
  return canvas.toDataURL("image/png");
}
