import { PDFPage } from "pdf-lib";

// scales the content of the page (not annotations)
export function scaleContent(page: PDFPage, x: number, y: number) {
  // load dependencies
  const { pushGraphicsState, scale, popGraphicsState } = require("pdf-lib");

  page.node.normalize();

  // @ts-ignore
  page.getContentStream();

  // @ts-ignore
  const start = page.createContentStream(pushGraphicsState(), scale(x, y));
  const startRef = page.doc.context.register(start);

  // @ts-ignore
  const end = page.createContentStream(popGraphicsState());
  const endRef = page.doc.context.register(end);

  page.node.wrapContentStreams(startRef, endRef);
}
