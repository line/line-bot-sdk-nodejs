import path from "node:path";
import { OUTPUT_NAMES } from "./constants.mjs";
import { discoverClients } from "./discover-clients.mjs";
import { loadPackageNamespaceAliases } from "./index-aliases.mjs";
import { writeFile, writeFileIfMissing } from "./io.mjs";
import { renderBaseFile } from "./render-base.mjs";
import { renderFactoryFile } from "./render-factory.mjs";
import { renderManualWrapperTemplate } from "./render-manual-template.mjs";
import { validateClients } from "./validate.mjs";

export function main(rootDir = process.cwd()) {
  const resolvedRootDir = path.resolve(rootDir);
  const libDir = path.join(resolvedRootDir, "lib");

  const packageAliases = loadPackageNamespaceAliases(libDir);
  const clients = discoverClients(libDir, packageAliases);
  validateClients(clients);

  const generatedFilePath = path.join(libDir, OUTPUT_NAMES.generatedFile);
  const factoryFilePath = path.join(libDir, OUTPUT_NAMES.factoryFile);
  const manualFilePath = path.join(libDir, OUTPUT_NAMES.manualFile);

  writeFile(generatedFilePath, renderBaseFile(clients));
  writeFile(factoryFilePath, renderFactoryFile(clients));
  writeFileIfMissing(manualFilePath, renderManualWrapperTemplate());

  const methodCount = clients.reduce(
    (sum, client) => sum + client.methods.length,
    0,
  );

  console.log(
    `Generated ${path.relative(resolvedRootDir, generatedFilePath)}, ` +
      `${path.relative(resolvedRootDir, factoryFilePath)} ` +
      `and ensured ${path.relative(resolvedRootDir, manualFilePath)}. ` +
      `${clients.length} client classes, ${methodCount} delegated methods.`,
  );
}
