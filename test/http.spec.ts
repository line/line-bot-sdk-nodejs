import { deepEqual, equal, ok } from "assert";
import { HTTPError } from "../lib/exceptions";
import HTTPClient from "../lib/http";
import { getStreamData } from "./helpers/stream";
import { createReadStream, readFileSync } from "fs";
import { join } from "path";
import * as fs from "fs";
import { TestServer, readBodyJson } from "./helpers/server";

const pkg = require("../package.json");
describe("legacy http", () => {

  const server = new TestServer();
  beforeEach(async () => {
    server.reset();
    await server.listen();
  });
  afterEach(async () => {
    await server.close();
  });

  const getHttpClient = () => {
    return new HTTPClient({
      baseURL: server.getUrl(),
      defaultHeaders: {
        "test-header-key": "Test-Header-Value",
      },
    });
  };

  const interceptionOption: Record<string, string> = {
    "test-header-key": "Test-Header-Value",
    "user-agent": `${pkg.name}/${pkg.version}`,
  };

  const mockGet = (path: string, expectedQuery?: Record<string, string>) => {
    server.setHandler((req, res) => {
      equal(req.method, "GET");
      equal(req.url.replace(/\?.*/, ""), path);

      for (const key in interceptionOption) {
        equal(req.headers[key], interceptionOption[key]);
      }

      if (expectedQuery) {
        const url = new URL(req.url, server.getUrl());
        const queryParams = url.searchParams;
        for (const key in expectedQuery) {
          equal(queryParams.get(key), expectedQuery[key]);
        }
      }

      res.writeHead(200, { "Content-type": "application/json" });
      res.end("{}");
    });
  };

  const mockPost = (path: string, expectedBody?: object) => {
    server.setHandler(async (req, res) => {
      equal(req.method, "POST");
      equal(req.url.replace(/\?.*/, ""), path);

      for (const key in interceptionOption) {
        equal(req.headers[key], interceptionOption[key]);
      }

      if (expectedBody) {
        const dat = await readBodyJson(req);
        ok(dat);
        deepEqual(dat, expectedBody);
      }

      res.writeHead(200, { "Content-type": "application/json" });
      res.end("{}");
    });
  };

  const mockDelete = (path: string, expectedQuery?: Record<string, string>) => {
    server.setHandler((req, res) => {
      equal(req.method, "DELETE");
      equal(req.url.replace(/\?.*/, ""), path);

      for (const key in interceptionOption) {
        equal(req.headers[key], interceptionOption[key]);
      }

      if (expectedQuery) {
        const url = new URL(req.url, server.getUrl());
        const queryParams = url.searchParams;
        for (const key in expectedQuery) {
          equal(queryParams.get(key), expectedQuery[key]);
        }
      }

      res.writeHead(200, { "Content-type": "application/json" });
      res.end("{}");
    });
  };

  it("get", async () => {
    mockGet("/get");
    const res = await getHttpClient().get<any>(`/get`);
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  });

  it("get with query", async () => {
    mockGet("/get", { x: "10" });
    const res = await getHttpClient().get<any>(`/get`, { x: 10 });
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  });

  it("post without body", async () => {
    mockPost("/post");
    const res = await getHttpClient().post<any>(`/post`);
    equal(server.getRequestCount(), 1);

    deepEqual(res, {});
  });

  it("post with body", async () => {
    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    mockPost("/post/body", testBody);
    const res = await getHttpClient().post<any>(`/post/body`, testBody);
    equal(server.getRequestCount(), 1);

    deepEqual(res, {});
  });

  it("getStream", async () => {
    server.setHandler((req, res) => {
      equal(req.method, "GET");
      equal(req.url, "/stream.txt");

      const content = fs.readFileSync(
        join(__dirname, "./helpers/stream.txt"),
      );
      res.writeHead(200, { "Content-type": "text/plain" });
      res.end(content);
    });

    const stream = await getHttpClient().getStream(`/stream.txt`);
    const data = await getStreamData(stream);

    equal(server.getRequestCount(), 1);
    equal(data, "hello, stream!\n");
  });

  it("delete", async () => {
    mockDelete("/delete");
    await getHttpClient().delete(`/delete`);
    equal(server.getRequestCount(), 1);
  });

  it("delete with query", async () => {
    mockDelete("/delete", { x: "10" });
    await getHttpClient().delete(`/delete`, { x: 10 });
    equal(server.getRequestCount(), 1);
  });

  const mockPostBinary = (
    buffer: Buffer,
    reqheaders: Record<string, string>,
  ) => {
    server.setHandler((req, res) => {
      equal(req.method, "POST");
      equal(req.url, "/post/binary");

      for (const key in interceptionOption) {
        equal(req.headers[key], interceptionOption[key]);
      }
      for (const key in reqheaders) {
        equal(req.headers[key], reqheaders[key]);
      }
      equal(req.headers["content-length"], buffer.length + "");

      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({}));
    });
  };

  it("postBinary", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    mockPostBinary(buffer, {
      "content-type": "image/png",
    });

    await getHttpClient().postBinary(`/post/binary`, buffer);
    equal(server.getRequestCount(), 1);
  });

  it("postBinary with specific content type", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    mockPostBinary(buffer, {
      "content-type": "image/jpeg",
    });

    await getHttpClient().postBinary(`/post/binary`, buffer, "image/jpeg");
    equal(server.getRequestCount(), 1);
  });

  it("postBinary with stream", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const stream = createReadStream(filepath);
    const buffer = readFileSync(filepath);
    mockPostBinary(buffer, {
      "content-type": "image/png",
    });

    await getHttpClient().postBinary(`/post/binary`, stream);
    equal(server.getRequestCount(), 1);
  });

  it("fail with 404", async () => {
    server.setHandler((req, res) => {
      equal(req.method, "GET");
      equal(req.url, "/404");

      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(404, { "Content-type": "application/json" });
      res.end(JSON.stringify({ status: 404 }));
    });

    try {
      await getHttpClient().get(`/404`);
      ok(false);
    } catch (err) {
      ok(err instanceof HTTPError);
      equal(server.getRequestCount(), 1);
      equal(err.statusCode, 404);
    }
  });

  it("will generate default params", async () => {
    server.setHandler((req, res) => {
      equal(req.method, "GET");
      equal(req.url, "/get");

      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({}));
    });

    const httpClient = new HTTPClient();
    const res = await httpClient.get<any>(`${server.getUrl()}get`);
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  });
});
