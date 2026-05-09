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
const TS6_RANGE = ">=6.0.0 <7";
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
    tsVersion: TS6_RANGE,
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

describe("dual package TS6 consumer contract", () => {
  beforeAll(async () => {
    tarballPath = await buildPackedTarball(repoRoot);
  });

  it(
    `runs TS ESM modern lane (${TS6_RANGE})`,
    async () => {
      await runTsLane({
        fixtureName: "ts6-esm-modern",
        packageTemplateFile: "package.module.json",
        tsconfigTemplateFile: "tsconfig.nodenext.json",
        withRuntime: true,
      });
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS modern lane (${TS6_RANGE})`,
    async () => {
      await runTsLane({
        fixtureName: "ts6-cjs-modern",
        packageTemplateFile: "package.commonjs.json",
        tsconfigTemplateFile: "tsconfig.nodenext.json",
        withRuntime: true,
      });
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS bundler compile-only lane (${TS6_RANGE})`,
    async () => {
      await runTsLane({
        fixtureName: "ts6-bundler",
        packageTemplateFile: "package.module.json",
        tsconfigTemplateFile: "tsconfig.bundler.json",
        withRuntime: false,
      });
    },
    TS_TIMEOUT_MS,
  );
});
