import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { Readable } from "node:stream";
import { HTTPError, ReadError, RequestError } from "./exceptions.js";
import { USER_AGENT } from "./version.js";

interface httpClientConfig extends Partial<AxiosRequestConfig> {
  baseURL?: string;
  defaultHeaders?: any;
  responseParser?: <T>(res: AxiosResponse) => T;
}

export default class HTTPClient {
  private instance: AxiosInstance;
  private readonly config: httpClientConfig;

  constructor(config: httpClientConfig = {}) {
    this.config = config;
    const { baseURL, defaultHeaders } = config;
    this.instance = axios.create({
      baseURL,
      headers: Object.assign({}, defaultHeaders, {
        "User-Agent": USER_AGENT,
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
    const res = await this.instance.put<T>(url, body, {
      headers: {
        "Content-Type": "application/json",
        ...(config && config.headers),
      },
      ...config,
    });

    return this.responseParse(res);
  }

  public async postForm<T>(url: string, body?: any): Promise<T> {
    const params = new URLSearchParams();
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        params.append(key, body[key]);
      }
    }
    const res = await this.instance.post(url, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return res.data;
  }

  public async postFormMultipart<T>(url: string, form: FormData): Promise<T> {
    const res = await this.instance.post<T>(url, form);
    return res.data;
  }

  public async putFormMultipart<T>(
    url: string,
    form: FormData,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    const res = await this.instance.put<T>(url, form, config);
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
        "Content-Type": contentType || "image/png",
        "Content-Length": buffer.length,
      },
    });

    return res.data;
  }

  public async postBinaryContent<T>(url: string, body: Blob): Promise<T> {
    const res = await this.instance.post(url, body, {
      headers: {
        "Content-Type": body.type,
        "Content-Length": body.size,
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
      const { status, statusText } = err.response;
      const { message } = err;

      return new HTTPError(message, {
        statusCode: status,
        statusMessage: statusText,
        originalError: err,
      });
    } else if (err.code) {
      const { message, code } = err;
      return new RequestError(message, { code, originalError: err });
    } else if (err.config) {
      // unknown, but from axios
      const { message } = err;

      return new ReadError(message, { originalError: err });
    }

    // otherwise, just rethrow
    return err;
  }
}
