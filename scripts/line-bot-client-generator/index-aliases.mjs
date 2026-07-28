import fs from "node:fs";
import path from "node:path";
import { parseSync } from "oxc-parser";
import { defaultNamespaceAlias } from "./text.mjs";

export function loadPackageNamespaceAliases(libDir) {
  const indexPath = path.join(libDir, "index.ts");
  const aliases = new Map();

  if (!fs.existsSync(indexPath)) {
    return aliases;
  }

  const sourceText = fs.readFileSync(indexPath, "utf8");
  const { program, errors } = parseSync(indexPath, sourceText);
  if (errors.length > 0) {
    throw new Error(`Failed to parse ${indexPath}: ${errors[0].message}`);
  }

  for (const statement of program.body) {
    if (statement.type !== "ImportDeclaration" || !statement.specifiers) {
      continue;
    }

    const namespaceSpecifier = statement.specifiers.find(
      specifier => specifier.type === "ImportNamespaceSpecifier",
    );
    if (!namespaceSpecifier) {
      continue;
    }

    const match = statement.source.value.match(/^\.\/(.+)\/api\.js$/);
    if (!match) {
      continue;
    }

    aliases.set(match[1], namespaceSpecifier.local.name);
  }

  return aliases;
}

export function resolveNamespaceAlias(packageDir, packageAliases) {
  return packageAliases.get(packageDir) ?? defaultNamespaceAlias(packageDir);
}
