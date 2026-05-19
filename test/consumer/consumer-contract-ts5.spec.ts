import { afterAll, beforeAll, describe, it } from "vitest";
import { buildPackedTarball, prepareFixtureDir, removeDir } from "./runner";
import { runTsLane } from "./runner/ts-lane";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";
const TS5_VERSION = "5.9.3";
const TS_TIMEOUT_MS = 240_000;

afterAll(async () => {
  await Promise.allSettled(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package TS5 consumer contract", () => {
  beforeAll(async () => {
    const packOutDir = await prepareFixtureDir(tempDirs, "ts5-pack");
    tarballPath = await buildPackedTarball(repoRoot, packOutDir);
  });

  it(
    `runs TS ESM modern lane (${TS5_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS5_VERSION, tempDirs },
        {
          fixtureName: "ts5-esm-modern",
          packageTemplateFile: "package.module.json",
          tsconfigTemplateFile: "tsconfig.nodenext.json",
          withRuntime: true,
        },
      );
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS modern lane (${TS5_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS5_VERSION, tempDirs },
        {
          fixtureName: "ts5-cjs-modern",
          packageTemplateFile: "package.commonjs.json",
          tsconfigTemplateFile: "tsconfig.nodenext.json",
          withRuntime: true,
        },
      );
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS CJS legacy lane (${TS5_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS5_VERSION, tempDirs },
        {
          fixtureName: "ts5-cjs-legacy",
          packageTemplateFile: "package.commonjs.json",
          tsconfigTemplateFile: "tsconfig.legacy-commonjs.json",
          withRuntime: true,
        },
      );
    },
    TS_TIMEOUT_MS,
  );

  it(
    `runs TS bundler compile-only lane (${TS5_VERSION})`,
    async () => {
      await runTsLane(
        { repoRoot, tarballPath, tsVersion: TS5_VERSION, tempDirs },
        {
          fixtureName: "ts5-bundler",
          packageTemplateFile: "package.module.json",
          tsconfigTemplateFile: "tsconfig.bundler.json",
          withRuntime: false,
        },
      );
    },
    TS_TIMEOUT_MS,
  );
});
