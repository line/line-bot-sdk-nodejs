type Message = string;

interface AppErrorDetails {
  signature?: string;
  raw?: any;
}

interface HTTPErrorDetails {
  status: number;
  statusText: string;
  headers?: Headers;
  body?: string;
  originalError?: any;
  code?: string;
}

export class SignatureValidationFailed extends Error {
  public signature?: string;

  constructor(message: Message, { signature }: AppErrorDetails = {}) {
    super(message);
    this.name = this.constructor.name;

    this.signature = signature;
  }
}

export class JSONParseError extends Error {
  public raw: any;

  constructor(message: Message, { raw }: AppErrorDetails = {}) {
    super(message);
    this.name = this.constructor.name;

    this.raw = raw;
  }
}

export class ReadError extends Error {
  constructor(message: Message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class HTTPFetchError extends Error {
  public status: number;

  public statusText: string;

  public headers: Headers;

  public body: string;

  constructor(
    message: Message,
    { status, statusText, headers, body }: HTTPErrorDetails,
  ) {
    super(message);
    this.name = this.constructor.name;

    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.body = body;
  }
}

/* Deprecated */
export class HTTPError extends Error {
  public status: number;

  public statusText: string;

  public originalError: any;

  constructor(
    message: Message,
    { status, statusText, originalError }: HTTPErrorDetails,
  ) {
    super(message);
    this.name = this.constructor.name;

    this.status = status;
    this.statusText = statusText;
    this.originalError = originalError;
  }
}

export class RequestError extends Error {
  public code: string;

  public originalError: any;

  constructor(
    message: Message,
    { code, originalError }: Omit<HTTPErrorDetails, "status" | "statusText">,
  ) {
    super(message);
    this.name = this.constructor.name;

    this.code = code;
    this.originalError = originalError;
  }
}
