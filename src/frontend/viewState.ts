import { ObjectState } from "@simple-html/core";
import { FileData } from "../backend/fileData";

/**
 * key and validate key, so we know we dont have duplicates
 */
export const STATE_KEY = "VIEW_STATE";

/**
 * function to get state/state setter
 */
export type state = {
  fileData: FileData | null;
  detailForm: boolean;
  showA4: boolean;
  showA3: boolean;
  a4pages: number;
  a3pages: number;
  showLoadingScreen: boolean;
  loadingMessage: string;
  updateAvailable: boolean;
};

export const viewState = new ObjectState<state>(STATE_KEY, {
  fileData: null,
  detailForm: false,
  showA4: true,
  showA3: true,
  a4pages: 0,
  a3pages: 0,
  showLoadingScreen: false,
  loadingMessage: " something awsome",
  updateAvailable: false,
});
