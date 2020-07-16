import * as path from "path";
import * as fs from "fs";
import { PDFDocument } from "pdf-lib";
import { app } from "electron";

export async function saveResizedPDF(
  pdfDoc: PDFDocument,
  filename: string,
  saveAsPath?: string
) {
  const pdfBytes = await pdfDoc.save();
  if (!saveAsPath) {
    const filepath = path.resolve(
      app.getPath("desktop"),
      `./${filename}-${new Date().getTime()}.pdf`
    );
    fs.writeFileSync(filepath, pdfBytes);
    return filepath;
  } else {
    fs.writeFileSync(saveAsPath, pdfBytes);
    return saveAsPath;
  }
}
