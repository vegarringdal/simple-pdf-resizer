import { PDFDocument } from "pdf-lib";
import { scaleAnnots } from "./scaleAnnots";
import { scaleContent } from "./scaleContent";
import { FileData } from "./fileData";

export async function resizeFile(pdfDoc: PDFDocument, parseData: FileData) {
  // load dependencies
  const pages = pdfDoc.getPages();

  pages.forEach((page, index) => {
    const pageData = parseData.pages[index];
    const scale = pageData.scale;
    const isLandscape = pageData.isLandscape;
    const type = pageData.paperSize;
    const a4_h = pageData.a4_h;
    const a4_w = pageData.a4_w;
    const a3_h = pageData.a3_h;
    const a3_w = pageData.a3_w;

    scaleContent(page, scale, scale);

    function setPage(x: number, y: number) {
      page.setSize(x, y);
    }

    // scale annotations
    scaleAnnots(page, scale, scale);

    // set actual page size
    if (isLandscape && type === "A4") {
      setPage(a4_h, a4_w);
    }

    if (isLandscape && type === "A3") {
      setPage(a3_h, a3_w);
    }

    if (!isLandscape && type === "A4") {
      setPage(a4_w, a4_h);
    }

    if (!isLandscape && type === "A3") {
      setPage(a3_w, a3_h);
    }
  });
}
