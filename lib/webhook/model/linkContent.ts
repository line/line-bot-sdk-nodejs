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

/**
 * Content of the account link event.
 */
export type LinkContent = {
  /**
   * One of the following values to indicate whether linking the account was successful or not
   */
  result: LinkContent.ResultEnum /**/;
  /**
   * Specified nonce (number used once) when verifying the user ID.
   */
  nonce: string /**/;
};

export namespace LinkContent {
  export type ResultEnum = "ok" | "failed";
}
