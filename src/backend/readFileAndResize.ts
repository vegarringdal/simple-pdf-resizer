import { FileData } from "./fileData";
import { getFile } from "./getFile";
import { saveResizedPDF } from "./saveResizedPDF";
import { resizeFile } from "./resizeFile";

export async function readFileAndResize(
  parseData: FileData,
  saveAsPath?: string
) {
  const pdfDoc = await getFile(parseData.filePath);
  resizeFile(pdfDoc, parseData);
  const newFilePath = saveResizedPDF(pdfDoc, parseData.filename, saveAsPath);
  return newFilePath;
}
