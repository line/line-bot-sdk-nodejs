import { deepEqual, equal, ok } from "node:assert";
import { HTTPError } from "../lib/exceptions.js";
import HTTPClient from "../lib/http-axios.js";
import { getStreamData } from "./helpers/stream.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { createReadStream, readFileSync } from "node:fs";
import { join } from "node:path";
import * as fs from "node:fs";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const baseURL = "https://line.me";
describe("http", () => {
  const httpClient = new HTTPClient({
    baseURL,
    defaultHeaders: {
      "test-header-key": "Test-Header-Value",
    },
  });

  const server = setupServer();
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  const interceptionOption: Record<string, string> = {
    "test-header-key": "Test-Header-Value",
    "User-Agent": "@line/bot-sdk/1.0.0-test",
  };

  class MSWResult {
    private _done: boolean;

    constructor() {
      this._done = false;
    }

    public done() {
      this._done = true;
    }

    public isDone() {
      return this._done;
    }
  }

  const mockGet = (path: string, expectedQuery?: Record<string, string>) => {
    const result = new MSWResult();
    server.use(
      http.get(baseURL + path, ({ request }) => {
        for (const key in interceptionOption) {
          equal(request.headers.get(key), interceptionOption[key]);
        }

        if (expectedQuery) {
          const url = new URL(request.url);
          const queryParams = url.searchParams;
          for (const key in expectedQuery) {
            equal(queryParams.get(key), expectedQuery[key]);
          }
        }

        result.done();

        return HttpResponse.json({});
      }),
    );
    return result;
  };

  const mockPost = (path: string, expectedBody?: object) => {
    const result = new MSWResult();
    server.use(
      http.post(baseURL + path, async ({ request, params, cookies }) => {
        for (const key in interceptionOption) {
          equal(request.headers.get(key), interceptionOption[key]);
        }

        if (expectedBody) {
          const dat = await request.json();
          ok(dat);
          deepEqual(dat, expectedBody);
        }

        result.done();

        return HttpResponse.json({});
      }),
    );
    return result;
  };

  const mockDelete = (path: string, expectedQuery?: Record<string, string>) => {
    const result = new MSWResult();
    server.use(
      http.delete(baseURL + path, ({ request }) => {
        for (const key in interceptionOption) {
          equal(request.headers.get(key), interceptionOption[key]);
        }

        if (expectedQuery) {
          const url = new URL(request.url);
          const queryParams = url.searchParams;
          for (const key in expectedQuery) {
            equal(queryParams.get(key), expectedQuery[key]);
          }
        }

        result.done();

        return HttpResponse.json({});
      }),
    );
    return result;
  };

  it("get", async () => {
    const scope = mockGet("/get");
    const res = await httpClient.get<any>(`/get`);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("get with query", async () => {
    const scope = mockGet("/get", { x: "10" });
    const res = await httpClient.get<any>(`/get`, { x: 10 });
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("post without body", async () => {
    const scope = mockPost("/post");
    const res = await httpClient.post<any>(`/post`);
    equal(scope.isDone(), true);

    deepEqual(res, {});
  });

  it("post with body", async () => {
    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    const scope = mockPost("/post/body", testBody);
    const res = await httpClient.post<any>(`/post/body`, testBody);
    equal(scope.isDone(), true);

    deepEqual(res, {});
  });

  it("getStream", async () => {
    const scope = new MSWResult();
    server.use(
      http.get(baseURL + "/stream.txt", ({}) => {
        scope.done();

        const stream = new ReadableStream({
          start(controller) {
            const content = fs.readFileSync(
              join(__dirname, "./helpers/stream.txt"),
            );
            // Encode the string chunks using "TextEncoder".
            controller.enqueue(content);
            controller.close();
          },
        });

        // Send the mocked response immediately.
        return new HttpResponse(stream, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }),
    );

    const stream = await httpClient.getStream(`/stream.txt`);
    const data = await getStreamData(stream);

    equal(scope.isDone(), true);
    equal(data, "hello, stream!\n");
  });

  it("delete", async () => {
    const scope = mockDelete("/delete");
    await httpClient.delete(`/delete`);
    equal(scope.isDone(), true);
  });

  it("delete with query", async () => {
    const scope = mockDelete("/delete", { x: "10" });
    await httpClient.delete(`/delete`, { x: 10 });
    equal(scope.isDone(), true);
  });

  const mockPostBinary = (
    buffer: Buffer,
    reqheaders: Record<string, string>,
  ) => {
    const result = new MSWResult();
    server.use(
      http.post(
        baseURL + "/post/binary",
        async ({ request, params, cookies }) => {
          for (const key in interceptionOption) {
            equal(request.headers.get(key), interceptionOption[key]);
          }
          for (const key in reqheaders) {
            equal(request.headers.get(key), reqheaders[key]);
          }
          equal(request.headers.get("content-length"), buffer.length + "");

          result.done();

          return HttpResponse.json({});
        },
      ),
    );
    return result;
  };

  it("postBinary", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const scope = mockPostBinary(buffer, {
      "content-type": "image/png",
    });

    await httpClient.postBinary(`/post/binary`, buffer);
    equal(scope.isDone(), true);
  });

  it("postBinary with specific content type", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const scope = mockPostBinary(buffer, {
      "content-type": "image/jpeg",
    });

    await httpClient.postBinary(`/post/binary`, buffer, "image/jpeg");
    equal(scope.isDone(), true);
  });

  it("postBinary with stream", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const stream = createReadStream(filepath);
    const buffer = readFileSync(filepath);
    const scope = mockPostBinary(buffer, {
      "content-type": "image/png",
    });

    await httpClient.postBinary(`/post/binary`, stream);
    equal(scope.isDone(), true);
  });

  it("fail with 404", async () => {
    const scope = new MSWResult();
    server.use(
      http.get(baseURL + "/404", async ({ request, params, cookies }) => {
        scope.done();
        equal(request.headers.get("user-agent"), "@line/bot-sdk/1.0.0-test");
        return HttpResponse.json(404, { status: 404 });
      }),
    );

    try {
      await httpClient.get(`/404`);
      ok(false);
    } catch (err) {
      ok(err instanceof HTTPError);
      equal(scope.isDone(), true);
      equal(err.statusCode, 404);
    }
  });

  it("will generate default params", async () => {
    const scope = new MSWResult();
    server.use(
      http.get(baseURL + "/get", async ({ request }) => {
        scope.done();
        equal(request.headers.get("user-agent"), "@line/bot-sdk/1.0.0-test");
        return HttpResponse.json({});
      }),
    );

    const httpClient = new HTTPClient();
    const res = await httpClient.get<any>(`${baseURL}/get`);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
