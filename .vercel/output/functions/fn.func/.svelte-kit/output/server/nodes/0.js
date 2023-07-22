

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.63fde850.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.0719bd3d.js"];
export const stylesheets = ["_app/immutable/assets/0.6cd137be.css"];
export const fonts = ["_app/immutable/assets/fa-solid-900.7152a693.woff2","_app/immutable/assets/fa-solid-900.67a65763.ttf","_app/immutable/assets/fa-regular-400.8e7e5ea1.woff2","_app/immutable/assets/fa-regular-400.528d022d.ttf"];
