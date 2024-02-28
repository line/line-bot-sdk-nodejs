import { Readable } from "stream";
import { HTTPError } from "./exceptions";
import * as qs from "querystring";

const pkg = require("../package.json");
export interface FetchRequestConfig {
  headers?: Record<string, string>;
}

interface httpFetchClientConfig {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  responseParser: <T>(res: Response) => T;
}

export default class HTTPFetchClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly responseParser: <T>(res: Response) => T;

  constructor(config: httpFetchClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "User-Agent": `${pkg.name}/${pkg.version}`,
      ...config.defaultHeaders,
    };
    this.responseParser = config.responseParser;
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const queryString = params ? `?${qs.stringify(params)}` : "";
    const response = await fetch(`${this.baseURL}${url}${queryString}`, {
      headers: this.defaultHeaders,
    });
    this.checkResponseStatus(response);
    return response.json();
  }

  public async getStream(url: string, params?: any): Promise<Readable> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    const response = await fetch(this.baseURL + url + queryString, {
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
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(config && config.headers),
      },
      body: JSON.stringify(body),
    });
    this.checkResponseStatus(response);
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
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...(config && config.headers),
      },
      body: JSON.stringify(body),
    });
    this.checkResponseStatus(response);
    return this.responseParse(response);
  }

  public async postForm<T>(url: string, body?: any): Promise<T> {
    const response = await fetch(this.baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.defaultHeaders,
      },
      body: qs.stringify(body),
    });
    this.checkResponseStatus(response);
    return response.json();
  }

  public async postFormMultipart<T>(url: string, form: FormData): Promise<T> {
    const response = await fetch(this.baseURL + url, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
      },
      body: form,
    });
    this.checkResponseStatus(response);
    return response.json();
  }

  public async putFormMultipart<T>(
    url: string,
    form: FormData,
    config?: Partial<FetchRequestConfig>,
  ): Promise<T> {
    const response = await fetch(this.baseURL + url, {
      method: "PUT",
      headers: {
        ...this.defaultHeaders,
        ...(config && (config.headers ? config.headers : {})),
      },
      body: form,
    });
    this.checkResponseStatus(response);
    return response.json();
  }
  public async postBinaryContent<T>(url: string, body: Blob): Promise<T> {
    const response = await fetch(this.baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": body.type,
        ...this.defaultHeaders,
      },
      body: body,
    });
    this.checkResponseStatus(response);
    return response.json();
  }

  public async delete<T>(url: string, params?: any): Promise<T> {
    const queryParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const response = await fetch(this.baseURL + url + queryParams, {
      method: "DELETE",
      headers: {
        ...this.defaultHeaders,
      },
    });
    this.checkResponseStatus(response);
    return response.json();
  }

  private checkResponseStatus(response: Response) {
    if (!response.ok) {
      throw new HTTPError(
        "HTTP request failed",
        response.status,
        response.statusText,
        undefined,
      );
    }
  }
}
