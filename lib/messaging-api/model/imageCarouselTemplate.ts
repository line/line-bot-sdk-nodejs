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

import { ImageCarouselColumn } from "./imageCarouselColumn";
import { Template } from "./template";

import { TemplateBase } from "./models";

export type ImageCarouselTemplate = TemplateBase & {
  type: "image_carousel";
  /**
   */
  columns: Array<ImageCarouselColumn> /**/;
};
