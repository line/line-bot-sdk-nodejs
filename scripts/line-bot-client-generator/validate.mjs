import { SUPPORTED_CONSTRUCTOR_CONFIG_KEYS } from "./constants.mjs";

export function validateClients(clients) {
  const duplicateMethods = new Map();
  const duplicateDelegates = new Map();

  for (const client of clients) {
    duplicateDelegates.set(client.delegateName, [
      ...(duplicateDelegates.get(client.delegateName) ?? []),
      client.className,
    ]);

    for (const method of client.methods) {
      duplicateMethods.set(method.methodName, [
        ...(duplicateMethods.get(method.methodName) ?? []),
        client.className,
      ]);
    }

    const unsupportedConfigKeys = client.constructorConfig.properties
      .map(property => property.name)
      .filter(name => !SUPPORTED_CONSTRUCTOR_CONFIG_KEYS.has(name));

    if (unsupportedConfigKeys.length > 0) {
      throw new Error(
        `Unsupported constructor config keys in ${client.className}: ${unsupportedConfigKeys.join(", ")}`,
      );
    }
  }

  const methodCollisions = [...duplicateMethods.entries()].filter(
    ([, owners]) => owners.length > 1,
  );
  const delegateCollisions = [...duplicateDelegates.entries()].filter(
    ([, owners]) => owners.length > 1,
  );

  if (delegateCollisions.length > 0) {
    const detail = delegateCollisions
      .map(([delegateName, owners]) => `${delegateName}: ${owners.join(", ")}`)
      .join("\n");
    throw new Error(`Delegate name collisions were found:\n${detail}`);
  }

  if (methodCollisions.length > 0) {
    const detail = methodCollisions
      .map(([methodName, owners]) => `${methodName}: ${owners.join(", ")}`)
      .join("\n");
    throw new Error(`Method name collisions were found:\n${detail}`);
  }
}
