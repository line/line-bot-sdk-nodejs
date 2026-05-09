import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { beforeAll, describe, it } from "vitest";
import {
  buildPackedTarball,
  listTarEntries,
  readTarPackageJson,
} from "./harness/runner";

const repoRoot = process.cwd();
let tarballPath = "";

describe("dual package packaging smoke", () => {
  beforeAll(async () => {
    tarballPath = await buildPackedTarball(repoRoot);
    assert.equal(existsSync(tarballPath), true);
  });

  it("includes required export targets and metadata", async () => {
    const entries = listTarEntries(repoRoot, tarballPath);
    const requiredEntries = [
      "package/dist/index.js",
      "package/dist/index.d.ts",
      "package/dist/cjs/index.js",
      "package/dist/cjs/index.d.ts",
      "package/dist/cjs/package.json",
      "package/package.json",
    ];

    for (const entry of requiredEntries) {
      assert.equal(
        entries.includes(entry),
        true,
        `${entry} was not found in tarball`,
      );
    }

    const packagedJson = await readTarPackageJson(repoRoot, tarballPath);
    assert.equal(packagedJson.main, "./dist/cjs/index.js");
    assert.equal(packagedJson.types, "./dist/index.d.ts");

    assert.equal(packagedJson.exports["."].import.types, "./dist/index.d.ts");
    assert.equal(packagedJson.exports["."].import.default, "./dist/index.js");
    assert.equal(
      packagedJson.exports["."].require.types,
      "./dist/cjs/index.d.ts",
    );
    assert.equal(
      packagedJson.exports["."].require.default,
      "./dist/cjs/index.js",
    );
  });

  it("does not include test artifacts", () => {
    const entries = listTarEntries(repoRoot, tarballPath);
    const testArtifacts = entries.filter(entry =>
      /(^|\/)tests?\//.test(entry.replace(/^package\//, "")),
    );
    assert.deepEqual(testArtifacts, []);
  });
});
