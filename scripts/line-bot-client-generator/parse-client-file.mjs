import fs from "node:fs";
import { parseSync } from "oxc-parser";
import { delegateNameFromClass, sortByLengthDesc } from "./text.mjs";

function getNodeText(node, sourceText) {
  return sourceText.slice(node.start, node.end);
}

// Statements like `export class ...` are wrapped in ExportNamedDeclaration in
// the ESTree AST; the declaration itself is what we want to inspect.
function unwrapExport(statement) {
  return statement.type === "ExportNamedDeclaration"
    ? statement.declaration
    : statement;
}

// Maps each class member to the source position right after the previous
// member (or the class body "{" for the first one), so that the raw leading
// trivia (JSDoc comments) of a member can be sliced out of the source text.
function buildLeadingTriviaStarts(classDeclaration) {
  const triviaStarts = new Map();
  let previousEnd = classDeclaration.body.start + 1;

  for (const member of classDeclaration.body.body) {
    triviaStarts.set(member, previousEnd);
    previousEnd = member.end;
  }

  return triviaStarts;
}

function getJSDocText(sourceText, member, triviaStarts) {
  const raw = sourceText.slice(triviaStarts.get(member), member.start).trim();

  return raw.length === 0 ? null : raw;
}

function parseModelImportNames(program) {
  const modelImportNames = [];

  for (const statement of program.body) {
    if (statement.type !== "ImportDeclaration" || !statement.specifiers) {
      continue;
    }

    if (!statement.source.value.startsWith("../model/")) {
      continue;
    }

    for (const specifier of statement.specifiers) {
      if (specifier.type === "ImportSpecifier") {
        modelImportNames.push(specifier.local.name);
      }
    }
  }

  return sortByLengthDesc([...new Set(modelImportNames)]);
}

function qualifyTypeText(text, modelImportNames, namespaceAlias) {
  if (!text || modelImportNames.length === 0) {
    return text;
  }

  let output = text;
  for (const importName of modelImportNames) {
    const matcher = new RegExp(`\\b${importName}\\b`, "g");
    output = output.replace(matcher, `${namespaceAlias}.${importName}`);
  }

  return output;
}

function findClassDeclaration(program, filePath) {
  for (const statement of program.body) {
    const candidate = unwrapExport(statement);
    if (candidate?.type === "ClassDeclaration" && candidate.id) {
      return candidate;
    }
  }

  throw new Error(`No class declaration found in ${filePath}`);
}

function findConstructorConfigMembers(program, filePath) {
  for (const statement of program.body) {
    const candidate = unwrapExport(statement);
    if (!candidate) {
      continue;
    }

    if (
      candidate.type === "TSInterfaceDeclaration" &&
      candidate.id.name === "httpClientConfig"
    ) {
      return candidate.body.body;
    }

    if (
      candidate.type === "TSTypeAliasDeclaration" &&
      candidate.id.name === "httpClientConfig" &&
      candidate.typeAnnotation.type === "TSTypeLiteral"
    ) {
      return candidate.typeAnnotation.members;
    }
  }

  throw new Error(`No httpClientConfig declaration found in ${filePath}`);
}

function parseConstructorConfig(program, sourceText, filePath) {
  const configMembers = findConstructorConfigMembers(program, filePath);
  const properties = [];

  for (const member of configMembers) {
    if (member.type !== "TSPropertySignature" || !member.key) {
      continue;
    }

    properties.push({
      name: getNodeText(member.key, sourceText),
    });
  }

  return properties;
}

function parseDefaultBaseURL(classDeclaration) {
  const constructorDeclaration = classDeclaration.body.body.find(
    member =>
      member.type === "MethodDefinition" && member.kind === "constructor",
  );

  if (!constructorDeclaration || !constructorDeclaration.value.body) {
    return null;
  }

  for (const statement of constructorDeclaration.value.body.body) {
    if (statement.type !== "VariableDeclaration") {
      continue;
    }

    for (const declaration of statement.declarations) {
      if (
        declaration.id.type !== "Identifier" ||
        declaration.id.name !== "baseURL"
      ) {
        continue;
      }

      const initializer = declaration.init;
      if (!initializer || initializer.type !== "LogicalExpression") {
        continue;
      }

      const isSupportedOperator =
        initializer.operator === "||" || initializer.operator === "??";

      if (
        !isSupportedOperator ||
        initializer.right.type !== "Literal" ||
        typeof initializer.right.value !== "string"
      ) {
        continue;
      }

      return initializer.right.value;
    }
  }

  return null;
}

// A parameter's source span covers the whole declaration ("...rest: T[] = x"),
// but call arguments need only the bare name with an optional rest prefix.
function parameterArgumentText(parameter) {
  let node = parameter;
  let restPrefix = "";

  if (node.type === "RestElement") {
    restPrefix = "...";
    node = node.argument;
  }
  if (node.type === "AssignmentPattern") {
    node = node.left;
  }

  return `${restPrefix}${node.name}`;
}

function parseMethods(
  sourceText,
  classDeclaration,
  namespaceAlias,
  delegateName,
  modelImportNames,
) {
  const methods = [];
  const triviaStarts = buildLeadingTriviaStarts(classDeclaration);

  for (const member of classDeclaration.body.body) {
    if (
      member.type !== "MethodDefinition" ||
      member.kind !== "method" ||
      !member.key
    ) {
      continue;
    }

    if (
      member.static ||
      member.accessibility === "private" ||
      member.accessibility === "protected"
    ) {
      continue;
    }

    const methodName = getNodeText(member.key, sourceText);
    const typeParameters = member.value.typeParameters?.params.length
      ? `<${member.value.typeParameters.params.map(typeParameter => getNodeText(typeParameter, sourceText)).join(", ")}>`
      : "";

    const parameters = member.value.params.map(parameter => {
      const parameterText = qualifyTypeText(
        getNodeText(parameter, sourceText),
        modelImportNames,
        namespaceAlias,
      );

      return {
        parameterText,
        argumentText: parameterArgumentText(parameter),
      };
    });

    const returnType = member.value.returnType
      ? qualifyTypeText(
          getNodeText(member.value.returnType.typeAnnotation, sourceText),
          modelImportNames,
          namespaceAlias,
        )
      : "Promise<unknown>";

    methods.push({
      comment: getJSDocText(sourceText, member, triviaStarts),
      methodName,
      typeParameters,
      parameterList: parameters
        .map(parameter => parameter.parameterText)
        .join(", "),
      argumentList: parameters
        .map(parameter => parameter.argumentText)
        .join(", "),
      returnType,
      asyncKeyword: member.value.async ? "async " : "",
      delegateName,
    });
  }

  return methods;
}

export function parseClientFile(filePath, packageDir, namespaceAlias) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const { program, errors } = parseSync(filePath, sourceText);
  if (errors.length > 0) {
    throw new Error(`Failed to parse ${filePath}: ${errors[0].message}`);
  }

  const modelImportNames = parseModelImportNames(program);
  const classDeclaration = findClassDeclaration(program, filePath);
  const className = classDeclaration.id.name;
  const delegateName = delegateNameFromClass(className);

  return {
    packageDir,
    namespaceAlias,
    className,
    delegateName,
    constructorConfig: {
      properties: parseConstructorConfig(program, sourceText, filePath),
      defaultBaseURL: parseDefaultBaseURL(classDeclaration),
    },
    methods: parseMethods(
      sourceText,
      classDeclaration,
      namespaceAlias,
      delegateName,
      modelImportNames,
    ),
  };
}
