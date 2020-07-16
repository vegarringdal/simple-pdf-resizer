export interface PageData {
  page: number;
  width: number;
  height: number;
  a4_w: number;
  a4_h: number;
  a3_w: number;
  a3_h: number;
  isLandscape: boolean;
  paperSize: "A4" | "A3";
  scale: number;
}
