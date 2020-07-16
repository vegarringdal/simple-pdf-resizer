const checker = require("fuse-box-typechecker").TypeChecker({
  basePath: "./",
  tsConfigOverride: {
    extends: "./tsconfig.json",
    compilerOptions: {
      rootDirs: ["./src"],
    },
  },
});
checker.printSettings();
const result = checker.inspectOnly();
checker.printOnly(result);

if (
  (result.optionsErrors.length,
  result.globalErrors.length,
  result.syntacticErrors.length,
  result.semanticErrors.length)
) {
  throw "type errors";
}
