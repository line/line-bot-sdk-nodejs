import { ensureJSON, buildTextMessage } from "../lib/utils";
import { JSONParseError } from "../lib/exceptions";
import { deepEqual, equal, ok } from "assert";

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
  describe("buildTextMessage", () => {
    it("build object array of TextMessage from string", () => {
      const input = "test message";
      deepEqual(buildTextMessage(input), [
        { type: "text", text: "test message" },
      ]);
    });
    it("build object array of TextMessage from string array", () => {
      const input1 = "test message one";
      const input2 = "test message two";
      deepEqual(buildTextMessage([input1, input2]), [
        { type: "text", text: "test message one" },
        { type: "text", text: "test message two" },
      ]);
    });
  });
});
