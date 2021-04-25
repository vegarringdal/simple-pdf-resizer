import { html } from "lit-html";
import { viewState } from "./viewState";

export function detailListCheckbox() {
  const [state, setViewState] = viewState.getState();
  return html`<!-- template -->
    <label class="m-2 p-2 italic text-sm"
      >Show details:<input
        class="m-2 p-2"
        type="checkbox"
        .checked=${state.detailForm}
        @click=${() => {
          state.detailForm = state.detailForm ? false : true;
          setViewState(state);
        }}
    /></label>`;
}

export function showA4Checkbox() {
  const [state, setViewState] = viewState.getState();
  return html`<!-- template -->
    <label class="m-2 p-2 italic text-sm"
      >Show A4:<input
        class="m-2 p-2"
        type="checkbox"
        .checked=${state.showA4}
        @click=${() => {
          state.showA4 = state.showA4 ? false : true;
          setViewState(state);
        }}
      />(${state.a4pages})</label
    >`;
}

export function showA3Checkbox() {
  const [state, setViewState] = viewState.getState();
  return html`<!-- template -->
    <label class="m-2 p-2 italic text-sm"
      >Show A3:<input
        class="m-2 p-2"
        type="checkbox"
        .checked=${state.showA3}
        @click=${() => {
          state.showA3 = state.showA3 ? false : true;
          setViewState(state);
        }}
      />(${state.a3pages})</label
    >`;
}
