const {
  fusebox,
  sparky,
  pluginPostCSS,
  pluginMinifyHtmlLiterals,
} = require("fuse-box");
const { pluginTypeChecker } = require("fuse-box-typechecker");

process.env.password = process.argv[3];
const debugMain = process.argv[3];
console.log(process.argv);

class Context {
  isProduction;
  runServer;

  process(name, prod, isFrontEnd) {
    // default config
    const config = {
      target: "server",
      entry: `src/${name}/main.ts`,
      env: { production: prod, version: require("./package.json").version },
      watcher: {
        enabled: !prod,
        include: [`./src/${name}`],
        ignored: ["dist"],
      },
      sourceMap: prod ? false : { vendor: true },
      useSingleBundle: isFrontEnd ? false : true,
      dependencies: { ignoreAllExternal: true },
      logging: { level: "succinct" },
      plugins: [
        pluginTypeChecker({
          name: name,
          basePath: `./src/${name}`,
          tsConfig: "../../tsconfig",
        }),
      ],
      cache: {
        enabled: !prod,
        root: `.cache/${name}`,
      },
    };

    // overide target and add more plugins/dev server for hmr & hmr
    // only used by frontend
    if (isFrontEnd) {
      config.target = "browser";
      config.plugins.push(
        pluginPostCSS(/\.css$/, {
          stylesheet: {
            postCSS: {
              plugins: [
                require("tailwindcss")("./tailwindcss.config.js"),
                require("autoprefixer"),
              ],
            },
          },
        })
      );

      if (prod) {
        config.plugins.push(pluginMinifyHtmlLiterals());
      }
      // dev server
      config.devServer = {
        httpServer: false,
        hmrServer: prod ? false : { port: 7878 },
      };

      config.hmr = prod
        ? false
        : { plugin: `./src/frontend/developmentTools/fuseHmrPlugin.ts` };

      config.webIndex = {
        publicPath: "./",
        template: `src/frontend/developmentTools/index.html`,
      };
    }

    return fusebox(config);
  }
}

async function runBuild(ctx, production) {
  const FRONTEND_BUNDLE_NAME = "frontend";
  const FRONTEND_PRELOAD_BUNDLE_NAME = "preload";
  const BACKEND_BUNDLE_NAME = "backend";
  const PRODUCTION = production;

  let mainServer;

  /**
   * Helper to restart
   */
  function updated(name, output) {
    if (name === BACKEND_BUNDLE_NAME) {
      mainServer = output;
    }

    if (name === FRONTEND_PRELOAD_BUNDLE_NAME) {
      mainServer?.electron.stop();
    }

    if (mainServer) {
      if (debugMain === "debug") {
        mainServer.electron.start({ argsBefore: ["--inspect-brk"] });
      } else {
        mainServer.electron.start();
      }
    }
  }

  /**
   * This is the process running front end
   */
  const frontend = ctx.process(FRONTEND_BUNDLE_NAME, PRODUCTION, true, true);
  if (production) {
    await frontend.runProd({
      bundles: { distRoot: `dist/${FRONTEND_BUNDLE_NAME}`, app: "main.js" },
    });
  } else {
    await frontend.runDev({
      bundles: { distRoot: `dist/${FRONTEND_BUNDLE_NAME}`, app: "main.js" },
    });
  }

  // get other if any
  await src(`./resources/**/*.*`)
    .dest(`dist/${FRONTEND_BUNDLE_NAME}`, `resources`)
    .exec();

  {
    /**
     * This is the process running frontend preload
     * in our case only for sending massage to server
     */
    const frontendPreload = ctx.process(
      FRONTEND_PRELOAD_BUNDLE_NAME,
      PRODUCTION,
      false
    );
    if (production) {
      await frontendPreload.runProd({
        bundles: {
          distRoot: `dist/${FRONTEND_PRELOAD_BUNDLE_NAME}`,
          app: "main.js",
        },
      });
    } else {
      const { onWatch } = await frontendPreload.runDev({
        bundles: {
          distRoot: `dist/${FRONTEND_PRELOAD_BUNDLE_NAME}`,
          app: "main.js",
        },
      });

      onWatch((output) => {
        updated(FRONTEND_PRELOAD_BUNDLE_NAME, output);
      });
    }
  }

  {
    /**
     * This is the process running backend
     * Backend runs electron window/menus etc
     */
    const backend = ctx.process(BACKEND_BUNDLE_NAME, PRODUCTION, false);

    if (production) {
      await backend.runProd({
        bundles: { distRoot: `dist/${BACKEND_BUNDLE_NAME}`, app: "main.js" },
      });
    } else {
      const { onComplete } = await backend.runDev({
        bundles: { distRoot: `dist/${BACKEND_BUNDLE_NAME}`, app: "main.js" },
      });

      onComplete((output) => {
        updated(BACKEND_BUNDLE_NAME, output);
      });
    }
  }
}

const { task, rm, src } = sparky(Context);

task("default", async (ctx) => {
  await rm("./dist");
  await rm("./.cache");

  await runBuild(ctx, false);
});

task("dist", async (ctx) => {
  await rm("./dist");
  await rm("./.cache");

  await runBuild(ctx, true);
});
