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
