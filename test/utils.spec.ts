import { ensureJSON } from "../lib/utils";
import { JSONParseError } from "../lib/exceptions";
import { equal, ok } from "assert";

describe("utils", () => {
  it("fails when it's not an object", () => {
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
