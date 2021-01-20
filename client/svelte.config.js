const sveltePreprocess = require("svelte-preprocess");
module.exports = {
    preprocess: sveltePreprocess(),
    kit: {
        adapter: "@sveltejs/adapter-static",
        target: "body",
    },
};
