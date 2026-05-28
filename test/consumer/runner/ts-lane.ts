import {
  installSdkTarball,
  materializeTsFixture,
  prepareFixtureDir,
  runCommand,
} from "./index";

export interface TsLaneConfig {
  readonly fixtureName: string;
  readonly packageTemplateFile: "package.module.json" | "package.commonjs.json";
  readonly tsconfigTemplateFile: string;
  readonly withRuntime: boolean;
}

export interface TsLaneRunContext {
  readonly repoRoot: string;
  readonly tarballPath: string;
  readonly tsVersion: string;
  readonly tempDirs: string[];
}

export async function runTsLane(
  context: TsLaneRunContext,
  config: TsLaneConfig,
): Promise<void> {
  const fixtureDir = await prepareFixtureDir(
    context.tempDirs,
    config.fixtureName,
  );
  await materializeTsFixture({
    repoRoot: context.repoRoot,
    outDir: fixtureDir,
    packageTemplateFile: config.packageTemplateFile,
    tsconfigTemplateFile: config.tsconfigTemplateFile,
    tsVersion: context.tsVersion,
  });

  installSdkTarball(fixtureDir, context.tarballPath);
  runCommand(fixtureDir, "npm", ["run", "build"]);
  if (config.withRuntime) {
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }
}
