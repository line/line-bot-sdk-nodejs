import { deepEqual, equal, ok } from "assert";
import { HTTPError, JSONParseError, RequestError } from "../lib/exceptions";
import { get, post, stream, del, postBinary } from "../lib/http";
import { getStreamData } from "./helpers/stream";
import { close, listen } from "./helpers/test-server";
import { readFileSync, createReadStream } from "fs";
import { join } from "path";

const pkg = require("../package.json");

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);
const TEST_URL = `http://localhost:${TEST_PORT}`;

const getRecentReq = (): any =>
  JSON.parse(readFileSync(join(__dirname, "helpers/request.json")).toString());

describe("http", () => {
  before(() => listen(TEST_PORT));
  after(() => close());

  it("get", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    return get(`${TEST_URL}/get?x=10`, testHeaders).then((res: any) => {
      const req = getRecentReq();
      equal(req.method, "GET");
      equal(req.path, "/get");
      equal(req.query.x, "10");
      equal(req.headers["test-header-key"], testHeaders["test-header-key"]);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      deepEqual(res, {});
    });
  });

  it("post without body", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    return post(`${TEST_URL}/post`, testHeaders).then((res: any) => {
      const req = getRecentReq();
      equal(req.method, "POST");
      equal(req.path, "/post");
      equal(req.headers["test-header-key"], testHeaders["test-header-key"]);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      deepEqual(res, {});
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

    return post(`${TEST_URL}/post/body`, testHeaders, testBody).then(
      (res: any) => {
        const req = getRecentReq();
        equal(req.method, "POST");
        equal(req.path, "/post/body");
        equal(req.headers["test-header-key"], testHeaders["test-header-key"]);
        equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
        deepEqual(req.body, testBody);
        deepEqual(res, {});
      },
    );
  });

  it("stream", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    return stream(`${TEST_URL}/stream.txt`, testHeaders)
      .then(s => getStreamData(s))
      .then(result => {
        equal(result, "hello, stream!\n");
      });
  });

  it("delete", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    return del(`${TEST_URL}/delete`, testHeaders).then(() => {
      const req = getRecentReq();
      equal(req.method, "DELETE");
      equal(req.path, "/delete");
      equal(req.headers["test-header-key"], testHeaders["test-header-key"]);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
    });
  });

  it("postBinary", () => {
    const testHeaders = {
      "test-header-key": "Test-Header-Value",
    };

    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    return postBinary(`${TEST_URL}/post/binary`, testHeaders, buffer).then(
      () => {
        const req = getRecentReq();
        equal(req.method, "POST");
        equal(req.path, "/post/binary");
        equal(req.body, buffer.toString("base64"));
        equal(req.headers["test-header-key"], testHeaders["test-header-key"]);
        equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
        equal(req.headers["content-type"], "image/png");
        equal(req.headers["content-length"], buffer.length);
      },
    );
  });

  it("postBinary with specific content type", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    return postBinary(`${TEST_URL}/post/binary`, {}, buffer, "image/jpeg").then(
      () => {
        const req = getRecentReq();
        equal(req.body, buffer.toString("base64"));
        equal(req.headers["content-type"], "image/jpeg");
        equal(req.headers["content-length"], buffer.length);
      },
    );
  });

  it("postBinary with stream", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const stream = createReadStream(filepath);
    return postBinary(`${TEST_URL}/post/binary`, {}, stream).then(() => {
      const buffer = readFileSync(filepath);

      const req = getRecentReq();
      equal(req.body, buffer.toString("base64"));
      equal(req.headers["content-type"], "image/png");
      equal(req.headers["content-length"], buffer.length);
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
