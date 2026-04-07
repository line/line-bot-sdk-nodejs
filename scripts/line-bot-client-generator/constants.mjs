export const OUTPUT_NAMES = {
  generatedFile: "line-bot-client.generated.ts",
  generatedFileJs: "line-bot-client.generated.js",
  factoryFile: "line-bot-client.factory.generated.ts",
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

export const DEFAULT_BASE_URLS = {
  api: "https://api.line.me",
  dataApi: "https://api-data.line.me",
  manager: "https://manager.line.biz",
};

export const SHARED_BASE_URL_FIELD_BY_VALUE = new Map([
  [DEFAULT_BASE_URLS.api, "apiBaseURL"],
  [DEFAULT_BASE_URLS.dataApi, "dataApiBaseURL"],
  [DEFAULT_BASE_URLS.manager, "managerBaseURL"],
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

export const PACKAGE_ALIAS_OVERRIDES = new Map([["module", "moduleOperation"]]);
