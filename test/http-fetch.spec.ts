import { deepEqual, equal, ok } from "assert";
import { HTTPError, HTTPFetchError } from "../lib";
import HTTPFetchClient from "../lib/http-fetch";
import { getStreamData } from "./helpers/stream";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { join } from "path";
import * as fs from "fs";

const pkg = require("../package.json");
const baseURL = "https://line.me";

const responseParser = async <T>(response: Response): Promise<T> => {
  return (await response.json()) as T;
};

describe("http(fetch)", () => {
  const client = new HTTPFetchClient({
    baseURL,
    defaultHeaders: {
      "test-header-key": "Test-Header-Value",
    },
    responseParser: responseParser,
  });

  const server = setupServer();
  before(() => {
    server.listen();
  });
  after(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  const interceptionOption: Record<string, string> = {
    "test-header-key": "Test-Header-Value",
    "User-Agent": `${pkg.name}/${pkg.version}`,
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
    const res = await client.get<any>(`/get`);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("get with query", async () => {
    const scope = mockGet("/get", { x: "10" });
    const res = await client.get<any>(`/get`, { x: 10 });
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("post without body", async () => {
    const scope = mockPost("/post");
    const res = await client.post<any>(`/post`);
    equal(scope.isDone(), true);

    deepEqual(res, {});
  });

  it("post with body", async () => {
    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    const scope = mockPost("/post/body", testBody);
    const res = await client.post<any>(`/post/body`, testBody);
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

    const stream = await client.getStream(`/stream.txt`);
    const data = await getStreamData(stream);

    equal(scope.isDone(), true);
    equal(data, "hello, stream!\n");
  });

  it("delete", async () => {
    const scope = mockDelete("/delete");
    await client.delete(`/delete`);
    equal(scope.isDone(), true);
  });

  it("delete with query", async () => {
    const scope = mockDelete("/delete", { x: "10" });
    await client.delete(`/delete`, { x: 10 });
    equal(scope.isDone(), true);
  });

  it("fail with 404", async () => {
    const scope = new MSWResult();
    server.use(
      http.get(baseURL + "/404", async ({ request, params, cookies }) => {
        scope.done();
        equal(request.headers.get("user-agent"), `${pkg.name}/${pkg.version}`);
        return HttpResponse.json({reason: "not found"}, { status: 404 });
      }),
    );

    try {
      await client.get(`/404`);
      ok(false);
    } catch (err) {
      ok(err instanceof HTTPFetchError);
      equal(scope.isDone(), true);
      equal(err.statusCode, 404);
      equal(err.headers.get('content-type'), "application/json");
      equal(err.body, "{\"reason\":\"not found\"}");
    }
  });

  it("will generate default params", async () => {
    const scope = new MSWResult();
    server.use(
      http.get(baseURL + "/get", async ({ request }) => {
        scope.done();
        equal(request.headers.get("user-agent"), `${pkg.name}/${pkg.version}`);
        return HttpResponse.json({});
      }),
    );

    const client = new HTTPFetchClient({
      baseURL,
      defaultHeaders: {},
      responseParser,
    });
    const res = await client.get<any>(`/get`);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
