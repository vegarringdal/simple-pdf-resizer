import { PDFDocument, PageSizes } from "pdf-lib";
import { PageData } from "./pageData";
import { FileData } from "./fileData";
import * as path from "path";

export function parsePDF(pdfDoc: PDFDocument, filePath: string) {
  const pages = pdfDoc.getPages();

  const parseData: FileData = {
    filePath,
    filename: path.basename(filePath).replace(".pdf", ""),
    pages: [],
  };

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const [a4_w, a4_h] = PageSizes.A4;
    const [a3_w, a3_h] = PageSizes.A3;

    const pageData: PageData = {
      page: index + 1,
      width,
      height,
      a4_w,
      a4_h,
      a3_w,
      a3_h,
      isLandscape: true,
      paperSize: "A4",
      scale: 1,
    };

    // find out if its portrait or lanscape
    let isLandscape = true;
    if (width < height) {
      isLandscape = false;
      pageData.isLandscape = isLandscape;
    }

    let type: "A4" | "A3" = null;

    // find paper size
    if (isLandscape) {
      if (width <= a4_h || (width > a4_h && width < a3_h - 50)) {
        type = "A4";
      }
      if (width >= a3_h - 50) {
        type = "A3";
      }
    } else {
      if (width <= a4_w || (width > a4_w && width < a3_w - 50)) {
        type = "A4";
      }
      if (width >= a3_w - 50) {
        type = "A3";
      }
    }

    pageData.paperSize = type;

    let scale: number = 1;

    function useScale(widthScale: number, heightScale: number) {
      if (widthScale < heightScale) {
        scale = widthScale;
      } else {
        scale = heightScale;
      }
      pageData.scale = scale;
    }

    // based on paper and if its landscape or portrait
    // we want to use the highest scale so it fits within paper
    if (isLandscape && type === "A4") {
      const wscale = a4_h / width;
      const hscale = a4_w / height;
      useScale(wscale, hscale);
    }

    if (isLandscape && type === "A3") {
      const wscale = a3_h / width;
      const hscale = a3_w / height;
      useScale(wscale, hscale);
    }

    if (!isLandscape && type === "A4") {
      const wscale = a4_w / width;
      const hscale = a4_h / height;
      useScale(wscale, hscale);
    }

    if (!isLandscape && type === "A3") {
      const wscale = a3_w / width;
      const hscale = a3_h / height;
      useScale(wscale, hscale);
    }

    parseData.pages.push(pageData);
  });

  return parseData;
}
