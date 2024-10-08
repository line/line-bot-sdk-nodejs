/**
 * Channel Access Token API
 * This document describes Channel Access Token API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * Issued channel access token
 */
export type IssueChannelAccessTokenResponse = {
  /**
   * Channel access token.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token-v2-1">accessToken Documentation</a>
   */
  access_token: string /**/;
  /**
   * Amount of time in seconds from issue to expiration of the channel access token
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token-v2-1">expiresIn Documentation</a>
   */
  expires_in: number /**/;
  /**
   * A token type.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token-v2-1">tokenType Documentation</a>
   */
  token_type: string /* = 'Bearer'*/;
  /**
   * Unique key ID for identifying the channel access token.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token-v2-1">keyId Documentation</a>
   */
  key_id: string /**/;
};
