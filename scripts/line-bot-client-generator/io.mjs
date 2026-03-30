import fs from "node:fs";
import path from "node:path";

export function ensureParentDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export function writeFile(filePath, content) {
  ensureParentDirectory(filePath);
  fs.writeFileSync(filePath, content, "utf8");
}

export function writeFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    return false;
  }

  writeFile(filePath, content);
  return true;
}
