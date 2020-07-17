import { AppRoot } from "./main";
import { PageData } from "../backend/pageData";
import { html } from "lit-html";
import { editScale } from "./editScale";
import { viewState } from "./viewState";

export function detailList(ctx: AppRoot, page: PageData, index: number) {
  const [state, setViewState] = viewState();
  return html`<!-- template -->
    <li class="flex flex-col ${index ? "mt-4" : ""}">
      <h1 class="font-semibold b-1 border-b ">
        Page ${page.page}:
      </h1>
      <div class="flex flex-row">
        <div class="flex-1 italic ">Original width:</div>
        <div class="flex-1 font-semibold">${page.width}</div>
      </div>
      <div class="flex">
        <div class="flex-1 italic ">Original height:</div>
        <div class="flex-1 font-semibold">${page.height}</div>
      </div>
      <div class="flex">
        <div class="flex-1 italic ">Is landscape:</div>
        <div class="flex-1 font-semibold">${page.isLandscape}</div>
      </div>
      <div class="flex">
        <div class="flex-1 italic ">Paper Size:</div>
        <div class="flex-1 font-semibold">
          <label class="mr-1 pr-1"
            >A4:<input
              class="m-1 p-1 pr-1"
              type="checkbox"
              .checked=${page.paperSize === "A4" ? true : false}
              @click=${() => {
                editScale(page, "A4");
                setViewState(state);
              }}
          /></label>
          <label class="m-1 p-1 pr-1"
            >A3:<input
              class="m-1 p-1 pr-1"
              type="checkbox"
              .checked=${page.paperSize === "A3" ? true : false}
              @click=${() => {
                editScale(page, "A3");
                setViewState(state);
              }}
          /></label>
        </div>
      </div>
      <div class="flex">
        <div class="flex-1 italic">Current Scale:</div>
        <div class="flex-1 font-semibold">
          ${ctx.round(page.scale)}
        </div>
      </div>
    </li>`;
}
