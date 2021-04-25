import { AppRoot } from "./main";
import { PageData } from "../backend/pageData";
import { html } from "lit-html";
import { editScale } from "./editScale";
import { viewState } from "./viewState";

export function simplelList(ctx: AppRoot, page: PageData, index: number) {
  const [state, setViewState] = viewState.getState();
  return html`<!-- template -->
    <li class="flex flex-row ${index ? "mt-4" : ""} border-b">
      <h1 class="font-semibold mr-5 ">Page ${page.page}:</h1>
      <div class="flex-1">
        <span class="italic ">Current Scale:</span>
        <span class="font-semibold">${ctx.round(page.scale)}</span>
      </div>

      <div class="flex-1">
        <span class="italic ">Paper Size:</span>
        <span class="font-semibold">
          <label class="m-1 p-1 pr-1"
            >A4<input
              class="m-1 p-1 pr-1"
              type="checkbox"
              .checked=${page.paperSize === "A4" ? true : false}
              @click=${() => {
                editScale(page, "A4");
                setViewState(state);
              }}
          /></label>
          <label class="m-1 p-1 pr-1"
            >A3<input
              class="m-1 p-1 pr-1"
              type="checkbox"
              .checked=${page.paperSize === "A3" ? true : false}
              @click=${() => {
                editScale(page, "A3");
                setViewState(state);
              }}
            />
          </label>
        </span>
      </div>
    </li>`;
}
