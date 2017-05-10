import { deepEqual, equal, ok } from "assert";
import {
  HTTPError,
  JSONParseError,
  RequestError,
} from "../lib/exceptions";
import { get, post, stream } from "../lib/http";
import { getStreamData } from "./helpers/stream";
import { close, listen } from "./helpers/test-server";

const pkg = require("../package.json"); // tslint:disable-line no-var-requires

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);
const TEST_URL = `http://localhost:${TEST_PORT}`;

describe("http", () => {
  before(() => listen(TEST_PORT));
  after(() => close());

  it("get", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    return get(`${TEST_URL}/get?x=10`, testHeaders)
      .then((res: any) => {
        equal(res.method, "GET");
        equal(res.path, "/get");
        equal(res.query.x, "10");
        equal(res.headers["test-header-key"], testHeaders["test-header-key"]);
        equal(res.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      });
  });

  it("post without body", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    return post(`${TEST_URL}/post`, testHeaders)
      .then((res: any) => {
        equal(res.method, "POST");
        equal(res.path, "/post");
        equal(res.headers["test-header-key"], testHeaders["test-header-key"]);
        equal(res.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      });
  });

  it("post with body", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    const testBody = {
      id: 12345,
      message: "hello, body!",
    };

    return post(`${TEST_URL}/post/body`, testHeaders, testBody)
      .then((res: any) => {
        equal(res.method, "POST");
        equal(res.path, "/post/body");
        equal(res.headers["test-header-key"], testHeaders["test-header-key"]);
        equal(res.headers["user-agent"], `${pkg.name}/${pkg.version}`);
        deepEqual(res.body, testBody);
      });
  });

  it("stream", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    const s = stream(`${TEST_URL}/stream.txt`, testHeaders);
    return getStreamData(s)
      .then((result) => {
        equal(result, "hello, stream!\n");
      });
  });

  it("fail to parse json", () => {
    return get(`${TEST_URL}/text`, {})
      .then(() => ok(false))
      .catch((err) => {
        ok(err instanceof JSONParseError);
        equal(err.raw, "i am not jason");
      });
  });

  it("fail with 404", () => {
    return get(`${TEST_URL}/404`, {})
      .then(() => ok(false))
      .catch((err: HTTPError) => {
        ok(err instanceof HTTPError);
        equal(err.statusCode, 404);
      });
  });

  it("fail with wrong addr", () => {
    return get("http://domain.invalid", {})
      .then(() => ok(false))
      .catch((err: RequestError) => {
        ok(err instanceof RequestError);
        equal(err.code, "ENOTFOUND");
      });
  });
});
