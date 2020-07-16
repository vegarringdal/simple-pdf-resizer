import { PageData } from "../backend/pageData";

export function editScale(pageData: PageData, toPage: "A3" | "A4") {
  if (pageData.paperSize === toPage) {
    // so they act like radio buttons
    if (pageData.paperSize === "A4") {
      pageData.paperSize = "A3";
      toPage = "A3";
    } else {
      pageData.paperSize = "A4";
      toPage = "A4";
    }
  } else {
    pageData.paperSize = toPage;
  }

  const type = toPage;
  const isLandscape = pageData.isLandscape;
  const width = pageData.width;
  const height = pageData.height;
  const a4_h = pageData.a4_h;
  const a4_w = pageData.a4_w;
  const a3_h = pageData.a3_h;
  const a3_w = pageData.a3_w;

  function useScale(widthScale: number, heightScale: number) {
    let scale = 1;
    if (widthScale < heightScale) {
      scale = widthScale;
    } else {
      scale = heightScale;
    }
    pageData.scale = scale;
  }

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
}
