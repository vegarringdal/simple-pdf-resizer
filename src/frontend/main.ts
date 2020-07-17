if (process.env.NODE_ENV === "development") {
  require("./developmentTools/hmr");
}
import "./index.css";
import { customElement } from "@simple-html/core";
import { html } from "lit-html";
import {
  detailListCheckbox,
  showA4Checkbox,
  showA3Checkbox,
} from "./checkboxes";
import { detailList } from "./detailList";
import { simplelList } from "./simplelList";
import { actionButtons } from "./actionButtons";
import { loading } from "./loading";
import { PreloadAPI } from "../preload/main";
import { connectViewState, viewState } from "./viewState";

window.document.title = "Simple PDF Resizer v." + process.env.version;

@customElement("app-root")
export class AppRoot extends HTMLElement {
  connectedCallback() {
    this.checkVersion();
    connectViewState(this, this.render);
  }

  render() {
    const [state] = viewState();

    this.resetPageCount();

    if (state.showLoadingScreen) {
      return loading();
    }

    return html`<!-- template -->
      <div class="main-content h-full w-full flex flex-col select-none">
        <!-- top action buttons button -->
        ${actionButtons(this)}

        <!-- file path and pages info -->
        ${state.fileData
          ? html`<div class="p-2 italic text-sm">
              <span class="underline"
                >PDF path: (${state.fileData.pages.length} pages)</span
              >
              <br />
              ${state.fileData.filePath}<br />
            </div>`
          : ""}

        <!--  list of pages  -->
        <div
          class="flex flex-grow flex-col overflow-y-auto  m-2 p-2 ${state.fileData
            ? "border-t border-b bg-gray-100"
            : ""}"
        >
          <ol>
            ${state.fileData?.pages?.map((page, index) => {
              let show = false;
              if (page.paperSize === "A3") {
                show = state.showA3;
              }

              if (page.paperSize === "A4") {
                show = state.showA4;
              }
              if (!show) {
                return "";
              }

              return state.detailForm
                ? detailList(this, page, index)
                : simplelList(this, page, index);
            })}
          </ol>
        </div>

        <!-- botton checkboxes -->
        <div class="flex flex-row">
          ${state.fileData ? detailListCheckbox() : ""}
          ${state.fileData ? showA4Checkbox() : ""}
          ${state.fileData ? showA3Checkbox() : ""}
        </div>

        <div class="flex p-2 italic text-xs tems-center bg-gray-200">
          <span class="text-center flex-1">
            Made by Vegar Ringdal (vegar.ringdal@gmail.com)
          </span>
          <button
            class="ml-3 underline flex-1"
            @click=${() => {
              (window as PreloadAPI).preload.gotoUrl(
                "https://github.com/vegarringdal/simple-pdf-resizer/blob/master/LICENSE"
              );
            }}
          >
            show license
          </button>
        </div>
        ${!state.updateAvailable
          ? ""
          : html`<!-- template -->
              <div class="flex p-2 italic text-xs tems-center bg-orange-200">
                <button
                  class="ml-3 underline flex-1"
                  @click=${() => {
                    (window as PreloadAPI).preload.gotoUrl(
                      "https://github.com/vegarringdal/simple-pdf-resizer/releases"
                    );
                  }}
                >
                  Update available, click here.
                </button>
              </div> `}
      </div> `;
  }

  resetPageCount() {
    // set instance value, do not setViewState... that will bring us into a endless loop
    const [state] = viewState();
    state.a4pages = 0;
    state.a3pages = 0;
    state.fileData?.pages.forEach((p) => {
      if (p.paperSize === "A3") {
        state.a3pages++;
      } else {
        state.a4pages++;
      }
    });
  }

  round(num: number) {
    return num.toFixed(2);
  }

  setLoading(msg: string) {
    const [state] = viewState();
    state.showLoadingScreen = true;
    state.loadingMessage = msg;
  }

  removeLoading() {
    const [state, setViewState] = viewState();
    state.showLoadingScreen = false;
    state.loadingMessage = "";
    setViewState(Object.assign(state, state));
  }

  async selectFileBtn() {
    const [state, setViewState] = viewState();
    this.setLoading(
      "open file selected - will resize when user have pressed save"
    );

    state.fileData = await (window as PreloadAPI).preload.openFileDialog();
    setViewState(Object.assign(state, state));
    this.removeLoading();
  }

  async saveAsBtn() {
    const [state] = viewState();
    this.setLoading(
      "save as selected - will resize when user have pressed save"
    );

    await (window as PreloadAPI).preload.saveAsDialog(state.fileData);
    this.removeLoading();
  }

  async displaySelectedBtn() {
    const [state] = viewState();
    this.setLoading("loading file in background");

    await (window as PreloadAPI).preload.showSelectedBtn(state.fileData);
    this.removeLoading();
  }

  async checkVersion() {
    try {
      const [state, setViewState] = viewState();
      const response = await fetch(
        "https://api.github.com/repos/vegarringdal/simple-pdf-resizer/git/refs/tags"
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        const currentVersion = process.env.version;
        const newestVersion = data[data.length - 1].ref.replace(
          "refs/tags/",
          ""
        );
        if (currentVersion !== newestVersion) {
          state.updateAvailable = true;
          setViewState(Object.assign(state, state));
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async saveToDesktopBtn() {
    const [state] = viewState();
    this.setLoading(
      "save as selected - will resize when user have pressed save"
    );

    await (window as PreloadAPI).preload.saveToDesktopBtn(state.fileData);
    this.removeLoading();
  }
}
