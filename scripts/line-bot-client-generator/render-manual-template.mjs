import { OUTPUT_NAMES } from "./constants.mjs";

export function renderManualWrapperTemplate() {
  return `/**
 * This file is intended for manual edits.
 *
 * Generated delegation methods live in ./${OUTPUT_NAMES.generatedFile}.
 * Generated factory helpers live in ./${OUTPUT_NAMES.factoryFile}.
 */
import { ${OUTPUT_NAMES.baseClassName} } from "./${OUTPUT_NAMES.generatedFileJs}";
import {
  ${OUTPUT_NAMES.factoryFunctionName},
  type ${OUTPUT_NAMES.configTypeName},
} from "./${OUTPUT_NAMES.factoryFileJs}";
import type { ${OUTPUT_NAMES.delegatesTypeName} } from "./${OUTPUT_NAMES.generatedFileJs}";

export class ${OUTPUT_NAMES.className} extends ${OUTPUT_NAMES.baseClassName} {
  protected readonly clients: ${OUTPUT_NAMES.delegatesTypeName};

  constructor(clients: ${OUTPUT_NAMES.delegatesTypeName}) {
    super();
    this.clients = clients;
  }

  static create(config: ${OUTPUT_NAMES.configTypeName}): ${OUTPUT_NAMES.className} {
    return new ${OUTPUT_NAMES.className}(${OUTPUT_NAMES.factoryFunctionName}(config));
  }

  static fromChannelAccessToken(channelAccessToken: string): ${OUTPUT_NAMES.className} {
    return ${OUTPUT_NAMES.className}.create({ channelAccessToken });
  }
}

export type {
  ${OUTPUT_NAMES.configTypeName},
  ${OUTPUT_NAMES.delegatesTypeName},
};
export { ${OUTPUT_NAMES.factoryFunctionName} };
`;
}
