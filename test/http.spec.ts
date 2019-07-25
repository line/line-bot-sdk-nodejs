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
  const http = new HTTPClient({
    baseURL: `http://localhost:${TEST_PORT}`,
    defaultHeaders: {
      "test-header-key": "Test-Header-Value",
    },
  });

  before(() => listen(TEST_PORT));
  after(() => close());

  it("get", async () => {
    const res = await http.get<any>(`/get`);
    const req = getRecentReq();
    equal(req.method, "GET");
    equal(req.path, "/get");
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    deepEqual(res, {});
  });

  it("get with query", async () => {
    const res = await http.get<any>(`/get`, { x: 10 });
    const req = getRecentReq();
    equal(req.method, "GET");
    equal(req.path, "/get");
    equal(req.query.x, "10");
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    deepEqual(res, {});
  });

  it("post without body", async () => {
    const res = await http.post<any>(`/post`);
    const req = getRecentReq();
    equal(req.method, "POST");
    equal(req.path, "/post");
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    deepEqual(res, {});
  });

  it("post with body", async () => {
    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    const res = await http.post<any>(`/post/body`, testBody);
    const req = getRecentReq();
    equal(req.method, "POST");
    equal(req.path, "/post/body");
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    deepEqual(req.body, testBody);
    deepEqual(res, {});
  });

  it("getStream", async () => {
    const stream = await http.getStream(`/stream.txt`);
    const data = await getStreamData(stream);
    equal(data, "hello, stream!\n");
  });

  it("delete", async () => {
    await http.delete(`/delete`);
    const req = getRecentReq();
    equal(req.method, "DELETE");
    equal(req.path, "/delete");
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
  });

  it("delete with query", async () => {
    await http.delete(`/delete`, { x: 10 });
    const req = getRecentReq();
    equal(req.method, "DELETE");
    equal(req.path, "/delete");
    equal(req.query.x, "10");
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
  });

  it("postBinary", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    await http.postBinary(`/post/binary`, buffer);
    const req = getRecentReq();
    equal(req.method, "POST");
    equal(req.path, "/post/binary");
    equal(req.body, buffer.toString("base64"));
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    equal(req.headers["content-type"], "image/png");
    equal(req.headers["content-length"], buffer.length);
  });

  it("postBinary with specific content type", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    await http.postBinary(`/post/binary`, buffer, "image/jpeg");
    const req = getRecentReq();
    equal(req.body, buffer.toString("base64"));
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["content-type"], "image/jpeg");
    equal(req.headers["content-length"], buffer.length);
  });

  it("postBinary with stream", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const stream = createReadStream(filepath);
    await http.postBinary(`/post/binary`, stream);
    const buffer = readFileSync(filepath);

    const req = getRecentReq();
    equal(req.body, buffer.toString("base64"));
    equal(req.headers["test-header-key"], "Test-Header-Value");
    equal(req.headers["content-type"], "image/png");
    equal(req.headers["content-length"], buffer.length);
  });

  it("fail with 404", async () => {
    try {
      await http.get(`/404`);
      ok(false);
    } catch (err) {
      ok(err instanceof HTTPError);
      equal(err.statusCode, 404);
    }
  });

  it("fail with wrong addr", async () => {
    try {
      await http.get("http://domain.invalid");
      ok(false);
    } catch (err) {
      ok(err instanceof RequestError);
      equal(err.code, "ENOTFOUND");
    }
  });
});
