import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { defaultNamespaceAlias } from "./text.mjs";

const require = createRequire(import.meta.url);
// typescript-v6 is an npm alias of typescript@6. This script needs the TypeScript JS
// compiler API, which the Go-native typescript@7 package no longer provides.
// https://github.com/microsoft/typescript-go/discussions/455
const ts = require("typescript-v6");

export function loadPackageNamespaceAliases(libDir) {
  const indexPath = path.join(libDir, "index.ts");
  const aliases = new Map();

  if (!fs.existsSync(indexPath)) {
    return aliases;
  }

  const sourceText = fs.readFileSync(indexPath, "utf8");
  const sourceFile = ts.createSourceFile(
    indexPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) {
      continue;
    }

    const namedBindings = statement.importClause.namedBindings;
    if (!namedBindings || !ts.isNamespaceImport(namedBindings)) {
      continue;
    }

    const moduleSpecifier = statement.moduleSpecifier
      .getText(sourceFile)
      .slice(1, -1);
    const match = moduleSpecifier.match(/^\.\/(.+)\/api\.js$/);
    if (!match) {
      continue;
    }

    aliases.set(match[1], namedBindings.name.text);
  }

  return aliases;
}

export function resolveNamespaceAlias(packageDir, packageAliases) {
  return packageAliases.get(packageDir) ?? defaultNamespaceAlias(packageDir);
}
