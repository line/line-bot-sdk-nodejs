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
const TS6_RANGE = ">=6.0.0 <7";

async function prepareFixtureDir(name: string): Promise<string> {
  const dir = await createTempDir(`bot-sdk-consumer-${name}-`);
  tempDirs.push(dir);
  return dir;
}

afterAll(async () => {
  await Promise.all(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package TS6 consumer smoke", () => {
  beforeAll(async () => {
    tarballPath = await buildPackedTarball(repoRoot);
  });

  it(`runs TS ESM modern lane (${TS6_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts6-esm-modern");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.module.json",
      tsconfigTemplateFile: "tsconfig.nodenext.json",
      tsVersion: TS6_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }, 240_000);

  it(`runs TS CJS modern lane (${TS6_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts6-cjs-modern");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.commonjs.json",
      tsconfigTemplateFile: "tsconfig.nodenext.json",
      tsVersion: TS6_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
    runCommand(fixtureDir, "npm", ["run", "run:resolution"]);
  }, 240_000);

  it(`runs TS bundler compile-only lane (${TS6_RANGE})`, async () => {
    const fixtureDir = await prepareFixtureDir("ts6-bundler");
    await materializeTsFixture({
      repoRoot,
      outDir: fixtureDir,
      packageTemplateFile: "package.module.json",
      tsconfigTemplateFile: "tsconfig.bundler.json",
      tsVersion: TS6_RANGE,
    });

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "npm", ["run", "build"]);
  }, 240_000);
});
