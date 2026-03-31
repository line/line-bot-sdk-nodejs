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

/**
 * A single client for all LINE Bot APIs, except channel access token management.
 *
 * Wraps all individual API clients (Messaging API, LIFF, Insight, etc.)
 * and exposes their methods directly, so you don't need to manage
 * multiple client instances.
 * For channel access token operations, use {@link ChannelAccessTokenClient} directly.
 *
 * @example
 * ```typescript
 * const client = LineBotClient.create({ channelAccessToken: "..." });
 * ```
 *
 * @example Push a message to a user
 * ```typescript
 * await client.pushMessage({
 *   to: userId,
 *   messages: [{ type: "text", text: "Hi there!" }],
 * });
 * ```
 *
 * @example Get a user's profile
 * ```typescript
 * const profile = await client.getProfile(userId);
 * console.log(profile.displayName);
 * ```
 */
export class LineBotClient extends LineBotClientBase {
  protected readonly clients: LineBotClientDelegates;

  private constructor(clients: LineBotClientDelegates) {
    super();
    this.clients = clients;
  }

  static create(config: LineBotClientConfig): LineBotClient {
    return new LineBotClient(createLineBotClientDelegates(config));
  }
}

export type { LineBotClientConfig };
