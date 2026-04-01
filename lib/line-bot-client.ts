/**
 * This file is intended for manual edits.
 *
 * Generated delegation methods live in ./line-bot-client.generated.ts.
 * Generated factory helpers live in ./line-bot-client.factory.generated.ts.
 */
import { LineBotClientBase } from "./line-bot-client.generated.js";
import { createLineBotClientDelegates } from "./line-bot-client.factory.generated.js";
import type { LineBotClientDelegates } from "./line-bot-client.generated.js";

interface LineBotClientCommonConfig {
  readonly defaultHeaders?: Record<string, string>;
  readonly apiBaseURL?: string;
  readonly dataApiBaseURL?: string;
  readonly managerBaseURL?: string;
}

export interface LineBotClientChannelAccessTokenConfig extends LineBotClientCommonConfig {
  readonly channelAccessToken: string;
}

// TODO: Use this in another PR.
/// Expected flow
/// 1. Define a class to rotate channel access token automatically
/// 2. Update access token with (1)
/// 3. Allow LineBotClient to receive |LineBotClientChannelCredentialsConfig|
/// 4. Write document well
interface LineBotClientChannelCredentialsConfig extends LineBotClientCommonConfig {
  readonly channelId: string;
  readonly channelSecret: string;
}

function assertNonEmptyString(
  name: string,
  value: unknown,
): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${name} must be a non-empty string.`);
  }
}

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
 * const client = LineBotClient.fromChannelAccessToken({ channelAccessToken: "..." });
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

  public static fromChannelAccessToken(
    config: LineBotClientChannelAccessTokenConfig,
  ): LineBotClient {
    assertNonEmptyString("channelAccessToken", config.channelAccessToken);

    return new LineBotClient(
      createLineBotClientDelegates({
        channelAccessToken: config.channelAccessToken,
        defaultHeaders: config.defaultHeaders,
        apiBaseURL: config.apiBaseURL,
        dataApiBaseURL: config.dataApiBaseURL,
        managerBaseURL: config.managerBaseURL,
      }),
    );
  }
}
