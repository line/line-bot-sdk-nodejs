type Message = string;
interface AppErrorDetails {
  signature?: string;
  raw?: any;
}

interface HTTPErrorDetails {
  status: number;
  statusText: string;
  originalError?: any;
  headers?: Headers;
  body?: string;
}

export class SignatureValidationFailed extends Error {
  public signature?: string;

  constructor(message: Message, { signature }: AppErrorDetails = {}) {
    super(message);
    this.signature = signature;
  }
}

export class JSONParseError extends Error {
  public raw: any;

  constructor(message: Message, { raw }: AppErrorDetails = {}) {
    super(message);
    this.raw = raw;
  }
}

export class ReadError extends Error {
  constructor(message: Message) {
    super(message);
  }
}

export class HTTPError extends Error {
  public status: number;

  public statusText: string;

  public originalError: any;

  constructor(
    message: Message,
    { status, statusText, originalError }: HTTPErrorDetails,
  ) {
    super(message);

    this.status = status;
    this.statusText = statusText;
    this.originalError = originalError;
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

    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.body = body;
  }
}

// only use message. originalError => { message }
export class RequestError extends Error {
  constructor(
    message: string,
    public code: string,
    private originalError: Error, // FIXME: check extends Error that encapsulates originalError is Using
  ) {
    super(message);
  }
}
