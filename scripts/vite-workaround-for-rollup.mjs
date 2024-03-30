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
