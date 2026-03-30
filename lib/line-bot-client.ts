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

export class LineBotClient extends LineBotClientBase {
  protected readonly clients: LineBotClientDelegates;

  constructor(clients: LineBotClientDelegates) {
    super();
    this.clients = clients;
  }

  static create(config: LineBotClientConfig): LineBotClient {
    return new LineBotClient(createLineBotClientDelegates(config));
  }
}

export type { LineBotClientConfig, LineBotClientDelegates };
export { createLineBotClientDelegates };
