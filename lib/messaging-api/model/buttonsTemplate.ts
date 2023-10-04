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

import { Action } from "./action";
import { Template } from "./template";

import { TemplateBase } from "./models";

export type ButtonsTemplate = TemplateBase & {
  type: "buttons";
  /**
   */
  thumbnailImageUrl?: string /**/;
  /**
   */
  imageAspectRatio?: string /**/;
  /**
   */
  imageSize?: string /**/;
  /**
   */
  imageBackgroundColor?: string /**/;
  /**
   */
  title?: string /**/;
  /**
   */
  text?: string /**/;
  /**
   */
  defaultAction?: Action /**/;
  /**
   */
  actions?: Array<Action> /**/;
};
