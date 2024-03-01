import { Readable } from "stream";
import { HTTPError, HTTPFetchError } from "./exceptions";
import * as qs from "querystring";

const pkg = require("../package.json");
export interface FetchRequestConfig {
  headers?: Record<string, string>;
}

interface httpFetchClientConfig {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  responseParser: <T>(res: Response) => Promise<T>;
}

export default class HTTPFetchClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly responseParser: <T>(res: Response) => Promise<T>;

  constructor(config: httpFetchClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "User-Agent": `${pkg.name}/${pkg.version}`,
      ...config.defaultHeaders,
    };
    this.responseParser = config.responseParser;
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    if (params) {
      requestUrl.search = qs.stringify(params);
    }
    const response = await fetch(requestUrl, {
      headers: this.defaultHeaders,
    });
    await this.checkResponseStatus(response);
    return response.json();
  }

  public async getStream(url: string, params?: any): Promise<Readable> {
    const requestUrl = new URL(url, this.baseURL);
    if (params) {
      requestUrl.search = new URLSearchParams(params).toString();
    }
    const response = await fetch(requestUrl, {
      headers: this.defaultHeaders,
    });
    const reader = response.body.getReader();
    return new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      },
    });
  }

  public async post<T>(
    url: string,
    body?: any,
    config?: Partial<FetchRequestConfig>,
  ): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(config && config.headers),
      },
      body: JSON.stringify(body),
    });
    await this.checkResponseStatus(response);
    return this.responseParse(response);
  }

  private async responseParse<T>(res: Response): Promise<T> {
    if (this.responseParser) return this.responseParser(res);
    else return await res.json();
  }

  public async put<T>(
    url: string,
    body?: any,
    config?: Partial<FetchRequestConfig>,
  ): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(config && config.headers),
      },
      body: JSON.stringify(body),
    });
    await this.checkResponseStatus(response);
    return this.responseParse(response);
  }

  public async postForm<T>(url: string, body?: any): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.defaultHeaders,
      },
      body: qs.stringify(body),
    });
    await this.checkResponseStatus(response);
    return response.json();
  }

  public async postFormMultipart<T>(url: string, form: FormData): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
      },
      body: form,
    });
    await this.checkResponseStatus(response);
    return response.json();
  }

  public async putFormMultipart<T>(
    url: string,
    form: FormData,
    config?: Partial<FetchRequestConfig>,
  ): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        ...this.defaultHeaders,
        ...(config && (config.headers ? config.headers : {})),
      },
      body: form,
    });
    await this.checkResponseStatus(response);
    return response.json();
  }
  public async postBinaryContent<T>(url: string, body: Blob): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": body.type,
        ...this.defaultHeaders,
      },
      body: body,
    });
    await this.checkResponseStatus(response);
    return response.json();
  }

  public async delete<T>(url: string, params?: any): Promise<T> {
    const requestUrl = new URL(url, this.baseURL);
    if (params) {
      requestUrl.search = new URLSearchParams(params).toString();
    }
    const response = await fetch(requestUrl, {
      method: "DELETE",
      headers: {
        ...this.defaultHeaders,
      },
    });
    await this.checkResponseStatus(response);
    return response.json();
  }

  private async checkResponseStatus(response: Response) {
    if (!response.ok) {
      throw new HTTPFetchError(
        response.status,
        response.statusText,
        response.headers,
        await response.text(),
      );
    }
  }
}
