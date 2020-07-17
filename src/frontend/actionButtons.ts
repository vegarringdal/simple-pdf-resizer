import { AppRoot } from "./main";
import { html } from "lit-html";
import { viewState } from "./viewState";

export function actionButtons(ctx: AppRoot) {
  const [state] = viewState();
  return html`<div class="flex">
    <button class="flex-1 p-2 m-2 bg-indigo-400" @click=${ctx.selectFileBtn}>
      Select PDF
    </button>

    <button
      class="flex-1 p-2 m-2 bg-indigo-400 ${state.fileData ? "" : "opacity-50"}"
      ?disabled=${state.fileData ? false : true}
      @click=${ctx.displaySelectedBtn}
    >
      Show selected
    </button>

    <button
      class="flex-1 p-2 m-2 bg-indigo-400 ${state.fileData ? "" : "opacity-50"}"
      ?disabled=${state.fileData ? false : true}
      @click=${ctx.saveToDesktopBtn}
    >
      Save to desktop
    </button>

    <button
      class="flex-1 p-2 m-2 bg-indigo-400 ${state.fileData ? "" : "opacity-50"}"
      ?disabled=${state.fileData ? false : true}
      @click=${ctx.saveAsBtn}
    >
      Save as
    </button>
  </div>`;
}
