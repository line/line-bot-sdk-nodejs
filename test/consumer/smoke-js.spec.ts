import { afterAll, beforeAll, describe, it } from "vitest";
import {
  buildPackedTarball,
  copyDir,
  createTempDir,
  installSdkTarball,
  removeDir,
  runCommand,
} from "./harness/runner";

const repoRoot = process.cwd();
const tempDirs: string[] = [];
let tarballPath = "";

async function prepareFixtureDir(name: string): Promise<string> {
  const dir = await createTempDir(`bot-sdk-consumer-${name}-`);
  tempDirs.push(dir);
  return dir;
}

afterAll(async () => {
  await Promise.all(tempDirs.map(dir => removeDir(dir)));
});

describe("dual package JS consumer smoke", () => {
  beforeAll(async () => {
    tarballPath = await buildPackedTarball(repoRoot);
  });

  it("runs JS ESM fixture with resolution and behavioral smoke", async () => {
    const fixtureDir = await prepareFixtureDir("js-esm");
    await copyDir(`${repoRoot}/test/consumer/fixtures/js-esm`, fixtureDir);

    installSdkTarball(fixtureDir, tarballPath);

    runCommand(fixtureDir, "node", ["./smoke-resolution.mjs"]);
    runCommand(fixtureDir, "node", ["./smoke-outbound.mjs"]);
    runCommand(fixtureDir, "node", ["./smoke-webhook.mjs"]);
  }, 180_000);

  it("runs JS CJS fixture resolution smoke", async () => {
    const fixtureDir = await prepareFixtureDir("js-cjs");
    await copyDir(`${repoRoot}/test/consumer/fixtures/js-cjs`, fixtureDir);

    installSdkTarball(fixtureDir, tarballPath);
    runCommand(fixtureDir, "node", ["./smoke-resolution.cjs"]);
    runCommand(fixtureDir, "node", ["./smoke-outbound.cjs"]);
    runCommand(fixtureDir, "node", ["./smoke-webhook.cjs"]);
  }, 120_000);
});
