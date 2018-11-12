import { deepEqual, equal, ok } from "assert";
import { HTTPError, RequestError } from "../lib/exceptions";
import HTTPClient from "../lib/http";
import { getStreamData } from "./helpers/stream";
import { close, listen } from "./helpers/test-server";
import { readFileSync, createReadStream } from "fs";
import { join } from "path";

const pkg = require("../package.json");

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);

const getRecentReq = (): any =>
  JSON.parse(readFileSync(join(__dirname, "helpers/request.json")).toString());

describe("http", () => {
  const http = new HTTPClient(`http://localhost:${TEST_PORT}`, {
    "test-header-key": "Test-Header-Value",
  });

  before(() => listen(TEST_PORT));
  after(() => close());

  it("get", () => {
    return http.get(`/get`).then((res: any) => {
      const req = getRecentReq();
      equal(req.method, "GET");
      equal(req.path, "/get");
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      deepEqual(res, {});
    });
  });

  it("get with query", () => {
    return http.get(`/get`, { x: 10 }).then((res: any) => {
      const req = getRecentReq();
      equal(req.method, "GET");
      equal(req.path, "/get");
      equal(req.query.x, "10");
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      deepEqual(res, {});
    });
  });

  it("post without body", () => {
    return http.post(`/post`).then((res: any) => {
      const req = getRecentReq();
      equal(req.method, "POST");
      equal(req.path, "/post");
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      deepEqual(res, {});
    });
  });

  it("post with body", () => {
    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    return http.post(`/post/body`, testBody).then((res: any) => {
      const req = getRecentReq();
      equal(req.method, "POST");
      equal(req.path, "/post/body");
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      deepEqual(req.body, testBody);
      deepEqual(res, {});
    });
  });

  it("getStream", () => {
    return http
      .getStream(`/stream.txt`)
      .then(s => getStreamData(s))
      .then(result => {
        equal(result, "hello, stream!\n");
      });
  });

  it("delete", () => {
    return http.delete(`/delete`).then(() => {
      const req = getRecentReq();
      equal(req.method, "DELETE");
      equal(req.path, "/delete");
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    });
  });

  it("delete with query", () => {
    return http.delete(`/delete`, { x: 10 }).then(() => {
      const req = getRecentReq();
      equal(req.method, "DELETE");
      equal(req.path, "/delete");
      equal(req.query.x, "10");
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    });
  });

  it("postBinary", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    return http.postBinary(`/post/binary`, buffer).then(() => {
      const req = getRecentReq();
      equal(req.method, "POST");
      equal(req.path, "/post/binary");
      equal(req.body, buffer.toString("base64"));
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      equal(req.headers["content-type"], "image/png");
      equal(req.headers["content-length"], buffer.length);
    });
  });

  it("postBinary with specific content type", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    return http.postBinary(`/post/binary`, buffer, "image/jpeg").then(() => {
      const req = getRecentReq();
      equal(req.body, buffer.toString("base64"));
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["content-type"], "image/jpeg");
      equal(req.headers["content-length"], buffer.length);
    });
  });

  it("postBinary with stream", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const stream = createReadStream(filepath);
    return http.postBinary(`/post/binary`, stream).then(() => {
      const buffer = readFileSync(filepath);

      const req = getRecentReq();
      equal(req.body, buffer.toString("base64"));
      equal(req.headers["test-header-key"], "Test-Header-Value");
      equal(req.headers["content-type"], "image/png");
      equal(req.headers["content-length"], buffer.length);
    });
  });

  it("fail with 404", () => {
    return http
      .get(`/404`)
      .then(() => ok(false))
      .catch((err: HTTPError) => {
        ok(err instanceof HTTPError);
        equal(err.statusCode, 404);
      });
  });

  it("fail with wrong addr", () => {
    return http
      .get("http://domain.invalid", {})
      .then(() => ok(false))
      .catch((err: RequestError) => {
        ok(err instanceof RequestError);
        equal(err.code, "ENOTFOUND");
      });
  });
});
