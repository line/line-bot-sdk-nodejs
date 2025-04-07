import { deepEqual, equal, ok } from "node:assert";
import { describe, it } from "vitest";
import { normalizeHeaders, mergeHeaders } from "../lib/http-fetch.js";

describe("header utilities", () => {
  describe("normalizeHeaders", () => {
    it("should return an empty object if headers is undefined", () => {
      deepEqual(normalizeHeaders(undefined), {});
    });

    it("should return an empty object if headers is an empty object", () => {
      deepEqual(normalizeHeaders({}), {});
    });

    it("should convert all header keys to lowercase", () => {
      const input = {
        "X-Header": "value",
        "CONTENT-Type": "application/json",
      };
      const expected = {
        "x-header": "value",
        "content-type": "application/json",
      };
      deepEqual(normalizeHeaders(input), expected);
    });
  });

  describe("mergeHeaders", () => {
    it("should return an empty object if both base and override are undefined", () => {
      deepEqual(mergeHeaders(undefined, undefined), {});
    });

    it("should return base headers if override is undefined", () => {
      const base = { "X-Header": "base-value" };
      deepEqual(mergeHeaders(base, undefined), { "x-header": "base-value" });
    });

    it("should return override headers if base is undefined", () => {
      const override = { Accept: "application/xml" };
      deepEqual(mergeHeaders(undefined, override), {
        accept: "application/xml",
      });
    });

    it("should merge headers and normalize keys to lowercase", () => {
      const base = {
        "X-Header": "base-value",
        "CONTENT-Type": "application/json",
      };
      const override = {
        "x-header": "override-value",
        Accept: "application/xml",
      };
      const expected = {
        "x-header": "override-value",
        "content-type": "application/json",
        accept: "application/xml",
      };
      deepEqual(mergeHeaders(base, override), expected);
    });

    it("should override keys from base with override ignoring case difference in keys", () => {
      const base = { "X-HEADER": "base-value" };
      const override = { "x-header": "override-value" };
      const merged = mergeHeaders(base, override);
      deepEqual(merged, { "x-header": "override-value" });
    });
  });
});
