export class SignatureValidationFailed extends Error {
  constructor(message: string, public signature?: string) {
    super(message);
  }
}

export class JSONParseError extends Error {
  constructor(message: string, public raw: any) {
    super(message);
  }
}

export class RequestError extends Error {
  constructor(
    message: string,
    public code: string,
    private originalError: Error,
  ) {
    super(message);
  }
}

export class ReadError extends Error {
  constructor(private originalError: Error) {
    super(originalError.message);
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
