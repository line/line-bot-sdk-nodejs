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

import { FlexComponent } from "./flexComponent";

import { FlexComponentBase } from "./models";

export type FlexSpan = FlexComponentBase & {
  type: "span";
  /**
   */
  text?: string /**/;
  /**
   */
  size?: string /**/;
  /**
   */
  color?: string /**/;
  /**
   */
  weight?: FlexSpan.WeightEnum /**/;
  /**
   */
  style?: FlexSpan.StyleEnum /**/;
  /**
   */
  decoration?: FlexSpan.DecorationEnum /**/;
};

export namespace FlexSpan {
  export type WeightEnum = "regular" | "bold";

  export type StyleEnum = "normal" | "italic";

  export type DecorationEnum = "none" | "underline" | "line-through";
}
