import fs from "node:fs";
import { createRequire } from "node:module";
import {
  delegateNameFromClass,
  sortByLengthDesc,
} from "./text.mjs";

const require = createRequire(import.meta.url);
const ts = require("typescript");

function getNodeText(node, sourceFile) {
  return node.getText(sourceFile);
}

function getJSDocText(sourceFile, methodDeclaration) {
  const raw = sourceFile.text
    .slice(methodDeclaration.getFullStart(), methodDeclaration.getStart(sourceFile))
    .trim();

  return raw.length === 0 ? null : raw;
}

function parseModelImportNames(sourceFile) {
  const modelImportNames = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) {
      continue;
    }

    const moduleSpecifier = statement.moduleSpecifier.getText(sourceFile).slice(1, -1);
    if (!moduleSpecifier.startsWith("../model/")) {
      continue;
    }

    const namedBindings = statement.importClause.namedBindings;
    if (!namedBindings || !ts.isNamedImports(namedBindings)) {
      continue;
    }

    for (const element of namedBindings.elements) {
      modelImportNames.push(element.name.text);
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

function findClassDeclaration(sourceFile, filePath) {
  const classDeclaration = sourceFile.statements.find(
    (statement) => ts.isClassDeclaration(statement) && statement.name,
  );

  if (!classDeclaration || !classDeclaration.name) {
    throw new Error(`No class declaration found in ${filePath}`);
  }

  return classDeclaration;
}

function findConstructorConfigNode(sourceFile, filePath) {
  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement) && statement.name.text === "httpClientConfig") {
      return statement;
    }

    if (
      ts.isTypeAliasDeclaration(statement) &&
      statement.name.text === "httpClientConfig" &&
      ts.isTypeLiteralNode(statement.type)
    ) {
      return statement.type;
    }
  }

  throw new Error(`No httpClientConfig declaration found in ${filePath}`);
}

function parseConstructorConfig(sourceFile, filePath) {
  const configNode = findConstructorConfigNode(sourceFile, filePath);
  const properties = [];

  for (const member of configNode.members) {
    if (!ts.isPropertySignature(member) || !member.name) {
      continue;
    }

    properties.push({
      name: getNodeText(member.name, sourceFile),
      optional: Boolean(member.questionToken),
      typeText: member.type ? getNodeText(member.type, sourceFile) : "unknown",
    });
  }

  return properties;
}

function parseDefaultBaseURL(classDeclaration) {
  const constructorDeclaration = classDeclaration.members.find((member) =>
    ts.isConstructorDeclaration(member),
  );

  if (!constructorDeclaration || !constructorDeclaration.body) {
    return null;
  }

  for (const statement of constructorDeclaration.body.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "baseURL") {
        continue;
      }

      const initializer = declaration.initializer;
      if (!initializer || !ts.isBinaryExpression(initializer)) {
        continue;
      }

      const operator = initializer.operatorToken.kind;
      const isSupportedOperator =
        operator === ts.SyntaxKind.BarBarToken ||
        operator === ts.SyntaxKind.QuestionQuestionToken;

      if (!isSupportedOperator || !ts.isStringLiteral(initializer.right)) {
        continue;
      }

      return initializer.right.text;
    }
  }

  return null;
}

function parseMethods(sourceFile, classDeclaration, namespaceAlias, delegateName, modelImportNames) {
  const methods = [];

  for (const member of classDeclaration.members) {
    if (!ts.isMethodDeclaration(member) || !member.name) {
      continue;
    }

    const modifiers = member.modifiers ?? [];
    if (
      modifiers.some((modifier) =>
        modifier.kind === ts.SyntaxKind.PrivateKeyword ||
        modifier.kind === ts.SyntaxKind.ProtectedKeyword ||
        modifier.kind === ts.SyntaxKind.StaticKeyword,
      )
    ) {
      continue;
    }

    const methodName = getNodeText(member.name, sourceFile);
    const typeParameters = member.typeParameters?.length
      ? `<${member.typeParameters.map((typeParameter) => getNodeText(typeParameter, sourceFile)).join(", ")}>`
      : "";

    const parameters = member.parameters.map((parameter) => {
      const parameterText = qualifyTypeText(
        getNodeText(parameter, sourceFile),
        modelImportNames,
        namespaceAlias,
      );

      const argumentText = `${parameter.dotDotDotToken ? "..." : ""}${getNodeText(parameter.name, sourceFile)}`;

      return {
        parameterText,
        argumentText,
      };
    });

    const returnType = member.type
      ? qualifyTypeText(getNodeText(member.type, sourceFile), modelImportNames, namespaceAlias)
      : "Promise<unknown>";

    const isAsync = modifiers.some(
      (modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword,
    );

    methods.push({
      comment: getJSDocText(sourceFile, member),
      methodName,
      typeParameters,
      parameterList: parameters.map((parameter) => parameter.parameterText).join(", "),
      argumentList: parameters.map((parameter) => parameter.argumentText).join(", "),
      returnType,
      asyncKeyword: isAsync ? "async " : "",
      delegateName,
    });
  }

  return methods;
}

export function parseClientFile(filePath, packageDir, namespaceAlias) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const modelImportNames = parseModelImportNames(sourceFile);
  const classDeclaration = findClassDeclaration(sourceFile, filePath);
  const className = classDeclaration.name.text;
  const delegateName = delegateNameFromClass(className);

  return {
    packageDir,
    namespaceAlias,
    className,
    delegateName,
    constructorConfig: {
      properties: parseConstructorConfig(sourceFile, filePath),
      defaultBaseURL: parseDefaultBaseURL(classDeclaration),
    },
    methods: parseMethods(
      sourceFile,
      classDeclaration,
      namespaceAlias,
      delegateName,
      modelImportNames,
    ),
  };
}
