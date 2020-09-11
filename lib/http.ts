import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { Readable } from "stream";
import { HTTPError, ReadError, RequestError } from "./exceptions";
import * as fileType from "file-type";
import * as qs from "querystring";

const pkg = require("../package.json");

interface httpClientConfig extends Partial<AxiosRequestConfig> {
  baseURL?: string;
  defaultHeaders?: any;
  responseParser?: <T>(res: AxiosResponse) => T;
}

export default class HTTPClient {
  private instance: AxiosInstance;
  private config: httpClientConfig;

  constructor(config: httpClientConfig = {}) {
    this.config = config;
    const { baseURL, defaultHeaders } = config;
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

  public async get<T>(url: string, params?: any): Promise<T> {
    const res = await this.instance.get(url, { params });
    return res.data;
  }

  public async getStream(url: string, params?: any): Promise<Readable> {
    const res = await this.instance.get(url, {
      params,
      responseType: "stream",
    });
    return res.data as Readable;
  }

  public async post<T>(
    url: string,
    body?: any,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    const res = await this.instance.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        ...(config && config.headers),
      },
      ...config,
    });

    return this.responseParse(res);
  }

  private responseParse(res: AxiosResponse) {
    const { responseParser } = this.config;
    if (responseParser) return responseParser(res);
    else return res.data;
  }

  public async put<T>(
    url: string,
    body?: any,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    const res = await this.instance.put(url, body, {
      headers: {
        "Content-Type": "application/json",
        ...(config && config.headers),
      },
      ...config,
    });

    return this.responseParse(res);
  }

  public async postForm<T>(url: string, body?: any): Promise<T> {
    const res = await this.instance.post(url, qs.stringify(body), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data;
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

    const res = await this.instance.post(url, buffer, {
      headers: {
        "Content-Type": contentType || (await fileType.fromBuffer(buffer)).mime,
        "Content-Length": buffer.length,
      },
    });

    return res.data;
  }

  public async delete<T>(url: string, params?: any): Promise<T> {
    const res = await this.instance.delete(url, { params });
    return res.data;
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
