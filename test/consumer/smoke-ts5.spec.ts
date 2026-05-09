import { afterAll, beforeAll, describe, it } from "vitest";
import {
  buildPackedTarball,
  createTempDir,
  installSdkTarball,
  materializeTsFixture,
  removeDir,
  runCommand,
} from "./harness/runner";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";
const TS5_RANGE = ">=5.5.4 <6";

async function prepareFixtureDir(name: string): Promise<string> {
  const dir = await createTempDir(`bot-sdk-consumer-${name}-`);
  tempDirs.push(dir);
  return dir;
}

afterAll(async () => {
  await Promise.all(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package TS5 consumer smoke", () => {
  beforeAll(async () => {
    tarballPath = await buildPackedTarball(repoRoot);
  });

  it(`runs TS ESM modern lane (${TS5_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts5-esm-modern");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.module.json",
      tsconfigTemplateFile: "tsconfig.nodenext.json",
      tsVersion: TS5_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }, 240_000);

  it(`runs TS CJS modern lane (${TS5_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts5-cjs-modern");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.commonjs.json",
      tsconfigTemplateFile: "tsconfig.nodenext.json",
      tsVersion: TS5_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }, 240_000);

  it(`runs TS CJS legacy lane (${TS5_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts5-cjs-legacy");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.commonjs.json",
      tsconfigTemplateFile: "tsconfig.legacy-commonjs.json",
      tsVersion: TS5_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }, 240_000);

  it(`runs TS bundler compile-only lane (${TS5_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts5-bundler");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.module.json",
      tsconfigTemplateFile: "tsconfig.bundler.json",
      tsVersion: TS5_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
  }, 240_000);
});
