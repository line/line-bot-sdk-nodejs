import path from "node:path";
import { OUTPUT_NAMES } from "./constants.mjs";
import { discoverClients } from "./discover-clients.mjs";
import { loadPackageNamespaceAliases } from "./index-aliases.mjs";
import { writeFile } from "./io.mjs";
import { renderBaseFile } from "./render-base.mjs";
import { renderFactoryFile } from "./render-factory.mjs";
import { validateClients } from "./validate.mjs";

/**
 * Generates LineBotClient
 * A single client that unifies all LINE API clients
 * (MessagingApiClient, InsightClient, LiffClient, etc.).
 *
 * The LINE API is split across multiple clients by category, which makes it
 * cumbersome to manage them individually. LineBotClient wraps them all so that
 * callers only need one object.
 *
 * Because each underlying client is generated from OpenAPI specs and changes
 * with every update, this script automates the delegation boilerplate rather
 * than maintaining it by hand.
 */
function main(rootDir = process.cwd()) {
  const resolvedRootDir = path.resolve(rootDir);
  const libDir = path.join(resolvedRootDir, "lib");

  const packageAliases = loadPackageNamespaceAliases(libDir);
  const clients = discoverClients(libDir, packageAliases);
  validateClients(clients);

  const generatedFilePath = path.join(libDir, OUTPUT_NAMES.generatedFile);
  const factoryFilePath = path.join(libDir, OUTPUT_NAMES.factoryFile);

  writeFile(generatedFilePath, renderBaseFile(clients));
  writeFile(factoryFilePath, renderFactoryFile(clients));

  const methodCount = clients.reduce(
    (sum, client) => sum + client.methods.length,
    0,
  );

  console.log(
    `Generated ${path.relative(resolvedRootDir, generatedFilePath)} and ` +
      `${path.relative(resolvedRootDir, factoryFilePath)}. ` +
      `${clients.length} client classes, ${methodCount} delegated methods.`,
  );
}

main(process.argv[2]);
