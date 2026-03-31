import fs from "node:fs";
import path from "node:path";

function ensureParentDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export function writeFile(filePath, content) {
  ensureParentDirectory(filePath);
  fs.writeFileSync(filePath, content, "utf8");
}
