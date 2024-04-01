/**
 * This script is a workaround for a compatibility issue between Vite and its dependency, Rollup.
 * Specifically, Vite's typescript definitions reference a module ('rollup/parseAst') that is not
 * directly resolvable with the default module resolution strategy used in some configurations.
 *
 * The script copies the necessary Rollup files to the expected locations and updates import paths
 * in 'parseAst.d.ts' to ensure Vite can correctly import these types.
 *
 * This workaround should be removed once the underlying issue with Vite's dependency resolution
 * is resolved. Ideally, this would be when Vite or Rollup releases an update that addresses the
 * issue directly, making this script unnecessary.
 *
 * Keep an eye on Vite and Rollup's release notes for an update on this issue.
 * https://github.com/rollup/rollup/issues/5199
 * https://github.com/vitest-dev/vitest/issues/4567
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rollupDir = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist');
const destDir = path.join(__dirname, '..', 'node_modules', 'rollup');

const filesToCopy = ['parseAst.d.ts', 'parseAst.js'];

filesToCopy.forEach(file => {
  const srcPath = path.join(rollupDir, file);
  const destPath = path.join(destDir, file);

  fs.copyFileSync(srcPath, destPath);
  console.log(`[Workaround] Copied ${srcPath} to ${destPath}`);

  if (file === 'parseAst.d.ts') {
    const data = fs.readFileSync(destPath, 'utf8');
    const result = data.replace("from './rollup';", "from './';");
    fs.writeFileSync(destPath, result, 'utf8');
    console.log(`[Workaround] Updated import in ${destPath}`);
  }
});
