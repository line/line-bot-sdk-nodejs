import { deepEqual, equal, ok } from "assert";
import { HTTPError, RequestError } from "../lib/exceptions";
import HTTPClient from "../lib/http";
import { getStreamData } from "./helpers/stream";
import * as nock from "nock";
import { readFileSync, createReadStream } from "fs";
import { join } from "path";

const pkg = require("../package.json");
const baseURL = "https://line.me";
const defaultHeaders = {
  "test-header-key": "Test-Header-Value",
};

describe("http", () => {
  const http = new HTTPClient({
    baseURL,
    defaultHeaders,
  });

  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const interceptionOption = {
    reqheaders: {
      ...defaultHeaders,
      "User-Agent": `${pkg.name}/${pkg.version}`,
    },
  };

  const mockGet = (
    path: string,
    expectedQuery?: boolean | string | nock.DataMatcherMap | URLSearchParams,
  ) => {
    let _it = nock(baseURL, interceptionOption).get(path);
    if (expectedQuery) {
      _it = _it.query(expectedQuery);
    }
    return _it.reply(200, {});
  };

  const mockPost = (path: string, expectedBody?: nock.RequestBodyMatcher) => {
    return nock(baseURL, interceptionOption)
      .post(path, expectedBody)
      .reply(200, {});
  };

  const mockDelete = (
    path: string,
    expectedQuery?: boolean | string | nock.DataMatcherMap | URLSearchParams,
  ) => {
    let _it = nock(baseURL, interceptionOption).delete(path);
    if (expectedQuery) {
      _it = _it.query(expectedQuery);
    }
    return _it.reply(200, {});
  };

  it("get", async () => {
    const scope = mockGet("/get");
    const res = await http.get<any>(`/get`);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("get with query", async () => {
    const scope = mockGet("/get", { x: 10 });
    const res = await http.get<any>(`/get`, { x: 10 });
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("post without body", async () => {
    const scope = mockPost("/post");
    const res = await http.post<any>(`/post`);
    equal(scope.isDone(), true);

    deepEqual(res, {});
  });

  it("post with body", async () => {
    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    const scope = mockPost("/post/body", testBody);
    const res = await http.post<any>(`/post/body`, testBody);
    equal(scope.isDone(), true);

    deepEqual(res, {});
  });

  it("getStream", async () => {
    const scope = nock(baseURL, interceptionOption)
      .get("/stream.txt")
      .reply(200, () =>
        createReadStream(join(__dirname, "./helpers/stream.txt")),
      );
    const stream = await http.getStream(`/stream.txt`);
    const data = await getStreamData(stream);

    equal(scope.isDone(), true);
    equal(data, "hello, stream!\n");
  });

  it("delete", async () => {
    const scope = mockDelete("/delete");
    await http.delete(`/delete`);
    equal(scope.isDone(), true);
  });

  it("delete with query", async () => {
    const scope = mockDelete("/delete", { x: 10 });
    await http.delete(`/delete`, { x: 10 });
    equal(scope.isDone(), true);
  });

  const mockPostBinary = (
    buffer: Buffer,
    reqheaders: Record<string, nock.RequestHeaderMatcher>,
  ) => {
    return nock(baseURL, {
      reqheaders: {
        ...interceptionOption.reqheaders,
        ...reqheaders,
        "content-length": buffer.length + "",
      },
    })
      .post("/post/binary", buffer)
      .reply(200, {});
  };

  it("postBinary", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const scope = mockPostBinary(buffer, {
      "content-type": "image/png",
    });

    await http.postBinary(`/post/binary`, buffer);
    equal(scope.isDone(), true);
  });

  it("postBinary with specific content type", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const scope = mockPostBinary(buffer, {
      "content-type": "image/jpeg",
    });

    await http.postBinary(`/post/binary`, buffer, "image/jpeg");
    equal(scope.isDone(), true);
  });

  it("postBinary with stream", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const stream = createReadStream(filepath);
    const buffer = readFileSync(filepath);
    const scope = mockPostBinary(buffer, {
      "content-type": "image/png",
    });

    await http.postBinary(`/post/binary`, stream);
    equal(scope.isDone(), true);
  });

  it("fail with 404", async () => {
    const scope = nock(baseURL, interceptionOption).get("/404").reply(404, {});
    try {
      await http.get(`/404`);
      ok(false);
    } catch (err) {
      ok(err instanceof HTTPError);
      equal(scope.isDone(), true);
      equal(err.statusCode, 404);
    }
  });

  it("fail with wrong addr", async () => {
    nock.enableNetConnect();
    try {
      await http.get("http://domain.invalid");
      ok(false);
    } catch (err) {
      ok(err instanceof RequestError);
      ok(["EAI_AGAIN", "ENOTFOUND"].includes(err.code));
      nock.disableNetConnect();
    }
  });

  it("will generate default params", async () => {
    const scope = nock(baseURL, {
      reqheaders: {
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get("/get")
      .reply(200, {});

    const http = new HTTPClient();
    const res = await http.get<any>(`${baseURL}/get`);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
