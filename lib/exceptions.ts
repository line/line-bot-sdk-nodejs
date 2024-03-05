type Message = string;
interface AppErrorDetails {
  signature?: string;
  raw?: any;
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
