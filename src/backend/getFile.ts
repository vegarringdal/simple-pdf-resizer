import * as fs from "fs";
import { PDFDocument } from "pdf-lib";

export async function getFile(filePath: string) {
  const uint8Array = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(uint8Array);
  return pdfDoc;
}
