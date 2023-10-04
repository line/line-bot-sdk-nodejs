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

export type FlexIcon = FlexComponentBase & {
  type: "icon";
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">url Documentation</a>
   */
  url?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">size Documentation</a>
   */
  size?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">aspectRatio Documentation</a>
   */
  aspectRatio?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">margin Documentation</a>
   */
  margin?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">position Documentation</a>
   */
  position?: FlexIcon.PositionEnum /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">offsetTop Documentation</a>
   */
  offsetTop?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">offsetBottom Documentation</a>
   */
  offsetBottom?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">offsetStart Documentation</a>
   */
  offsetStart?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">offsetEnd Documentation</a>
   */
  offsetEnd?: string /**/;
  /**
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#icon">scaling Documentation</a>
   */
  scaling?: boolean /**/;
};

export namespace FlexIcon {
  export type PositionEnum = "relative" | "absolute";
}
