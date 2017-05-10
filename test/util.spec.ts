import { deepEqual } from "assert";
import { toArray } from "../lib/util";

describe("util", () => {
  describe("toArray", () => {
    it("returns an array as it is", () => {
      deepEqual(toArray([1, 2, 3]), [1, 2, 3]);
    });

    it("wrap others as an array", () => {
      deepEqual(toArray(1), [1]);
    });
  });
});
