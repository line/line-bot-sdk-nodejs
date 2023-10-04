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

import { CarouselColumn } from "./carouselColumn";
import { Template } from "./template";

import { TemplateBase } from "./models";

export type CarouselTemplate = TemplateBase & {
  type: "carousel";
  /**
   */
  columns?: Array<CarouselColumn> /**/;
  /**
   */
  imageAspectRatio?: string /**/;
  /**
   */
  imageSize?: string /**/;
};
