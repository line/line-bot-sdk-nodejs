import axios, { AxiosInstance, AxiosError } from "axios";
import { Readable } from "stream";
import { HTTPError, ReadError, RequestError } from "./exceptions";
import * as fileType from "file-type";

const pkg = require("../package.json");

export default class HTTPClient {
  private instance: AxiosInstance;

  constructor(baseURL?: string, defaultHeaders?: any) {
    this.instance = axios.create({
      baseURL,
      headers: Object.assign({}, defaultHeaders, {
        "User-Agent": `${pkg.name}/${pkg.version}`,
      }),
    });

    this.instance.interceptors.response.use(
      res => res,
      err => Promise.reject(this.wrapError(err)),
    );
  }

  public get<T>(url: string, params?: any): Promise<T> {
    return this.instance.get(url, { params }).then(res => res.data);
  }

  public getStream(url: string, params?: any): Promise<Readable> {
    return this.instance
      .get(url, { params, responseType: "stream" })
      .then(res => res.data as Readable);
  }

  public post<T>(url: string, data?: any): Promise<T> {
    return this.instance
      .post(url, data, { headers: { "Content-Type": "application/json" } })
      .then(res => res.data);
  }

  public postBinary<T>(
    url: string,
    data: Buffer | Readable,
    contentType?: string,
  ): Promise<T> {
    let getBuffer: Promise<Buffer>;

    if (Buffer.isBuffer(data)) {
      getBuffer = Promise.resolve(data);
    } else {
      getBuffer = new Promise((resolve, reject) => {
        if (data instanceof Readable) {
          const buffers: Buffer[] = [];
          let size = 0;
          data.on("data", (chunk: Buffer) => {
            buffers.push(chunk);
            size += chunk.length;
          });
          data.on("end", () => resolve(Buffer.concat(buffers, size)));
          data.on("error", reject);
        } else {
          reject(new Error("invalid data type for postBinary"));
        }
      });
    }

    return getBuffer.then(data => {
      return this.instance
        .post(url, data, {
          headers: {
            "Content-Type": contentType || fileType(data).mime,
            "Content-Length": data.length,
          },
        })
        .then(res => res.data);
    });
  }

  public delete<T>(url: string, params?: any): Promise<T> {
    return this.instance.delete(url, { params }).then(res => res.data);
  }

  private wrapError(err: AxiosError): Error {
    if (err.response) {
      return new HTTPError(
        err.message,
        err.response.status,
        err.response.statusText,
        err,
      );
    } else if (err.code) {
      return new RequestError(err.message, err.code, err);
    } else if (err.config) {
      // unknown, but from axios
      return new ReadError(err);
    }

    // otherwise, just rethrow
    return err;
  }
}
