type Message = string;
interface ErrorDetails {
  signature?: string;
  raw?: any;
}

/* App Error */
export class SignatureValidationFailed extends Error {
  public signature?: string;

  constructor(message: Message, { signature }: ErrorDetails = {}) {
    super(message);
    this.signature = signature;
  }
}

export class JSONParseError extends Error {
  public raw: any;

  constructor(message: Message, { raw }: ErrorDetails = {}) {
    super(message);
    this.raw = raw;
  }
}

// only use message. originalError => { message }
export class ReadError extends Error {
  constructor(private originalError: Error) {
    super(originalError.message);
  }
}

/* HTTP Error */
export class HTTPError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public statusMessage: string,
    public originalError: any,
  ) {
    super(message);
  }
}

export class HTTPFetchError extends Error {
  constructor(
    public statusCode: number,
    public statusMessage: string,
    public headers: Headers,
    public body: string,
  ) {
    super(`${statusCode} - ${statusMessage}`);
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
