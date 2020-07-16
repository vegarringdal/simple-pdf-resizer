import { AppRoot } from "./main";
import { html } from "lit-html";

export function loading(ctx: AppRoot) {
  return html`
    <span class="m-auto block text-center loader mt-12"></span>
    <span class="m-auto block text-center mt-12">
      ${ctx.loadingMessage}
    </span>
  `;
}
