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

import { FlexBox } from "./models";
import { FlexButton } from "./models";
import { FlexFiller } from "./models";
import { FlexIcon } from "./models";
import { FlexImage } from "./models";
import { FlexSeparator } from "./models";
import { FlexSpan } from "./models";
import { FlexText } from "./models";
import { FlexVideo } from "./models";

export type FlexComponent =
  | FlexBox // box
  | FlexButton // button
  | FlexFiller // filler
  | FlexIcon // icon
  | FlexImage // image
  | FlexSeparator // separator
  | FlexSpan // span
  | FlexText // text
  | FlexVideo // video
  | UnknownFlexComponent;

export type UnknownFlexComponent = FlexComponentBase & {
  [key: string]: unknown;
};

export type FlexComponentBase = {
  /**
   */
  type: string /**/;
};
