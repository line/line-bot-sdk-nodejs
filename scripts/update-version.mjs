import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function updateVersion(newVersion) {
  // FIles having version number
  const files = {
    packageJson: './package.json',
    packageLockJson: './package-lock.json',
    versionTs: './lib/version.ts',
  };

  // package.json
  const packageJsonData = JSON.parse(await fs.readFile(files.packageJson, 'utf8'));
  packageJsonData.version = newVersion;
  await fs.writeFile(files.packageJson, JSON.stringify(packageJsonData, null, 2) + '\n');

  // package-lock.json
  const packageLockJsonData = JSON.parse(await fs.readFile(files.packageLockJson, 'utf8'));
  packageLockJsonData.version = newVersion;
  if (packageLockJsonData.packages && packageLockJsonData.packages[""]) {
    packageLockJsonData.packages[""].version = newVersion;
  }
  await fs.writeFile(files.packageLockJson, JSON.stringify(packageLockJsonData, null, 2) + '\n');

  // lib/version.ts
  const versionTsData = await fs.readFile(files.versionTs, 'utf8');
  const updatedVersionTsData = versionTsData.replace(
    /const LINE_BOT_SDK_VERSION = ".*?";/,
    `const LINE_BOT_SDK_VERSION = "${newVersion}";`
  );
  await fs.writeFile(files.versionTs, updatedVersionTsData);

  console.log(`Version updated to ${newVersion} in all files.`);
}

async function verifyVersion(expectedVersion) {
  // package.json
  const packageJsonData = JSON.parse(await fs.readFile('./package.json', 'utf8'));
  if (packageJsonData.version !== expectedVersion) {
    throw new Error(`package.json version mismatch: expected ${expectedVersion}, found ${packageJsonData.version}`);
  }

  // package-lock.json
  const packageLockJsonData = JSON.parse(await fs.readFile('./package-lock.json', 'utf8'));
  if (packageLockJsonData.version !== expectedVersion) {
    throw new Error(`package-lock.json version mismatch: expected ${expectedVersion}, found ${packageLockJsonData.version}`);
  }
  if (packageLockJsonData.packages && packageLockJsonData.packages[""] && packageLockJsonData.packages[""].version !== expectedVersion) {
    throw new Error(`package-lock.json root package version mismatch: expected ${expectedVersion}, found ${packageLockJsonData.packages[""].version}`);
  }

  // lib/version.ts
  const versionTsData = await fs.readFile('./lib/version.ts', 'utf8');
  if (!versionTsData.includes(`const LINE_BOT_SDK_VERSION = "${expectedVersion}";`)) {
    throw new Error(`lib/version.ts version mismatch: expected ${expectedVersion}`);
  }

  console.log(`All files have the correct version: ${expectedVersion}`);
}

async function verifyGitDiff() {
  try {
    const { stdout: numstatOutput } = await execAsync('git diff --numstat');
    const { addedLines, deletedLines } = numstatOutput.trim().split('\n').reduce((acc, line) => {
      const [added, deleted] = line.split('\t').map(Number);
      acc.addedLines += added;
      acc.deletedLines += deleted;
      return acc;
    }, { addedLines: 0, deletedLines: 0 });

    if (addedLines !== 4 || deletedLines !== 4) {
      throw new Error(`Unexpected number of changed lines: expected 4 added and 4 deleted, found ${addedLines} added and ${deletedLines} deleted`);
    }

    console.log('Git diff verification passed: 4 lines added and 4 lines deleted.');

    // Display the diff with context and color
    const { stdout: diffOutput } = await execAsync('git diff -U5 --color=always');
    console.log('Git diff with context and color:\n', diffOutput);

  } catch (error) {
    console.error('Error during git diff verification:', error.message);
    process.exit(1);
  }
}

// Main process
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node update-version.mjs <new-version>');
  process.exit(1);
}

const newVersion = args[0];
await updateVersion(newVersion);
await verifyVersion(newVersion);
await verifyGitDiff();
