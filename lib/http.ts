import axios, { AxiosError } from "axios";
import {
  HTTPError,
  JSONParseError,
  ReadError,
  RequestError,
} from "./exceptions";

const pkg = require("../package.json"); // tslint:disable-line no-var-requires

function checkJSON(raw: any): any {
  if (typeof raw === "object") {
    return raw;
  } else {
    throw new JSONParseError("Failed to parse response body as JSON", raw);
  }
}

function wrapError(err: AxiosError) {
  if (err.response) {
    throw new HTTPError(
      err.message,
      err.response.status,
      err.response.statusText,
      err,
    );
  } else if (err.code) {
    throw new RequestError(
      err.message,
      err.code,
      err,
    );
  } else if (err.config) {
    // unknown, but from axios
    throw new ReadError(err);
  }

  // otherwise, just rethrow
  throw err;
}

const userAgent = `${pkg.name}/${pkg.version}`;

export function stream(url: string, headers: any): Promise<NodeJS.ReadableStream> {
  headers["User-Agent"] = userAgent;
  return axios
    .get(url, { headers, responseType: "stream" })
    .then((res) => res.data as NodeJS.ReadableStream);
}

export function get(url: string, headers: any): Promise<any> {
  headers["User-Agent"] = userAgent;

  return axios
    .get(url, { headers })
    .then((res) => checkJSON(res.data))
    .catch(wrapError);
}

export function post(url: string, headers: any, data?: any): Promise<any> {
  headers["Content-Type"] = "application/json";
  headers["User-Agent"] = userAgent;
  return axios
    .post(url, data, { headers })
    .then((res) => checkJSON(res.data))
    .catch(wrapError);
}
