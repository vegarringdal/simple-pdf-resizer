import { applyPolyfill, ReflowStrategy } from "custom-elements-hmr-polyfill";
if (document.body) {
  document.body.innerHTML = "";
  setTimeout(() => {
    document.body.innerHTML = '<app-root class="app-root"></app-root>';
  }, 0);
}

applyPolyfill(ReflowStrategy.NONE);
