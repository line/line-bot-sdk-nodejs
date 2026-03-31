type Message = string;

interface Status {
  status: number;
  statusText: string;
}

interface ErrorDetails {
  signature?: string;
  raw?: any;
}

interface FetchErrorDetails extends Status {
  headers: Headers;
  body: string;
}

// Deprecated
interface AxiosErrorDetails {
  originalError: Error;
  code?: string;
  statusCode?: number;
  statusMessage?: string;
}

export class SignatureValidationFailed extends Error {
  public signature?: string;

  constructor(message: Message, { signature }: ErrorDetails = {}) {
    super(message);
    this.name = this.constructor.name;

    Object.assign(this, { signature });
  }
}

export class JSONParseError extends Error {
  public raw: any;

  constructor(message: Message, { raw }: ErrorDetails = {}) {
    super(message);
    this.name = this.constructor.name;

    Object.assign(this, { raw });
  }
}

/**
 * @deprecated Legacy axios-based HTTP client only. `LineBotClient` (fetch-based) does not
 * throw this error. Network-level failures in `LineBotClient` surface as a native `TypeError`
 * from the Fetch API, not as `RequestError`.
 */
export class RequestError extends Error {
  public code: string;

  private originalError: Error;

  constructor(message: Message, { code, originalError }: AxiosErrorDetails) {
    super(message);
    this.name = this.constructor.name;

    Object.assign(this, { code, originalError });
  }
}

/**
 * @deprecated Legacy axios-based HTTP client only. `LineBotClient` (fetch-based) does not
 * throw this error. Read failures in `LineBotClient` propagate unwrapped from the Fetch API.
 */
export class ReadError extends Error {
  public originalError: Error;

  constructor(message: Message, { originalError }: AxiosErrorDetails) {
    super(message);
    this.name = this.constructor.name;

    Object.assign(this, { originalError });
  }
}

/**
 * @deprecated Use `HTTPFetchError` instead. Thrown by the legacy axios-based HTTP client;
 * `LineBotClient` uses the Fetch API and throws `HTTPFetchError` on non-2xx responses.
 * Key differences: `HTTPFetchError` exposes `status`/`statusText`/`headers`/`body`
 * instead of `statusCode`/`statusMessage`/`originalError`.
 */
export class HTTPError extends Error {
  public statusCode: number;

  public statusMessage: string;

  public originalError: any;

  constructor(
    message: Message,
    { statusCode, statusMessage, originalError }: AxiosErrorDetails,
  ) {
    super(message);
    this.name = this.constructor.name;

    Object.assign(this, { statusCode, statusMessage, originalError });
  }
}

export class HTTPFetchError extends Error {
  public status: number;

  public statusText: string;

  public headers: Headers;

  public body: string;

  constructor(
    message: Message,
    { status, statusText, headers, body }: FetchErrorDetails,
  ) {
    super(message);
    this.name = this.constructor.name;

    Object.assign(this, { status, statusText, headers, body });
  }
}
