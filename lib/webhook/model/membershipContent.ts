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

import { JoinedMembershipContent } from "./models.js";
import { LeftMembershipContent } from "./models.js";
import { RenewedMembershipContent } from "./models.js";

export type MembershipContent =
  | JoinedMembershipContent // joined
  | LeftMembershipContent // left
  | RenewedMembershipContent; // renewed

/**
 * Content of the membership event.
 */
export type MembershipContentBase = {
  /**
   * Type of membership event.
   */
  type: string /**/;
};
