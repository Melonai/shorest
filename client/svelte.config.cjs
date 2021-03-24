const sveltePreprocess = require("svelte-preprocess");
const static = require("@sveltejs/adapter-static");
const pkg = require("./package.json");

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: sveltePreprocess(),
    kit: {
        adapter: static(),
        target: "body",
        vite: {
            ssr: {
                noExternal: Object.keys(pkg.dependencies || {}),
            },
        },
    },
};
