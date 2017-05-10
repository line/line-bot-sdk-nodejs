import * as got from "got";

export class SignatureValidationFailed extends Error {
  public signature: string;

  constructor(msg: string, signature: string) {
    super(msg);
    this.signature = signature;
  }
}

export class JSONParseError extends Error {
  public raw: string;

  constructor(msg: string, raw: string) {
    super(msg);
    this.raw = raw;
  }
}

export class RequestError extends Error {
  public code: string;
  private origin: Error;

  constructor(gotErr: RequestError) {
    super(gotErr.message);
    this.code = gotErr.code;
    this.origin = gotErr;
  }
}

export class ReadError extends Error {
  private origin: Error;

  constructor(gotErr: ReadError) {
    super(gotErr.message);
    this.origin = gotErr;
  }
}

export class HTTPError extends Error {
  public statusCode: number;
  public statusMessage: string;
  private origin: Error;

  constructor(gotErr: HTTPError) {
    super(gotErr.message);
    this.statusCode = gotErr.statusCode;
    this.statusMessage = gotErr.statusMessage;
    this.origin = gotErr;
  }
}
