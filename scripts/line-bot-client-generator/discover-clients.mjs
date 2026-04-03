import fs from "node:fs";
import path from "node:path";
import { parseClientFile } from "./parse-client-file.mjs";
import { resolveNamespaceAlias } from "./index-aliases.mjs";

// channel-access-token is excluded because its clients don't need a
// channelAccessToken in their constructor (they issue/verify/revoke tokens,
// so they're used before a token exists). Including it would force
// LineBotClientConfig to carry a field that those clients ignore, and would
// pollute LineBotClient with token-management methods that don't belong there.
// Use channelAccessToken.ChannelAccessTokenClient directly instead.
const EXCLUDED_FROM_UNIFIED_CLIENT = new Set(["channel-access-token"]);

export function discoverClients(libDir, packageAliases) {
  if (!fs.existsSync(libDir)) {
    throw new Error(`lib directory was not found: ${libDir}`);
  }

  const packageDirs = fs
    .readdirSync(libDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !EXCLUDED_FROM_UNIFIED_CLIENT.has(name))
    .sort((left, right) => left.localeCompare(right));

  const clients = [];

  for (const packageDir of packageDirs) {
    const apiDir = path.join(libDir, packageDir, "api");
    if (!fs.existsSync(apiDir)) {
      continue;
    }

    const namespaceAlias = resolveNamespaceAlias(packageDir, packageAliases);
    const clientFiles = fs
      .readdirSync(apiDir, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith("Client.ts"))
      .map(entry => entry.name)
      .sort((left, right) => left.localeCompare(right));

    for (const clientFile of clientFiles) {
      const filePath = path.join(apiDir, clientFile);
      clients.push(parseClientFile(filePath, packageDir, namespaceAlias));
    }
  }

  if (clients.length === 0) {
    throw new Error(`No generated client files were found under ${libDir}`);
  }

  clients.sort(
    (left, right) =>
      left.packageDir.localeCompare(right.packageDir) ||
      left.delegateName.localeCompare(right.delegateName) ||
      left.className.localeCompare(right.className),
  );

  return clients;
}
