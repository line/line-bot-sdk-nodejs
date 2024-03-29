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
import { QuickReply } from "./quickReply";
import { Sender } from "./sender";

import { MessageBase } from "./models";

export type AudioMessage = MessageBase & {
  type: "audio";
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#audio-message">originalContentUrl Documentation</a>
   */
  originalContentUrl: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#audio-message">duration Documentation</a>
   */
  duration: number /**/;
};
