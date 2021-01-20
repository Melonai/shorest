// Consult https://www.snowpack.dev to learn about these options
module.exports = {
    extends: "@sveltejs/snowpack-config",
    plugins: ["@snowpack/plugin-typescript"],
    mount: {
        "src/components": "/_components",
        "src/actions": "/_actions",
        "src/data": "/_data",
        "src/utils": "/_utils",
    },
    alias: {
        $components: "./src/components",
        $actions: "./src/actions",
        $data: "./src/data",
        $utils: "./src/utils",
    },
};
