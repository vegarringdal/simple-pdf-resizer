import {
  subscribe,
  unSubscribe,
  disconnectedCallback,
} from "@simple-html/core";
import { validateKey, stateContainer, stateResult } from "@simple-html/core";
import { FileData } from "../backend/fileData";

/**
 * key and validate key, so we know we dont have duplicates
 */
export const STATE_KEY = "VIEW_STATE";
validateKey(STATE_KEY);

/**
 * connect state
 */
export function connectViewState(
  context: HTMLElement,
  callback: () => void
): void {
  // this register callback with simpleHtml elements disconnected callback
  disconnectedCallback(context, () => unSubscribe(STATE_KEY, context));

  // for following the event we just use the internal event handler
  subscribe(STATE_KEY, context, callback);
}

/**
 * function to get state/state setter
 */
export type state = {
  fileData: FileData;
  detailForm: boolean;
  showA4: boolean;
  showA3: boolean;
  a4pages: number;
  a3pages: number;
  showLoadingScreen: boolean;
  loadingMessage: string;
  updateAvailable: boolean;
};
export function viewState(
  defaultValue = {
    fileData: null,
    detailForm: false,
    showA4: true,
    showA3: true,
    a4pages: 0,
    a3pages: 0,
    showLoadingScreen: false,
    loadingMessage: " something awsome",
    updateAvailable: false,
  } as state
): stateResult<state> {
  return stateContainer<state>(STATE_KEY, defaultValue);
}
