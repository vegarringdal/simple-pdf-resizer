import {
  clearFolders,
  addDefaultIndex,
  electron,
  client,
  makeAllPackagesExternalPlugin,
  postcssPlugin,
  single,
  TypeChecker,
} from "esbuild-helpers";

clearFolders("dist/backend", "dist/frontend", "dist/preload");

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(null, {
  color: true,
  define: {
    DEVELOPMENT: "false",
  },
  entryPoints: ["./src/frontend/index.css"],
  outfile: "./dist/frontend/index.css",
  plugins: [postcssPlugin([require("tailwindcss")("./tailwind.config.js")])],
  logLevel: "error",
  incremental: false,
});

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(null, {
  color: true,
  define: {
    DEVELOPMENT: "false",
  },
  plugins: [makeAllPackagesExternalPlugin],
  entryPoints: ["./src/preload/main.ts"],
  outfile: "./dist/preload/main.js",
  minify: true,
  target: "node14",
  bundle: true,
  platform: "node",
  sourcemap: false,
  logLevel: "error",
  incremental: false,
});

/**
 * client bundle
 */
client(null, {
  color: true,
  define: {
    DEVELOPMENT: "false",
    VERSION: `'${require("./package.json").version}'`,
  },
  entryPoints: ["./src/frontend/main.ts"],
  outfile: "./dist/frontend/main.js",
  minify: true,
  bundle: true,
  platform: "browser",
  sourcemap: false,
  logLevel: "error",
  incremental: false,
});

/**
 * index file for project
 */
addDefaultIndex({
  distFolder: "dist/frontend",
  entry: "./main.js",
  publicFolders: [],
  hbr: false,
  indexTemplate: /*html*/ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link href="./index.css" rel="stylesheet" />
       
        $bundle
      </head>
      <body>
        <app-root class="app-root"></app-root>
      </body>
      </html>
      `,
});

/**
 * electron bundle
 */
electron(null, {
  color: true,
  define: {
    DEVELOPMENT: "true",
  },
  entryPoints: ["./src/backend/main.ts"],
  outfile: "./dist/backend/main.js",
  minify: true,
  target: "node14",
  bundle: true,
  plugins: [makeAllPackagesExternalPlugin],
  platform: "node",
  sourcemap: false,
  logLevel: "error",
  incremental: false,
});

const checker_frontend = TypeChecker({
  basePath: "./src/frontend",
  name: "checker_frontend",
  tsConfig: "tsconfig.json",
});

checker_frontend.printSettings();
checker_frontend.inspectAndPrint();

const checker_preload = TypeChecker({
  basePath: "./src/preload",
  name: "checker_preload",
  tsConfig: "tsconfig.json",
});

checker_preload.printSettings();
checker_preload.inspectAndPrint();

const checker_backend = TypeChecker({
  basePath: "./src/backend",
  name: "checker_backend",
  tsConfig: "tsconfig.json",
});

checker_backend.printSettings();
checker_backend.inspectAndPrint();
