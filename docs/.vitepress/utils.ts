import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

// __dirname is not available in ESM, so we need to derive it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copyFile(sourceFilename, targetFilename) {
  const sourcePath = path.join(__dirname, '../../', sourceFilename);
  const targetPath = path.join(__dirname, '../', targetFilename);
  const md = fs.readFileSync(sourcePath, 'utf-8');
  fs.writeFileSync(targetPath, md);
}

function rewriteFile(filename, regex, replacement) {
  console.log("Rewriting file: ", filename, " with regex: ", regex, " and replacement: ", replacement)
  const content = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
  const newContent = content.replace(regex, replacement);
  fs.writeFileSync(path.join(__dirname, filename), newContent);
}

export {
  copyFile,
  rewriteFile
};
