import "./index.css";
import { customElement } from "@simple-html/core";
import { html } from "lit-html";
import { FileData } from "../backend/fileData";
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

if (process.env.NODE_ENV === "development") {
  require("./developmentTools/hmr");
}

window.document.title = "Simple PDF Resizer v." + process.env.version;

@customElement("app-root")
export class AppRoot extends HTMLElement {
  fileData: FileData;
  detailForm = false;
  showA4 = true;
  showA3 = true;
  a4pages = 0;
  a3pages = 0;
  showLoadingScreen = false;
  loadingMessage: string = " something awsome";
  updateAvailable: boolean;

  constructor() {
    super();
    this.checkVersion();
  }

  render() {
    this.resetPageCount();

    if (this.showLoadingScreen) {
      return loading(this);
    }

    return html`<!-- template -->
      <div class="main-content h-full w-full flex flex-col select-none">
        <!-- top action buttons button -->
        ${actionButtons(this)}

        <!-- file path and pages info -->
        ${this.fileData
          ? html`<div class="p-2 italic text-sm">
              <span class="underline"
                >PDF path: (${this.fileData.pages.length} pages)</span
              >
              <br />
              ${this.fileData.filePath}<br />
            </div>`
          : ""}

        <!--  list of pages  -->
        <div
          class="flex flex-grow flex-col overflow-y-auto  m-2 p-2 ${this
            .fileData
            ? "border-t border-b bg-gray-100"
            : ""}"
        >
          <ol>
            ${this.fileData?.pages?.map((page, index) => {
              let show = false;
              if (page.paperSize === "A3") {
                show = this.showA3;
              }

              if (page.paperSize === "A4") {
                show = this.showA4;
              }
              if (!show) {
                return "";
              }

              return this.detailForm
                ? detailList(this, page, index)
                : simplelList(this, page, index);
            })}
          </ol>
        </div>

        <!-- botton checkboxes -->
        <div class="flex flex-row">
          ${this.fileData ? detailListCheckbox(this) : ""}
          ${this.fileData ? showA4Checkbox(this) : ""}
          ${this.fileData ? showA3Checkbox(this) : ""}
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
        ${!this.updateAvailable
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
    this.a4pages = 0;
    this.a3pages = 0;
    this.fileData?.pages.forEach((p) => {
      if (p.paperSize === "A3") {
        this.a3pages++;
      } else {
        this.a4pages++;
      }
    });
  }

  round(num: number) {
    return num.toFixed(2);
  }

  setLoading(msg: string) {
    this.showLoadingScreen = true;
    this.loadingMessage = msg;
    this.render();
  }

  removeLoading() {
    this.showLoadingScreen = false;
    this.loadingMessage = "";
    this.render();
  }

  async selectFileBtn() {
    this.setLoading(
      "open file selected - will resize when user have pressed save"
    );

    this.fileData = await (window as PreloadAPI).preload.openFileDialog();
    this.removeLoading();
  }

  async saveAsBtn() {
    this.setLoading(
      "save as selected - will resize when user have pressed save"
    );

    await (window as PreloadAPI).preload.saveAsDialog(this.fileData);
    this.removeLoading();
  }

  async displaySelectedBtn() {
    this.setLoading("loading file in background");

    await (window as PreloadAPI).preload.showSelectedBtn(this.fileData);
    this.removeLoading();
  }

  async checkVersion() {
    try {
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
          this.updateAvailable = true;
          this.render();
        }
      }

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async saveToDesktopBtn() {
    this.setLoading(
      "save as selected - will resize when user have pressed save"
    );

    await (window as PreloadAPI).preload.saveToDesktopBtn(this.fileData);
    this.removeLoading();
  }
}
