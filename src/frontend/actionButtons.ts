import { AppRoot } from "./main";
import { html } from "lit-html";

export function actionButtons(ctx: AppRoot) {
  return html`<div class="flex">
    <button class="flex-1 p-2 m-2 bg-indigo-400" @click=${ctx.selectFileBtn}>
      Select PDF
    </button>

    <button
      class="flex-1 p-2 m-2 bg-indigo-400 ${ctx.fileData ? "" : "opacity-50"}"
      ?disabled=${ctx.fileData ? false : true}
      @click=${ctx.displaySelectedBtn}
    >
      Show selected
    </button>

    <button
      class="flex-1 p-2 m-2 bg-indigo-400 ${ctx.fileData ? "" : "opacity-50"}"
      ?disabled=${ctx.fileData ? false : true}
      @click=${ctx.saveToDesktopBtn}
    >
      Save to desktop
    </button>

    <button
      class="flex-1 p-2 m-2 bg-indigo-400 ${ctx.fileData ? "" : "opacity-50"}"
      ?disabled=${ctx.fileData ? false : true}
      @click=${ctx.saveAsBtn}
    >
      Save as
    </button>
  </div>`;
}
