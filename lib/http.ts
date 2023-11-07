import { Readable } from "stream";
import type { ReadableStream } from "node:stream/web";
import { HTTPError, ReadError, RequestError } from "./exceptions";
import * as fileType from "file-type";
import * as qs from "querystring";
import * as merge from "deepmerge";

const pkg = require("../package.json");

export interface RequestFile {
  data: Blob;
  contentType: string;
}

interface httpClientConfig extends Partial<RequestInit> {
  baseURL?: string;
  defaultHeaders?: HeadersInit;
  responseParser?: <T>(res: Response) => Promise<T>;
  onError?: (err: any) => any;
}

const wrapFetch = (config: httpClientConfig) => {
  return (
    url: string,
    params?: any,
    requestConfig?: RequestInit,
  ): Promise<Response> =>
    new Promise(async (resolve, reject) => {
      const requestUrl = new URL(url, config.baseURL);

      if (params && Object.keys(params).length !== 0) {
        if (typeof params === "object") {
          Object.entries(params).forEach(([key, value]) =>
            requestUrl.searchParams.set(...[key, String(value)]),
          );
        } else {
          requestUrl.search = params;
        }
      }

      const promise = fetch(requestUrl, merge(requestConfig, config));
      promise.catch(err => {
        if (err instanceof TypeError)
          reject(config.onError({ ...err, code: "" }));
        if (err instanceof DOMException) reject(config.onError(err));
      });
      promise.then(async res => {
        if (!res.ok)
          return reject(
            config.onError({
              response: res,
              message: await res.text(),
            }),
          );
        resolve(res);
      });
    });
};

export default class HTTPClient {
  private fetch: (
    url: string,
    params?: any,
    requestConfig?: RequestInit,
  ) => Promise<Response>;
  private config: httpClientConfig;

  constructor(config: httpClientConfig = {}) {
    this.config = config;
    const { baseURL, defaultHeaders } = config;
    this.fetch = wrapFetch({
      baseURL,
      headers: Object.assign({}, defaultHeaders, {
        "User-Agent": `${pkg.name}/${pkg.version}`,
      }),
      onError: err => this.wrapError(err),
    });
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const res = await this.fetch(url, params);
    return await res.json();
  }

  public async getStream(url: string, params?: any): Promise<Readable> {
    const res = (await this.fetch(url, params)).body;
    return Readable.fromWeb(res as ReadableStream<Uint8Array>);
  }

  public async post<T>(
    url: string,
    body?: any,
    config?: Partial<RequestInit>,
  ): Promise<T> {
    const res = await this.fetch(
      url,
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body instanceof Object ? JSON.stringify(body) : body,
        ...config,
      },
    );

    return await this.responseParse(res);
  }

  private async responseParse(res: Response) {
    const { responseParser } = this.config;
    if (responseParser) return await responseParser(res);
    else return await res.json();
  }

  public async put<T>(
    url: string,
    body?: any,
    config?: Partial<RequestInit>,
  ): Promise<T> {
    const res = await this.fetch(
      url,
      {},
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: body instanceof Object ? JSON.stringify(body) : body,
        ...config,
      },
    );

    return await this.responseParse(res);
  }

  public async postForm<T>(url: string, body?: any): Promise<T> {
    const res = await this.fetch(
      url,
      {},
      {
        method: "POST",
        body: qs.stringify(body),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    return await res.json();
  }

  public async postFormMultipart<T>(url: string, form: FormData): Promise<T> {
    const res = await this.fetch(
      url,
      {},
      {
        method: "POST",
        body: form,
      },
    );
    return await res.json();
  }

  public async putFormMultipart<T>(url: string, form: FormData): Promise<T> {
    const res = await this.fetch(
      url,
      {},
      {
        method: "PUT",
        body: form,
      },
    );
    return await res.json();
  }

  public async toBuffer(data: Buffer | Readable) {
    if (Buffer.isBuffer(data)) {
      return data;
    } else if (data instanceof Readable) {
      return await new Promise<Buffer>((resolve, reject) => {
        const buffers: Buffer[] = [];
        let size = 0;
        data.on("data", (chunk: Buffer) => {
          buffers.push(chunk);
          size += chunk.length;
        });
        data.on("end", () => resolve(Buffer.concat(buffers, size)));
        data.on("error", reject);
      });
    } else {
      throw new Error("invalid data type for binary data");
    }
  }

  public async postBinary<T>(
    url: string,
    data: Buffer | Readable,
    contentType?: string,
  ): Promise<T> {
    const buffer = await this.toBuffer(data);

    const res = await this.fetch(
      url,
      {},
      {
        method: "POST",
        body: buffer,
        headers: {
          "Content-Type":
            contentType || (await fileType.fromBuffer(buffer)).mime,
          "Content-Length": buffer.length.toString(),
        },
      },
    );

    return await res.json();
  }

  public async postBinaryContent<T>(url: string, body: Blob): Promise<T> {
    const res = await this.fetch(
      url,
      {},
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": body.type,
          "Content-Length": body.size.toString(),
        },
      },
    );

    return await res.json();
  }

  public async delete<T>(url: string, params?: any): Promise<T> {
    const res = await this.fetch(url, params, { method: "DELETE" });
    return await res.json();
  }

  private wrapError(err: any): Error {
    if (err.response) {
      return new HTTPError(
        err.message,
        err.response.status,
        err.response.statusText,
        err,
      );
    } else if (err.code) {
      return new RequestError(err.message, err.code, err);
    } else if (err.name === "AbortError") {
      return new ReadError(err);
    }

    // otherwise, just rethrow
    return err;
  }
}
