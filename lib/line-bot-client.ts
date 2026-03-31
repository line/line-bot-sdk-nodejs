/**
 * This file is intended for manual edits.
 *
 * Generated delegation methods live in ./line-bot-client.generated.ts.
 * Generated factory helpers live in ./line-bot-client.factory.generated.ts.
 */
import { LineBotClientBase } from "./line-bot-client.generated.js";
import {
  createLineBotClientDelegates,
  type LineBotClientConfig,
} from "./line-bot-client.factory.generated.js";
import type { LineBotClientDelegates } from "./line-bot-client.generated.js";

// Populated by the static initializer block below; used by createLineBotClientForTest.
let _createForTest!: (
  config: LineBotClientConfig,
  overrides: Partial<LineBotClientDelegates>,
) => LineBotClient;

export class LineBotClient extends LineBotClientBase {
  protected readonly clients: LineBotClientDelegates;

  private constructor(clients: LineBotClientDelegates) {
    super();
    this.clients = clients;
  }

  static {
    _createForTest = (config, overrides) =>
      new LineBotClient(createLineBotClientDelegates(config, overrides));
  }

  static create(config: LineBotClientConfig): LineBotClient {
    return new LineBotClient(createLineBotClientDelegates(config));
  }
}

export type { LineBotClientConfig };

// repo-internal test hook; do not re-export from lib/index.ts
export function createLineBotClientForTest(
  config: LineBotClientConfig,
  overrides: Partial<LineBotClientDelegates>,
): LineBotClient {
  return _createForTest(config, overrides);
}
