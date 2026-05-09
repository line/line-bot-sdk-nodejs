import { afterAll, beforeAll, describe, it } from "vitest";
import {
  buildPackedTarball,
  copyDir,
  createTempDir,
  installSdkTarball,
  removeDir,
  runCommand,
} from "./runner";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";
const JS_TIMEOUT_MS = 180_000;

async function prepareFixtureDir(name: string): Promise<string> {
  const dir = await createTempDir(`bot-sdk-consumer-${name}-`);
  tempDirs.push(dir);
  return dir;
}

async function runJsFixture(
  fixtureName: "js-esm" | "js-cjs",
  scripts: readonly string[],
): Promise<void> {
  const fixtureDir = await prepareFixtureDir(fixtureName);
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
  await Promise.all(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package JS consumer contract", () => {
  beforeAll(async () => {
    tarballPath = await buildPackedTarball(repoRoot);
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
