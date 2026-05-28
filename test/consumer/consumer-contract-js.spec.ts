import { afterAll, beforeAll, describe, it } from "vitest";
import {
  buildPackedTarball,
  copyDir,
  installSdkTarball,
  prepareFixtureDir,
  removeDir,
  runCommand,
} from "./runner";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";
const JS_TIMEOUT_MS = 180_000;

async function runJsFixture(
  fixtureName: "js-esm" | "js-cjs",
  scripts: readonly string[],
): Promise<void> {
  const fixtureDir = await prepareFixtureDir(tempDirs, fixtureName);
  await copyDir(
    `${repoRoot}/test/consumer/fixtures/${fixtureName}`,
    fixtureDir,
  );
  installSdkTarball(fixtureDir, tarballPath);

  for (const script of scripts) {
    runCommand(fixtureDir, "node", [script]);
  }
}

afterAll(async () => {
  await Promise.allSettled(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package JS consumer contract", () => {
  beforeAll(async () => {
    const packOutDir = await prepareFixtureDir(tempDirs, "js-pack");
    tarballPath = await buildPackedTarball(repoRoot, packOutDir);
  });

  it(
    "runs JS ESM fixture with resolution and behavioral contract checks",
    async () => {
      await runJsFixture("js-esm", [
        "./resolution-load-check.mjs",
        "./outbound-http-contract.mjs",
        "./webhook-signature-contract.mjs",
      ]);
    },
    JS_TIMEOUT_MS,
  );

  it(
    "runs JS CJS fixture resolution and behavioral contract checks",
    async () => {
      await runJsFixture("js-cjs", [
        "./resolution-load-check.cjs",
        "./outbound-http-contract.cjs",
        "./webhook-signature-contract.cjs",
      ]);
    },
    JS_TIMEOUT_MS,
  );
});
