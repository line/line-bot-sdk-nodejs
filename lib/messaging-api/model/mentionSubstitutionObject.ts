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

import { MentionTarget } from "./mentionTarget.js";
import { SubstitutionObject } from "./substitutionObject.js";

/**
 * An object representing a mention substitution.
 */
import { SubstitutionObjectBase } from "./models.js";

export type MentionSubstitutionObject = SubstitutionObjectBase & {
  type: "mention";
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#text-message-v2-mention-object">mentionee Documentation</a>
   */
  mentionee?: MentionTarget /**/;
};
