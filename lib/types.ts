export interface MiddlewareConfig {
  channelSecret: string;

  // skipSignatureValidation is a function that determines whether to skip
  // webhook signature verification.
  //
  // If the function returns true, the signature verification step is skipped.
  // This can be useful in scenarios such as when you're in the process of updating
  // the channel secret and need to temporarily bypass verification to avoid disruptions.
  skipSignatureVerification?: () => boolean;
}

export const LINE_REQUEST_ID_HTTP_HEADER_NAME = "x-line-request-id";
export type MessageAPIResponseBase = {
  [LINE_REQUEST_ID_HTTP_HEADER_NAME]?: string;
};

export const LINE_SIGNATURE_HTTP_HEADER_NAME = "x-line-signature";

export interface ApiResponseType<T> {
  httpResponse: Response;
  body: T;
}
