import { AppRoot } from "./main";
import { html } from "lit-html";

export function detailListCheckbox(ctx: AppRoot) {
  return html`<!-- template -->
    <label class="m-2 p-2 italic text-sm"
      >Show details:<input
        class="m-2 p-2"
        type="checkbox"
        .checked=${ctx.detailForm}
        @click=${() => {
          ctx.detailForm = ctx.detailForm ? false : true;
          ctx.render();
        }}
    /></label>`;
}

export function showA4Checkbox(ctx: AppRoot) {
  return html`<!-- template -->
    <label class="m-2 p-2 italic text-sm"
      >Show A4:<input
        class="m-2 p-2"
        type="checkbox"
        .checked=${ctx.showA4}
        @click=${() => {
          ctx.showA4 = ctx.showA4 ? false : true;
          ctx.render();
        }}
      />(${ctx.a4pages})</label
    >`;
}

export function showA3Checkbox(ctx: AppRoot) {
  return html`<!-- template -->
    <label class="m-2 p-2 italic text-sm"
      >Show A3:<input
        class="m-2 p-2"
        type="checkbox"
        .checked=${ctx.showA3}
        @click=${() => {
          ctx.showA3 = ctx.showA3 ? false : true;
          ctx.render();
        }}
      />(${ctx.a3pages})</label
    >`;
}
