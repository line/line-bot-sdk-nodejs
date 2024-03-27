import { ensureJSON } from "../lib/utils.js";
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
});
