import { afterAll, beforeAll, describe, it } from "vitest";
import {
  buildPackedTarball,
  createTempDir,
  installSdkTarball,
  materializeTsFixture,
  removeDir,
  runCommand,
} from "./runner";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";
const TS5_VERSION = "5.9.3";
const TS_TIMEOUT_MS = 240_000;

async function prepareFixtureDir(name: string): Promise<string> {
  const dir = await createTempDir(`bot-sdk-consumer-${name}-`);
  tempDirs.push(dir);
  return dir;
}

interface TsLaneConfig {
  readonly fixtureName: string;
  readonly packageTemplateFile: "package.module.json" | "package.commonjs.json";
  readonly tsconfigTemplateFile:
    | "tsconfig.nodenext.json"
    | "tsconfig.legacy-commonjs.json"
    | "tsconfig.bundler.json";
  readonly withRuntime: boolean;
}

async function runTsLane(config: TsLaneConfig): Promise<void> {
  const fixtureDir = await prepareFixtureDir(config.fixtureName);
  await materializeTsFixture({
    repoRoot,
    outDir: fixtureDir,
    packageTemplateFile: config.packageTemplateFile,
    tsconfigTemplateFile: config.tsconfigTemplateFile,
    tsVersion: TS5_VERSION,
  });

  installSdkTarball(fixtureDir, tarballPath);
  runCommand(fixtureDir, "npm", ["run", "build"]);
  if (config.withRuntime) {
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }
}

afterAll(async () => {
  await Promise.all(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package TS5 consumer contract", () => {
  beforeAll(async () => {
    const packOutDir = await prepareFixtureDir("ts5-pack");
    tarballPath = await buildPackedTarball(repoRoot, packOutDir);
  });

  it(
    `runs TS ESM modern lane (${TS5_VERSION})`,
    async () => {
      await runTsLane({
        fixtureName: "ts5-esm-modern",
        packageTemplateFile: "package.module.json",
        tsconfigTemplateFile: "tsconfig.nodenext.json",
        withRuntime: true,
      });
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS modern lane (${TS5_VERSION})`,
    async () => {
      await runTsLane({
        fixtureName: "ts5-cjs-modern",
        packageTemplateFile: "package.commonjs.json",
        tsconfigTemplateFile: "tsconfig.nodenext.json",
        withRuntime: true,
      });
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS legacy lane (${TS5_VERSION})`,
    async () => {
      await runTsLane({
        fixtureName: "ts5-cjs-legacy",
        packageTemplateFile: "package.commonjs.json",
        tsconfigTemplateFile: "tsconfig.legacy-commonjs.json",
        withRuntime: true,
      });
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS bundler compile-only lane (${TS5_VERSION})`,
    async () => {
      await runTsLane({
        fixtureName: "ts5-bundler",
        packageTemplateFile: "package.module.json",
        tsconfigTemplateFile: "tsconfig.bundler.json",
        withRuntime: false,
      });
    },
    TS_TIMEOUT_MS,
  );
});
