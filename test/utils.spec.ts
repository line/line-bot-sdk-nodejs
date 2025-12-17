import { ensureJSON, createURLSearchParams } from "../lib/utils.js";
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
});
