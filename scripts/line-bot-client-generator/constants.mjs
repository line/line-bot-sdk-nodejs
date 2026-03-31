export const OUTPUT_NAMES = {
  generatedFile: "line-bot-client.generated.ts",
  generatedFileJs: "line-bot-client.generated.js",
  factoryFile: "line-bot-client.factory.generated.ts",
  factoryFileJs: "line-bot-client.factory.generated.js",
  manualFile: "line-bot-client.ts",
  className: "LineBotClient",
  baseClassName: "LineBotClientBase",
  delegatesTypeName: "LineBotClientDelegates",
  configTypeName: "LineBotClientConfig",
  factoryFunctionName: "createLineBotClientDelegates",
};

export const SUPPORTED_CONSTRUCTOR_CONFIG_KEYS = new Set([
  "baseURL",
  "channelAccessToken",
  "defaultHeaders",
]);

export const SHARED_BASE_URL_FIELD_BY_VALUE = new Map([
  ["https://api.line.me", "apiBaseURL"],
  ["https://api-data.line.me", "dataApiBaseURL"],
  ["https://manager.line.biz", "managerBaseURL"],
]);

export const BASE_URL_FIELD_ORDER = [
  "apiBaseURL",
  "dataApiBaseURL",
  "managerBaseURL",
];

export const RESERVED_IDENTIFIERS = new Set([
  "module",
  "default",
  "function",
  "class",
  "const",
  "let",
  "var",
  "return",
  "export",
  "import",
]);

export const PACKAGE_ALIAS_OVERRIDES = new Map([
  ["module", "moduleOperation"],
]);
