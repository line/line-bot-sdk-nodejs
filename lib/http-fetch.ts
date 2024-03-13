import { Readable } from "node:stream";
import { HTTPFetchError } from "./exceptions";

const pkg = require("../package.json");
export interface FetchRequestConfig {
  headers?: Record<string, string>;
}

interface httpFetchClientConfig {
  baseURL: string;
  defaultHeaders: Record<string, string>;
}

export function convertResponseToReadable(response: Response): Readable {
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

export default class HTTPFetchClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: httpFetchClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "User-Agent": `${pkg.name}/${pkg.version}`,
      ...config.defaultHeaders,
    };
  }

  public async get<T>(url: string, params?: any): Promise<Response> {
    const requestUrl = new URL(url, this.baseURL);
    if (params) {
      const searchParams = new URLSearchParams();
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          searchParams.append(key, params[key]);
        }
      }
      requestUrl.search = searchParams.toString();
    }
    const response = await fetch(requestUrl, {
      headers: this.defaultHeaders,
    });
    await this.checkResponseStatus(response);
    return response;
  }

  public async post(
    url: string,
    body?: any,
    config?: Partial<FetchRequestConfig>,
  ): Promise<Response> {
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
    return response;
  }

  public async put(
    url: string,
    body?: any,
    config?: Partial<FetchRequestConfig>,
  ): Promise<Response> {
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
    return response;
  }

  public async postForm(url: string, body?: any): Promise<Response> {
    const requestUrl = new URL(url, this.baseURL);
    const params = new URLSearchParams();
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        params.append(key, body[key]);
      }
    }
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...this.defaultHeaders,
      },
      body: params.toString(),
    });
    await this.checkResponseStatus(response);
    return response;
  }

  public async postFormMultipart(
    url: string,
    form: FormData,
  ): Promise<Response> {
    const requestUrl = new URL(url, this.baseURL);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
      },
      body: form,
    });
    await this.checkResponseStatus(response);
    return response;
  }

  public async putFormMultipart(
    url: string,
    form: FormData,
    config?: Partial<FetchRequestConfig>,
  ): Promise<Response> {
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
    return response;
  }
  public async postBinaryContent(url: string, body: Blob): Promise<Response> {
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
    return response;
  }

  public async delete(url: string, params?: any): Promise<Response> {
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
    return response;
  }

  private async checkResponseStatus(response: Response) {
    const { ok, status, statusText, headers } = response;
    const message = `${status} - ${statusText}`;

    if (!ok) {
      const body = await response.text();

      throw new HTTPFetchError(message, {
        status,
        statusText,
        headers,
        body,
      });
    }
  }
}
