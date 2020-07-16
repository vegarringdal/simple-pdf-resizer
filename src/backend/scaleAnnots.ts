import { PDFName, PDFNumber, PDFPage } from "pdf-lib";

// scales the annotations of page
export function scaleAnnots(page: PDFPage, x: number, y: number) {
  // load dependencies

  const annots = page.node.Annots();

  // loop annotations
  annots?.asArray().forEach((ref: any) => {
    //@ts-ignore
    const annot = annots.context.lookup(ref);

    /**
     * PDFName { encodedName: '/Caret' }
     * PDFName { encodedName: '/Circle' }
     * PDFName { encodedName: '/FreeText' }
     * PDFName { encodedName: '/Square' }
     */
    const pdfNameRD = annot.dict.get(PDFName.of("RD"));
    if (pdfNameRD) {
      //@ts-ignore
      pdfNameRD.set(0, new PDFNumber(pdfNameRD.get(0).numberValue * x));
      //@ts-ignore
      pdfNameRD.set(1, new PDFNumber(pdfNameRD.get(1).numberValue * y));
      //@ts-ignore
      pdfNameRD.set(2, new PDFNumber(pdfNameRD.get(2).numberValue * x));
      //@ts-ignore
      pdfNameRD.set(3, new PDFNumber(pdfNameRD.get(3).numberValue * y));
    }

    /**
     * PDFName { encodedName: '/FreeText' }
     */
    const pdfNameCL = annot.dict.get(PDFName.of("CL"));
    if (pdfNameCL) {
      //@ts-ignore
      pdfNameCL.set(0, new PDFNumber(pdfNameCL.get(0).numberValue * x));
      //@ts-ignore
      pdfNameCL.set(1, new PDFNumber(pdfNameCL.get(1).numberValue * y));
      //@ts-ignore
      pdfNameCL.set(2, new PDFNumber(pdfNameCL.get(2).numberValue * x));
      //@ts-ignore
      pdfNameCL.set(3, new PDFNumber(pdfNameCL.get(3).numberValue * y));
      //@ts-ignore
      pdfNameCL.set(4, new PDFNumber(pdfNameCL.get(4).numberValue * x));
      //@ts-ignore
      pdfNameCL.set(5, new PDFNumber(pdfNameCL.get(5).numberValue * y));
    }

    /**
     * PDFName { encodedName: '/Ink' }
     */
    const pdfNameInkList = annot.dict.get(PDFName.of("InkList"));
    if (pdfNameInkList) {
      const length =
        pdfNameInkList?.array && pdfNameInkList?.array[0]?.array?.length;
      if (length) {
        // can there be more then 1? I might need to loop them ?
        const internalArray = pdfNameInkList?.array[0];
        for (let v = 0; v < length; v++) {
          if (v % 2 === 0 || v % 2 === undefined) {
            internalArray.set(
              v,
              //@ts-ignore
              new PDFNumber(internalArray.get(v).numberValue * x)
            );
          } else {
            internalArray.set(
              v,
              //@ts-ignore
              new PDFNumber(internalArray.get(v).numberValue * y)
            );
          }
        }
      }
    }

    /**
     * PDFName { encodedName: '/Polygon' }
     * PDFName { encodedName: '/PolyLine' }
     */
    const pdfNameVertices = annot.dict.get(PDFName.of("Vertices"));
    if (pdfNameVertices) {
      const length = pdfNameVertices?.array?.length;
      if (length) {
        for (let v = 0; v < length; v++) {
          if (v % 2 === 0 || v % 2 === undefined) {
            pdfNameVertices.set(
              v,
              //@ts-ignore
              new PDFNumber(pdfNameVertices.get(v).numberValue * x)
            );
          } else {
            pdfNameVertices.set(
              v,
              //@ts-ignore
              new PDFNumber(pdfNameVertices.get(v).numberValue * y)
            );
          }
        }
      }
    }

    /**
     * PDFName { encodedName: '/Highlight' }
     * PDFName { encodedName: '/StrikeOut' }
     * PDFName { encodedName: '/Underline' }
     */
    const pdfNameQuadPoints = annot.dict.get(PDFName.of("QuadPoints"));
    if (pdfNameQuadPoints) {
      const length = pdfNameQuadPoints?.array?.length;
      if (length) {
        for (let v = 0; v < length; v++) {
          if (v % 2 === 0 || v % 2 === undefined) {
            pdfNameQuadPoints.set(
              v,
              //@ts-ignore
              new PDFNumber(pdfNameQuadPoints.get(v).numberValue * x)
            );
          } else {
            //@ts-ignore
            pdfNameQuadPoints.set(
              v,
              //@ts-ignore
              new PDFNumber(pdfNameQuadPoints.get(v).numberValue * y)
            );
          }
        }
      }
    }

    /**
     * PDFName { encodedName: '/Line' }
     */
    const pdfNameL = annot.dict.get(PDFName.of("L"));
    if (pdfNameL) {
      //@ts-ignore
      pdfNameL.set(0, new PDFNumber(pdfNameL.get(0).numberValue * x));
      //@ts-ignore
      pdfNameL.set(1, new PDFNumber(pdfNameL.get(1).numberValue * y));
      //@ts-ignore
      pdfNameL.set(2, new PDFNumber(pdfNameL.get(2).numberValue * x));
      //@ts-ignore
      pdfNameL.set(3, new PDFNumber(pdfNameL.get(3).numberValue * y));
    }

    /**
     * all...
     */
    const pdfNameRect = annot.dict.get(PDFName.of("Rect"));
    if (pdfNameRect) {
      //@ts-ignore
      pdfNameRect.set(0, new PDFNumber(pdfNameRect.get(0).numberValue * x));
      //@ts-ignore
      pdfNameRect.set(1, new PDFNumber(pdfNameRect.get(1).numberValue * y));
      //@ts-ignore
      pdfNameRect.set(2, new PDFNumber(pdfNameRect.get(2).numberValue * x));
      //@ts-ignore
      pdfNameRect.set(3, new PDFNumber(pdfNameRect.get(3).numberValue * y));
    }

    /**
     * PDFName { encodedName: '/Caret' }
     * PDFName { encodedName: '/FreeText' }
     * PDFName { encodedName: '/Text' }
     * TODO: put in function and add tests...
     */
    const pdfNameRCfontsize = annot.dict.get(PDFName.of("RC"));
    if (pdfNameRCfontsize) {
      const beforeandafter = encodeURI(pdfNameRCfontsize.value).split(
        /font-size:[0-9]*?.?[0-9]*?pt/
      );

      const matches = pdfNameRCfontsize.value.match(
        /font-size:[0-9]*?.?[0-9]*?pt/g
      );
      console.log(matches);
      if (matches?.length) {
        const fontsizes: string[] = [];

        matches.forEach((r: string) => {
          const fontmatches = r.split(/[0-9]*.[0-9]/);

          let value = r;

          fontmatches.forEach((x) => {
            value = value.replace(x, "");
          });
          // @ts-ignore

          value = value.replace(":", "");

          const fontsize = ((value as any) * (1 * x)).toFixed(1);

          fontsizes.push(`${fontmatches[0]}:${fontsize}${fontmatches[2]}`);
        });

        pdfNameRCfontsize.value = "";

        beforeandafter.forEach((x) => {
          pdfNameRCfontsize.value =
            pdfNameRCfontsize.value +
            decodeURI(`${x}${fontsizes.length ? fontsizes.shift() : ""}`);
        });
      }
    }

    /**
     * PDFName { encodedName: '/Caret' }
     * PDFName { encodedName: '/FreeText' }
     * PDFName { encodedName: '/Text' }
     * TODO: put in function and add tests...
     */
    const pdfNameRCLineheight = annot.dict.get(PDFName.of("RC"));
    if (pdfNameRCLineheight) {
      const beforeandafter = encodeURI(pdfNameRCLineheight.value).split(
        /line-height:[0-9]*?.?[0-9]*?pt/
      );

      const matches = pdfNameRCLineheight.value.match(
        /line-height:[0-9]*?.?[0-9]*?pt/g
      );

      if (matches?.length) {
        const fontsizes: string[] = [];

        matches.forEach((r: string) => {
          const fontmatches = r.split(/[0-9]*.[0-9]/);

          let value = r;

          fontmatches.forEach((x) => {
            value = value.replace(x, "");
          });

          value = value.replace(":", "");

          const fontsize = ((value as any) * (1 * x)).toFixed(1);
          fontsizes.push(`${fontmatches[0]}:${fontsize}${fontmatches[2]}`);
        });

        pdfNameRCLineheight.value = "";

        beforeandafter.forEach((x) => {
          pdfNameRCLineheight.value =
            pdfNameRCLineheight.value +
            decodeURI(`${x}${fontsizes.length ? fontsizes.shift() : ""}`);
        });
      }
    }
  });
}
