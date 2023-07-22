import { c as create_ssr_component } from "../../chunks/ssr.js";
const styles = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-pkk0so{position:relative}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app"><main class="svelte-pkk0so">${slots.default ? slots.default({}) : ``}</main>  </div>`;
});
export {
  Layout as default
};
