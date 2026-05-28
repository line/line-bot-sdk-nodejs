import { afterAll, beforeAll, describe, it } from "vitest";
import { buildPackedTarball, prepareFixtureDir, removeDir } from "./runner";
import { runTsLane } from "./runner/ts-lane";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";
const TS6_VERSION = "6.0.3";
const TS_TIMEOUT_MS = 240_000;

afterAll(async () => {
  await Promise.allSettled(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package TS6 consumer contract", () => {
  beforeAll(async () => {
    const packOutDir = await prepareFixtureDir(tempDirs, "ts6-pack");
    tarballPath = await buildPackedTarball(repoRoot, packOutDir);
  });

  it(
    `runs TS ESM modern lane (${TS6_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS6_VERSION, tempDirs },
        {
          fixtureName: "ts6-esm-modern",
          packageTemplateFile: "package.module.json",
          tsconfigTemplateFile: "tsconfig.nodenext.json",
          withRuntime: true,
        },
      );
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS modern lane (${TS6_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS6_VERSION, tempDirs },
        {
          fixtureName: "ts6-cjs-modern",
          packageTemplateFile: "package.commonjs.json",
          tsconfigTemplateFile: "tsconfig.nodenext.json",
          withRuntime: true,
        },
      );
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS bundler compile-only lane (${TS6_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS6_VERSION, tempDirs },
        {
          fixtureName: "ts6-bundler",
          packageTemplateFile: "package.module.json",
          tsconfigTemplateFile: "tsconfig.bundler.json",
          withRuntime: false,
        },
      );
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS node16 lane (${TS6_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS6_VERSION, tempDirs },
        {
          fixtureName: "ts6-cjs-node16",
          packageTemplateFile: "package.commonjs.json",
          tsconfigTemplateFile: "tsconfig.node16.json",
          withRuntime: true,
        },
      );
    },
    TS_TIMEOUT_MS,
  );
});
