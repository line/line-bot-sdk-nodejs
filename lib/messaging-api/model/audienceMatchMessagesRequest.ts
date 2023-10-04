/**
 * LINE Messaging API
 * This document describes LINE Messaging API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Message } from "./message";

export type AudienceMatchMessagesRequest = {
  /**
   * Destination of the message (A value obtained by hashing the telephone number, which is another value normalized to E.164 format, with SHA256).
   *
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#phone-audience-match">messages Documentation</a>
   */
  messages: Array<Message> /**/;
  /**
   * Message to send.
   *
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#phone-audience-match">to Documentation</a>
   */
  to: Array<string> /**/;
  /**
   * `true`: The user doesn’t receive a push notification when a message is sent. `false`: The user receives a push notification when the message is sent (unless they have disabled push notifications in LINE and/or their device). The default value is false.
   *
   * @see <a href="https://developers.line.biz/en/reference/partner-docs/#phone-audience-match">notificationDisabled Documentation</a>
   */
  notificationDisabled?: boolean /* = false*/;
};
