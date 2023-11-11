import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { equal } from "assert";

type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

export function readBodyString(req: IncomingMessage): Promise<string> {
  return new Promise(resolve => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body);
    });
  });
}

export async function readBodyJson(req: IncomingMessage): Promise<any> {
  const body = await readBodyString(req);
  return JSON.parse(body);
}

export class TestServer {
  private server: Server;
  private handler: RequestHandler;
  private requestCount: number;
  private url: string | null;

  constructor() {
    this.reset();

    this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
      this.requestCount += 1;
      this.handler(req, res);
    });
  }

  async listen() {
    const listening = new Promise<void>(resolve => {
      this.server.listen(0, resolve);
    });
    await listening;

    const serverAddress = this.server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    this.url = `http://localhost:${serverAddress.port}/`;
  }

  reset() {
    this.handler = (req: IncomingMessage, res: ServerResponse): void => {};
    this.requestCount = 0;
    this.url = undefined;
  }

  getUrl() {
    if (!this.url) {
      throw new Error("URL is not ready");
    }
    return this.url;
  }

  getRequestCount() {
    return this.requestCount;
  }

  setHandler(handler: RequestHandler) {
    this.handler = handler;
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      this.server.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
