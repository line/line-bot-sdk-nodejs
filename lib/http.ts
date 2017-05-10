import * as got from "got";
import {
  HTTPError,
  JSONParseError,
  ReadError,
  RequestError,
} from "./exceptions";

const pkg = require("../package.json"); // tslint:disable-line no-var-requires

function parseJSON(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new JSONParseError(err.message, raw);
  }
}

function wrapError(err: Error) {
  if (err instanceof got.RequestError) {
    throw new RequestError(err as any);
  } else if (err instanceof got.ReadError) {
    throw new ReadError(err as any);
  } else if (err instanceof got.HTTPError) {
    throw new HTTPError(err as any);
  }

  // otherwise, just rethrow
  throw err;
}

const userAgent = `${pkg.name}/${pkg.version}`;

export function stream(url: string, headers: any): NodeJS.ReadableStream {
  headers["User-Agent"] = userAgent;
  return got.stream(url, { headers });
}

export function get(url: string, headers: any): Promise<any> {
  headers["User-Agent"] = userAgent;
  return got
    .get(url, { headers })
    .then((res: any) => parseJSON(res.body))
    .catch(wrapError);
}

export function post(url: string, headers: any, body?: any): Promise<any> {
  headers["Content-Type"] = "application/json";
  headers["User-Agent"] = userAgent;
  return got
    .post(url, {
      body: JSON.stringify(body),
      headers,
    })
    .then((res: any) => parseJSON(res.body))
    .catch(wrapError);
}
