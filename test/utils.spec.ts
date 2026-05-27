import { buildPath, ensureJSON, createURLSearchParams } from "../lib/utils.js";
import { JSONParseError } from "../lib/exceptions.js";
import { equal, ok } from "node:assert";

import { describe, it } from "vitest";

describe("utils", () => {
  describe("ensureJSON", () => {
    it("fails when input isn't an object", () => {
      let input = "not Object";
      try {
        ensureJSON(input);
        ok(false);
      } catch (err) {
        equal(
          (err as JSONParseError).message,
          "Failed to parse response body as JSON",
        );
      }
    });
  });

  describe("createURLSearchParams", () => {
    it("creates URLSearchParams from object with string values", () => {
      const params = { key1: "value1", key2: "value2" };
      const result = createURLSearchParams(params);
      equal(result.get("key1"), "value1");
      equal(result.get("key2"), "value2");
    });

    it("converts number values to strings", () => {
      const params = { num: 123, float: 45.67 };
      const result = createURLSearchParams(params);
      equal(result.get("num"), "123");
      equal(result.get("float"), "45.67");
    });

    it("converts boolean values to strings", () => {
      const params = { bool1: true, bool2: false };
      const result = createURLSearchParams(params);
      equal(result.get("bool1"), "true");
      equal(result.get("bool2"), "false");
    });

    it("filters out null values", () => {
      const params = { key1: "value1", key2: null, key3: "value3" };
      const result = createURLSearchParams(params);
      equal(result.get("key1"), "value1");
      equal(result.get("key2"), null);
      equal(result.get("key3"), "value3");
    });

    it("filters out undefined values", () => {
      const params = { key1: "value1", key2: undefined, key3: "value3" };
      const result = createURLSearchParams(params);
      equal(result.get("key1"), "value1");
      equal(result.get("key2"), null);
      equal(result.get("key3"), "value3");
    });

    it("handles empty object", () => {
      const params = {};
      const result = createURLSearchParams(params);
      equal(result.toString(), "");
    });

    it("handles mixed types and null/undefined", () => {
      const params = {
        str: "test",
        num: 42,
        bool: true,
        nullVal: null,
        undefinedVal: undefined,
        zero: 0,
        emptyStr: "",
      };
      const result = createURLSearchParams(params);
      equal(result.get("str"), "test");
      equal(result.get("num"), "42");
      equal(result.get("bool"), "true");
      equal(result.get("zero"), "0");
      equal(result.get("emptyStr"), "");
      equal(result.get("nullVal"), null);
      equal(result.get("undefinedVal"), null);
    });
  });

  describe("buildPath", () => {
    it("accepts common path parameter values and encodes reserved characters", () => {
      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "U0123456789abcdef0123456789abcdef",
        }),
        "/v2/bot/profile/U0123456789abcdef0123456789abcdef",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "abc..def",
        }),
        "/v2/bot/profile/abc..def",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "../message/quota",
        }),
        "/v2/bot/profile/..%2Fmessage%2Fquota",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "%2e%2e/message/quota",
        }),
        "/v2/bot/profile/%252e%252e%2Fmessage%2Fquota",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "foo?bar",
        }),
        "/v2/bot/profile/foo%3Fbar",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "foo#bar",
        }),
        "/v2/bot/profile/foo%23bar",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "foo\\bar",
        }),
        "/v2/bot/profile/foo%5Cbar",
      );

      equal(
        buildPath("/v2/bot/profile/{userId}", {
          userId: "foo:bar;baz",
        }),
        "/v2/bot/profile/foo%3Abar%3Bbaz",
      );
    });

    it("rejects dot-only path parameter values", () => {
      try {
        buildPath("/v2/bot/profile/{userId}", { userId: "." });
        ok(false);
      } catch (err) {
        equal((err as TypeError).name, "TypeError");
      }

      try {
        buildPath("/v2/bot/profile/{userId}", { userId: ".." });
        ok(false);
      } catch (err) {
        equal((err as TypeError).name, "TypeError");
      }
    });

    it("rejects dot segments in generated path", () => {
      for (const rawPath of [
        "/v2/bot/profile/.",
        "/v2/bot/profile/..",
        "/v2/bot/profile/%2e",
        "/v2/bot/profile/%2e%2e",
      ]) {
        try {
          buildPath(rawPath, {});
          ok(false);
        } catch (err) {
          equal((err as TypeError).name, "TypeError");
        }
      }
    });
  });
});
