import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export interface CmdResult {
  readonly stdout: string;
  readonly stderr: string;
}

const COMMAND_TIMEOUT_MS = 300_000;

export function runCommand(
  cwd: string,
  command: string,
  args: string[],
  env: Record<string, string> = {},
): CmdResult {
  const defaultEnv =
    command === "npm" && env.NPM_CONFIG_CACHE == null
      ? {
          NPM_CONFIG_CACHE: path.join(os.tmpdir(), "bot-sdk-npm-cache"),
          NPM_CONFIG_REGISTRY: "https://registry.npmjs.org",
        }
      : {};

  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...defaultEnv, ...env },
    encoding: "utf8",
    timeout: COMMAND_TIMEOUT_MS,
  });

  if (result.error) {
    const joined = [
      `$ ${command} ${args.join(" ")}`,
      `cwd: ${cwd}`,
      `timeoutMs: ${COMMAND_TIMEOUT_MS}`,
      result.stdout,
      result.stderr,
      result.error.message,
    ]
      .filter(Boolean)
      .join("\n");
    throw new Error(joined);
  }

  if (result.status !== 0) {
    const joined = [
      `$ ${command} ${args.join(" ")}`,
      `cwd: ${cwd}`,
      `timeoutMs: ${COMMAND_TIMEOUT_MS}`,
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join("\n");
    throw new Error(joined);
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

export async function createTempDir(prefix: string): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function removeDir(dirPath: string): Promise<void> {
  await rm(dirPath, { recursive: true, force: true });
}

export async function copyDir(src: string, dst: string): Promise<void> {
  await cp(src, dst, { recursive: true });
}

export async function buildPackedTarball(repoRoot: string): Promise<string> {
  const { stdout } = runCommand(repoRoot, "npm", ["pack", "--json"]);
  const parsed = JSON.parse(stdout) as Array<{ filename: string }>;
  const filename = parsed[0]?.filename;
  assert.ok(filename, "npm pack --json did not return filename");
  return path.join(repoRoot, filename);
}

export async function readTarPackageJson(
  repoRoot: string,
  tarballPath: string,
): Promise<any> {
  const { stdout } = runCommand(repoRoot, "tar", [
    "-xOf",
    tarballPath,
    "package/package.json",
  ]);
  return JSON.parse(stdout);
}

export function listTarEntries(
  repoRoot: string,
  tarballPath: string,
): string[] {
  const { stdout } = runCommand(repoRoot, "tar", ["-tf", tarballPath]);
  return stdout
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export async function materializeTsFixture(params: {
  readonly repoRoot: string;
  readonly outDir: string;
  readonly packageTemplateFile: string;
  readonly tsconfigTemplateFile?: string;
  readonly tsVersion: string;
}): Promise<void> {
  const templateRoot = path.join(
    params.repoRoot,
    "test/consumer/templates/ts-modern",
  );
  await copyDir(path.join(templateRoot, "files"), params.outDir);

  const packageTemplate = await readFile(
    path.join(templateRoot, params.packageTemplateFile),
    "utf8",
  );
  const packageJson = packageTemplate.replace(
    "__TS_VERSION__",
    params.tsVersion,
  );
  await writeFile(
    path.join(params.outDir, "package.json"),
    packageJson,
    "utf8",
  );

  const tsconfig = await readFile(
    path.join(
      templateRoot,
      params.tsconfigTemplateFile ?? "tsconfig.nodenext.json",
    ),
    "utf8",
  );
  await writeFile(path.join(params.outDir, "tsconfig.json"), tsconfig, "utf8");
}

export function installSdkTarball(
  projectDir: string,
  tarballPath: string,
): void {
  runCommand(projectDir, "npm", [
    "install",
    "--no-audit",
    "--no-fund",
    "--ignore-scripts",
    "--prefer-offline",
    "--no-save",
    `file:${tarballPath}`,
  ]);
}
