/**
 * Webhook Type Definition
 * Webhook event definition of the LINE Messaging API
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { GroupSource } from "./models.js";
import { RoomSource } from "./models.js";
import { UserSource } from "./models.js";

export type Source =
  | GroupSource // group
  | RoomSource // room
  | UserSource; // user

/**
 * the source of the event.
 */
export type SourceBase = {
  /**
   * source type
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#source-user">type Documentation</a>
   */
  type: string /**/;
};
