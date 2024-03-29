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

import { DeliveryContext } from "./deliveryContext";
import { Event } from "./event";
import { EventMode } from "./eventMode";
import { PostbackContent } from "./postbackContent";
import { Source } from "./source";

/**
 * Event object for when a user performs a postback action which initiates a postback. You can reply to postback events.
 */
import { EventBase } from "./models";

export type PostbackEvent = EventBase & {
  type: "postback";
  /**
   * Reply token used to send reply message to this event
   */
  replyToken?: string /**/;
  /**
   */
  postback: PostbackContent /**/;
};

export namespace PostbackEvent {}
