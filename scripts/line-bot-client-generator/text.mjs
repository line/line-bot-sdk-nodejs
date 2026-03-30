import { PACKAGE_ALIAS_OVERRIDES, RESERVED_IDENTIFIERS } from "./constants.mjs";

export function toCamelCase(input) {
  return input
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
}

export function lowerCamelCase(input) {
  return input.charAt(0).toLowerCase() + input.slice(1);
}

export function defaultNamespaceAlias(packageDir) {
  if (PACKAGE_ALIAS_OVERRIDES.has(packageDir)) {
    return PACKAGE_ALIAS_OVERRIDES.get(packageDir);
  }

  const alias = toCamelCase(packageDir);
  return RESERVED_IDENTIFIERS.has(alias) ? `${alias}Api` : alias;
}

export function delegateNameFromClass(className) {
  return lowerCamelCase(className.replace(/Client$/, ""));
}

export function normalizeComment(text) {
  return text
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
}

export function indentBlock(text, indent = "  ") {
  return text
    .split("\n")
    .map((line) => (line.length === 0 ? "" : `${indent}${line}`))
    .join("\n");
}

export function quoteString(value) {
  return JSON.stringify(value);
}

export function sortByLengthDesc(values) {
  return [...values].sort(
    (left, right) => right.length - left.length || left.localeCompare(right),
  );
}

export function unique(values) {
  return [...new Set(values)];
}
