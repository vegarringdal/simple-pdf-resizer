import { html } from "lit-html";
import { viewState } from "./viewState";

export function loading() {
  const [state] = viewState.getState();
  return html`
    <span class="m-auto block text-center loader mt-12"></span>
    <span class="m-auto block text-center mt-12">
      ${state.loadingMessage}
    </span>
  `;
}
