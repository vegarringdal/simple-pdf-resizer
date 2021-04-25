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
single(
  { watch: "./src/frontend/**/*.css" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src/frontend/index.css"],
    outfile: "./dist/frontend/index.css",
    plugins: [postcssPlugin([require("tailwindcss")("./tailwind.config.js")])],
    logLevel: "error",
    incremental: true,
  }
);

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(
  { watch: "./src/preload/**/*.ts" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    plugins: [makeAllPackagesExternalPlugin],
    entryPoints: ["./src/preload/main.ts"],
    outfile: "./dist/preload/main.js",
    minify: false,
    target: "node14",
    bundle: true,
    platform: "node",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  }
);

/**
 * client bundle
 */
client(
  { watch: "./src/frontend/**/*.ts" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
      VERSION: `'${require("./package.json").version}'`,
    },
    entryPoints: ["./src/frontend/main.ts"],
    outfile: "./dist/frontend/main.js",
    minify: false,
    bundle: true,
    platform: "browser",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  }
);

/**
 * index file for project
 */
addDefaultIndex({
  distFolder: "dist/frontend",
  entry: "./main.js",
  publicFolders: [],
  hbr: true,
  webSocketPort: 8080,
  userInjectOnHbr:
    'window.dispatchEvent(new CustomEvent("SIMPLE_HTML_SAVE_STATE"));',
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
       
      </body>
      </html>
      `,
});

/**
 * electron bundle
 */
electron(
  { watch: "./src/backend/**/*.ts", launch: true },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src/backend/main.ts"],
    outfile: "./dist/backend/main.js",
    minify: false,
    target: "node14",
    bundle: true,
    plugins: [makeAllPackagesExternalPlugin],
    platform: "node",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  }
);

const checker_frontend = TypeChecker({
  basePath: "./src/frontend",
  name: "checker_frontend",
  tsConfig: "tsconfig.json",
});

checker_frontend.printSettings();
checker_frontend.inspectAndPrint();
checker_frontend.worker_watch("./");

const checker_preload = TypeChecker({
  basePath: "./src/preload",
  name: "checker_preload",
  tsConfig: "tsconfig.json",
});

checker_preload.printSettings();
checker_preload.inspectAndPrint();
checker_preload.worker_watch("./");

const checker_backend = TypeChecker({
  basePath: "./src/backend",
  name: "checker_backend",
  tsConfig: "tsconfig.json",
});

checker_backend.printSettings();
checker_backend.inspectAndPrint();
checker_backend.worker_watch("./");
